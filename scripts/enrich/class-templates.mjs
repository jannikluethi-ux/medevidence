import { ind, ae, warn, stdReg } from "./helpers.mjs";

/** Class-level enrichment applied by drugClass substring / name matching */
export const CLASS_TEMPLATES = {
  ppi: {
    match: (m) => /proton pump|ppi/i.test(m.drugClass) || /omeprazole|pantoprazole|esomeprazole|lansoprazole|rabeprazole|dexlansoprazole/i.test(m.genericName),
    patch: {
      indications: [
        ind("Gastroesophageal reflux disease (GERD)"),
        ind("Erosive esophagitis healing / maintenance"),
        ind("Peptic ulcer disease"),
        ind("H. pylori eradication (combination regimens)", "high", true, "As part of labeled multi-drug regimens"),
        ind("Pathological hypersecretory conditions (e.g., Zollinger–Ellison)", "moderate"),
        ind("NSAID-associated ulcer risk reduction (selected regimens)", "moderate", true, "See specific product labeling"),
      ],
      adverse: [
        ae("Headache", "common"),
        ae("Diarrhea, abdominal pain, nausea, flatulence", "common"),
        ae("Hypomagnesemia with prolonged use", "serious", "high", "Labeled; may be severe"),
        ae("Clostridioides difficile–associated diarrhea (associated in safety communications)", "serious", "moderate"),
        ae("Fundic gland polyps with long-term use", "common", "moderate"),
        ae("Vitamin B12 deficiency with prolonged use (possible)", "moderate", "moderate", "Association discussed in labels/observational data"),
        ae("Acute interstitial nephritis (rare)", "serious", "moderate", "Rare but labeled"),
      ],
      warnings: [
        warn("warning", "Long-term users", "moderate", "Use lowest effective dose for shortest appropriate duration; reassess ongoing need."),
        warn("precaution", "Patients at fracture risk", "moderate", "Long-term PPI use associated with fracture risk in observational data; causality uncertain."),
        warn("precaution", "Patients at C. difficile risk", "moderate", "Consider diagnosis of C. difficile if persistent diarrhea occurs."),
        warn("warning", "Severe cutaneous adverse reactions (rare)", "major", "Discontinue if severe rash / suspected SJS/TEN (labeled for some PPIs)."),
      ],
      special: {
        pregnancy: "Discuss with clinician; many PPIs have relatively reassuring human data but product-specific guidance applies.",
        lactation: "Small amounts may appear in milk; discuss risk/benefit with clinician.",
        hepatic: "Dose adjustment may be needed in hepatic impairment (product-specific).",
        renal: "No routine renal dose change for most PPIs; monitor magnesium with prolonged use.",
        geriatric: "Higher likelihood of polypharmacy interactions and long-term safety concerns — deprescribe when appropriate.",
      },
      monitoring: [
        "Reassess indication periodically; consider deprescribing when indication unclear",
        "Consider magnesium (and possibly B12) monitoring with prolonged therapy",
      ],
      withdrawal: "Abrupt stop after prolonged use may be followed by rebound acid hypersecretion/symptoms in some patients; taper or step-down strategies are sometimes used clinically.",
      longTermEvidence: "Labels warn about hypomagnesemia with prolonged use. Observational associations (fracture, CKD, dementia, infection) are reported; association ≠ proven causation. Benefits remain established for appropriate acid-related indications.",
      whyStillPrescribed: "PPIs remain first-line for documented acid-related disease because healing and symptom-control benefits are well established when used for appropriate indications and durations.",
      sourceKeys: ["dailymed", "ema", "nice", "fda_ppi_magnesium", "bnf"],
    },
  },

  nsaid: {
    match: (m) => /nsaid/i.test(m.drugClass) || /ibuprofen|naproxen|diclofenac|celecoxib|meloxicam|indomethacin|ketorolac|etodolac|piroxicam/i.test(m.genericName),
    patch: {
      indications: [
        ind("Pain (mild to moderate)"),
        ind("Fever / antipyresis", "high", true, "Product-dependent"),
        ind("Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled"),
        ind("Dysmenorrhea (selected NSAIDs)", "high", true, "See product labeling"),
        ind("Migraine / headache symptomatic relief (selected)", "moderate", false, "Off-label or product-specific OTC uses — not a diagnosis"),
      ],
      adverse: [
        ae("Dyspepsia, abdominal pain, nausea", "common"),
        ae("GI ulceration / bleeding", "serious", "high", "Boxed warning class risk"),
        ae("Increased risk of cardiovascular thrombotic events (MI, stroke)", "serious", "high", "Boxed warning class risk"),
        ae("Renal impairment / fluid retention / edema", "serious", "high"),
        ae("Hypertension worsening", "moderate"),
        ae("Hypersensitivity / asthma exacerbation in aspirin-sensitive patients", "serious"),
        ae("Elevated liver enzymes / rare hepatotoxicity", "serious", "moderate"),
      ],
      warnings: [
        warn("boxed", "Cardiovascular disease / risk", "major", "NSAIDs increase risk of serious CV thrombotic events; contraindicated for peri-operative CABG pain in US labeling."),
        warn("boxed", "GI bleeding risk groups", "major", "Increased risk of serious GI adverse events including bleeding, ulceration, perforation."),
        warn("contraindication", "Third trimester pregnancy (generally)", "major", "Avoid NSAIDs in late pregnancy due to fetal risk (ductus arteriosus / oligohydramnios concerns)."),
        warn("precaution", "Heart failure, CKD, elderly, concurrent anticoagulants/steroids/SSRIs", "major", "Higher bleeding and renal risk — clinician risk–benefit assessment required."),
        warn("warning", "Aspirin-sensitive asthma", "major", "Cross-reactivity possible."),
      ],
      special: {
        pregnancy: "Avoid especially in third trimester; earlier pregnancy requires clinician discussion.",
        lactation: "Generally short courses of some NSAIDs may be compatible — product-specific; ask clinician.",
        renal: "Avoid or use extreme caution in significant CKD; may reduce GFR.",
        hepatic: "Caution in hepatic disease; rare severe hepatotoxicity.",
        geriatric: "Higher GI, renal, and CV risk — prefer lowest dose/shortest duration; consider gastroprotection strategies when indicated.",
      },
      monitoring: [
        "Blood pressure if used regularly",
        "Renal function and electrolytes in higher-risk patients",
        "Watch for GI bleeding signs (melena, hematemesis, anemia)",
      ],
      whyStillPrescribed: "Effective analgesics/anti-inflammatories with extensive trial and guideline support; risks are managed by patient selection, dose/duration limits, and gastroprotection when appropriate.",
      longTermEvidence: "Chronic NSAID use carries established GI, CV, and renal risks proportional to dose, duration, and patient factors.",
      sourceKeys: ["dailymed", "label_ibuprofen", "ema", "nice", "fda", "bnf"],
    },
  },

  acei: {
    match: (m) => /ace inhibitor/i.test(m.drugClass) || /lisinopril|ramipril|enalapril|perindopril|benazepril|quinapril|trandolapril|fosinopril|captopril/i.test(m.genericName),
    patch: {
      indications: [
        ind("Hypertension"),
        ind("Heart failure with reduced ejection fraction (as labeled)"),
        ind("Post-myocardial infarction / CV risk reduction (product-specific)"),
        ind("Diabetic nephropathy / CKD with albuminuria (selected ACEIs)", "high", true, "See product and guideline labeling"),
      ],
      adverse: [
        ae("Dry cough", "common", "high", "Often leads to switch to ARB"),
        ae("Hyperkalemia", "serious"),
        ae("Hypotension / dizziness (especially first doses / volume depletion)", "common"),
        ae("Acute kidney injury (especially with bilateral renal artery stenosis or volume depletion)", "serious"),
        ae("Angioedema (rare but serious)", "serious", "high", "Higher risk in some populations; can be life-threatening"),
        ae("Elevated creatinine (hemodynamic)", "moderate"),
      ],
      warnings: [
        warn("boxed", "Pregnancy", "major", "Can cause injury and death to the developing fetus — discontinue when pregnancy detected."),
        warn("contraindication", "History of ACEI-related angioedema", "major", "Do not rechallenge."),
        warn("warning", "Bilateral renal artery stenosis / hyperkalemia / volume depletion", "major", "Risk of renal failure or severe hypotension."),
        warn("precaution", "Concurrent potassium-sparing diuretics / K+ supplements / ARNI", "moderate", "Hyperkalemia risk — monitor."),
      ],
      special: {
        pregnancy: "Contraindicated — fetal toxicity boxed warning.",
        lactation: "Discuss with clinician; some ACEIs have more lactation data than others.",
        renal: "Dose adjust / monitor creatinine and potassium; caution in advanced CKD.",
        hepatic: "Product-specific; generally not primarily hepatically cleared.",
        geriatric: "Start low; monitor renal function and potassium closely.",
      },
      monitoring: ["Blood pressure", "Serum creatinine / eGFR", "Serum potassium"],
      whyStillPrescribed: "Outcome-proven for hypertension, HFrEF, and selected renal protection indications despite cough and angioedema risks.",
      sourceKeys: ["dailymed", "aha_hypertension", "esc_hf", "ema", "nice", "bnf"],
    },
  },

  arb: {
    match: (m) => /\barb\b|angiotensin ii receptor/i.test(m.drugClass) || /losartan|candesartan|valsartan|irbesartan|olmesartan|telmisartan|azilsartan|eprosartan/i.test(m.genericName),
    patch: {
      indications: [
        ind("Hypertension"),
        ind("Heart failure / post-MI (selected ARBs as labeled)"),
        ind("Diabetic nephropathy (selected ARBs, e.g., type 2)", "high"),
        ind("Stroke risk reduction in hypertension with LVH (losartan — labeled)", "moderate", true, "Product-specific"),
      ],
      adverse: [
        ae("Dizziness / hypotension", "common"),
        ae("Hyperkalemia", "serious"),
        ae("Acute kidney injury in susceptible patients", "serious"),
        ae("Angioedema (less common than ACEIs but possible)", "serious", "moderate"),
        ae("Fatigue", "common", "moderate"),
      ],
      warnings: [
        warn("boxed", "Pregnancy", "major", "Fetal toxicity — discontinue when pregnancy detected."),
        warn("warning", "Volume depletion / renal artery stenosis / hyperkalemia", "major", "Similar hemodynamic renal risks as ACEIs."),
        warn("precaution", "Dual blockade with ACEI/ARNI generally avoided", "major", "Increased renal/hyperkalemia harm without routine benefit."),
      ],
      special: {
        pregnancy: "Contraindicated — fetal toxicity.",
        lactation: "Discuss with clinician.",
        renal: "Monitor creatinine and potassium; dose considerations in CKD.",
        hepatic: "Some ARBs need hepatic dose adjustment (product-specific).",
        geriatric: "Monitor renal function and BP.",
      },
      monitoring: ["Blood pressure", "Creatinine / eGFR", "Potassium"],
      whyStillPrescribed: "Guideline-preferred alternative when ACEI cough occurs; strong outcome data for BP and selected renal/HF indications.",
      sourceKeys: ["dailymed", "aha_hypertension", "esc_hf", "ema", "nice"],
    },
  },

  statin: {
    match: (m) => /statin|hmg-coa/i.test(m.drugClass) || /atorvastatin|simvastatin|rosuvastatin|pravastatin|lovastatin|fluvastatin|pitavastatin/i.test(m.genericName),
    patch: {
      indications: [
        ind("Primary hyperlipidemia / mixed dyslipidemia"),
        ind("Familial hypercholesterolemia (hetero/homo — product-specific)"),
        ind("Atherosclerotic cardiovascular disease risk reduction / secondary prevention"),
        ind("Primary prevention in elevated CV risk as labeled/guideline-supported"),
      ],
      adverse: [
        ae("Myalgia / muscle symptoms", "common"),
        ae("Elevated liver enzymes", "common", "moderate"),
        ae("Myopathy / rhabdomyolysis (rare)", "serious", "high", "Risk rises with dose and interacting drugs"),
        ae("New-onset diabetes mellitus (small absolute risk increase)", "moderate", "moderate", "Labeled for class; benefits usually outweigh in indicated patients"),
        ae("Headache, GI upset", "common", "moderate"),
        ae("Cognitive symptoms reported (rare/uncertain causality)", "moderate", "low", "Discussed in labels/safety communications; usually reversible if related"),
      ],
      warnings: [
        warn("contraindication", "Active liver disease / unexplained persistent LFT elevations", "major", "See labeling."),
        warn("contraindication", "Pregnancy / breastfeeding (generally avoid)", "major", "Cholesterol synthesis important in fetal development — discuss exceptions with specialist."),
        warn("warning", "Strong CYP3A4 inhibitors with simvastatin/lovastatin", "major", "Myopathy risk — many combinations contraindicated."),
        warn("precaution", "Alcohol use disorder / hepatic risk factors", "moderate", "Monitor LFTs as clinically indicated."),
      ],
      special: {
        pregnancy: "Generally contraindicated; specialist advice if exceptional circumstances.",
        lactation: "Generally not recommended.",
        renal: "Some statins need renal dose adjustment (e.g., rosuvastatin, simvastatin at higher doses).",
        hepatic: "Contraindicated in active liver disease.",
        geriatric: "Higher myopathy risk with polypharmacy — review interactions.",
      },
      monitoring: [
        "Baseline LFTs; repeat if clinically indicated",
        "CK if unexplained muscle symptoms",
        "Lipid panel for efficacy",
      ],
      whyStillPrescribed: "Among the most evidence-backed therapies for ASCVD risk reduction; absolute diabetes and myopathy risks are generally small versus CV benefit in indicated patients.",
      longTermEvidence: "Decades of RCT outcome data for CV event reduction; long-term safety profile well characterized with known muscle and glycemic signals.",
      sourceKeys: ["dailymed", "label_atorvastatin", "ema", "nice", "aha_hypertension", "bnf"],
    },
  },

  ssri: {
    match: (m) => /\bssri\b/i.test(m.drugClass) || /sertraline|escitalopram|fluoxetine|citalopram|paroxetine|fluvoxamine/i.test(m.genericName),
    patch: {
      indications: [
        ind("Major depressive disorder"),
        ind("Generalized anxiety disorder / panic disorder / social anxiety (product-specific)"),
        ind("Obsessive-compulsive disorder (selected SSRIs)"),
        ind("PTSD / PMDD (selected SSRIs as labeled)", "moderate", true, "Product-specific approvals"),
        ind("Bulimia nervosa (fluoxetine — labeled)", "moderate", true, "Product-specific"),
      ],
      adverse: [
        ae("Nausea, diarrhea or constipation", "common"),
        ae("Sexual dysfunction", "common"),
        ae("Insomnia or somnolence, headache", "common"),
        ae("Increased risk of suicidal thinking/behavior in children, adolescents, and young adults", "serious", "high", "Boxed warning — monitor closely early in treatment"),
        ae("Serotonin syndrome (especially with interacting drugs)", "serious"),
        ae("Hyponatremia / SIADH (esp. elderly)", "serious", "moderate"),
        ae("Bleeding risk increase (esp. with NSAIDs/anticoagulants)", "moderate"),
        ae("QT prolongation (notably citalopram/escitalopram dose-related)", "serious", "moderate", "Product-specific dose caps"),
      ],
      warnings: [
        warn("boxed", "Children, adolescents, young adults", "major", "Antidepressants increase risk of suicidal thinking and behavior in young people — close monitoring required."),
        warn("contraindication", "MAOIs / linezolid / IV methylene blue (timing rules)", "major", "Serotonin syndrome risk — observe washout rules in labeling."),
        warn("warning", "Activation of mania/hypomania in bipolar spectrum", "major", "Screen for bipolar risk."),
        warn("precaution", "Concurrent NSAIDs, antiplatelets, anticoagulants", "moderate", "Increased bleeding risk."),
        warn("warning", "Discontinuation syndrome", "moderate", "Taper rather than abrupt stop when appropriate."),
      ],
      special: {
        pregnancy: "Risk–benefit discussion; some SSRIs have more data than others; neonatal adaptation syndrome possible; paroxetine has additional cardiac concerns historically discussed.",
        lactation: "Sertraline and some others often preferred when treatment needed — clinician decision.",
        renal: "Dose adjustment may be needed (product-specific).",
        hepatic: "Use caution / dose adjust in hepatic impairment.",
        geriatric: "Start low; watch hyponatremia and falls; citalopram max doses lower in elderly.",
      },
      monitoring: [
        "Suicidality / clinical worsening especially first weeks and after dose changes",
        "Sodium in elderly or symptomatic patients",
        "Drug interactions (MAOIs, triptans, tramadol, linezolid, etc.)",
      ],
      withdrawal: "SSRI discontinuation syndrome (dizziness, electric-shock sensations, irritability, insomnia, flu-like symptoms) can occur — taper under clinician guidance, especially with shorter-half-life agents (e.g., paroxetine).",
      whyStillPrescribed: "First-line pharmacotherapy for many depressive and anxiety disorders with extensive RCT support despite boxed suicidality warning in youth and common tolerability issues.",
      longTermEvidence: "Long-term maintenance reduces relapse risk in recurrent depression; ongoing risk–benefit reassessment advised.",
      sourceKeys: ["dailymed", "label_sertraline", "ema", "nice", "mhra", "bnf"],
    },
  },

  snri: {
    match: (m) => /\bsnri\b/i.test(m.drugClass) || /venlafaxine|duloxetine|desvenlafaxine|levomilnacipran|milnacipran/i.test(m.genericName),
    patch: {
      indications: [
        ind("Major depressive disorder"),
        ind("Generalized anxiety disorder (selected SNRIs)"),
        ind("Diabetic peripheral neuropathic pain / fibromyalgia / chronic musculoskeletal pain (duloxetine — labeled)", "high", true, "Product-specific"),
        ind("Panic / social anxiety (venlafaxine XR — labeled)", "moderate", true, "Product-specific"),
      ],
      adverse: [
        ae("Nausea, dry mouth, sweating", "common"),
        ae("Blood pressure elevation (dose-related, esp. venlafaxine)", "moderate"),
        ae("Sexual dysfunction", "common"),
        ae("Suicidality risk in young people (class boxed warning)", "serious"),
        ae("Serotonin syndrome with interacting agents", "serious"),
        ae("Discontinuation syndrome", "moderate"),
        ae("Urinary hesitation / hepatotoxicity concerns (duloxetine)", "serious", "moderate", "Product-specific"),
      ],
      warnings: [
        warn("boxed", "Children, adolescents, young adults", "major", "Suicidality boxed warning — monitor."),
        warn("contraindication", "MAOIs (washout rules)", "major", "Serotonin syndrome risk."),
        warn("warning", "Uncontrolled hypertension", "moderate", "Particularly relevant for venlafaxine."),
        warn("warning", "Substantial alcohol use / chronic liver disease (duloxetine)", "major", "Hepatotoxicity concerns — see label."),
      ],
      special: {
        pregnancy: "Risk–benefit discussion with clinician.",
        lactation: "Discuss with clinician.",
        renal: "Dose adjust / avoid in severe impairment (product-specific).",
        hepatic: "Caution or avoid (esp. duloxetine in substantial alcohol use / chronic liver disease).",
        geriatric: "Watch BP, falls, hyponatremia.",
      },
      monitoring: ["BP", "Suicidality / clinical response", "Liver symptoms if relevant"],
      withdrawal: "Often pronounced discontinuation symptoms — taper slowly under clinician guidance.",
      sourceKeys: ["dailymed", "ema", "nice", "bnf"],
    },
  },

  fluoroquinolone: {
    match: (m) => /fluoroquinolone/i.test(m.drugClass) || /ciprofloxacin|levofloxacin|moxifloxacin|ofloxacin|delafloxacin/i.test(m.genericName),
    patch: {
      indications: [
        ind("Complicated UTI / pyelonephritis (when appropriate)"),
        ind("Selected respiratory / skin / bone infections as labeled"),
        ind("Anthrax / plague (selected agents — labeled)", "moderate", true, "Special-use labeled indications"),
        ind("Uncomplicated infections only when no alternatives (per FDA safety communications)", "moderate", true, "Reserve use due to serious risks"),
      ],
      adverse: [
        ae("GI upset, headache", "common"),
        ae("Tendinitis / tendon rupture (incl. Achilles)", "serious", "high", "Boxed warning"),
        ae("Peripheral neuropathy (may be irreversible)", "serious", "high", "Boxed warning"),
        ae("CNS effects (seizures, psychosis, anxiety, confusion)", "serious"),
        ae("QT prolongation / arrhythmia risk (esp. moxifloxacin)", "serious", "moderate"),
        ae("Aortic aneurysm/dissection risk signal (labeled warnings)", "serious", "moderate"),
        ae("Dysglycemia (hypo/hyperglycemia)", "serious", "moderate"),
        ae("C. difficile–associated diarrhea", "serious"),
        ae("Photosensitivity", "common", "moderate"),
      ],
      warnings: [
        warn("boxed", "Systemic fluoroquinolones", "major", "Serious adverse reactions including tendinopathy, peripheral neuropathy, and CNS effects; reserve for patients with no alternative for certain uncomplicated infections."),
        warn("warning", "Myasthenia gravis", "major", "May exacerbate muscle weakness — avoid."),
        warn("precaution", "Elderly, corticosteroid users, transplant, renal impairment", "major", "Higher tendon injury risk."),
        warn("warning", "QT risk factors / interacting QT drugs", "major", "Product-specific."),
      ],
      special: {
        pregnancy: "Generally avoid unless no safer alternatives — discuss with clinician.",
        lactation: "Discuss; often avoided when alternatives exist.",
        renal: "Dose adjust for many fluoroquinolones.",
        hepatic: "Product-specific caution.",
        geriatric: "Higher tendon and CNS risk.",
      },
      monitoring: ["Reassess need; switch if serious AE symptoms appear", "Glucose in diabetics", "ECG considerations if QT risk"],
      whyStillPrescribed: "Still important for selected serious infections and resistant organisms when benefits outweigh well-documented serious risks; stewardship and FDA reserve guidance apply.",
      sourceKeys: ["dailymed", "fda_fluoroquinolone", "label_ciprofloxacin", "ema", "mhra", "cdc_stis"],
    },
  },

  doac: {
    match: (m) => /doac|factor xa|direct oral anticoagulant|direct thrombin/i.test(m.drugClass) || /apixaban|rivaroxaban|edoxaban|dabigatran/i.test(m.genericName),
    patch: {
      indications: [
        ind("Stroke prevention in nonvalvular atrial fibrillation"),
        ind("Treatment of DVT / PE"),
        ind("Secondary prevention of recurrent VTE"),
        ind("VTE prophylaxis after hip/knee replacement (product-specific)"),
        ind("CAD/PAD risk reduction (rivaroxaban low-dose regimens — labeled)", "moderate", true, "Product-specific"),
      ],
      adverse: [
        ae("Bleeding (any site)", "serious", "high", "Primary risk"),
        ae("GI bleeding", "serious"),
        ae("Intracranial hemorrhage (less than warfarin in many trials, still serious)", "serious"),
        ae("Anemia", "common", "moderate"),
        ae("Nausea", "common", "moderate"),
      ],
      warnings: [
        warn("boxed", "Premature discontinuation", "major", "Increases thrombotic event risk — provide alternative anticoagulation coverage if stopping."),
        warn("boxed", "Spinal/epidural hematoma risk with neuraxial anesthesia", "major", "See labeling timing rules."),
        warn("contraindication", "Active pathological bleeding / mechanical prosthetic valves (generally)", "major", "DOACs not for mechanical valves; dabigatran specifically failed in that setting."),
        warn("warning", "Significant drug interactions (P-gp/CYP3A4)", "major", "Many combinations require avoidance or dose change — e.g., strong dual inhibitors/inducers."),
      ],
      special: {
        pregnancy: "Limited data; specialist management for anticoagulation in pregnancy usually prefers other agents.",
        lactation: "Generally avoided; specialist advice.",
        renal: "Dose adjust or avoid based on CrCl/eGFR thresholds — product-specific (critical for safety).",
        hepatic: "Avoid in significant hepatic disease associated with coagulopathy (product-specific).",
        geriatric: "Fall and bleeding risk higher — still often preferred over warfarin when indicated.",
      },
      monitoring: [
        "Renal function at baseline and periodically",
        "CBC / signs of bleeding",
        "Adherence counseling (short half-life vs warfarin)",
      ],
      whyStillPrescribed: "For many NVAF and VTE indications, DOACs have RCT evidence of similar/better efficacy and less intracranial bleeding vs warfarin, with fewer routine INR checks — not interchangeable for mechanical valves or APS in many guidelines.",
      sourceKeys: ["dailymed", "label_apixaban", "ema", "esc_hf", "nice", "bnf"],
    },
  },

  warfarin: {
    match: (m) => /warfarin|vitamin k antagonist/i.test(m.genericName + m.drugClass),
    patch: {
      indications: [
        ind("Prophylaxis/treatment of venous thrombosis and PE"),
        ind("Thromboembolic complications of AF / cardiac valve replacement"),
        ind("Secondary prevention after MI (selected contexts)", "moderate"),
        ind("Antiphospholipid syndrome / mechanical valves (often preferred anticoagulant class)", "high", true, "DOACs often inappropriate"),
      ],
      adverse: [
        ae("Major and minor bleeding", "serious", "high", "Boxed warning"),
        ae("Skin necrosis (rare, esp. protein C/S deficiency)", "serious", "moderate"),
        ae("Purple toe syndrome (rare)", "serious", "low"),
        ae("Teratogenicity / fetal harm", "serious"),
        ae("Drug and food (vitamin K) interaction instability", "moderate"),
      ],
      warnings: [
        warn("boxed", "Bleeding risk", "major", "Can cause major or fatal bleeding; monitor INR."),
        warn("contraindication", "Pregnancy (except special mechanical valve scenarios under specialist care)", "major", "Teratogenic / fetopathic."),
        warn("warning", "Numerous drug–drug and drug–food interactions", "major", "Antibiotics, amiodarone, NSAIDs, acetaminophen (high dose), herbals, vitamin K intake changes."),
      ],
      special: {
        pregnancy: "Contraindicated in most pregnancies; specialist protocols exist for some mechanical valves.",
        lactation: "Generally considered compatible — confirm with clinician.",
        renal: "Not renally cleared primarily but comorbidity affects bleeding risk.",
        hepatic: "Impaired synthesis of clotting factors increases sensitivity.",
        geriatric: "Higher bleeding risk — careful INR management.",
      },
      monitoring: ["INR regularly", "CBC / signs of bleeding", "Medication and diet review at each change"],
      whyStillPrescribed: "Still required/preferred for mechanical heart valves, some APS patients, and settings where DOACs are unsuitable or unaffordable; extensive clinical experience.",
      sourceKeys: ["dailymed", "fda_warfarin", "ema", "nice", "bnf"],
    },
  },

  metformin: {
    match: (m) => /metformin|biguanide/i.test(m.genericName + m.drugClass),
    patch: {
      indications: [
        ind("Type 2 diabetes mellitus (first-line in many guidelines when tolerated)"),
        ind("Prediabetes / diabetes prevention (guideline off-label in some regions)", "moderate", false, "Not a universal labeled indication — guideline-dependent"),
        ind("PCOS metabolic features (commonly used off-label)", "moderate", false, "Off-label"),
      ],
      adverse: [
        ae("GI upset (diarrhea, nausea, abdominal discomfort)", "common", "high", "Often dose-related; XR may help"),
        ae("Vitamin B12 deficiency with long-term use", "moderate"),
        ae("Lactic acidosis (rare)", "serious", "high", "Boxed warning — risk rises with renal failure, hypoxia, dehydration, heavy alcohol use"),
        ae("Metallic taste", "common", "moderate"),
      ],
      warnings: [
        warn("boxed", "Lactic acidosis risk groups", "major", "Rare but potentially fatal; risk increases with substantial renal impairment and hypoxic states."),
        warn("contraindication", "Severe renal impairment (eGFR thresholds product/region-specific)", "major", "See current labeling for initiation/continuation cutoffs."),
        warn("warning", "Iodinated contrast / acute illness with dehydration", "moderate", "Temporary interruption often advised — follow local protocols."),
        warn("precaution", "Heavy alcohol use / hepatic disease / HF instability", "moderate", "Increased lactic acidosis risk."),
      ],
      special: {
        pregnancy: "Increasingly used in gestational diabetes in some guidelines — clinician decision; insulin often preferred historically.",
        lactation: "Generally considered compatible — confirm.",
        renal: "Dose adjust / stop per eGFR thresholds.",
        hepatic: "Avoid in significant hepatic disease (lactic acidosis risk).",
        geriatric: "Assess renal function carefully.",
      },
      monitoring: ["eGFR at baseline and periodically", "HbA1c / glucose", "Consider B12 with long-term use"],
      whyStillPrescribed: "Foundational T2DM therapy with outcome and glycemic evidence, low hypoglycemia risk when used alone, and extensive global experience; lactic acidosis is rare when renal/hypoxia cautions are respected.",
      longTermEvidence: "Long-term use associated with durable glycemic benefit; B12 monitoring increasingly emphasized; CV outcome neutrality/benefit discussed historically (UKPDS era) with modern agents adding incremental CV/kidney benefits in higher-risk patients.",
      sourceKeys: ["dailymed", "label_metformin", "ada_diabetes", "nice", "ema", "bnf"],
    },
  },
};

