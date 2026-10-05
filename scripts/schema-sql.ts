/** Raw SQL used to create tables + FTS (shared by seed). */
export const SCHEMA_SQL = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS medications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  generic_name TEXT NOT NULL,
  brand_names TEXT NOT NULL DEFAULT '[]',
  drug_class TEXT NOT NULL,
  mechanism TEXT NOT NULL,
  routes TEXT NOT NULL DEFAULT '[]',
  regulatory_status TEXT NOT NULL DEFAULT '{}',
  evidence_quality_overview TEXT,
  last_evidence_review TEXT,
  why_still_prescribed TEXT,
  benefits_summary TEXT,
  long_term_evidence TEXT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS medication_indications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  indication TEXT NOT NULL,
  approved_vs_off_label TEXT NOT NULL DEFAULT 'approved',
  jurisdictions TEXT NOT NULL DEFAULT '["US","EU","UK","CH"]',
  evidence_level TEXT NOT NULL DEFAULT 'moderate',
  source_ids TEXT NOT NULL DEFAULT '[]',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS adverse_effects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  effect TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'common',
  frequency_note TEXT,
  evidence_level TEXT NOT NULL DEFAULT 'moderate',
  source_ids TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS contraindications_warnings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  type TEXT NOT NULL,
  population_or_condition TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'moderate',
  evidence_level TEXT NOT NULL DEFAULT 'high',
  source_ids TEXT NOT NULL DEFAULT '[]',
  details TEXT
);

CREATE TABLE IF NOT EXISTS interactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  med_a_id INTEGER REFERENCES medications(id),
  med_b_id INTEGER REFERENCES medications(id),
  condition_id INTEGER,
  severity TEXT NOT NULL,
  mechanism TEXT,
  clinical_effect TEXT NOT NULL,
  established_vs_theoretical TEXT NOT NULL DEFAULT 'established',
  evidence_level TEXT NOT NULL DEFAULT 'moderate',
  source_ids TEXT NOT NULL DEFAULT '[]',
  professional_followup TEXT
);

CREATE TABLE IF NOT EXISTS special_populations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  pregnancy TEXT,
  lactation TEXT,
  renal TEXT,
  hepatic TEXT,
  geriatric TEXT,
  pediatric TEXT,
  source_ids TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS monitoring_requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  requirement TEXT NOT NULL,
  frequency_note TEXT,
  evidence_level TEXT NOT NULL DEFAULT 'moderate',
  source_ids TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS withdrawal_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  note TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'moderate',
  source_ids TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS alternatives (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  medication_id INTEGER NOT NULL REFERENCES medications(id),
  alternative_medication_id INTEGER REFERENCES medications(id),
  alternative_name TEXT,
  rationale TEXT NOT NULL,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS conditions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  typical_symptoms TEXT NOT NULL DEFAULT '[]',
  red_flags TEXT NOT NULL DEFAULT '[]',
  when_to_seek_care TEXT NOT NULL,
  evidence_overview TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS condition_symptoms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  condition_id INTEGER NOT NULL REFERENCES conditions(id),
  symptom TEXT NOT NULL,
  synonyms TEXT NOT NULL DEFAULT '[]',
  weight REAL NOT NULL DEFAULT 1.0,
  supporting_feature TEXT,
  against_feature TEXT
);

CREATE TABLE IF NOT EXISTS sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  publication_date TEXT,
  evidence_type TEXT NOT NULL DEFAULT 'regulatory',
  url TEXT,
  accessed_date TEXT,
  jurisdiction TEXT
);

CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  claim_text TEXT NOT NULL,
  evidence_level TEXT NOT NULL DEFAULT 'moderate',
  evidence_type TEXT NOT NULL DEFAULT 'regulatory',
  certainty_bucket TEXT NOT NULL DEFAULT 'established',
  jurisdiction TEXT,
  reviewer TEXT,
  review_date TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'published',
  section TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS claim_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_id INTEGER NOT NULL REFERENCES claims(id),
  source_id INTEGER NOT NULL REFERENCES sources(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  query TEXT,
  retrieved_sources TEXT DEFAULT '[]',
  claims_used TEXT DEFAULT '[]',
  response_summary TEXT,
  safety_flags TEXT DEFAULT '[]',
  db_version TEXT,
  timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  claim_id INTEGER REFERENCES claims(id),
  medication_id INTEGER REFERENCES medications(id),
  reviewer_note TEXT,
  decision TEXT NOT NULL,
  version_note TEXT,
  timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS emergency_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pattern_keywords TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'emergency',
  message TEXT NOT NULL,
  region_notes TEXT NOT NULL DEFAULT '{}',
  active INTEGER NOT NULL DEFAULT 1
);

-- Synonyms layer (search/recognition only): brands, international names, lay terms,
-- misspellings, abbreviations and DE/FR/IT terms mapped to a canonical target.
CREATE TABLE IF NOT EXISTS synonyms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term TEXT NOT NULL,
  normalized_term TEXT NOT NULL,
  target_type TEXT NOT NULL, -- medication|condition|symptom
  target_id INTEGER,         -- medications.id / conditions.id; NULL for symptom
  target_label TEXT NOT NULL, -- canonical name / canonical symptom text
  kind TEXT NOT NULL,        -- brand|international_name|lay_term|misspelling|abbreviation|german|french|italian
  language TEXT,
  region TEXT                -- e.g. CH,DE (brands)
);
CREATE INDEX IF NOT EXISTS idx_synonyms_norm ON synonyms(normalized_term);
CREATE INDEX IF NOT EXISTS idx_synonyms_target ON synonyms(target_type, target_id);

CREATE VIRTUAL TABLE IF NOT EXISTS synonyms_fts USING fts5(
  term, normalized_term, target_label,
  content='synonyms', content_rowid='id'
);

CREATE VIRTUAL TABLE IF NOT EXISTS meds_fts USING fts5(
  generic_name, brand_names, drug_class, mechanism, slug,
  content='medications', content_rowid='id'
);

CREATE VIRTUAL TABLE IF NOT EXISTS conditions_fts USING fts5(
  name, summary, typical_symptoms, slug,
  content='conditions', content_rowid='id'
);

CREATE VIRTUAL TABLE IF NOT EXISTS symptoms_fts USING fts5(
  symptom, synonyms, condition_name
);
`;
