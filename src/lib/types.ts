export type Jurisdiction = "US" | "EU" | "UK" | "CH";

export type EvidenceLevel =
  | "high"
  | "moderate"
  | "low"
  | "very_low"
  | "no_established";

export type CertaintyBucket =
  | "established"
  | "probable"
  | "possible_emerging"
  | "not_established";

export type EvidenceType =
  | "regulatory"
  | "guideline"
  | "rct"
  | "observational"
  | "case_report"
  | "mechanistic"
  | "early_research"
  | "expert_opinion";

export type ContentStatus = "draft" | "reviewed" | "published" | "rejected";

export type SeverityCommon = "common" | "serious" | "boxed";

export type InteractionSeverity =
  | "minor"
  | "moderate"
  | "major"
  | "contraindicated";

export const EVIDENCE_LABELS: Record<EvidenceLevel, string> = {
  high: "High",
  moderate: "Moderate",
  low: "Low",
  very_low: "Very low",
  no_established: "No established evidence",
};

export const CERTAINTY_LABELS: Record<CertaintyBucket, string> = {
  established: "Established",
  probable: "Probable",
  possible_emerging: "Possible / emerging",
  not_established: "Not established",
};

export const JURISDICTION_LABELS: Record<Jurisdiction, string> = {
  US: "United States (FDA)",
  EU: "European Union (EMA)",
  UK: "United Kingdom (MHRA/NICE)",
  CH: "Switzerland (Swissmedic)",
};

export const EMERGENCY_NUMBERS: Record<Jurisdiction, string> = {
  US: "911",
  EU: "112",
  UK: "999",
  CH: "144",
};
