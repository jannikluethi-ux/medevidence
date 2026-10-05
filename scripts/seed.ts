import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { SCHEMA_SQL } from "./schema-sql";
import { getBuiltinEmergencyRules } from "../src/lib/safety/emergency";
import { normalize } from "../src/lib/text";
import { assertContentChecks } from "./content-checks";

const ROOT = path.join(__dirname, "..");
const DATA = path.join(__dirname, "data");
const DB_PATH = path.join(ROOT, "data", "medevidence.db");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function loadJson<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), "utf8")) as T;
}

function now() {
  return new Date().toISOString().slice(0, 10);
}

type Med = {
  genericName: string;
  brandNames: string[];
  drugClass: string;
  mechanism: string;
  routes: string[];
  regulatoryStatus: Record<string, string>;
  evidenceQualityOverview: string;
  benefitsSummary: string;
  whyStillPrescribed?: string | null;
  longTermEvidence?: string | null;
  indications: { indication: string; approved: boolean; evidence: string; notes?: string }[];
  adverse: { effect: string; severity: string; frequencyNote?: string; evidence: string }[];
  warnings: { type: string; population: string; severity: string; details: string }[];
  special?: Record<string, string> | null;
  monitoring?: string[] | null;
  withdrawal?: string | null;
  sourceKeys: string[];
};

