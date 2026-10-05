import { getSqlite } from "@/lib/db";
import { scanEmergency, type EmergencyMatch } from "@/lib/safety/emergency";
import { containsTerm, normalize } from "@/lib/text";
import { isStopword, kindLabel, resolveExact, resolveFuzzy, scanPhrases, type SynTarget } from "@/lib/search/synonyms";
export { resolveMedicationInput, getMedicationAliases, medicationSuggestions } from "@/lib/search/synonyms";

export type SearchHit = {
  type: "medication" | "condition";
  id: number;
  slug: string;
  title: string;
  subtitle: string;
};

export type SymptomMatch = {
  conditionId: number;
  name: string;
  slug: string;
  summary: string;
  score: number;
  matchedSymptoms: string[];
  supporting: string[];
  against: string[];
  redFlags: string[];
  whenToSeekCare: string;
};

function tokenize(q: string): string[] {
  return normalize(q)
    .split(" ")
    .filter((t) => t.length > 2 && !isStopword(t));
}

export type SearchInterpretation = {
  /** e.g. "Dafalgan" */
  searched: string;
  /** canonical label(s), e.g. "Paracetamol (Acetaminophen)" */
  matches: { label: string; slug: string | null; type: "medication" | "condition" | "symptom"; via: string; kindLabel: string }[];
  mode: "exact" | "phrase" | "fuzzy";
};

function interpretationFrom(searchedFallback: string, targets: SynTarget[], mode: SearchInterpretation["mode"]): SearchInterpretation | null {
  const nonCanon = targets.filter((t) => t.kind !== "canonical");
  if (!nonCanon.length && mode !== "fuzzy") return null;
  const list = (nonCanon.length ? nonCanon : targets).filter((t) => t.targetType !== "symptom");
  if (!list.length) return null;
  return {
    searched: searchedFallback,
    matches: list.map((t) => ({ label: t.label, slug: t.slug, type: t.targetType, via: t.term, kindLabel: kindLabel(t.kind, t.region, t.language) })),
    mode,
  };
}


