import { getSqlite } from "@/lib/db";
import { scanEmergency, type EmergencyMatch } from "@/lib/safety/emergency";

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
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

export function universalSearch(query: string, limit = 20): {
  emergency: EmergencyMatch | null;
  hits: SearchHit[];
} {
  const emergency = scanEmergency(query);
  const sqlite = getSqlite();
  const hits: SearchHit[] = [];
  const q = query.trim();
  if (!q) return { emergency, hits };

  try {
    const ftsQuery = tokenize(q).map((t) => `"${t}"*`).join(" OR ") || `"${q}"*`;
    const meds = sqlite
      .prepare(
        `SELECT m.id, m.slug, m.generic_name, m.drug_class, m.brand_names
         FROM meds_fts f
         JOIN medications m ON m.id = f.rowid
         WHERE meds_fts MATCH ?
         LIMIT ?`
      )
      .all(ftsQuery, limit) as {
      id: number;
      slug: string;
      generic_name: string;
      drug_class: string;
      brand_names: string;
    }[];

    for (const m of meds) {
      hits.push({
        type: "medication",
        id: m.id,
        slug: m.slug,
        title: m.generic_name,
        subtitle: m.drug_class,
      });
    }

    const conds = sqlite
      .prepare(
        `SELECT c.id, c.slug, c.name, c.summary
         FROM conditions_fts f
         JOIN conditions c ON c.id = f.rowid
         WHERE conditions_fts MATCH ?
         LIMIT ?`
      )
      .all(ftsQuery, limit) as {
      id: number;
      slug: string;
      name: string;
      summary: string;
    }[];

    for (const c of conds) {
      hits.push({
        type: "condition",
        id: c.id,
        slug: c.slug,
        title: c.name,
        subtitle: c.summary.slice(0, 120) + (c.summary.length > 120 ? "…" : ""),
      });
    }
  } catch {
    // Fallback LIKE search if FTS query fails
    const like = `%${q}%`;
    const meds = sqlite
      .prepare(
        `SELECT id, slug, generic_name, drug_class FROM medications
         WHERE generic_name LIKE ? OR brand_names LIKE ? OR drug_class LIKE ?
         LIMIT ?`
      )
      .all(like, like, like, limit) as {
      id: number;
      slug: string;
      generic_name: string;
      drug_class: string;
    }[];
    for (const m of meds) {
      hits.push({
        type: "medication",
        id: m.id,
        slug: m.slug,
        title: m.generic_name,
        subtitle: m.drug_class,
      });
    }
    const conds = sqlite
      .prepare(
        `SELECT id, slug, name, summary FROM conditions WHERE name LIKE ? OR summary LIKE ? LIMIT ?`
      )
      .all(like, like, limit) as {
      id: number;
      slug: string;
      name: string;
      summary: string;
    }[];
    for (const c of conds) {
      hits.push({
        type: "condition",
        id: c.id,
        slug: c.slug,
        title: c.name,
        subtitle: c.summary.slice(0, 120),
      });
    }
  }

  return { emergency, hits };
}

export function symptomSearch(query: string): {
  emergency: EmergencyMatch | null;
  matches: SymptomMatch[];
} {
  const emergency = scanEmergency(query);
  const sqlite = getSqlite();
  const tokens = tokenize(query);
  if (tokens.length === 0) return { emergency, matches: [] };

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

  const text = query.toLowerCase();
  const byCond = new Map<number, SymptomMatch>();

  for (const row of rows) {
    let synonyms: string[] = [];
    try {
      synonyms = JSON.parse(row.synonyms);
    } catch {
      synonyms = [];
    }
    const terms = [row.symptom, ...synonyms].map((t) => t.toLowerCase());
    const hit = terms.find((t) => text.includes(t) || tokens.some((tok) => t.includes(tok)));
    if (!hit) continue;

    const existing = byCond.get(row.condition_id);
    if (!existing) {
      let redFlags: string[] = [];
      try {
        redFlags = JSON.parse(row.red_flags);
      } catch {
        redFlags = [];
      }
      byCond.set(row.condition_id, {
        conditionId: row.condition_id,
        name: row.name,
        slug: row.slug,
        summary: row.summary,
        score: row.weight,
        matchedSymptoms: [row.symptom],
        supporting: row.supporting_feature ? [row.supporting_feature] : [],
        against: row.against_feature ? [row.against_feature] : [],
        redFlags,
        whenToSeekCare: row.when_to_seek_care,
      });
    } else {
      existing.score += row.weight;
      if (!existing.matchedSymptoms.includes(row.symptom)) {
        existing.matchedSymptoms.push(row.symptom);
      }
      if (row.supporting_feature) existing.supporting.push(row.supporting_feature);
      if (row.against_feature) existing.against.push(row.against_feature);
    }
  }

  const matches = [...byCond.values()].sort((a, b) => b.score - a.score).slice(0, 8);
  return { emergency, matches };
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
