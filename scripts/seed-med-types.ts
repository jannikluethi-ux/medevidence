export type MedSeed = {
  genericName: string;
  brandNames: string[];
  drugClass: string;
  mechanism: string;
  routes: string[];
  regulatoryStatus: Record<string, string>;
  evidenceQualityOverview: string;
  benefitsSummary: string;
  whyStillPrescribed?: string;
  longTermEvidence?: string;
  indications: { indication: string; approved: boolean; evidence: string; notes?: string }[];
  adverse: { effect: string; severity: string; frequencyNote?: string; evidence: string }[];
  warnings: { type: string; population: string; severity: string; details: string }[];
  special?: {
    pregnancy?: string;
    lactation?: string;
    renal?: string;
    hepatic?: string;
    geriatric?: string;
  };
  monitoring?: string[];
  withdrawal?: string;
  sourceKeys: string[];
};

export const stdReg = {
  US: "FDA-approved (see current labeling)",
  EU: "Authorized in EU / national procedures (see SmPC)",
  UK: "Licensed (see MHRA product information)",
  CH: "Authorized (see Swissmedic product information)",
};
