/**
 * v2 helpers — deliberately do NOT use the legacy `stdReg` boilerplate.
 * Regulatory text defaults to "check current product information" unless a
 * per-medicine override states something we are confident about.
 */
export const CHECK_REG = {
  US: "Check current US labeling (FDA / DailyMed)",
  EU: "Check EMA / national SmPC for current EU status",
  UK: "Check MHRA / BNF product information",
  CH: "Check current Swiss product information (Swissmedic: swissmedicinfo.ch)",
};
export const US_OK = "FDA-approved — see current labeling on DailyMed";
export const US_NO = "Not FDA-approved in the US";

export function reg(over = {}) {
  return { ...CHECK_REG, ...over };
}

/** ind(text, evidence='high', approved=true, notes) */
export function I(indication, evidence = "high", approved = true, notes) {
  const o = { indication, approved, evidence };
  if (notes) o.notes = notes;
  return o;
}
/** A(effect, severity, evidence='high', frequencyNote) */
export function A(effect, severity, evidence = "high", frequencyNote) {
  const o = { effect, severity, evidence };
  if (frequencyNote) o.frequencyNote = frequencyNote;
  return o;
}
export function W(type, population, severity, details) {
  return { type, population, severity, details };
}

export function med(m) {
  return {
    genericName: m.name,
    brandNames: m.brands ?? [],
    drugClass: m.cls,
    mechanism: m.mech,
    routes: m.routes ?? ["oral"],
    regulatoryStatus: reg(m.reg),
    evidenceQualityOverview: m.eq,
    benefitsSummary: m.ben,
    whyStillPrescribed: m.why ?? null,
    longTermEvidence: m.lt ?? null,
    indications: m.ind,
    adverse: m.ae,
    warnings: m.warn,
    special: m.special ?? null,
    monitoring: m.mon ?? null,
    withdrawal: m.wd ?? null,
    sourceKeys: m.src,
  };
}
