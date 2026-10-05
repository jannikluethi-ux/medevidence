/**
 * Synonym resolver (search / recognition only — never used for dosing or treatment logic).
 * Resolves brands, international names, lay terms, misspellings, abbreviations and DE/FR/IT
 * terms to canonical medications, conditions or canonical symptoms.
 */
import { getSqlite } from "@/lib/db";
import { levenshtein, normalize, normalizeUmlautVariant } from "@/lib/text";

export type SynonymKind =
  | "canonical"
  | "brand"
  | "international_name"
  | "lay_term"
  | "misspelling"
  | "abbreviation"
  | "german"
  | "french"
  | "italian";

export type SynTarget = {
  term: string;
  kind: SynonymKind;
  language: string | null;
  region: string | null;
  targetType: "medication" | "condition" | "symptom";
  targetId: number | null;
  label: string; // canonical generic name / condition name / canonical symptom
  slug: string | null;
};

type Cache = {
  byKey: Map<string, SynTarget[]>;
  keys: string[]; // for fuzzy
  maxWords: number;
  medsById: Map<number, { id: number; slug: string; generic_name: string }>;
  medsBySlug: Map<string, { id: number; slug: string; generic_name: string }>;
};

const g = globalThis as unknown as { __synCache?: Cache };

const STOPWORDS = new Set(
  "a an and or the of in on at to for with my i im ive have has having had is am are was be been feel feeling get getting got very really bit little some since when after before also but und oder mit ich habe hab bin der die das den dem ein eine einen einem mein meine meinen seit sehr auch et ou avec le la les un une des du de mon ma mes j ai je suis e o con il lo gli un una di da ho sono mi".split(
    " "
  )
);
export function isStopword(t: string) {
  return STOPWORDS.has(t);
}

function load(): Cache {
  if (g.__synCache) return g.__synCache;
  const db = getSqlite();
  const byKey = new Map<string, SynTarget[]>();
  const push = (key: string, t: SynTarget) => {
    if (!key) return;
    const arr = byKey.get(key);
    if (!arr) byKey.set(key, [t]);
    else if (!arr.some((x) => x.targetType === t.targetType && x.label === t.label)) arr.push(t);
  };

  const meds = db.prepare(`SELECT id, slug, generic_name FROM medications WHERE status = 'published'`).all() as {
    id: number;
    slug: string;
    generic_name: string;
  }[];
  const medsById = new Map(meds.map((m) => [m.id, m]));
  const medsBySlug = new Map(meds.map((m) => [m.slug, m]));
  for (const m of meds) {
    const t: SynTarget = { term: m.generic_name, kind: "canonical", language: null, region: null, targetType: "medication", targetId: m.id, label: m.generic_name, slug: m.slug };
    push(normalize(m.generic_name), t);
    push(normalize(m.slug), t);
  }
  const conds = db.prepare(`SELECT id, slug, name FROM conditions WHERE status = 'published'`).all() as { id: number; slug: string; name: string }[];
  const condById = new Map(conds.map((c) => [c.id, c]));
  for (const c of conds) {
    push(normalize(c.name), { term: c.name, kind: "canonical", language: null, region: null, targetType: "condition", targetId: c.id, label: c.name, slug: c.slug });
  }
  const syms = db.prepare(`SELECT DISTINCT symptom FROM condition_symptoms`).all() as { symptom: string }[];
  for (const s of syms) {
    push(normalize(s.symptom), { term: s.symptom, kind: "canonical", language: null, region: null, targetType: "symptom", targetId: null, label: s.symptom, slug: null });
  }

  let rows: { term: string; normalized_term: string; target_type: string; target_id: number | null; target_label: string; kind: string; language: string | null; region: string | null }[] = [];
  try {
    rows = db.prepare(`SELECT term, normalized_term, target_type, target_id, target_label, kind, language, region FROM synonyms`).all() as typeof rows;
  } catch {
    rows = []; // synonyms table missing (old DB) — degrade gracefully
  }
  for (const r of rows) {
    let slug: string | null = null;
    if (r.target_type === "medication" && r.target_id) slug = medsById.get(r.target_id)?.slug ?? null;
    if (r.target_type === "condition" && r.target_id) slug = condById.get(r.target_id)?.slug ?? null;
    const t: SynTarget = {
      term: r.term,
      kind: r.kind as SynonymKind,
      language: r.language,
      region: r.region,
      targetType: r.target_type as SynTarget["targetType"],
      targetId: r.target_id,
      label: r.target_label,
      slug,
    };
    push(r.normalized_term, t);
    const alt = normalizeUmlautVariant(r.term);
    if (alt !== r.normalized_term) push(alt, t);
  }
  let maxWords = 1;
  for (const k of byKey.keys()) maxWords = Math.max(maxWords, k.split(" ").length);
  const cache: Cache = { byKey, keys: [...byKey.keys()], maxWords: Math.min(maxWords, 8), medsById, medsBySlug };
  g.__synCache = cache;
  return cache;
}

