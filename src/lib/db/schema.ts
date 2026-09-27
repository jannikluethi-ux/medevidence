import { sqliteTable, text, integer, real, index } from "drizzle-orm/sqlite-core";

export const medications = sqliteTable(
  "medications",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    genericName: text("generic_name").notNull(),
    brandNames: text("brand_names").notNull().default("[]"), // JSON
    drugClass: text("drug_class").notNull(),
    mechanism: text("mechanism").notNull(),
    routes: text("routes").notNull().default("[]"), // JSON
    regulatoryStatus: text("regulatory_status").notNull().default("{}"), // JSON by jurisdiction
    evidenceQualityOverview: text("evidence_quality_overview"),
    lastEvidenceReview: text("last_evidence_review"),
    whyStillPrescribed: text("why_still_prescribed"),
    benefitsSummary: text("benefits_summary"),
    longTermEvidence: text("long_term_evidence"),
    slug: text("slug").notNull().unique(),
    status: text("status").notNull().default("published"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [index("med_slug_idx").on(t.slug), index("med_name_idx").on(t.genericName)]
);

export const medicationIndications = sqliteTable("medication_indications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  indication: text("indication").notNull(),
  approvedVsOffLabel: text("approved_vs_off_label").notNull().default("approved"),
  jurisdictions: text("jurisdictions").notNull().default('["US","EU","UK","CH"]'),
  evidenceLevel: text("evidence_level").notNull().default("moderate"),
  sourceIds: text("source_ids").notNull().default("[]"),
  notes: text("notes"),
});

export const adverseEffects = sqliteTable("adverse_effects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  effect: text("effect").notNull(),
  severity: text("severity").notNull().default("common"), // common|serious|boxed
  frequencyNote: text("frequency_note"),
  evidenceLevel: text("evidence_level").notNull().default("moderate"),
  sourceIds: text("source_ids").notNull().default("[]"),
});

export const contraindicationsWarnings = sqliteTable("contraindications_warnings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  type: text("type").notNull(), // contraindication|warning|precaution
  populationOrCondition: text("population_or_condition").notNull(),
  severity: text("severity").notNull().default("moderate"),
  evidenceLevel: text("evidence_level").notNull().default("high"),
  sourceIds: text("source_ids").notNull().default("[]"),
  details: text("details"),
});

export const interactions = sqliteTable("interactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medAId: integer("med_a_id").references(() => medications.id),
  medBId: integer("med_b_id").references(() => medications.id),
  conditionId: integer("condition_id"),
  severity: text("severity").notNull(), // minor|moderate|major|contraindicated
  mechanism: text("mechanism"),
  clinicalEffect: text("clinical_effect").notNull(),
  establishedVsTheoretical: text("established_vs_theoretical").notNull().default("established"),
  evidenceLevel: text("evidence_level").notNull().default("moderate"),
  sourceIds: text("source_ids").notNull().default("[]"),
  professionalFollowup: text("professional_followup"),
});

export const specialPopulations = sqliteTable("special_populations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  pregnancy: text("pregnancy"),
  lactation: text("lactation"),
  renal: text("renal"),
  hepatic: text("hepatic"),
  geriatric: text("geriatric"),
  pediatric: text("pediatric"),
  sourceIds: text("source_ids").notNull().default("[]"),
});

export const monitoringRequirements = sqliteTable("monitoring_requirements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  requirement: text("requirement").notNull(),
  frequencyNote: text("frequency_note"),
  evidenceLevel: text("evidence_level").notNull().default("moderate"),
  sourceIds: text("source_ids").notNull().default("[]"),
});

export const withdrawalNotes = sqliteTable("withdrawal_notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  note: text("note").notNull(),
  severity: text("severity").notNull().default("moderate"),
  sourceIds: text("source_ids").notNull().default("[]"),
});

export const alternatives = sqliteTable("alternatives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  medicationId: integer("medication_id")
    .notNull()
    .references(() => medications.id),
  alternativeMedicationId: integer("alternative_medication_id").references(
    () => medications.id
  ),
  alternativeName: text("alternative_name"),
  rationale: text("rationale").notNull(),
  notes: text("notes"),
});

export const conditions = sqliteTable(
  "conditions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    summary: text("summary").notNull(),
    typicalSymptoms: text("typical_symptoms").notNull().default("[]"),
    redFlags: text("red_flags").notNull().default("[]"),
    whenToSeekCare: text("when_to_seek_care").notNull(),
    evidenceOverview: text("evidence_overview"),
    status: text("status").notNull().default("published"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (t) => [index("cond_slug_idx").on(t.slug)]
);

export const conditionSymptoms = sqliteTable("condition_symptoms", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conditionId: integer("condition_id")
    .notNull()
    .references(() => conditions.id),
  symptom: text("symptom").notNull(),
  synonyms: text("synonyms").notNull().default("[]"),
  weight: real("weight").notNull().default(1.0),
  supportingFeature: text("supporting_feature"),
  againstFeature: text("against_feature"),
});

export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  publicationDate: text("publication_date"),
  evidenceType: text("evidence_type").notNull().default("regulatory"),
  url: text("url"),
  accessedDate: text("accessed_date"),
  jurisdiction: text("jurisdiction"),
});

export const claims = sqliteTable("claims", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  entityType: text("entity_type").notNull(), // medication|condition|interaction|general
  entityId: integer("entity_id"),
  claimText: text("claim_text").notNull(),
  evidenceLevel: text("evidence_level").notNull().default("moderate"),
  evidenceType: text("evidence_type").notNull().default("regulatory"),
  certaintyBucket: text("certainty_bucket").notNull().default("established"),
  jurisdiction: text("jurisdiction"),
  reviewer: text("reviewer"),
  reviewDate: text("review_date"),
  version: integer("version").notNull().default(1),
  status: text("status").notNull().default("published"),
  section: text("section"), // e.g. emerging_safety, long_term, benefit
  createdAt: text("created_at").notNull(),
});

export const claimSources = sqliteTable("claim_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  claimId: integer("claim_id")
    .notNull()
    .references(() => claims.id),
  sourceId: integer("source_id")
    .notNull()
    .references(() => sources.id),
});

export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  query: text("query"),
  retrievedSources: text("retrieved_sources").default("[]"),
  claimsUsed: text("claims_used").default("[]"),
  responseSummary: text("response_summary"),
  safetyFlags: text("safety_flags").default("[]"),
  dbVersion: text("db_version"),
  timestamp: text("timestamp").notNull(),
});

export const contentReviews = sqliteTable("content_reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  claimId: integer("claim_id").references(() => claims.id),
  medicationId: integer("medication_id").references(() => medications.id),
  reviewerNote: text("reviewer_note"),
  decision: text("decision").notNull(), // approve|reject|needs_revision
  versionNote: text("version_note"),
  timestamp: text("timestamp").notNull(),
});

export const emergencyRules = sqliteTable("emergency_rules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  patternKeywords: text("pattern_keywords").notNull(), // JSON array of keyword groups
  urgency: text("urgency").notNull().default("emergency"), // emergency|urgent
  message: text("message").notNull(),
  regionNotes: text("region_notes").notNull().default("{}"),
  active: integer("active").notNull().default(1),
});

export type Medication = typeof medications.$inferSelect;
export type Condition = typeof conditions.$inferSelect;
export type Claim = typeof claims.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type Interaction = typeof interactions.$inferSelect;
export type EmergencyRule = typeof emergencyRules.$inferSelect;
