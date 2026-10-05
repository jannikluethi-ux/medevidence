/**
 * "Find medicines by condition" — information-only reference lookup.
 *
 * Given a condition or complaint typed by the user (any language / lay term / known misspelling
 * covered by the synonyms layer), list the medicines whose official labelling or major guidelines
 * list that use, as curated in condition_medications (each row points at an indication that already
 * exists in the medicine's own data).
 *
 * Deliberately NOT a recommender: no questions about the user, no dosing, no ranking. Results are
 * grouped by form + prescription status and sorted alphabetically within each group. The emergency
 * rules engine runs on the raw query first. Unknown terms are never guessed: fuzzy matches are only
 * offered as "did you mean" links, never used to show results.
 */
import { getSqlite } from "@/lib/db";
import { scanEmergency, type EmergencyMatch } from "@/lib/safety/emergency";
import { normalize } from "@/lib/text";
import { parseJsonArray } from "@/lib/utils";
import { kindLabel, resolveExact, resolveFuzzy, resolveMedicationInput, scanPhrases, type SynTarget } from "@/lib/search/synonyms";

export type TreatmentForm = "topical" | "oral" | "nasal" | "inhaled" | "injection";
export type TreatmentAvailability = "otc" | "varies" | "rx";

export const FORM_LABELS: Record<TreatmentForm, string> = {
  topical: "Applied to the skin (topical)",
  oral: "Taken by mouth (oral)",
  nasal: "Nasal sprays",
  inhaled: "Inhaled",
  injection: "Injection / infusion",
};
export const AVAILABILITY_LABELS: Record<TreatmentAvailability, string> = {
  otc: "Non-prescription forms available in many countries",
  varies: "Prescription status varies by country or strength",
  rx: "Prescription-only",
};
const FORM_ORDER: TreatmentForm[] = ["topical", "oral", "nasal", "inhaled", "injection"];
const AVAIL_ORDER: TreatmentAvailability[] = ["otc", "varies", "rx"];

/** Cross-links between closely related conditions (by slug). */
const SEE_ALSO: Record<string, string[]> = {
  "burns-minor-superficial": ["sunburn"],
  sunburn: ["burns-minor-superficial"],
  "tension-type-headache": ["migraine", "medication-overuse-headache"],
  migraine: ["tension-type-headache", "medication-overuse-headache"],
  "gastroesophageal-reflux-disease-gerd": ["peptic-ulcer-disease"],
};

export type TreatmentSource = { title: string; organization: string; url: string | null; specificToUse: boolean };

export type TreatmentItem = {
  slug: string;
  name: string;
  drugClass: string;
  indication: string;
  evidenceLevel: string | null;
  approval: string | null;
  note: string | null;
  source: TreatmentSource | null;
};

export type TreatmentGroup = {
  key: string;
  form: TreatmentForm;
  availability: TreatmentAvailability;
  formLabel: string;
  availabilityLabel: string;
  items: TreatmentItem[];
};

export type ConditionTreatments = {
  id: number;
  name: string;
  slug: string;
  summary: string;
  firstAid: string[];
  redFlags: string[];
  whenToSeekCare: string;
  matchedVia: { term: string; kindLabel: string } | null;
  groups: TreatmentGroup[];
  total: number;
  seeAlso: { name: string; slug: string }[];
};

export type TreatmentLookup = {
  query: string;
  status: "empty_query" | "results" | "no_match";
  emergency: EmergencyMatch | null;
  conditions: ConditionTreatments[];
  /** Fuzzy spelling suggestions — shown as links only, never used to show results. */
  suggestions: { term: string; label: string; slug: string | null }[];
  /** Canonical symptoms recognised in the query (when no condition matched). */
  recognisedSymptoms: string[];
  /** The query looks like a medicine name. */
  medicationHints: { name: string; slug: string }[];
};

type Row = {
  condition_id: number;
  indication: string;
  form: string;
  availability: string;
  note: string | null;
  source_id: number | null;
  slug: string;
  generic_name: string;
  drug_class: string;
  evidence_level: string | null;
  approved_vs_off_label: string | null;
  ind_source_ids: string | null;
  s_title: string | null;
  s_org: string | null;
  s_url: string | null;
};