type TypeFilter = SynTarget["targetType"][];
const filt = (arr: SynTarget[] | undefined, types?: TypeFilter) => (arr ?? []).filter((t) => !types || types.includes(t.targetType));

/** Exact match of the whole (normalised) input. */
export function resolveExact(input: string, types?: TypeFilter): SynTarget[] {
  const c = load();
  const n = normalize(input);
  if (!n) return [];
  return filt(c.byKey.get(n), types);
}

export type PhraseHit = { phrase: string; start: number; end: number; targets: SynTarget[] };

/**
 * Longest-match, non-overlapping phrase scan over the normalised input (word boundaries).
 * Keys of <=2 characters are only honoured when they are the whole input (e.g. "AF", "MI").
 */
export function scanPhrases(input: string, types?: TypeFilter): { tokens: string[]; hits: PhraseHit[]; consumed: Set<number> } {
  const c = load();
  const tokens = normalize(input).split(" ").filter(Boolean);
  const hits: PhraseHit[] = [];
  const consumed = new Set<number>();
  for (let i = 0; i < tokens.length; ) {
    let matched = false;
    for (let len = Math.min(c.maxWords, tokens.length - i); len >= 1; len--) {
      const phrase = tokens.slice(i, i + len).join(" ");
      if (phrase.length <= 2 && tokens.length > 1) continue;
      if (len === 1 && isStopword(phrase)) continue;
      const targets = filt(c.byKey.get(phrase), types);
      if (targets.length) {
        hits.push({ phrase, start: i, end: i + len, targets });
        for (let k = i; k < i + len; k++) consumed.add(k);
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) i++;
  }
  return { tokens, hits, consumed };
}

/** Fuzzy fallback for misspellings: Levenshtein against all known names/synonyms. */
export function resolveFuzzy(input: string, types?: TypeFilter): { key: string; distance: number; targets: SynTarget[] } | null {
  const c = load();
  const n = normalize(input);
  if (n.length < 4) return null;
  const maxD = n.length <= 5 ? 1 : n.length <= 9 ? 2 : 3;
  let best: { key: string; distance: number; targets: SynTarget[] } | null = null;
  for (const k of c.keys) {
    if (Math.abs(k.length - n.length) > maxD) continue;
    if (k.length < 4) continue;
    const d = levenshtein(n, k, maxD);
    if (d > maxD) continue;
    const targets = filt(c.byKey.get(k), types);
    if (!targets.length) continue;
    const rank = (t: SynTarget[]) => (t.some((x) => x.kind === "canonical") ? 0 : t.some((x) => x.kind === "brand" || x.kind === "international_name") ? 1 : 2);
    if (!best || d < best.distance || (d === best.distance && rank(targets) < rank(best.targets))) best = { key: k, distance: d, targets };
  }
  return best;
}

export type MedResolution = {
  input: string;
  status: "slug" | "canonical" | "synonym" | "class" | "fuzzy" | "none";
  meds: { id: number; slug: string; generic_name: string }[];
  via: { term: string; kind: SynonymKind; region: string | null; language: string | null } | null;
};

/** Resolve free text / slug / brand to medication(s). Class terms (e.g. "blood thinner") return several. */
export function resolveMedicationInput(raw: string | undefined | null): MedResolution {
  const input = (raw ?? "").trim();
  const none: MedResolution = { input, status: "none", meds: [], via: null };
  if (!input) return none;
  const c = load();
  const bySlug = c.medsBySlug.get(input.toLowerCase());
  if (bySlug) return { input, status: "slug", meds: [bySlug], via: null };

  const toMeds = (ts: SynTarget[]) => {
    const out: { id: number; slug: string; generic_name: string }[] = [];
    for (const t of ts) {
      if (t.targetType !== "medication" || !t.targetId) continue;
      const m = c.medsById.get(t.targetId);
      if (m && !out.some((x) => x.id === m.id)) out.push(m);
    }
    return out;
  };
  const exact = resolveExact(input, ["medication"]);
  if (exact.length) {
    const meds = toMeds(exact);
    const canon = exact.find((t) => t.kind === "canonical");
    if (canon) return { input, status: "canonical", meds: toMeds([canon]), via: null };
    const first = exact[0];
    return {
      input,
      status: meds.length > 1 ? "class" : "synonym",
      meds,
      via: { term: first.term, kind: first.kind, region: first.region, language: first.language },
    };
  }
  const fz = resolveFuzzy(input, ["medication"]);
  if (fz) {
    const meds = toMeds(fz.targets);
    const first = fz.targets[0];
    if (meds.length === 1)
      return { input, status: "fuzzy", meds, via: { term: first.term, kind: first.kind, region: first.region, language: first.language } };
  }
  return none;
}

export function kindLabel(kind: SynonymKind, region?: string | null, language?: string | null): string {
  const base: Record<SynonymKind, string> = {
    canonical: "name",
    brand: "brand name",
    international_name: "international / alternative name",
    lay_term: "everyday term",
    misspelling: "spelling variant",
    abbreviation: "abbreviation",
    german: "German term",
    french: "French term",
    italian: "Italian term",
  };
  let s = base[kind] ?? kind;
  if (kind === "brand" && region) s += ` (${region.split(",").join(", ")})`;
  else if (language && kind === "lay_term" && language !== "en") s += ` (${language})`;
  return s;
}

/** Synonyms grouped for "Also known as" on medication pages. */
export function getMedicationAliases(medId: number) {
  const db = getSqlite();
  let rows: { term: string; kind: string; region: string | null; language: string | null; n: number }[] = [];
  try {
    rows = db
      .prepare(
        `SELECT s.term, s.kind, s.region, s.language,
                (SELECT COUNT(DISTINCT s2.target_id) FROM synonyms s2 WHERE s2.normalized_term = s.normalized_term AND s2.target_type = 'medication') AS n
         FROM synonyms s WHERE s.target_type = 'medication' AND s.target_id = ? ORDER BY s.kind, s.term`
      )
      .all(medId) as typeof rows;
  } catch {
    return { brands: [], international: [], languages: [], misspellings: [], classTerms: [] };
  }
  const specific = rows.filter((r) => r.n === 1); // exclude class terms shared by many meds
  return {
    brands: specific.filter((r) => r.kind === "brand").map((r) => ({ term: r.term, region: r.region })),
    international: specific.filter((r) => r.kind === "international_name" || r.kind === "abbreviation").map((r) => r.term),
    languages: specific
      .filter((r) => r.kind === "german" || r.kind === "french" || r.kind === "italian")
      .map((r) => ({ term: r.term, language: r.language })),
    misspellings: specific.filter((r) => r.kind === "misspelling").map((r) => r.term),
    classTerms: rows.filter((r) => r.n > 1 && (r.kind === "lay_term" || r.kind === "german")).map((r) => r.term).slice(0, 12),
  };
}

/** All medication names + brand names for datalist suggestions. */
export function medicationSuggestions(): string[] {
  const c = load();
  const out = new Set<string>();
  for (const m of c.medsById.values()) out.add(m.generic_name);
  try {
    const db = getSqlite();
    const rows = db.prepare(`SELECT DISTINCT term FROM synonyms WHERE target_type='medication' AND kind IN ('brand','international_name')`).all() as { term: string }[];
    for (const r of rows) out.add(r.term);
  } catch {
    /* ignore */
  }
  return [...out].sort((a, b) => a.localeCompare(b));
}