export function universalSearch(query: string, limit = 20): {
  emergency: EmergencyMatch | null;
  hits: SearchHit[];
  interpretation: SearchInterpretation | null;
} {
  const emergency = scanEmergency(query);
  const sqlite = getSqlite();
  const hits: SearchHit[] = [];
  const q = query.trim();
  if (!q) return { emergency, hits, interpretation: null };

  const seen = new Set<string>();
  const medInfo = sqlite.prepare(`SELECT id, slug, generic_name, drug_class FROM medications WHERE id = ?`);
  const condInfo = sqlite.prepare(`SELECT id, slug, name, summary FROM conditions WHERE id = ?`);
  const pushTarget = (t: SynTarget) => {
    if (!t.targetId || t.targetType === "symptom") return;
    const key = t.targetType + ":" + t.targetId;
    if (seen.has(key)) return;
    seen.add(key);
    if (t.targetType === "medication") {
      const m = medInfo.get(t.targetId) as { id: number; slug: string; generic_name: string; drug_class: string } | undefined;
      if (m) hits.push({ type: "medication", id: m.id, slug: m.slug, title: m.generic_name, subtitle: m.drug_class });
    } else {
      const c = condInfo.get(t.targetId) as { id: number; slug: string; name: string; summary: string } | undefined;
      if (c) hits.push({ type: "condition", id: c.id, slug: c.slug, title: c.name, subtitle: c.summary.slice(0, 120) + (c.summary.length > 120 ? "…" : "") });
    }
  };

  // 1) synonym / canonical resolution
  let interpretation: SearchInterpretation | null = null;
  const exact = resolveExact(q, ["medication", "condition"]);
  let exactResolved = false;
  if (exact.length) {
    exactResolved = true;
    exact.forEach(pushTarget);
    interpretation = interpretationFrom(q, exact, "exact");
  } else {
    const { hits: phraseHits } = scanPhrases(q, ["medication", "condition"]);
    const targets = phraseHits.flatMap((h) => h.targets);
    targets.forEach(pushTarget);
    if (phraseHits.length) {
      const nonCanon = phraseHits.filter((h) => h.targets.some((t) => t.kind !== "canonical"));
      if (nonCanon.length) interpretation = interpretationFrom(nonCanon.map((h) => h.targets[0].term).join(", "), nonCanon.flatMap((h) => h.targets), "phrase");
    }
  }

  // 2) full-text search (skipped when the whole query resolved exactly, to avoid noise for lay terms)
  if (!exactResolved) {
    try {
      const toks = tokenize(q);
      const ftsQuery = toks.map((t) => `"${t}"*`).join(" OR ");
      if (ftsQuery) {
        const meds = sqlite
          .prepare(
            `SELECT m.id, m.slug, m.generic_name, m.drug_class
             FROM meds_fts f JOIN medications m ON m.id = f.rowid
             WHERE meds_fts MATCH ? ORDER BY rank LIMIT ?`
          )
          .all(ftsQuery, limit) as { id: number; slug: string; generic_name: string; drug_class: string }[];
        for (const m of meds) {
          if (seen.has("medication:" + m.id)) continue;
          seen.add("medication:" + m.id);
          hits.push({ type: "medication", id: m.id, slug: m.slug, title: m.generic_name, subtitle: m.drug_class });
        }
        const conds = sqlite
          .prepare(
            `SELECT c.id, c.slug, c.name, c.summary
             FROM conditions_fts f JOIN conditions c ON c.id = f.rowid
             WHERE conditions_fts MATCH ? ORDER BY rank LIMIT ?`
          )
          .all(ftsQuery, limit) as { id: number; slug: string; name: string; summary: string }[];
        for (const c of conds) {
          if (seen.has("condition:" + c.id)) continue;
          seen.add("condition:" + c.id);
          hits.push({ type: "condition", id: c.id, slug: c.slug, title: c.name, subtitle: c.summary.slice(0, 120) + (c.summary.length > 120 ? "…" : "") });
        }
      }
    } catch {
      const like = `%${q}%`;
      const meds = sqlite
        .prepare(`SELECT id, slug, generic_name, drug_class FROM medications WHERE generic_name LIKE ? OR brand_names LIKE ? OR drug_class LIKE ? LIMIT ?`)
        .all(like, like, like, limit) as { id: number; slug: string; generic_name: string; drug_class: string }[];
      for (const m of meds) {
        if (seen.has("medication:" + m.id)) continue;
        seen.add("medication:" + m.id);
        hits.push({ type: "medication", id: m.id, slug: m.slug, title: m.generic_name, subtitle: m.drug_class });
      }
    }
  }

  // 3) fuzzy fallback for misspellings (only when nothing else matched)
  if (hits.length === 0) {
    const fz = resolveFuzzy(q, ["medication", "condition"]);
    if (fz) {
      fz.targets.forEach(pushTarget);
      interpretation = {
        searched: q,
        matches: fz.targets
          .filter((t) => t.targetType !== "symptom")
          .map((t) => ({ label: t.label, slug: t.slug, type: t.targetType, via: t.term, kindLabel: "closest spelling match" })),
        mode: "fuzzy",
      };
    }
  }

  return { emergency, hits: hits.slice(0, Math.max(limit, 40)), interpretation };
}

export type SymptomInterpretation = { phrase: string; meaning: string[] }[];

