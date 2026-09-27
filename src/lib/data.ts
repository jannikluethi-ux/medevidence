import { getSqlite } from "@/lib/db";
import { parseJsonArray, parseJsonObject } from "@/lib/utils";

export function listMedications(opts?: { q?: string; limit?: number }) {
  const sqlite = getSqlite();
  const limit = opts?.limit ?? 200;
  if (opts?.q?.trim()) {
    const like = `%${opts.q.trim()}%`;
    return sqlite
      .prepare(
        `SELECT id, generic_name, brand_names, drug_class, slug, status
         FROM medications
         WHERE status = 'published' AND (generic_name LIKE ? OR brand_names LIKE ? OR drug_class LIKE ?)
         ORDER BY generic_name LIMIT ?`
      )
      .all(like, like, like, limit);
  }
  return sqlite
    .prepare(
      `SELECT id, generic_name, brand_names, drug_class, slug, status
       FROM medications WHERE status = 'published' ORDER BY generic_name LIMIT ?`
    )
    .all(limit);
}

export function getMedicationBySlug(slug: string) {
  const sqlite = getSqlite();
  const med = sqlite
    .prepare(`SELECT * FROM medications WHERE slug = ?`)
    .get(slug) as Record<string, unknown> | undefined;
  if (!med) return null;

  const id = med.id as number;
  const indications = sqlite
    .prepare(`SELECT * FROM medication_indications WHERE medication_id = ?`)
    .all(id);
  const adverse = sqlite
    .prepare(`SELECT * FROM adverse_effects WHERE medication_id = ?`)
    .all(id);
  const warnings = sqlite
    .prepare(`SELECT * FROM contraindications_warnings WHERE medication_id = ?`)
    .all(id);
  const special = sqlite
    .prepare(`SELECT * FROM special_populations WHERE medication_id = ?`)
    .get(id);
  const monitoring = sqlite
    .prepare(`SELECT * FROM monitoring_requirements WHERE medication_id = ?`)
    .all(id);
  const withdrawal = sqlite
    .prepare(`SELECT * FROM withdrawal_notes WHERE medication_id = ?`)
    .all(id);
  const alternatives = sqlite
    .prepare(
      `SELECT a.*, m.slug as alt_slug, m.generic_name as alt_generic
       FROM alternatives a
       LEFT JOIN medications m ON m.id = a.alternative_medication_id
       WHERE a.medication_id = ?`
    )
    .all(id);
  const claims = sqlite
    .prepare(
      `SELECT * FROM claims WHERE entity_type = 'medication' AND entity_id = ? AND status IN ('published','reviewed')
       ORDER BY certainty_bucket, id`
    )
    .all(id) as { id: number; [k: string]: unknown }[];

  const claimIds = claims.map((c) => c.id);
  let claimSources: { claim_id: number; source_id: number }[] = [];
  if (claimIds.length) {
    claimSources = sqlite
      .prepare(
        `SELECT claim_id, source_id FROM claim_sources WHERE claim_id IN (${claimIds.map(() => "?").join(",")})`
      )
      .all(...claimIds) as { claim_id: number; source_id: number }[];
  }

  const sourceIdSet = new Set<number>();
  for (const row of [...indications, ...adverse, ...warnings] as { source_ids?: string }[]) {
    for (const sid of parseJsonArray(row.source_ids)) {
      const n = Number(sid);
      if (!Number.isNaN(n)) sourceIdSet.add(n);
    }
  }
  for (const cs of claimSources) sourceIdSet.add(cs.source_id);

  // Also pull med-level source keys from indications
  const sources =
    sourceIdSet.size > 0
      ? (sqlite
          .prepare(
            `SELECT * FROM sources WHERE id IN (${[...sourceIdSet].map(() => "?").join(",")})`
          )
          .all(...sourceIdSet) as Record<string, unknown>[])
      : [];

  const claimsWithSources = claims.map((c) => ({
    ...c,
    sources: sources.filter((s) =>
      claimSources.some((cs) => cs.claim_id === c.id && cs.source_id === s.id)
    ),
  }));

  return {
    ...med,
    id: med.id as number,
    slug: med.slug as string,
    generic_name: med.generic_name as string,
    drug_class: med.drug_class as string,
    mechanism: med.mechanism as string,
    benefits_summary: med.benefits_summary as string,
    evidence_quality_overview: med.evidence_quality_overview as string | null,
    why_still_prescribed: med.why_still_prescribed as string | null,
    long_term_evidence: med.long_term_evidence as string | null,
    brandNames: parseJsonArray(med.brand_names as string),
    routes: parseJsonArray(med.routes as string),
    regulatoryStatus: parseJsonObject<Record<string, string>>(
      med.regulatory_status as string
    ),
    indications,
    adverse,
    warnings,
    special,
    monitoring,
    withdrawal,
    alternatives,
    claims: claimsWithSources,
    sources,
  };
}

export function listConditions(opts?: { q?: string }) {
  const sqlite = getSqlite();
  if (opts?.q?.trim()) {
    const like = `%${opts.q.trim()}%`;
    return sqlite
      .prepare(
        `SELECT id, name, slug, summary FROM conditions
         WHERE status = 'published' AND (name LIKE ? OR summary LIKE ?)
         ORDER BY name`
      )
      .all(like, like);
  }
  return sqlite
    .prepare(
      `SELECT id, name, slug, summary FROM conditions WHERE status = 'published' ORDER BY name`
    )
    .all();
}

export function getConditionBySlug(slug: string) {
  const sqlite = getSqlite();
  const c = sqlite.prepare(`SELECT * FROM conditions WHERE slug = ?`).get(slug) as
    | Record<string, unknown>
    | undefined;
  if (!c) return null;
  const symptoms = sqlite
    .prepare(`SELECT * FROM condition_symptoms WHERE condition_id = ?`)
    .all(c.id as number);
  return {
    ...c,
    id: c.id as number,
    name: c.name as string,
    slug: c.slug as string,
    summary: c.summary as string,
    when_to_seek_care: c.when_to_seek_care as string,
    evidence_overview: c.evidence_overview as string | null,
    typicalSymptoms: parseJsonArray(c.typical_symptoms as string),
    redFlags: parseJsonArray(c.red_flags as string),
    symptoms,
  };
}

export function listSources() {
  return getSqlite().prepare(`SELECT * FROM sources ORDER BY organization, title`).all();
}

export function getSourceById(id: number) {
  return getSqlite().prepare(`SELECT * FROM sources WHERE id = ?`).get(id);
}

export function listPendingClaims() {
  return getSqlite()
    .prepare(
      `SELECT c.*, m.generic_name, m.slug as med_slug
       FROM claims c
       LEFT JOIN medications m ON m.id = c.entity_id AND c.entity_type = 'medication'
       WHERE c.status IN ('draft', 'reviewed')
       ORDER BY CASE c.status WHEN 'draft' THEN 0 ELSE 1 END, c.id DESC`
    )
    .all();
}

export function getMedsForCompare(slugs: string[]) {
  return slugs
    .map((s) => getMedicationBySlug(s))
    .filter(Boolean);
}
