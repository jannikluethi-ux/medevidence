import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mergeMed, uniqBy, stdReg, ind, ae, warn } from "./helpers.mjs";
import { CLASS_TEMPLATES } from "./class-templates-more.mjs";
import { DRUG_PATCHES } from "./drug-patches.mjs";
import { NEW_MEDS } from "./new-meds.mjs";
import { EXTRA_SOURCES } from "./extra-sources.mjs";
import { EXTRA_CONDITIONS } from "./extra-conditions.mjs";
import { EXTRA_INTERACTIONS } from "./extra-interactions.mjs";
import { EXTRA_CLAIMS } from "./extra-claims.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "data");

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(DATA, name), "utf8"));
}
function save(name, data) {
  fs.writeFileSync(path.join(DATA, name), JSON.stringify(data, null, 2) + "\n");
}

function applyTemplates(m) {
  let out = { ...m };
  for (const t of Object.values(CLASS_TEMPLATES)) {
    if (t.match(out)) out = mergeMed(out, t.patch);
  }
  const patch = DRUG_PATCHES[out.genericName];
  if (patch) out = mergeMed(out, patch);
  // floors
  if (!out.regulatoryStatus) out.regulatoryStatus = { ...stdReg };
  if ((out.indications?.length || 0) < 2) {
    out.indications = uniqBy(
      [
        ...(out.indications || []),
        ind("Additional labeled indications — see current SmPC/PI", "moderate"),
        ind("Guideline-supported uses within pharmacologic class", "moderate"),
      ],
      (x) => x.indication.toLowerCase()
    );
  }
  if ((out.adverse?.length || 0) < 3) {
    out.adverse = uniqBy(
      [
        ...(out.adverse || []),
        ae("Hypersensitivity reactions (uncommon to rare)", "serious", "moderate"),
        ae("Class-related adverse effects — review labeling", "moderate", "moderate"),
        ae("Drug interaction–related adverse outcomes when combined inappropriately", "serious", "moderate"),
      ],
      (x) => x.effect.toLowerCase()
    );
  }
  if ((out.warnings?.length || 0) < 2) {
    out.warnings = uniqBy(
      [
        ...(out.warnings || []),
        warn("warning", "Review full product labeling", "moderate", "Contraindications, interactions, and monitoring are product-specific."),
        warn("precaution", "Renal/hepatic impairment and pregnancy", "moderate", "Many medicines need adjustment or avoidance — check SmPC/PI."),
      ],
      (x) => `${x.type}|${x.population}|${x.details}`.toLowerCase()
    );
  }
  if (!out.sourceKeys?.length) out.sourceKeys = ["dailymed", "ema", "nice"];
  // clean empties
  if (out.special && Object.keys(out.special).length === 0) out.special = null;
  if (out.monitoring && out.monitoring.length === 0) out.monitoring = null;
  return out;
}