export function symptomSearch(query: string): {
  emergency: EmergencyMatch | null;
  matches: SymptomMatch[];
  interpretation: SymptomInterpretation;
} {
  const emergency = scanEmergency(query);
  const sqlite = getSqlite();
  const text = normalize(query);
  if (!text) return { emergency, matches: [], interpretation: [] };

  // 1) translate lay / German / French / Italian phrases to canonical symptoms & conditions
  const { tokens, hits: phraseHits, consumed } = scanPhrases(query, ["symptom", "condition"]);
  const canonicalSymptoms = new Map<string, string>(); // canonical -> phrase used
  const conditionBoost = new Map<number, string>(); // conditionId -> phrase used
  const interpretation: SymptomInterpretation = [];
  for (const h of phraseHits) {
    const meaning: string[] = [];
    for (const t of h.targets) {
      if (t.targetType === "symptom") {
        if (!canonicalSymptoms.has(t.label)) canonicalSymptoms.set(t.label, h.phrase);
        meaning.push(t.label);
      } else if (t.targetType === "condition" && t.targetId) {
        if (!conditionBoost.has(t.targetId)) conditionBoost.set(t.targetId, h.phrase);
        meaning.push(t.label);
      }
    }
    const isCanonicalOnly = h.targets.every((t) => t.kind === "canonical");
    if (meaning.length && !isCanonicalOnly) interpretation.push({ phrase: h.phrase, meaning: [...new Set(meaning)] });
  }
  // residual significant tokens (not consumed by a synonym phrase)
  const residual = tokens.filter((t, i) => !consumed.has(i) && t.length >= 4 && !isStopword(t));

  const rows = sqlite
    .prepare(
      `SELECT cs.*, c.name, c.slug, c.summary, c.red_flags, c.when_to_seek_care
       FROM condition_symptoms cs
       JOIN conditions c ON c.id = cs.condition_id`
    )
    .all() as {
    condition_id: number;
    symptom: string;
    synonyms: string;
    weight: number;
    supporting_feature: string | null;
    against_feature: string | null;
    name: string;
    slug: string;
    summary: string;
    red_flags: string;
    when_to_seek_care: string;
  }[];

  const byCond = new Map<number, SymptomMatch>();
  const ensure = (row: (typeof rows)[number]) => {
    let m = byCond.get(row.condition_id);
    if (!m) {
      let redFlags: string[] = [];
      try {
        redFlags = JSON.parse(row.red_flags);
      } catch {
        redFlags = [];
      }
      m = {
        conditionId: row.condition_id,
        name: row.name,
        slug: row.slug,
        summary: row.summary,
        score: 0,
        matchedSymptoms: [],
        supporting: [],
        against: [],
        redFlags,
        whenToSeekCare: row.when_to_seek_care,
      };
      byCond.set(row.condition_id, m);
    }
    return m;
  };

  for (const row of rows) {
    let synonyms: string[] = [];
    try {
      synonyms = JSON.parse(row.synonyms);
    } catch {
      synonyms = [];
    }
    let factor = 0;
    if (canonicalSymptoms.has(row.symptom)) factor = 1;
    else {
      const terms = [row.symptom, ...synonyms].map((t) => normalize(t)).filter(Boolean);
      if (terms.some((t) => containsTerm(text, t))) factor = 1;
      else if (residual.length) {
        // partial: share of the term's significant words present in the residual query words
        for (const t of terms) {
          const words = t.split(" ").filter((w) => w.length >= 3 && !isStopword(w));
          if (!words.length) continue;
          const hit = words.filter((w) => residual.some((r) => w.startsWith(r) || r.startsWith(w))).length;
          const ratio = hit / words.length;
          if (ratio >= 0.5) factor = Math.max(factor, ratio === 1 ? 1 : 0.5 * ratio);
        }
      }
    }
    if (factor <= 0) continue;
    const m = ensure(row);
    m.score += row.weight * factor;
    if (!m.matchedSymptoms.includes(row.symptom)) m.matchedSymptoms.push(row.symptom);
    if (row.supporting_feature && !m.supporting.includes(row.supporting_feature)) m.supporting.push(row.supporting_feature);
    if (row.against_feature && !m.against.includes(row.against_feature)) m.against.push(row.against_feature);
  }

  // condition named directly (e.g. "Sodbrennen", "flu", "Blasenentzündung")
  for (const [cid, phrase] of conditionBoost) {
    const row = rows.find((r) => r.condition_id === cid);
    if (!row) continue;
    const m = ensure(row);
    m.score += 2;
    const label = `“${phrase}” (condition name)`;
    if (!m.matchedSymptoms.includes(label)) m.matchedSymptoms.push(label);
  }

  const matches = [...byCond.values()].filter((m) => m.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  return { emergency, matches, interpretation };
}

export function findInteractions(medIds: number[]) {
  if (medIds.length < 2) return [];
  const sqlite = getSqlite();
  const results = [];
  for (let i = 0; i < medIds.length; i++) {
    for (let j = i + 1; j < medIds.length; j++) {
      const a = medIds[i];
      const b = medIds[j];
      const rows = sqlite
        .prepare(
          `SELECT i.*, ma.generic_name as med_a_name, ma.slug as med_a_slug,
                  mb.generic_name as med_b_name, mb.slug as med_b_slug
           FROM interactions i
           JOIN medications ma ON ma.id = i.med_a_id
           JOIN medications mb ON mb.id = i.med_b_id
           WHERE (i.med_a_id = ? AND i.med_b_id = ?) OR (i.med_a_id = ? AND i.med_b_id = ?)`
        )
        .all(a, b, b, a);
      results.push(...rows);
    }
  }
  return results;
}

export function logAudit(entry: {
  query: string;
  responseSummary: string;
  safetyFlags?: string[];
  claims?: number[];
  sources?: number[];
}) {
  const sqlite = getSqlite();
  sqlite
    .prepare(
      `INSERT INTO audit_log (query, retrieved_sources, claims_used, response_summary, safety_flags, db_version, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      entry.query,
      JSON.stringify(entry.sources ?? []),
      JSON.stringify(entry.claims ?? []),
      entry.responseSummary,
      JSON.stringify(entry.safetyFlags ?? []),
      "mvp-0.1",
      new Date().toISOString()
    );
}