function tableExists(name: string): boolean {
  const r = getSqlite().prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name = ?`).get(name);
  return Boolean(r);
}

function loadCondition(id: number, via: { term: string; kindLabel: string } | null): ConditionTreatments | null {
  const db = getSqlite();
  const c = db.prepare(`SELECT * FROM conditions WHERE id = ? AND status = 'published'`).get(id) as Record<string, unknown> | undefined;
  if (!c) return null;

  let rows: Row[] = [];
  if (tableExists("condition_medications")) {
    rows = db
      .prepare(
        `SELECT cm.condition_id, cm.indication, cm.form, cm.availability, cm.note, cm.source_id,
                m.slug, m.generic_name, m.drug_class,
                (SELECT mi.evidence_level FROM medication_indications mi WHERE mi.medication_id = m.id AND mi.indication = cm.indication LIMIT 1) AS evidence_level,
                (SELECT mi.approved_vs_off_label FROM medication_indications mi WHERE mi.medication_id = m.id AND mi.indication = cm.indication LIMIT 1) AS approved_vs_off_label,
                (SELECT mi.source_ids FROM medication_indications mi WHERE mi.medication_id = m.id AND mi.indication = cm.indication LIMIT 1) AS ind_source_ids,
                s.title AS s_title, s.organization AS s_org, s.url AS s_url
         FROM condition_medications cm
         JOIN medications m ON m.id = cm.medication_id AND m.status = 'published'
         LEFT JOIN sources s ON s.id = cm.source_id
         WHERE cm.condition_id = ?`
      )
      .all(id) as Row[];
  }

  const srcById = db.prepare(`SELECT title, organization, url FROM sources WHERE id = ?`);
  const groups = new Map<string, TreatmentGroup>();
  for (const r of rows) {
    const form = (FORM_ORDER as string[]).includes(r.form) ? (r.form as TreatmentForm) : "oral";
    const availability = (AVAIL_ORDER as string[]).includes(r.availability) ? (r.availability as TreatmentAvailability) : "varies";
    let source: TreatmentSource | null = null;
    if (r.s_title && r.s_org) source = { title: r.s_title, organization: r.s_org, url: r.s_url, specificToUse: true };
    else {
      const firstId = parseJsonArray(r.ind_source_ids).map(Number).find((n) => !Number.isNaN(n));
      if (firstId) {
        const s = srcById.get(firstId) as { title: string; organization: string; url: string | null } | undefined;
        if (s) source = { ...s, specificToUse: false };
      }
    }
    const key = `${form}:${availability}`;
    let g = groups.get(key);
    if (!g) {
      g = { key, form, availability, formLabel: FORM_LABELS[form], availabilityLabel: AVAILABILITY_LABELS[availability], items: [] };
      groups.set(key, g);
    }
    g.items.push({
      slug: r.slug,
      name: r.generic_name,
      drugClass: r.drug_class,
      indication: r.indication,
      evidenceLevel: r.evidence_level,
      approval: r.approved_vs_off_label,
      note: r.note,
      source,
    });
  }
  const ordered = [...groups.values()].sort(
    (a, b) => FORM_ORDER.indexOf(a.form) - FORM_ORDER.indexOf(b.form) || AVAIL_ORDER.indexOf(a.availability) - AVAIL_ORDER.indexOf(b.availability)
  );
  for (const g of ordered) g.items.sort((a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" }));

  const slug = String(c.slug);
  const seeAlso = (SEE_ALSO[slug] ?? [])
    .map((s) => db.prepare(`SELECT name, slug FROM conditions WHERE slug = ? AND status = 'published'`).get(s) as { name: string; slug: string } | undefined)
    .filter((x): x is { name: string; slug: string } => Boolean(x));

  return {
    id,
    name: String(c.name),
    slug,
    summary: String(c.summary),
    firstAid: parseJsonArray((c.first_aid as string | undefined) ?? "[]"),
    redFlags: parseJsonArray(c.red_flags as string),
    whenToSeekCare: String(c.when_to_seek_care ?? ""),
    matchedVia: via,
    groups: ordered,
    total: rows.length,
    seeAlso,
  };
}

function viaFor(t: SynTarget): { term: string; kindLabel: string } | null {
  if (t.kind === "canonical") return null;
  return { term: t.term, kindLabel: kindLabel(t.kind, t.region, t.language) };
}

export function lookupTreatments(rawQuery: string): TreatmentLookup {
  const query = (rawQuery ?? "").trim().slice(0, 200);
  const emergency = scanEmergency(query);
  const base: TreatmentLookup = { query, status: "empty_query", emergency, conditions: [], suggestions: [], recognisedSymptoms: [], medicationHints: [] };
  if (!normalize(query)) return base;

  // 1) whole query, exactly (canonical names, lay terms, DE/FR/IT, listed misspellings)
  const condTargets = new Map<number, SynTarget>();
  const symptoms = new Set<string>();
  const exact = resolveExact(query, ["condition", "symptom"]);
  if (exact.length) {
    for (const t of exact) {
      if (t.targetType === "condition" && t.targetId && !condTargets.has(t.targetId)) condTargets.set(t.targetId, t);
      if (t.targetType === "symptom") symptoms.add(t.label);
    }
  } else {
    // 2) phrases inside a longer query ("chemical burn on face", "Sodbrennen seit gestern").
    // Symptom phrases are scanned too so they consume their words ("brûlure en urinant" is a
    // urinary symptom, not a skin burn) — only condition targets produce results.
    const { hits } = scanPhrases(query, ["condition", "symptom"]);
    for (const h of hits) {
      for (const t of h.targets) {
        if (t.targetType === "condition" && t.targetId && !condTargets.has(t.targetId)) condTargets.set(t.targetId, t);
        if (t.targetType === "symptom") symptoms.add(t.label);
      }
    }
  }

  const conditions = [...condTargets.values()]
    .map((t) => loadCondition(t.targetId as number, viaFor(t)))
    .filter((c): c is ConditionTreatments => Boolean(c));

  if (conditions.length) return { ...base, status: "results", conditions };

  // 3) nothing matched: never guess. Offer spelling suggestions and hints only.
  const out: TreatmentLookup = { ...base, status: "no_match", recognisedSymptoms: [...symptoms].slice(0, 6) };
  const fz = resolveFuzzy(query, ["condition"]);
  if (fz) {
    const seen = new Set<string>();
    for (const t of fz.targets) {
      if (t.targetType !== "condition" || seen.has(t.label)) continue;
      seen.add(t.label);
      out.suggestions.push({ term: t.term, label: t.label, slug: t.slug });
    }
  }
  const med = resolveMedicationInput(query);
  if (med.status !== "none" && med.status !== "fuzzy") out.medicationHints = med.meds.slice(0, 6).map((m) => ({ name: m.generic_name, slug: m.slug }));
  return out;
}
