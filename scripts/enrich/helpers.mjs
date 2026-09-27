export const stdReg = {
  US: "FDA-approved (see current labeling)",
  EU: "Authorized in EU / national procedures (see SmPC)",
  UK: "Licensed (see MHRA product information)",
  CH: "Authorized (see Swissmedic product information)",
};

export function uniqBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const k = keyFn(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export function mergeMed(base, patch) {
  const out = { ...base, ...patch };
  out.brandNames = uniqBy([...(base.brandNames || []), ...(patch.brandNames || [])], (x) => x);
  out.routes = uniqBy([...(base.routes || []), ...(patch.routes || [])], (x) => x);
  out.indications = uniqBy(
    [...(base.indications || []), ...(patch.indications || [])],
    (x) => x.indication.toLowerCase()
  );
  out.adverse = uniqBy(
    [...(base.adverse || []), ...(patch.adverse || [])],
    (x) => x.effect.toLowerCase()
  );
  out.warnings = uniqBy(
    [...(base.warnings || []), ...(patch.warnings || [])],
    (x) => `${x.type}|${x.population}|${x.details}`.toLowerCase()
  );
  out.monitoring = uniqBy([...(base.monitoring || []), ...(patch.monitoring || [])], (x) =>
    x.toLowerCase()
  );
  out.sourceKeys = uniqBy([...(base.sourceKeys || []), ...(patch.sourceKeys || [])], (x) => x);
  out.special = { ...(base.special || {}), ...(patch.special || {}) };
  if (Object.keys(out.special).length === 0) out.special = null;
  if (!out.monitoring?.length) out.monitoring = null;
  // Prefer richer text fields from patch when provided
  for (const f of [
    "mechanism",
    "evidenceQualityOverview",
    "benefitsSummary",
    "whyStillPrescribed",
    "longTermEvidence",
    "withdrawal",
    "drugClass",
  ]) {
    if (patch[f] != null && patch[f] !== "") out[f] = patch[f];
    else if (base[f] != null) out[f] = base[f];
  }
  if (!out.regulatoryStatus) out.regulatoryStatus = stdReg;
  return out;
}

export function ind(indication, evidence = "high", approved = true, notes) {
  const o = { indication, approved, evidence };
  if (notes) o.notes = notes;
  return o;
}

export function ae(effect, severity, evidence = "high", frequencyNote) {
  const o = { effect, severity, evidence };
  if (frequencyNote) o.frequencyNote = frequencyNote;
  return o;
}

export function warn(type, population, severity, details) {
  return { type, population, severity, details };
}