function main() {
  assertContentChecks();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);
  for (const suffix of ["-wal", "-shm"]) {
    const p = DB_PATH + suffix;
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(SCHEMA_SQL);

  const sources = loadJson<
    {
      key: string;
      title: string;
      organization: string;
      publicationDate?: string;
      evidenceType: string;
      url?: string;
      jurisdiction?: string;
    }[]
  >("sources.json");

  const sourceIdByKey = new Map<string, number>();
  const insertSource = db.prepare(`
    INSERT INTO sources (title, organization, publication_date, evidence_type, url, accessed_date, jurisdiction)
    VALUES (@title, @organization, @publicationDate, @evidenceType, @url, @accessedDate, @jurisdiction)
  `);

  const accessed = now();
  for (const s of sources) {
    const info = insertSource.run({
      title: s.title,
      organization: s.organization,
      publicationDate: s.publicationDate ?? null,
      evidenceType: s.evidenceType,
      url: s.url ?? null,
      accessedDate: accessed,
      jurisdiction: s.jurisdiction ?? null,
    });
    sourceIdByKey.set(s.key, Number(info.lastInsertRowid));
  }

  function resolveSourceIds(keys: string[]): number[] {
    return keys
      .map((k) => sourceIdByKey.get(k))
      .filter((id): id is number => typeof id === "number");
  }

  const medParts = ["meds_part1.json", "meds_part2.json", "meds_part3.json", "meds_part4.json", "meds_part5.json", "meds_part6.json", "meds_part7.json"];
  const medications: Med[] = medParts.flatMap((f) => loadJson<Med[]>(f));

  const insertMed = db.prepare(`
    INSERT INTO medications (
      generic_name, brand_names, drug_class, mechanism, routes, regulatory_status,
      evidence_quality_overview, last_evidence_review, why_still_prescribed, benefits_summary,
      long_term_evidence, slug, status, created_at, updated_at
    ) VALUES (
      @genericName, @brandNames, @drugClass, @mechanism, @routes, @regulatoryStatus,
      @evidenceQualityOverview, @lastEvidenceReview, @whyStillPrescribed, @benefitsSummary,
      @longTermEvidence, @slug, 'published', @createdAt, @updatedAt
    )
  `);

  const insertInd = db.prepare(`
    INSERT INTO medication_indications (medication_id, indication, approved_vs_off_label, jurisdictions, evidence_level, source_ids, notes)
    VALUES (@medicationId, @indication, @approved, @jurisdictions, @evidenceLevel, @sourceIds, @notes)
  `);
  const insertAdv = db.prepare(`
    INSERT INTO adverse_effects (medication_id, effect, severity, frequency_note, evidence_level, source_ids)
    VALUES (@medicationId, @effect, @severity, @frequencyNote, @evidenceLevel, @sourceIds)
  `);
  const insertWarn = db.prepare(`
    INSERT INTO contraindications_warnings (medication_id, type, population_or_condition, severity, evidence_level, source_ids, details)
    VALUES (@medicationId, @type, @population, @severity, 'high', @sourceIds, @details)
  `);
  const insertSpecial = db.prepare(`
    INSERT INTO special_populations (medication_id, pregnancy, lactation, renal, hepatic, geriatric, pediatric, source_ids)
    VALUES (@medicationId, @pregnancy, @lactation, @renal, @hepatic, @geriatric, @pediatric, @sourceIds)
  `);
  const insertMon = db.prepare(`
    INSERT INTO monitoring_requirements (medication_id, requirement, frequency_note, evidence_level, source_ids)
    VALUES (@medicationId, @requirement, NULL, 'moderate', @sourceIds)
  `);
  const insertWd = db.prepare(`
    INSERT INTO withdrawal_notes (medication_id, note, severity, source_ids)
    VALUES (@medicationId, @note, 'moderate', @sourceIds)
  `);

  const medIdByName = new Map<string, number>();
  const usedSlugs = new Set<string>();

  const txMeds = db.transaction(() => {
    for (const m of medications) {
      let slug = slugify(m.genericName);
      if (usedSlugs.has(slug)) slug = slug + "-" + usedSlugs.size;
      usedSlugs.add(slug);
      const sourceIds = resolveSourceIds(m.sourceKeys);
      const info = insertMed.run({
        genericName: m.genericName,
        brandNames: JSON.stringify(m.brandNames),
        drugClass: m.drugClass,
        mechanism: m.mechanism,
        routes: JSON.stringify(m.routes),
        regulatoryStatus: JSON.stringify(m.regulatoryStatus),
        evidenceQualityOverview: m.evidenceQualityOverview,
        lastEvidenceReview: accessed,
        whyStillPrescribed: m.whyStillPrescribed ?? null,
        benefitsSummary: m.benefitsSummary,
        longTermEvidence: m.longTermEvidence ?? null,
        slug,
        createdAt: accessed,
        updatedAt: accessed,
      });
      const medId = Number(info.lastInsertRowid);
      medIdByName.set(m.genericName, medId);

      for (const ind of m.indications) {
        insertInd.run({
          medicationId: medId,
          indication: ind.indication,
          approved: ind.approved ? "approved" : "off-label / not established",
          jurisdictions: JSON.stringify(["US", "EU", "UK", "CH"]),
          evidenceLevel: ind.evidence,
          sourceIds: JSON.stringify(sourceIds),
          notes: ind.notes ?? null,
        });
      }
      for (const a of m.adverse) {
        insertAdv.run({
          medicationId: medId,
          effect: a.effect,
          severity: a.severity,
          frequencyNote: a.frequencyNote ?? null,
          evidenceLevel: a.evidence,
          sourceIds: JSON.stringify(sourceIds),
        });
      }
      for (const w of m.warnings) {
        insertWarn.run({
          medicationId: medId,
          type: w.type,
          population: w.population,
          severity: w.severity,
          sourceIds: JSON.stringify(sourceIds),
          details: w.details,
        });
      }
      if (m.special) {
        insertSpecial.run({
          medicationId: medId,
          pregnancy: m.special.pregnancy ?? null,
          lactation: m.special.lactation ?? null,
          renal: m.special.renal ?? null,
          hepatic: m.special.hepatic ?? null,
          geriatric: m.special.geriatric ?? null,
          pediatric: m.special.pediatric ?? null,
          sourceIds: JSON.stringify(sourceIds),
        });
      }
      for (const req of m.monitoring ?? []) {
        insertMon.run({
          medicationId: medId,
          requirement: req,
          sourceIds: JSON.stringify(sourceIds),
        });
      }
      if (m.withdrawal) {
        insertWd.run({
          medicationId: medId,
          note: m.withdrawal,
          sourceIds: JSON.stringify(sourceIds),
        });
      }
    }
  });
  txMeds();

  // Alternatives (simple links)
  const insertAlt = db.prepare(`
    INSERT INTO alternatives (medication_id, alternative_medication_id, alternative_name, rationale, notes)
    VALUES (@medicationId, @altId, @altName, @rationale, @notes)
  `);
  const altPairs: [string, string, string][] = [
    ["Omeprazole", "Famotidine", "H2RA alternative for some milder acid-related symptoms; less potent for erosive disease."],
    ["Omeprazole", "Pantoprazole", "Alternative PPI within class; choice may matter for drug interactions (e.g., clopidogrel discussions)."],
    ["Omeprazole", "Lansoprazole", "Alternative PPI; similar acid-suppression class effects and long-term safety discussions."],
    ["Ibuprofen", "Paracetamol (Acetaminophen)", "Analgesic/antipyretic with different risk profile (hepatotoxicity vs GI/CV/renal NSAID risks)."],
    ["Ibuprofen", "Naproxen", "Alternative NSAID — still carries class CV/GI/renal risks; not risk-free switching."],
    ["Ibuprofen", "Celecoxib", "COX-2 selective option may reduce some GI ulcer risk but retains CV boxed-warning concerns; sulfa allergy relevant."],
    ["Lisinopril", "Losartan", "ARB alternative if ACE inhibitor cough or angioedema history (angioedema still possible with ARBs)."],
    ["Lisinopril", "Amlodipine", "Dihydropyridine CCB alternative antihypertensive class when ACEI not tolerated (different indications/benefits in HFrEF/proteinuria)."],
    ["Lisinopril", "Sacubitril/valsartan", "ARNI preferred over ACEI for many symptomatic HFrEF patients per guidelines — requires ACEI washout; not a casual switch."],
    ["Warfarin", "Apixaban", "DOAC alternative for many NVAF/VTE indications — NOT interchangeable for mechanical valves."],
    ["Warfarin", "Rivaroxaban", "DOAC alternative for selected NVAF/VTE indications — renal dosing and food/timing rules differ; not for mechanical valves."],
    ["Sertraline", "Escitalopram", "Alternative SSRI; individual response and tolerability vary."],
    ["Sertraline", "Venlafaxine", "SNRI alternative if SSRI inadequate; watch BP and discontinuation symptoms."],
    ["Sertraline", "Mirtazapine", "Alternative antidepressant when sedation/appetite increase desirable; different AE profile."],
    ["Ciprofloxacin", "Amoxicillin", "Different spectrum — only an alternative when culture/indication supports a non-fluoroquinolone choice."],
    ["Ciprofloxacin", "Nitrofurantoin", "Often preferred for uncomplicated cystitis when appropriate — avoids fluoroquinolone boxed-warning toxicities."],
    ["Simvastatin", "Rosuvastatin", "Alternative statin; interaction profiles differ (CYP3A4)."],
    ["Simvastatin", "Pravastatin", "More interaction-friendly statin option when strong CYP3A4 inhibitors are required."],
    ["Atorvastatin", "Rosuvastatin", "Alternative high-intensity statin; renal dosing and interaction profiles differ."],
    ["Metformin", "Empagliflozin", "Add-on or alternative in T2DM with HF/CKD/CVD indications for SGLT2i — complementary mechanisms often combined."],
    ["Metformin", "Semaglutide", "GLP-1 RA option when weight and CV risk dominate; GI tolerability and cost/access differ."],
    ["Salbutamol (Albuterol)", "Budesonide/formoterol", "Maintenance/reliever strategies per GINA may reduce SABA-only reliance — clinician-directed asthma plan."],
    ["Diazepam", "Sertraline", "For chronic anxiety, SSRI/SNRI guideline pharmacotherapy is generally preferred over long-term benzodiazepines."],
    ["Zolpidem", "Melatonin", "Non-benzo option for some circadian/insomnia contexts; evidence and regulation vary — not equivalent potency."],
    ["Oxybutynin", "Mirabegron", "Beta-3 agonist alternative for OAB with less anticholinergic cognitive burden in many older adults."],
    ["Clopidogrel", "Ticagrelor", "Potent P2Y12 alternative post-ACS in selected patients — higher bleeding and dyspnea considerations."],
    ["Morphine", "Buprenorphine", "Partial agonist may be used for selected chronic pain/OUD contexts — not interchangeable dosing; specialist frameworks."],
    ["Prednisone / Prednisolone", "Budesonide (inhaled)", "For asthma, inhaled corticosteroids treat airway inflammation with far less systemic exposure than chronic oral steroids."],
    ["Omeprazole", "Lifestyle / non-drug GERD care", "Weight management, head-of-bed elevation, trigger avoidance — foundational before indefinite PPI use."],
  ];
  for (const [a, b, rationale] of altPairs) {
    const aId = medIdByName.get(a);
    const bId = medIdByName.get(b) ?? null;
    if (aId) {
      insertAlt.run({
        medicationId: aId,
        altId: bId,
        altName: b,
        rationale,
        notes: "Not a recommendation to switch — clinician decision.",
      });
    }
  }

  // Conditions
  type Cond = {
    name: string;
    summary: string;
    typical_symptoms: string[];
    red_flags: string[];
    when_to_seek_care: string;
    evidence_overview: string;
    first_aid?: string[];
    symptoms: {
      symptom: string;
      synonyms: string[];
      weight: number;
      supporting?: string | null;
      against?: string | null;
    }[];
  };
  const conditions = loadJson<Cond[]>("conditions.json");
  const insertCond = db.prepare(`
    INSERT INTO conditions (name, slug, summary, typical_symptoms, red_flags, when_to_seek_care, evidence_overview, first_aid, status, created_at, updated_at)
    VALUES (@name, @slug, @summary, @typical, @redFlags, @whenToSeek, @evidence, @firstAid, 'published', @createdAt, @updatedAt)
  `);
  const insertSym = db.prepare(`
    INSERT INTO condition_symptoms (condition_id, symptom, synonyms, weight, supporting_feature, against_feature)
    VALUES (@conditionId, @symptom, @synonyms, @weight, @supporting, @against)
  `);
  const insertSymFts = db.prepare(`
    INSERT INTO symptoms_fts (symptom, synonyms, condition_name) VALUES (@symptom, @synonyms, @conditionName)
  `);

  const condIdByName = new Map<string, number>();
  const txCond = db.transaction(() => {
    for (const c of conditions) {
      const slug = slugify(c.name);
      const info = insertCond.run({
        name: c.name,
        slug,
        summary: c.summary,
        typical: JSON.stringify(c.typical_symptoms),
        redFlags: JSON.stringify(c.red_flags),
        whenToSeek: c.when_to_seek_care,
        evidence: c.evidence_overview,
        firstAid: JSON.stringify(c.first_aid ?? []),
        createdAt: accessed,
        updatedAt: accessed,
      });
      const cid = Number(info.lastInsertRowid);
      condIdByName.set(c.name, cid);
      for (const s of c.symptoms) {
        insertSym.run({
          conditionId: cid,
          symptom: s.symptom,
          synonyms: JSON.stringify(s.synonyms),
          weight: s.weight,
          supporting: s.supporting ?? null,
          against: s.against ?? null,
        });
        insertSymFts.run({
          symptom: s.symptom,
          synonyms: s.synonyms.join(" "),
          conditionName: c.name,
        });
      }
    }
  });
  txCond();

  // Condition -> medicine links ("Find medicines by condition") — generated by scripts/enrich/v2/build.mjs.
  // Fail the seed if a link does not resolve or its indication is not in the medicine's own data.
  type CondMed = {
    condition: string;
    medication: string;
    indication: string;
    form: string;
    availability: string;
    note: string | null;
    sourceKey: string | null;
  };
  const condMeds = fs.existsSync(path.join(DATA, "condition_medications.json")) ? loadJson<CondMed[]>("condition_medications.json") : [];
  const insertCondMed = db.prepare(`
    INSERT INTO condition_medications (condition_id, medication_id, indication, form, availability, note, source_id)
    VALUES (@conditionId, @medicationId, @indication, @form, @availability, @note, @sourceId)
  `);
  const hasIndication = db.prepare(`SELECT 1 FROM medication_indications WHERE medication_id = ? AND indication = ? LIMIT 1`);
  const condMedErrors: string[] = [];
  const txCondMeds = db.transaction(() => {
    for (const l of condMeds) {
      const conditionId = condIdByName.get(l.condition);
      const medicationId = medIdByName.get(l.medication);
      if (!conditionId || !medicationId) {
        condMedErrors.push(`${l.condition} -> ${l.medication}: unresolved`);
        continue;
      }
      if (!hasIndication.get(medicationId, l.indication)) {
        condMedErrors.push(`${l.condition} -> ${l.medication}: indication not in medication data ("${l.indication}")`);
        continue;
      }
      const sourceId = l.sourceKey ? sourceIdByKey.get(l.sourceKey) ?? null : null;
      if (l.sourceKey && sourceId === null) condMedErrors.push(`${l.condition} -> ${l.medication}: unknown source ${l.sourceKey}`);
      insertCondMed.run({ conditionId, medicationId, indication: l.indication, form: l.form, availability: l.availability, note: l.note, sourceId });
    }
  });
  txCondMeds();
  if (condMedErrors.length) throw new Error("condition_medications validation failed:\n" + condMedErrors.join("\n"));

  // Synonyms layer (search/recognition only) — generated by scripts/enrich/v2/build.mjs
  type Syn = {
    term: string;
    normalized_term: string;
    kind: string;
    language: string | null;
    region: string | null;
    target_type: "medication" | "condition" | "symptom";
    target: string;
  };
  const synonymRows = fs.existsSync(path.join(DATA, "synonyms.json")) ? loadJson<Syn[]>("synonyms.json") : [];
  const canonicalSymptomSet = new Set(conditions.flatMap((c) => c.symptoms.map((s) => s.symptom)));
  const insertSyn = db.prepare(`
    INSERT INTO synonyms (term, normalized_term, target_type, target_id, target_label, kind, language, region)
    VALUES (@term, @normalized, @targetType, @targetId, @label, @kind, @language, @region)
  `);
  let synCount = 0;
  const synMisses: string[] = [];
  const txSyn = db.transaction(() => {
    for (const r of synonymRows) {
      let targetId: number | null = null;
      if (r.target_type === "medication") targetId = medIdByName.get(r.target) ?? null;
      else if (r.target_type === "condition") targetId = condIdByName.get(r.target) ?? null;
      const ok = r.target_type === "symptom" ? canonicalSymptomSet.has(r.target) : targetId !== null;
      if (!ok) {
        synMisses.push(`${r.target_type}:${r.target} <- ${r.term}`);
        continue;
      }
      insertSyn.run({
        term: r.term,
        normalized: normalize(r.term),
        targetType: r.target_type,
        targetId,
        label: r.target,
        kind: r.kind,
        language: r.language,
        region: r.region,
      });
      synCount++;
    }
  });
  txSyn();
  if (synMisses.length) console.warn(`WARN: ${synMisses.length} synonym rows with unresolved targets`, synMisses.slice(0, 10));

  // Interactions
  type Ix = {
    medA: string;
    medB: string;
    severity: string;
    mechanism: string;
    clinical_effect: string;
    established_vs_theoretical: string;
    evidence_level: string;
    professional_followup: string;
    sourceKeys: string[];
  };
  const interactions = loadJson<Ix[]>("interactions.json");
  const insertIx = db.prepare(`
    INSERT INTO interactions (med_a_id, med_b_id, condition_id, severity, mechanism, clinical_effect, established_vs_theoretical, evidence_level, source_ids, professional_followup)
    VALUES (@a, @b, NULL, @severity, @mechanism, @clinical, @est, @evidence, @sourceIds, @followup)
  `);
  let ixCount = 0;
  for (const ix of interactions) {
    const a = medIdByName.get(ix.medA);
    const b = medIdByName.get(ix.medB);
    if (!a || !b) {
      console.warn("Skipping interaction, missing med:", ix.medA, ix.medB);
      continue;
    }
    insertIx.run({
      a,
      b,
      severity: ix.severity,
      mechanism: ix.mechanism,
      clinical: ix.clinical_effect,
      est: ix.established_vs_theoretical,
      evidence: ix.evidence_level,
      sourceIds: JSON.stringify(resolveSourceIds(ix.sourceKeys)),
      followup: ix.professional_followup,
    });
    ixCount++;
  }

  // Claims
  type Claim = {
    entity: string;
    entityType: string;
    section: string;
    claim_text: string;
    evidence_level: string;
    evidence_type: string;
    certainty_bucket: string;
    jurisdiction?: string | null;
    status: string;
    sourceKeys: string[];
  };
  const claims = loadJson<Claim[]>("claims.json");
  const insertClaim = db.prepare(`
    INSERT INTO claims (entity_type, entity_id, claim_text, evidence_level, evidence_type, certainty_bucket, jurisdiction, reviewer, review_date, version, status, section, created_at)
    VALUES (@entityType, @entityId, @claimText, @evidenceLevel, @evidenceType, @certaintyBucket, @jurisdiction, @reviewer, @reviewDate, 1, @status, @section, @createdAt)
  `);
  const insertClaimSource = db.prepare(`
    INSERT INTO claim_sources (claim_id, source_id) VALUES (@claimId, @sourceId)
  `);
  let claimCount = 0;
  for (const c of claims) {
    const entityId =
      c.entityType === "medication" ? medIdByName.get(c.entity) ?? null : null;
    const info = insertClaim.run({
      entityType: c.entityType,
      entityId,
      claimText: c.claim_text,
      evidenceLevel: c.evidence_level,
      evidenceType: c.evidence_type,
      certaintyBucket: c.certainty_bucket,
      jurisdiction: c.jurisdiction ?? null,
      reviewer: c.status === "published" ? "seed-editorial" : null,
      reviewDate: c.status === "published" ? accessed : null,
      status: c.status,
      section: c.section,
      createdAt: accessed,
    });
    const claimId = Number(info.lastInsertRowid);
    for (const sid of resolveSourceIds(c.sourceKeys)) {
      insertClaimSource.run({ claimId, sourceId: sid });
    }
    claimCount++;
  }

  // Emergency rules (persisted copy of engine patterns)
  const insertRule = db.prepare(`
    INSERT INTO emergency_rules (name, pattern_keywords, urgency, message, region_notes, active)
    VALUES (@name, @patterns, @urgency, @message, @regionNotes, 1)
  `);
  const regionNotes = JSON.stringify({
    US: "Call 911",
    EU: "Call 112",
    UK: "Call 999",
    CH: "Call 144",
  });
  // Persist the engine's own rule set so the DB copy never drifts from src/lib/safety/emergency.ts
  const rules = getBuiltinEmergencyRules().map((r) => ({
    name: r.name,
    patterns: r.groups,
    urgency: r.urgency,
    message: r.message,
  }));
  for (const r of rules) {
    insertRule.run({
      name: r.name,
      patterns: JSON.stringify(r.patterns),
      urgency: r.urgency,
      message: r.message,
      regionNotes,
    });
  }

  // Rebuild FTS content tables
  db.exec(`INSERT INTO meds_fts(meds_fts) VALUES('rebuild');`);
  db.exec(`INSERT INTO conditions_fts(conditions_fts) VALUES('rebuild');`);
  db.exec(`INSERT INTO synonyms_fts(synonyms_fts) VALUES('rebuild');`);

  // Seed one pending content review row pointing at a draft claim
  const draft = db.prepare(`SELECT id FROM claims WHERE status = 'draft' LIMIT 1`).get() as
    | { id: number }
    | undefined;
  if (draft) {
    db.prepare(
      `INSERT INTO content_reviews (claim_id, medication_id, reviewer_note, decision, version_note, timestamp)
       VALUES (@claimId, NULL, @note, @decision, @versionNote, @ts)`
    ).run({
      claimId: draft.id,
      note: "Awaiting clinician editorial review",
      decision: "pending",
      versionNote: "Seeded draft for admin queue demo",
      ts: new Date().toISOString(),
    });
  }

  const count = (sql: string) => Number((db.prepare(sql).get() as { c: number }).c);
  console.log(
    JSON.stringify(
      {
        dbPath: DB_PATH,
        medications: medications.length,
        conditions: conditions.length,
        conditionMedications: count("SELECT COUNT(*) AS c FROM condition_medications"),
        interactions: ixCount,
        sources: sources.length,
        claims: claimCount,
        emergencyRules: rules.length,
        synonyms: synCount,
        synonymsByKind: Object.fromEntries(
          (db.prepare(`SELECT kind, COUNT(*) AS c FROM synonyms GROUP BY kind`).all() as { kind: string; c: number }[]).map((r) => [r.kind, r.c])
        ),
        adverse_effects: count("SELECT COUNT(*) AS c FROM adverse_effects"),
        indications: count("SELECT COUNT(*) AS c FROM medication_indications"),
        warnings: count("SELECT COUNT(*) AS c FROM contraindications_warnings"),
        monitoring: count("SELECT COUNT(*) AS c FROM monitoring_requirements"),
        special_populations: count("SELECT COUNT(*) AS c FROM special_populations"),
        withdrawal: count("SELECT COUNT(*) AS c FROM withdrawal_notes"),
        alternatives: count("SELECT COUNT(*) AS c FROM alternatives"),
        condition_symptoms: count("SELECT COUNT(*) AS c FROM condition_symptoms"),
      },
      null,
      2
    )
  );
  db.close();
}

main();