Object.assign(CLASS_TEMPLATES, {
  beta_blocker: {
    match: (m) => /beta.*blocker|beta-1/i.test(m.drugClass) || /metoprolol|bisoprolol|atenolol|propranolol|carvedilol|nebivolol|labetalol|nadolol|sotalol/i.test(m.genericName),
    patch: {
      indications: [
        ind("Hypertension"),
        ind("Angina pectoris"),
        ind("Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)", "high", true, "Agent-specific"),
        ind("Post-MI / rate control in AF (selected)", "high"),
        ind("Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)", "moderate", false),
      ],
      adverse: [
        ae("Bradycardia, fatigue, dizziness", "common"),
        ae("Cold extremities", "common", "moderate"),
        ae("Sleep disturbance / vivid dreams (lipophilic agents)", "common", "moderate"),
        ae("Sexual dysfunction", "common", "moderate"),
        ae("Worsening of acute decompensated HF if started inappropriately", "serious"),
        ae("Bronchospasm risk (esp. nonselective)", "serious", "moderate"),
        ae("Masked hypoglycemia symptoms in insulin-treated patients", "moderate"),
      ],
      warnings: [
        warn("warning", "Abrupt withdrawal", "major", "Can precipitate angina, MI, or rebound hypertension — taper."),
        warn("contraindication", "Severe bradycardia / high-grade AV block without pacemaker / acute decompensated HF (selected contexts)", "major", "See labeling."),
        warn("precaution", "Asthma / severe COPD (esp. nonselective)", "moderate", "Prefer cardioselective agents if beta blocker required."),
        warn("precaution", "Diabetes", "moderate", "May mask hypoglycemia warning signs."),
      ],
      special: {
        pregnancy: "Some agents used (e.g., labetalol) for hypertension in pregnancy — specialist guidance.",
        lactation: "Several beta blockers used with caution — agent-specific.",
        renal: "Atenolol renally cleared — adjust.",
        hepatic: "Many are hepatically metabolized — caution.",
        geriatric: "Start low; fall and bradycardia risk.",
      },
      monitoring: ["Heart rate and BP", "Signs of HF decompensation when initiating", "Glucose awareness in diabetics"],
      withdrawal: "Do not stop suddenly after chronic use — taper under clinician guidance to reduce rebound ischemia/hypertension risk.",
      sourceKeys: ["dailymed", "aha_hypertension", "esc_hf", "ema", "nice"],
    },
  },

  ccb_dhp: {
    match: (m) => /dihydropyridine|amlodipine|nifedipine|felodipine|lercanidipine|nicardipine/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [
        ind("Hypertension"),
        ind("Angina (chronic stable / vasospastic — product-specific)"),
        ind("Raynaud phenomenon (often off-label)", "moderate", false),
      ],
      adverse: [
        ae("Peripheral edema", "common"),
        ae("Flushing, headache, dizziness", "common"),
        ae("Gingival hyperplasia (long-term)", "moderate", "moderate"),
        ae("Palpitations / reflex tachycardia (shorter-acting agents)", "moderate"),
        ae("Hypotension", "moderate"),
      ],
      warnings: [
        warn("precaution", "Severe aortic stenosis / unstable hemodynamics", "moderate", "Vasodilation risks."),
        warn("warning", "Short-acting nifedipine historically cautioned for hypertensive urgency misuse", "moderate", "Prefer long-acting formulations."),
      ],
      special: {
        pregnancy: "Some DHPs used in pregnancy hypertension under specialist care.",
        lactation: "Discuss agent-specific data.",
        renal: "Generally no major dose change for amlodipine.",
        hepatic: "Dose caution in hepatic impairment (amlodipine).",
        geriatric: "Edema and hypotension — start low.",
      },
      monitoring: ["BP", "Edema / weight"],
      sourceKeys: ["dailymed", "aha_hypertension", "ema", "nice"],
    },
  },

  antibiotic_penicillin: {
    match: (m) => /aminopenicillin|penicillin \+|amoxicillin|ampicillin/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [
        ind("Otitis media / streptococcal pharyngitis / sinusitis (when bacterial)"),
        ind("Lower respiratory tract infections as labeled"),
        ind("UTI (selected contexts / susceptibility)"),
        ind("H. pylori regimens (amoxicillin component)", "high"),
        ind("Prophylaxis in selected procedures (guideline-directed)", "moderate"),
      ],
      adverse: [
        ae("Diarrhea, nausea, rash", "common"),
        ae("Hypersensitivity / anaphylaxis", "serious"),
        ae("C. difficile–associated diarrhea", "serious"),
        ae("Interstitial nephritis (rare)", "serious", "moderate"),
        ae("Drug reaction with eosinophilia (rare severe cutaneous reactions)", "serious", "moderate"),
      ],
      warnings: [
        warn("contraindication", "Serious penicillin allergy", "major", "Cross-reactivity considerations with other beta-lactams."),
        warn("warning", "Infectious mononucleosis", "moderate", "High rate of rash with aminopenicillins."),
        warn("precaution", "History of C. difficile", "moderate", "Risk of recurrence."),
      ],
      special: {
        pregnancy: "Penicillins generally considered compatible when indicated.",
        lactation: "Generally compatible — monitor infant for diarrhea/rash.",
        renal: "Dose adjust in significant impairment.",
        hepatic: "Clavulanate component — hepatic caution with Augmentin.",
      },
      monitoring: ["Allergy history", "Renal dosing", "Diarrhea / C. difficile symptoms"],
      sourceKeys: ["dailymed", "label_amoxicillin", "ema", "nice", "bnf", "cdc_stis"],
    },
  },

  macrolide: {
    match: (m) => /macrolide/i.test(m.drugClass) || /azithromycin|clarithromycin|erythromycin|roxithromycin/i.test(m.genericName),
    patch: {
      indications: [
        ind("Community-acquired respiratory infections as labeled"),
        ind("Chlamydia / selected STIs (azithromycin — guideline regimens)", "high"),
        ind("H. pylori regimens (clarithromycin-containing)", "high"),
        ind("MAC prophylaxis/treatment (selected)", "moderate"),
        ind("COPD exacerbation antibiotic contexts (selected)", "moderate"),
      ],
      adverse: [
        ae("GI upset", "common"),
        ae("QT prolongation / torsades risk", "serious", "moderate"),
        ae("Hepatotoxicity", "serious", "moderate"),
        ae("Hearing loss (high-dose / prolonged — rare)", "serious", "low"),
        ae("C. difficile diarrhea", "serious", "moderate"),
      ],
      warnings: [
        warn("warning", "QT prolongation risk factors / interacting drugs", "major", "Especially erythromycin/clarithromycin; azithromycin also has FDA QT communication."),
        warn("warning", "Strong CYP3A4 inhibition (clarithromycin/erythromycin)", "major", "Serious interactions (e.g., some statins, colchicine)."),
        warn("precaution", "Myasthenia gravis", "moderate", "May exacerbate."),
      ],
      special: {
        pregnancy: "Often used when indicated; discuss product-specific data.",
        lactation: "Generally considered compatible with monitoring.",
        renal: "Clarithromycin adjust in renal impairment.",
        hepatic: "Caution — hepatotoxicity reports.",
      },
      monitoring: ["Drug interaction review", "ECG if high QT risk"],
      sourceKeys: ["dailymed", "ema", "cdc_stis", "nice", "fda"],
    },
  },

  opioid: {
    match: (m) => /opioid/i.test(m.drugClass) || /morphine|oxycodone|hydrocodone|codeine|tramadol|fentanyl|hydromorphone|buprenorphine|tapentadol/i.test(m.genericName),
    patch: {
      indications: [
        ind("Moderate to severe acute pain when non-opioids insufficient"),
        ind("Cancer / palliative pain (selected)", "high"),
        ind("Chronic non-cancer pain only with careful selection (generally last-line)", "moderate", true, "Guideline caution — risks often outweigh for many chronic pain states"),
        ind("Antitussive (codeine — labeled in some products)", "moderate", true, "Restricted in many jurisdictions for children"),
      ],
      adverse: [
        ae("Constipation, nausea, sedation", "common"),
        ae("Respiratory depression", "serious", "high", "Boxed warning"),
        ae("Dependence / addiction / misuse", "serious", "high", "Boxed warning"),
        ae("Hypogonadism with chronic use", "moderate", "moderate"),
        ae("Falls / cognitive impairment", "moderate"),
        ae("Serotonin syndrome (tramadol) / seizures (tramadol)", "serious", "moderate"),
      ],
      warnings: [
        warn("boxed", "Addiction, abuse, misuse; respiratory depression; accidental ingestion; neonatal opioid withdrawal; CYP450 interaction issues (selected)", "major", "See full opioid analgesic REMS / labeling."),
        warn("boxed", "Benzodiazepines / CNS depressants co-use", "major", "Profound sedation, respiratory depression, death."),
        warn("warning", "Ultra-rapid CYP2D6 metabolizers (codeine/tramadol)", "major", "Life-threatening respiratory depression — contraindicated in children in many labels."),
      ],
      special: {
        pregnancy: "Neonatal opioid withdrawal risk with prolonged use; specialist care.",
        lactation: "Codeine/tramadol particularly hazardous in some infants — often contraindicated.",
        renal: "Accumulate metabolites (morphine, codeine) — caution/adjust.",
        hepatic: "Dose caution; tramadol/codeine activation issues.",
        geriatric: "High risk — start low, go slow; prefer non-opioids first.",
      },
      monitoring: ["Sedation / respiration", "Constipation plan", "Misuse risk / PDMP where applicable", "Functional goals"],
      withdrawal: "Physiologic withdrawal (yawning, diarrhea, myalgias, anxiety, tachycardia) after chronic use — taper; not the same as addiction but can be severe.",
      whyStillPrescribed: "Essential for severe acute, cancer, and palliative pain; chronic non-cancer use increasingly restricted because harms often exceed benefits.",
      sourceKeys: ["dailymed", "fda", "ema", "nice", "mhra", "bnf", "who"],
    },
  },

  corticosteroid_sys: {
    match: (m) => /systemic corticosteroid|prednisone|prednisolone|methylprednisolone|dexamethasone|hydrocortisone/i.test(m.drugClass + m.genericName) && !/inhaled/i.test(m.drugClass),
    patch: {
      indications: [
        ind("Inflammatory / allergic / autoimmune flares as labeled"),
        ind("Asthma / COPD exacerbations (systemic short courses)"),
        ind("Adrenal insufficiency replacement (physiologic dosing — selected agents)"),
        ind("Oncology / antiemetic adjunct / COVID protocols (context-specific)", "moderate", true, "Indication and dose highly context-specific"),
      ],
      adverse: [
        ae("Insomnia, mood changes, increased appetite", "common"),
        ae("Hyperglycemia", "common"),
        ae("Infection risk increase", "serious"),
        ae("Osteoporosis with long-term use", "serious"),
        ae("Adrenal suppression with prolonged therapy", "serious"),
        ae("AVN of bone / myopathy (higher dose/duration)", "serious", "moderate"),
        ae("GI ulcer risk especially with NSAIDs", "serious", "moderate"),
      ],
      warnings: [
        warn("warning", "Abrupt withdrawal after prolonged use", "major", "Risk of adrenal crisis — taper."),
        warn("warning", "Live vaccines / active untreated infections", "major", "Immunosuppression concerns."),
        warn("precaution", "Diabetes, osteoporosis, psychiatric disease, glaucoma, PUD", "moderate", "May worsen."),
      ],
      special: {
        pregnancy: "Used when indicated (e.g., fetal lung maturation with dexamethasone/betamethasone); chronic use needs specialist balance.",
        lactation: "Often compatible at lower doses — discuss.",
        renal: "Fluid retention / hypertension considerations.",
        hepatic: "Prednisone needs conversion to prednisolone — prefer prednisolone in severe hepatic disease.",
        geriatric: "Higher delirium, fracture, infection risk.",
      },
      monitoring: ["Glucose / BP with higher doses", "Bone protection if long-term", "Ophthalmology if prolonged", "HPA axis awareness when tapering"],
      withdrawal: "Taper after prolonged courses to avoid adrenal insufficiency; duration/dose thresholds are clinical judgments.",
      whyStillPrescribed: "Rapid, broad anti-inflammatory/immunosuppressive effects remain unmatched for many acute indications despite well-known toxicity with chronic use.",
      sourceKeys: ["dailymed", "ema", "nice", "gina_asthma", "gold_copd", "bnf"],
    },
  },

  levothyroxine: {
    match: (m) => /levothyroxine|thyroid hormone/i.test(m.genericName + m.drugClass),
    patch: {
      indications: [
        ind("Hypothyroidism (replacement)"),
        ind("TSH suppression in selected thyroid cancer protocols", "high"),
        ind("Myxedema coma (IV formulations — specialist)", "high"),
      ],
      adverse: [
        ae("Symptoms of iatrogenic hyperthyroidism if over-replaced (palpitations, tremor, insomnia, weight loss)", "common"),
        ae("Arrhythmias / bone loss with chronic overtreatment", "serious"),
        ae("Allergic reactions to excipients (rare)", "moderate", "low"),
      ],
      warnings: [
        warn("boxed", "Not for weight loss / euthyroid obesity", "major", "Ineffective and dangerous in euthyroid patients."),
        warn("warning", "Adrenal insufficiency should be treated before starting thyroid hormone", "major", "Risk of precipitating adrenal crisis."),
        warn("precaution", "CAD / elderly — start low", "moderate", "Demand ischemia risk."),
      ],
      special: {
        pregnancy: "Increased requirements common — monitor TSH closely; treat hypothyroidism in pregnancy.",
        lactation: "Compatible.",
        renal: "No specific contraindication.",
        hepatic: "No specific contraindication.",
        geriatric: "Start low, titrate slowly.",
      },
      monitoring: ["TSH (and free T4 as indicated) 6–8 weeks after dose changes", "More frequent monitoring in pregnancy"],
      longTermEvidence: "Lifelong therapy usually required for primary hypothyroidism; overtreatment associated with AF and osteoporosis risk.",
      sourceKeys: ["dailymed", "label_levothyroxine", "ema", "nice", "bnf"],
    },
  },

  antiplatelet: {
    match: (m) => /p2y12|antiplatelet/i.test(m.drugClass) || /clopidogrel|prasugrel|ticagrelor|aspirin \(low-dose/i.test(m.genericName),
    patch: {
      indications: [
        ind("Secondary prevention after ACS / stent / ischemic stroke or TIA (as labeled)"),
        ind("PAD symptomatic management (selected)", "moderate"),
        ind("Primary prevention only in selected higher-risk patients (aspirin) — guideline-narrowed", "moderate", true, "Net benefit often unfavorable in average-risk adults"),
      ],
      adverse: [
        ae("Bleeding / bruising", "serious"),
        ae("Dyspepsia / GI bleeding (aspirin)", "serious"),
        ae("Dyspnea (ticagrelor)", "common", "moderate"),
        ae("Thrombotic thrombocytopenic purpura (rare — clopidogrel)", "serious", "low"),
      ],
      warnings: [
        warn("boxed", "Bleeding (prasugrel/ticagrelor)", "major", "See product boxed warnings."),
        warn("warning", "CYP2C19 poor metabolizers (clopidogrel)", "moderate", "Reduced antiplatelet effect — boxed warning in US."),
        warn("warning", "Omeprazole/esomeprazole interaction discussions with clopidogrel", "moderate", "Prefer interaction-safer acid suppression when needed."),
      ],
      monitoring: ["Bleeding signs", "Adherence after stents (critical)", "Hemoglobin if occult bleed suspected"],
      sourceKeys: ["dailymed", "ema", "aha_hypertension", "nice", "esc_hf"],
    },
  },

  sglt2: {
    match: (m) => /sglt2/i.test(m.drugClass) || /empagliflozin|dapagliflozin|canagliflozin|ertugliflozin/i.test(m.genericName),
    patch: {
      indications: [
        ind("Type 2 diabetes mellitus"),
        ind("Heart failure (HFrEF/HFpEF — agent-specific labeled)"),
        ind("CKD / diabetic kidney disease progression risk reduction (agent-specific)"),
        ind("CV death risk reduction in T2DM with CVD (empagliflozin — labeled)", "high"),
      ],
      adverse: [
        ae("Genital mycotic infections", "common"),
        ae("Volume depletion / hypotension", "moderate"),
        ae("Euglycemic DKA (rare)", "serious"),
        ae("UTIs / rare urosepsis", "serious", "moderate"),
        ae("Fournier gangrene (rare)", "serious", "low"),
        ae("Amputation risk signal (canagliflozin historically labeled)", "serious", "moderate", "Product-specific historical warning"),
      ],
      warnings: [
        warn("warning", "DKA risk even with near-normal glucose", "major", "Hold in acute illness / peri-op per protocols."),
        warn("precaution", "Volume depletion / loop diuretics / low BP", "moderate", "Adjust concomitant therapy."),
        warn("warning", "Severe renal impairment thresholds for glycemic vs cardiorenal indications", "moderate", "Indication-specific eGFR cutoffs."),
      ],
      special: {
        pregnancy: "Not recommended.",
        lactation: "Not recommended.",
        renal: "Indication and dose depend on eGFR — check current label.",
        geriatric: "Volume depletion / fall risk.",
      },
      monitoring: ["Renal function", "Volume status", "Genital hygiene counseling", "Ketones if DKA symptoms"],
      whyStillPrescribed: "Cardiorenal outcome benefits beyond glucose lowering have made SGLT2 inhibitors foundational in HF and CKD guidelines.",
      sourceKeys: ["dailymed", "ada_diabetes", "esc_hf", "ema", "nice"],
    },
  },

  glp1: {
    match: (m) => /glp-1|glp1/i.test(m.drugClass) || /semaglutide|liraglutide|dulaglutide|exenatide|tirzepatide/i.test(m.genericName),
    patch: {
      indications: [
        ind("Type 2 diabetes mellitus"),
        ind("Chronic weight management (selected doses/products — labeled)", "high", true, "Product/dose-specific"),
        ind("CV risk reduction in T2DM with CVD (selected agents)", "high"),
      ],
      adverse: [
        ae("Nausea, vomiting, diarrhea, constipation", "common", "high", "Often dose-related / titrate"),
        ae("Gallbladder disease", "serious", "moderate"),
        ae("Pancreatitis (uncommon — labeled warning)", "serious", "moderate"),
        ae("Injection-site reactions", "common", "moderate"),
        ae("Thyroid C-cell tumor boxed warning (rodent; human relevance uncertain)", "serious", "moderate", "Contraindicated with MTC/MEN2 personal/family history for many agents"),
      ],
      warnings: [
        warn("boxed", "MTC / MEN2 history (many GLP-1 RAs)", "major", "Contraindicated — rodent C-cell tumor signal."),
        warn("warning", "History of pancreatitis", "moderate", "Generally avoid rechallenge if pancreatitis occurs."),
        warn("precaution", "Gastroparesis / severe GI disease", "moderate", "May worsen."),
      ],
      special: {
        pregnancy: "Discontinue when pregnancy recognized for weight products; diabetes needs specialist plan.",
        lactation: "Limited data — discuss.",
        renal: "Dehydration from GI AEs can worsen renal function.",
        hepatic: "Limited specific restrictions.",
      },
      monitoring: ["GI tolerability / titration", "Gallbladder symptoms", "Glucose / weight goals"],
      whyStillPrescribed: "Robust glycemic, weight, and for some agents CV outcome benefits outweigh common GI AEs for many patients when titrated carefully.",
      sourceKeys: ["dailymed", "ada_diabetes", "ema", "nice", "fda"],
    },
  },

  benzodiazepine: {
    match: (m) => /benzodiazepine/i.test(m.drugClass) || /diazepam|lorazepam|alprazolam|clonazepam|temazepam|oxazepam|midazolam/i.test(m.genericName),
    patch: {
      indications: [
        ind("Acute anxiety / panic (short-term)"),
        ind("Seizure / status epilepticus (selected agents/routes)"),
        ind("Alcohol withdrawal (selected protocols)"),
        ind("Muscle spasm (diazepam)", "moderate"),
        ind("Insomnia short-term (selected)", "moderate", true, "Prefer non-drug and non-benzo options first in many guidelines"),
      ],
      adverse: [
        ae("Sedation, dizziness, ataxia", "common"),
        ae("Cognitive impairment / dependence", "serious"),
        ae("Respiratory depression with opioids / alcohol", "serious"),
        ae("Paradoxical agitation (esp. elderly)", "moderate"),
        ae("Falls and fractures in elderly", "serious"),
      ],
      warnings: [
        warn("boxed", "Opioid co-use", "major", "Profound sedation, respiratory depression, death."),
        warn("warning", "Abuse, misuse, addiction; physical dependence; withdrawal reactions", "major", "FDA class boxed warnings."),
        warn("precaution", "Elderly (Beers Criteria)", "major", "Prefer avoidance for insomnia/agitation."),
      ],
      special: {
        pregnancy: "Risks of neonatal floppy infant / withdrawal — avoid chronic use when possible.",
        lactation: "Sedation risk in infant — caution.",
        hepatic: "Prefer lorazepam/oxazepam in cirrhosis (no active metabolites).",
        geriatric: "High risk — avoid if possible.",
      },
      monitoring: ["Sedation / falls", "Duration of therapy (keep short)", "Withdrawal risk if prolonged"],
      withdrawal: "Can be severe (anxiety rebound, insomnia, tremor, seizures) — slow taper required after prolonged use.",
      whyStillPrescribed: "Rapid anxiolytic/anticonvulsant effects remain useful acutely; chronic outpatient use discouraged due to dependence and cognitive/fall harms.",
      sourceKeys: ["dailymed", "fda", "ema", "nice", "bnf"],
    },
  },

  antihistamine2: {
    match: (m) => /h1 antihistamine|second-generation h1|cetirizine|loratadine|fexofenadine|desloratadine|levocetirizine/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [
        ind("Allergic rhinitis"),
        ind("Urticaria / chronic spontaneous urticaria (selected)"),
        ind("Allergic conjunctivitis symptomatic relief (selected)", "moderate"),
      ],
      adverse: [
        ae("Somnolence (cetirizine > loratadine/fexofenadine typically)", "common", "moderate"),
        ae("Dry mouth, headache", "common", "moderate"),
        ae("Rare serious allergic reaction", "serious", "low"),
      ],
      warnings: [
        warn("precaution", "Severe renal impairment (cetirizine/levocetirizine)", "moderate", "Dose adjust."),
        warn("precaution", "Activities requiring alertness if sedated", "moderate", "Individual variability."),
      ],
      special: {
        pregnancy: "Often used when needed; discuss agent choice.",
        lactation: "Generally compatible — prefer non-sedating; monitor infant.",
        renal: "Dose adjust cetirizine family.",
        hepatic: "Caution product-specific.",
      },
      monitoring: ["Sedation / efficacy"],
      sourceKeys: ["dailymed", "ema", "nice", "bnf"],
    },
  },

  inhaled_steroid: {
    match: (m) => /inhaled corticosteroid|ics\/laba|fluticasone \(inhaled\)|budesonide|beclomethasone|mometasone \(inhaled\)/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [
        ind("Asthma maintenance"),
        ind("COPD (selected ICS-containing regimens — not monotherapy first-line)", "high"),
        ind("Allergic rhinitis (intranasal formulations — related products)", "moderate", true, "Different products"),
      ],
      adverse: [
        ae("Oropharyngeal candidiasis", "common"),
        ae("Dysphonia / hoarseness", "common"),
        ae("Pneumonia risk increase in COPD with ICS", "serious", "moderate"),
        ae("Systemic corticosteroid effects at high doses (adrenal, bone, ocular)", "serious", "moderate"),
      ],
      warnings: [
        warn("warning", "Not for acute bronchospasm rescue (maintenance ICS)", "major", "Use SABA/SMART protocols as directed."),
        warn("precaution", "COPD patients — pneumonia risk", "moderate", "Reassess ICS need."),
      ],
      special: {
        pregnancy: "Inhaled corticosteroids (esp. budesonide) often continued for asthma control.",
        lactation: "Generally compatible.",
        pediatric: "Growth velocity monitoring with long-term ICS.",
      },
      monitoring: ["Inhaler technique / rinse mouth", "Exacerbation frequency", "Growth in children"],
      sourceKeys: ["dailymed", "gina_asthma", "gold_copd", "nice", "ema"],
    },
  },

  contraceptive: {
    match: (m) => /contraceptive|levonorgestrel emergency|combined hormonal/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [
        ind("Prevention of pregnancy"),
        ind("Emergency contraception (levonorgestrel / ulipristal products)", "high", true, "Product-specific"),
        ind("Menstrual cycle regulation / acne / endometriosis symptoms (selected CHCs — labeled)", "moderate"),
      ],
      adverse: [
        ae("Nausea, breast tenderness, breakthrough bleeding", "common"),
        ae("Venous thromboembolism (CHC)", "serious", "high", "Estrogen-dose and progestin-type dependent absolute risk still low in healthy nonsmokers"),
        ae("Stroke / MI risk increase in smokers >35 and other CV risk factors (CHC)", "serious"),
        ae("Mood changes / headache", "common", "moderate"),
      ],
      warnings: [
        warn("boxed", "Smoking and age >35 (combined hormonal contraceptives)", "major", "Increased CV event risk."),
        warn("contraindication", "History of VTE, thrombophilia, migraine with aura, uncontrolled HTN (CHC — selected)", "major", "See CDC MEC / labeling."),
        warn("warning", "Reduced efficacy with enzyme-inducing drugs / vomiting", "moderate", "Counsel backup contraception."),
      ],
      special: {
        pregnancy: "Not abortifacient at contraceptive doses; stop CHC if pregnancy occurs.",
        lactation: "Progestin-only often preferred early postpartum — timing rules apply.",
        hepatic: "Avoid CHC in significant hepatic disease / tumors.",
      },
      monitoring: ["BP", "Migraine / VTE risk reassessment", "Drug interaction review"],
      sourceKeys: ["dailymed", "acog", "cdc_stis", "ema", "who", "mhra"],
    },
  },
});