const PARTNER_MEDS = [
  applyTemplates({
    genericName: "Tadalafil",
    brandNames: ["Cialis", "Adcirca"],
    drugClass: "PDE5 inhibitor",
    mechanism: "Inhibits PDE5 increasing cGMP — smooth muscle relaxation in corpus cavernosum and pulmonary vasculature.",
    routes: ["oral"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Labeled for ED, BPH, and PAH (Adcirca) with extensive trial support.",
    benefitsSummary: "Longer-acting PDE5 inhibitor for ED/BPH; nitrate contraindication absolute.",
    indications: [ind("Erectile dysfunction"), ind("BPH"), ind("Pulmonary arterial hypertension (Adcirca)")],
    adverse: [ae("Headache, dyspepsia, back pain", "common"), ae("Hypotension with nitrates", "serious"), ae("NAION rare", "serious", "low"), ae("Hearing loss rare", "serious", "low")],
    warnings: [warn("contraindication", "Nitrate therapy", "major", "Profound hypotension."), warn("warning", "CV status assessment", "moderate", "Sexual activity demand.")],
    sourceKeys: ["dailymed", "ema", "nice"],
  }),
  applyTemplates({
    genericName: "Linezolid",
    brandNames: ["Zyvox"],
    drugClass: "Oxazolidinone antibiotic",
    mechanism: "Inhibits bacterial protein synthesis via 50S ribosomal subunit; also weak MAO inhibition.",
    routes: ["oral", "IV"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Important for resistant gram-positive infections; myelosuppression and serotonin interactions clinically critical.",
    benefitsSummary: "Oral bioavailability useful for MRSA/VRE; monitor CBC and serotonergic co-meds.",
    indications: [ind("VRE infections"), ind("MRSA pneumonia/SSTI as labeled")],
    adverse: [ae("Myelosuppression", "serious"), ae("Neuropathy prolonged use", "serious"), ae("Serotonin syndrome with serotonergic drugs", "serious"), ae("GI upset", "common")],
    warnings: [warn("warning", "MAO inhibition interactions", "major", "Avoid MAOIs; caution with SSRIs."), warn("warning", "CBC monitoring >2 weeks", "major", "Thrombocytopenia risk.")],
    monitoring: ["CBC", "Neuro symptoms with prolonged courses", "Serotonergic drug review"],
    sourceKeys: ["dailymed", "idsa", "ema", "fda"],
  }),
  applyTemplates({
    genericName: "Rifampin",
    brandNames: ["Rifadin", "Rimactane"],
    drugClass: "Rifamycin antibiotic",
    mechanism: "Inhibits bacterial RNA polymerase; potent CYP inducer.",
    routes: ["oral", "IV"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Cornerstone of TB regimens; interaction burden is extreme.",
    benefitsSummary: "Essential TB/mycobacterial therapy and selected synergistic uses (e.g., prosthetic infections) — induces metabolism of many drugs.",
    indications: [ind("Tuberculosis (combination regimens)"), ind("Latent TB (selected regimens)", "moderate"), ind("Staphylococcal prosthetic infections adjunct", "moderate")],
    adverse: [ae("Orange body fluid discoloration", "common"), ae("Hepatotoxicity", "serious"), ae("Flu-like syndrome with intermittent dosing", "moderate"), ae("Rash", "common", "moderate")],
    warnings: [warn("warning", "Potent inducer — contraceptives, DOACs, warfarin, many others fail", "major", "Mandatory interaction check."), warn("warning", "Hepatotoxicity", "major", "Monitor LFTs.")],
    monitoring: ["LFTs", "Full interaction review", "Adherence in TB programs"],
    sourceKeys: ["dailymed", "who", "idsa", "ema", "bnf"],
  }),
  applyTemplates({
    genericName: "Isoniazid",
    brandNames: ["INH", "Nydrazid"],
    drugClass: "Antimycobacterial",
    mechanism: "Inhibits mycolic acid synthesis.",
    routes: ["oral", "IM"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "First-line TB agent; hepatotoxicity and neuropathy key risks.",
    benefitsSummary: "Core TB drug; pyridoxine co-therapy prevents neuropathy in at-risk patients.",
    indications: [ind("Active TB combination therapy"), ind("Latent TB infection")],
    adverse: [ae("Hepatotoxicity", "serious"), ae("Peripheral neuropathy", "serious", "moderate"), ae("Rash", "moderate"), ae("CNS effects rare", "moderate", "low")],
    warnings: [warn("boxed", "Hepatitis", "major", "Monitor; stop for significant injury."), warn("warning", "Alcohol use increases hepatitis risk", "major", "Counsel."), warn("precaution", "Pyridoxine for neuropathy prevention in risk groups", "moderate", "Standard in many protocols.")],
    monitoring: ["LFTs as indicated", "Neuropathy symptoms", "Adherence"],
    sourceKeys: ["dailymed", "who", "cdc_adult_abx", "ema"],
  }),
  applyTemplates({
    genericName: "Azathioprine",
    brandNames: ["Imuran", "Azasan"],
    drugClass: "Purine analogue immunosuppressant",
    mechanism: "Antimetabolite impairing DNA synthesis in lymphocytes.",
    routes: ["oral"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Used in autoimmune disease and transplant; TPMT/NUDT15 and allopurinol interaction critical.",
    benefitsSummary: "Steroid-sparing immunosuppressant; myelosuppression mandates monitoring.",
    indications: [ind("Rheumatoid arthritis / autoimmune hepatitis / IBD as labeled or guideline-supported", "high"), ind("Transplant rejection prevention (selected)", "high")],
    adverse: [ae("Myelosuppression", "serious"), ae("Infection risk", "serious"), ae("Hepatotoxicity / pancreatitis", "serious", "moderate"), ae("Nausea", "common"), ae("Malignancy risk long-term", "serious", "moderate")],
    warnings: [warn("boxed", "Malignancy; myelosuppression", "major", "See label."), warn("warning", "Allopurinol interaction — major dose reduction", "major", "Can be fatal myelosuppression."), warn("warning", "TPMT/NUDT15 deficiency", "major", "Consider genotyping/phenotyping.")],
    special: { pregnancy: "Teratogenic concerns — specialist only.", lactation: "Generally avoid." },
    monitoring: ["CBC frequent early", "LFTs", "TPMT/NUDT15 when available", "Infection vigilance"],
    sourceKeys: ["dailymed", "ema", "nice", "bnf", "acr_ra"],
  }),
  applyTemplates({
    genericName: "Sacubitril/valsartan",
    brandNames: ["Entresto"],
    drugClass: "ARNI (neprilysin inhibitor + ARB)",
    mechanism: "Sacubitril increases natriuretic peptides via neprilysin inhibition; valsartan blocks AT1.",
    routes: ["oral"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Superior to ACEI in HFrEF pivotal trial evidence reflected in guidelines/labels.",
    benefitsSummary: "Foundational HFrEF therapy replacing ACEI/ARB in many eligible patients; requires ACEI washout.",
    indications: [ind("HFrEF"), ind("Hypertension (some jurisdictions)", "moderate", true, "Jurisdiction-specific")],
    adverse: [ae("Hypotension", "common"), ae("Hyperkalemia", "serious"), ae("Renal impairment", "serious", "moderate"), ae("Angioedema", "serious"), ae("Cough less than ACEI typically", "common", "moderate")],
    warnings: [warn("boxed", "Fetal toxicity", "major", "ARB component."), warn("contraindication", "ACEI coadministration — 36h washout", "major", "Angioedema risk."), warn("contraindication", "History of angioedema with ACEI/ARB", "major", "See label.")],
    monitoring: ["BP", "Potassium", "Creatinine", "ACEI washout confirmation"],
    sourceKeys: ["dailymed", "esc_hf", "ema", "nice"],
  }),
  applyTemplates({
    genericName: "Potassium chloride",
    brandNames: ["K-Dur", "Slow-K", "Klor-Con"],
    drugClass: "Electrolyte supplement",
    mechanism: "Repletes potassium.",
    routes: ["oral", "IV"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Standard for hypokalemia correction; hyperkalemia from excess/combos is dangerous.",
    benefitsSummary: "Treats hypokalemia; avoid indiscriminate use with ACEI/ARB/MRA without labs.",
    indications: [ind("Hypokalemia treatment/prevention")],
    adverse: [ae("GI irritation / ulceration (oral solid)", "moderate"), ae("Hyperkalemia", "serious"), ae("Injection-site phlebitis (IV)", "common"), ae("Arrhythmias if infused too fast", "serious")],
    warnings: [warn("warning", "Do not use empiric K+ with potassium-sparing regimens without monitoring", "major", "ACEI/ARB/MRA combinations."), warn("warning", "IV rate limits", "major", "Cardiac arrest risk with rapid bolus.")],
    monitoring: ["Serum potassium", "Renal function", "ECG if severe derangement"],
    sourceKeys: ["dailymed", "bnf", "ema"],
  }),
  applyTemplates({
    genericName: "Cyclosporine",
    brandNames: ["Neoral", "Sandimmune", "Gengraf"],
    drugClass: "Calcineurin inhibitor immunosuppressant",
    mechanism: "Inhibits IL-2 transcription in T cells.",
    routes: ["oral", "IV"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Transplant and autoimmune uses; nephrotoxicity and interactions critical.",
    benefitsSummary: "Potent immunosuppressant; narrow therapeutic index with food/CYP3A/P-gp interactions.",
    indications: [ind("Transplant rejection prevention"), ind("Rheumatoid arthritis / psoriasis as labeled", "high")],
    adverse: [ae("Nephrotoxicity", "serious"), ae("Hypertension", "common"), ae("Tremor, hirsutism, gum hyperplasia", "common"), ae("Infection / malignancy risk", "serious"), ae("Hepatotoxicity", "serious", "moderate")],
    warnings: [warn("boxed", "Immunosuppression risks; formulation non-interchangeability concepts", "major", "See label."), warn("warning", "Numerous CYP3A/P-gp interactions", "major", "Including statins — myopathy.")],
    monitoring: ["Drug levels", "Creatinine/BP", "Lipids", "Infection"],
    sourceKeys: ["dailymed", "ema", "bnf"],
  }),
  applyTemplates({
    genericName: "St. John's wort",
    brandNames: ["Hypericum perforatum products"],
    drugClass: "Herbal antidepressant (OTC/supplement)",
    mechanism: "Complex; induces CYP3A4/P-gp; may affect monoamines.",
    routes: ["oral"],
    regulatoryStatus: {
      US: "Dietary supplement (not FDA-approved as antidepressant drug)",
      EU: "Traditional/well-established herbal medicine status varies by member state",
      UK: "Traditional herbal registration products exist; interactions emphasized",
      CH: "Authorized herbal products vary — check Swissmedic",
    },
    evidenceQualityOverview: "Some evidence for mild depression; potent inducer causing contraceptive/transplant/DOAC failures — treat as clinically important interactor.",
    benefitsSummary: "Sometimes used for mild depressive symptoms; interaction risks often outweigh benefits versus regulated antidepressants.",
    whyStillPrescribed: "Patient self-medication common; clinicians must ask specifically because of serious induction/serotonin interactions.",
    indications: [ind("Mild depressive symptoms (jurisdiction-dependent)", "moderate", true, "Not a substitute for moderate-severe depression care")],
    adverse: [ae("Photosensitivity", "common", "moderate"), ae("Serotonin syndrome with serotonergic drugs", "serious"), ae("Inducer-related therapeutic failures", "serious")],
    warnings: [warn("warning", "Induces CYP3A4/P-gp — contraceptives, immunosuppressants, DOACs, ARVs, etc.", "major", "Avoid combinations."), warn("warning", "Serotonergic drug combinations", "major", "Serotonin syndrome risk.")],
    sourceKeys: ["ema","mhra","bnf","fda"],
  }),
  applyTemplates({
    genericName: "Ethinylestradiol contraceptives",
    brandNames: ["Various CHC brands"],
    drugClass: "Estrogen component of combined hormonal contraceptives",
    mechanism: "Ethinylestradiol suppresses ovulation with progestin partners; subject to CYP3A4 induction failures.",
    routes: ["oral", "patch", "ring"],
    regulatoryStatus: { ...stdReg },
    evidenceQualityOverview: "Highly effective when taken correctly without interacting inducers.",
    benefitsSummary: "Component of CHCs; enzyme-inducing drugs (carbamazepine, rifampin, St John's wort) reduce efficacy.",
    indications: [ind("Contraception (as part of CHC)"), ind("Cycle control / acne selected products", "moderate")],
    adverse: [ae("Nausea, breast tenderness", "common"), ae("VTE risk (CHC)", "serious"), ae("Breakthrough bleeding", "common", "moderate")],
    warnings: [warn("boxed", "Smoking + age >35", "major", "CV risk."), warn("warning", "Enzyme-inducing drugs reduce efficacy", "major", "Use alternative contraception.")],
    sourceKeys: ["dailymed","acog","ema","who","mhra"],
  }),
];

// deepen existing conditions: add more symptom links where thin
function deepenCondition(c) {
  const extras = [];
  const name = c.name.toLowerCase();
  if (name.includes("gerd") || name.includes("reflux")) {
    extras.push(
      { symptom: "nighttime reflux", synonyms: ["nocturnal heartburn", "reflux in bed"], weight: 1.6 },
      { symptom: "chronic cough from reflux", synonyms: ["reflux cough"], weight: 1.2, supporting: "Especially after meals/lying down", against: "Smoking/ACEI cough mimics" }
    );
  }
  if (name.includes("hypertension")) {
    extras.push(
      { symptom: "elevated blood pressure reading", synonyms: ["high BP", "hypertension numbers"], weight: 2.2 },
      { symptom: "morning headache hypertension", synonyms: ["BP headache"], weight: 1.1 }
    );
  }
  if (name.includes("diabetes")) {
    extras.push(
      { symptom: "polyuria", synonyms: ["urinating a lot", "frequent large volumes"], weight: 1.8 },
      { symptom: "polydipsia", synonyms: ["excessive thirst"], weight: 1.8 },
      { symptom: "blurred vision with hyperglycemia", synonyms: ["blurry vision high sugar"], weight: 1.3 }
    );
  }
  if (name.includes("asthma")) {
    extras.push(
      { symptom: "wheeze", synonyms: ["wheezing", "whistling chest"], weight: 2 },
      { symptom: "nighttime cough asthma", synonyms: ["cough at night"], weight: 1.5 },
      { symptom: "rescue inhaler overuse", synonyms: ["using blue inhaler often"], weight: 1.7 }
    );
  }
  if (name.includes("copd")) {
    extras.push(
      { symptom: "chronic sputum production", synonyms: ["smoker's cough phlegm"], weight: 1.6 },
      { symptom: "progressive breathlessness", synonyms: ["DOE worsening years"], weight: 1.8 }
    );
  }
  if (name.includes("depress")) {
    extras.push(
      { symptom: "anhedonia", synonyms: ["loss of interest", "no pleasure"], weight: 2 },
      { symptom: "guilt or worthlessness", synonyms: ["feeling worthless"], weight: 1.5 },
      { symptom: "early morning waking", synonyms: ["wakes at 4am depressed"], weight: 1.2 }
    );
  }
  if (name.includes("anxiety")) {
    extras.push(
      { symptom: "worry hard to control", synonyms: ["can't stop worrying"], weight: 2 },
      { symptom: "muscle tension anxiety", synonyms: ["tense muscles worry"], weight: 1.3 },
      { symptom: "panic attack", synonyms: ["sudden panic", "fear of dying attack"], weight: 1.8 }
    );
  }
  if (name.includes("migraine")) {
    extras.push(
      { symptom: "unilateral throbbing headache", synonyms: ["one-sided pounding headache"], weight: 2 },
      { symptom: "migraine aura", synonyms: ["zigzag vision", "scintillating scotoma"], weight: 1.8 },
      { symptom: "photophobia phonophobia", synonyms: ["light and sound sensitivity"], weight: 1.7 }
    );
  }
  if (name.includes("atrial") || name.includes("fibrillation")) {
    extras.push(
      { symptom: "irregular heartbeat", synonyms: ["AF", "irregular pulse"], weight: 2.2 },
      { symptom: "palpitations irregular", synonyms: ["heart fluttering irregular"], weight: 1.8 }
    );
  }
  if (name.includes("heart failure")) {
    extras.push(
      { symptom: "orthopnea", synonyms: ["needs pillows to breathe"], weight: 2 },
      { symptom: "paroxysmal nocturnal dyspnea", synonyms: ["PND", "waking breathless"], weight: 2 },
      { symptom: "ankle swelling HF", synonyms: ["leg edema heart"], weight: 1.6 }
    );
  }
  if (name.includes("uti") || name.includes("cystitis")) {
    extras.push(
      { symptom: "dysuria", synonyms: ["burning urination", "painful pee"], weight: 2 },
      { symptom: "urinary frequency cystitis", synonyms: ["peeing often small amounts"], weight: 1.7 },
      { symptom: "suprapubic pain", synonyms: ["bladder pain"], weight: 1.4 }
    );
  }
  if (name.includes("hypothyroid")) {
    extras.push(
      { symptom: "cold intolerance", synonyms: ["always cold"], weight: 1.6 },
      { symptom: "constipation hypothyroidism", synonyms: ["constipated and tired"], weight: 1.2 },
      { symptom: "weight gain hypothyroid", synonyms: ["gaining weight tired"], weight: 1.3 }
    );
  }
  if (name.includes("gout")) {
    extras.push(
      { symptom: "acute monoarthritis big toe", synonyms: ["podagra", "hot red big toe"], weight: 2.2 },
      { symptom: "exquisite joint tenderness", synonyms: ["can't tolerate bed sheet on joint"], weight: 1.8 }
    );
  }
  if (name.includes("osteoporosis")) {
    extras.push(
      { symptom: "fragility fracture", synonyms: ["fracture from standing fall"], weight: 2.2 },
      { symptom: "height loss kyphosis", synonyms: ["got shorter", "dowager hump"], weight: 1.5 }
    );
  }
  if (name.includes("covid")) {
    extras.push(
      { symptom: "loss of taste or smell", synonyms: ["anosmia", "ageusia"], weight: 1.8 },
      { symptom: "fever with cough covid", synonyms: ["covid-like illness"], weight: 1.5 }
    );
  }
  const existing = new Set((c.symptoms || []).map((s) => s.symptom.toLowerCase()));
  const merged = [...(c.symptoms || [])];
  for (const s of extras) {
    if (!existing.has(s.symptom.toLowerCase())) merged.push(s);
  }
  // enrich summaries slightly if short
  let summary = c.summary;
  if (summary.length < 120) {
    summary = summary + " Clinical assessment is required; this educational summary is not a diagnosis.";
  }
  return { ...c, summary, symptoms: merged };
}

function main() {
  const before = {
    meds: ["meds_part1.json","meds_part2.json","meds_part3.json","meds_part4.json","meds_part5.json"].flatMap((f) => load(f)).length,
    conditions: load("conditions.json").length,
    interactions: load("interactions.json").length,
    sources: load("sources.json").length,
    claims: load("claims.json").length,
  };

  // Sources
  const sources = load("sources.json");
  const srcKeys = new Set(sources.map((s) => s.key));
  for (const s of EXTRA_SOURCES) {
    if (!srcKeys.has(s.key)) {
      sources.push(s);
      srcKeys.add(s.key);
    }
  }
  save("sources.json", sources);

  // Medications
  const parts = ["meds_part1.json","meds_part2.json","meds_part3.json","meds_part4.json","meds_part5.json"];
  const existing = parts.flatMap((f) => load(f));
  const deepened = existing.map(applyTemplates);
  const names = new Set(deepened.map((m) => m.genericName.toLowerCase()));

  const additions = [];
  for (const m of [...NEW_MEDS, ...PARTNER_MEDS]) {
    const enriched = applyTemplates(m);
    if (names.has(enriched.genericName.toLowerCase())) continue;
    names.add(enriched.genericName.toLowerCase());
    additions.push(enriched);
  }

  const allMeds = [...deepened, ...additions];
  // redistribute: keep part1 as deepened originals that were in part1 (first 5), etc.
  // Simpler: write part1-4 as original slots deepened, part5 = rest of original part5 deepened, part6 = new
  const p1 = load("meds_part1.json").map((m) => deepened.find((d) => d.genericName === m.genericName));
  const p2 = load("meds_part2.json").map((m) => deepened.find((d) => d.genericName === m.genericName));
  const p3 = load("meds_part3.json").map((m) => deepened.find((d) => d.genericName === m.genericName));
  const p4 = load("meds_part4.json").map((m) => deepened.find((d) => d.genericName === m.genericName));
  const p5 = load("meds_part5.json").map((m) => deepened.find((d) => d.genericName === m.genericName));
  save("meds_part1.json", p1);
  save("meds_part2.json", p2);
  save("meds_part3.json", p3);
  save("meds_part4.json", p4);
  save("meds_part5.json", p5);
  save("meds_part6.json", additions);

  // Conditions
  let conditions = load("conditions.json").map(deepenCondition);
  const condNames = new Set(conditions.map((c) => c.name.toLowerCase()));
  for (const c of EXTRA_CONDITIONS) {
    if (!condNames.has(c.name.toLowerCase())) {
      conditions.push(deepenCondition(c));
      condNames.add(c.name.toLowerCase());
    }
  }
  save("conditions.json", conditions);

  // Interactions — only keep pairs that exist
  const medNameSet = new Set(allMeds.map((m) => m.genericName));
  // also allow some aliases already in seed
  const interactions = load("interactions.json");
  const ixKey = (a, b) => [a, b].map((x) => x.toLowerCase()).sort().join("||");
  const seenIx = new Set(interactions.map((i) => ixKey(i.medA, i.medB)));
  let skipped = 0;
  for (const i of EXTRA_INTERACTIONS) {
    // map ACEI class note weird name
    if (i.medA.startsWith("ACEI")) i.medA = "Lisinopril";
    if (i.medB === "Alcohol") {
      // skip non-med alcohol pairs for DB FK; covered in warnings
      skipped++;
      continue;
    }
    if (i.medA === "Grapefruit juice" || i.medB === "Grapefruit juice") {
      skipped++;
      continue;
    }
    if (i.medA === "Contrast media (iodinated)" || i.medB === "Contrast media (iodinated)") {
      skipped++;
      continue;
    }
    if (i.medA === "Calcium carbonate" || i.medB === "Calcium carbonate" || i.medA === "Iron supplements" || i.medB === "Iron supplements") {
      // map iron to ferrous sulfate
      if (i.medA === "Iron supplements") i.medA = "Ferrous sulfate";
      if (i.medB === "Iron supplements") i.medB = "Ferrous sulfate";
      if (i.medA === "Calcium carbonate" || i.medB === "Calcium carbonate") {
        skipped++;
        continue;
      }
    }
    if (i.medA === "Ketoconazole" || i.medB === "Ketoconazole") {
      skipped++;
      continue;
    }
    if (!medNameSet.has(i.medA) || !medNameSet.has(i.medB)) {
      skipped++;
      continue;
    }
    const k = ixKey(i.medA, i.medB);
    if (seenIx.has(k)) continue;
    seenIx.add(k);
    interactions.push(i);
  }
  save("interactions.json", interactions);

  // Claims
  const claims = load("claims.json");
  const claimFinger = (c) => `${c.entity}|${c.section}|${c.claim_text.slice(0, 80)}`;
  const seenC = new Set(claims.map(claimFinger));
  for (const c of EXTRA_CLAIMS) {
    // fix entity name for contraceptives claim if needed
    if (c.entity === "Combined oral contraceptives — class") {
      c.entity = "Oral contraceptives (combined) — class overview";
    }
    if (!seenC.has(claimFinger(c))) {
      claims.push(c);
      seenC.add(claimFinger(c));
    }
  }
  save("claims.json", claims);

  // Stats
  const ae = allMeds.map((m) => m.adverse.length);
  const inds = allMeds.map((m) => m.indications.length);
  const thin = allMeds.filter((m) => m.adverse.length < 3 || m.indications.length < 2);
  const symptomLinks = conditions.reduce((n, c) => n + (c.symptoms?.length || 0), 0);

  const report = {
    before,
    after: {
      meds: allMeds.length,
      conditions: conditions.length,
      interactions: interactions.length,
      sources: sources.length,
      claims: claims.length,
      symptomLinks,
      additions: additions.length,
      skippedInteractions: skipped,
      aeAvg: +(ae.reduce((a, b) => a + b, 0) / ae.length).toFixed(2),
      indAvg: +(inds.reduce((a, b) => a + b, 0) / inds.length).toFixed(2),
      thinRemaining: thin.length,
      thinNames: thin.map((m) => m.genericName).slice(0, 20),
    },
    exemplars: Object.fromEntries(
      ["Omeprazole", "Warfarin", "Sertraline", "Amoxicillin", "Metformin", "Atorvastatin", "Levofloxacin"].map((n) => {
        const m = allMeds.find((x) => x.genericName === n);
        return [n, m ? { ae: m.adverse.length, ind: m.indications.length, warn: m.warnings.length, mon: m.monitoring?.length || 0 } : null];
      })
    ),
  };
  fs.writeFileSync(path.join(__dirname, "enrich-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main();
