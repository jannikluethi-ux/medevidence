import { ind, ae, warn } from "./helpers.mjs";
import { CLASS_TEMPLATES } from "./class-templates.mjs";

Object.assign(CLASS_TEMPLATES, {
  paracetamol: {
    match: (m) => /paracetamol|acetaminophen/i.test(m.genericName),
    patch: {
      indications: [
        ind("Pain (mild to moderate)"),
        ind("Fever"),
        ind("Osteoarthritis symptomatic relief (adjunct)", "moderate"),
        ind("Post-vaccine / viral illness symptomatic care", "moderate", true, "Supportive — not disease-modifying"),
      ],
      adverse: [
        ae("Generally well tolerated at labeled doses", "common", "moderate", "Many users report no side effects"),
        ae("Hepatotoxicity / acute liver failure in overdose or with risk factors", "serious", "high", "Leading cause of acute liver failure in some countries"),
        ae("Rare severe skin reactions (SJS/TEN/AGEP)", "serious", "low"),
        ae("Nausea with higher doses", "common", "moderate"),
      ],
      warnings: [
        warn("warning", "Overdose / chronic supratherapeutic dosing", "major", "Severe hepatotoxicity — do not exceed labeled daily maximum; account for combination products."),
        warn("precaution", "Chronic alcohol use / malnutrition / liver disease", "major", "Lower thresholds for harm."),
        warn("warning", "Multiple acetaminophen-containing products", "major", "Unintentional overdose risk."),
      ],
      special: {
        pregnancy: "Widely used analgesic in pregnancy when needed — still use lowest effective dose/duration.",
        lactation: "Compatible at labeled doses.",
        renal: "Extend interval in severe CKD for some regimens.",
        hepatic: "Avoid or use extreme caution in active liver disease.",
        geriatric: "Watch total daily dose from all sources.",
      },
      monitoring: ["Total daily acetaminophen from all products", "LFTs if overdose or prolonged high-risk use"],
      whyStillPrescribed: "First-line analgesic/antipyretic with a different risk profile than NSAIDs (no typical NSAID GI/CV/renal class effects at therapeutic doses), but overdose hepatotoxicity is critical to prevent.",
      sourceKeys: ["dailymed", "label_paracetamol", "ema", "mhra", "bnf", "who"],
    },
  },
  thiazide: {
    match: (m) => /thiazide/i.test(m.drugClass) || /hydrochlorothiazide|chlorthalidone|indapamide|bendroflumethiazide|metolazone/i.test(m.genericName),
    patch: {
      indications: [ind("Hypertension"), ind("Edema (selected contexts)"), ind("Nephrolithiasis prevention with hypercalciuria (off-label / selected)", "moderate", false)],
      adverse: [
        ae("Hypokalemia, hyponatremia", "common"),
        ae("Hyperuricemia / gout flare", "moderate"),
        ae("Hyperglycemia / lipid changes", "moderate", "moderate"),
        ae("Photosensitivity / rare severe skin reactions", "moderate"),
        ae("Dehydration / hypotension", "moderate"),
      ],
      warnings: [
        warn("precaution", "Severe hyponatremia risk (esp. elderly women)", "major", "Monitor electrolytes."),
        warn("precaution", "Gout / sulfonamide allergy history", "moderate", "Clinical judgment."),
        warn("warning", "Anuria", "major", "Contraindicated."),
      ],
      special: { pregnancy: "Not first-line for pregnancy hypertension.", lactation: "May reduce milk volume — discuss.", renal: "Less effective at low GFR; metolazone sometimes used.", geriatric: "Hyponatremia risk high." },
      monitoring: ["Electrolytes", "Renal function", "Uric acid / glucose as indicated", "BP"],
      sourceKeys: ["dailymed", "aha_hypertension", "nice", "ema"],
    },
  },
  loop: {
    match: (m) => /loop diuretic/i.test(m.drugClass) || /furosemide|bumetanide|torsemide|ethacrynic/i.test(m.genericName),
    patch: {
      indications: [ind("Edema due to HF / cirrhosis / renal disease"), ind("Acute pulmonary edema"), ind("Hypertension (selected — not usually first-line)", "moderate"), ind("Hypercalcemia adjunct (off-label contexts)", "moderate", false)],
      adverse: [
        ae("Electrolyte depletion (K+, Mg2+, Na+)", "common"),
        ae("Dehydration / prerenal azotemia", "serious"),
        ae("Ototoxicity (high doses / rapid IV)", "serious", "moderate"),
        ae("Hyperuricemia", "moderate"),
        ae("Hypotension", "moderate"),
      ],
      warnings: [
        warn("warning", "Profound diuresis / electrolyte loss", "major", "Monitor closely."),
        warn("precaution", "Aminoglycoside co-use", "moderate", "Ototoxicity/nephrotoxicity potentiation."),
        warn("precaution", "Sulfa allergy (most loops)", "moderate", "Ethacrynic acid alternative rarely used."),
      ],
      special: { pregnancy: "Use only if clearly needed.", lactation: "Discuss — may suppress lactation.", renal: "Higher doses often needed in CKD.", hepatic: "Risk of precipitating hepatic encephalopathy with overdiuresis." },
      monitoring: ["Daily weights", "Electrolytes", "Renal function", "BP"],
      sourceKeys: ["dailymed", "esc_hf", "nice", "ema"],
    },
  },
  mra: {
    match: (m) => /mineralocorticoid|spironolactone|eplerenone|finerenone/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("HFrEF / HF outcome benefit as labeled"), ind("Resistant hypertension / primary aldosteronism"), ind("Edema / ascites in cirrhosis (spironolactone)", "high"), ind("Acne / hirsutism (spironolactone off-label)", "moderate", false)],
      adverse: [
        ae("Hyperkalemia", "serious"),
        ae("Gynecomastia / menstrual irregularities (spironolactone)", "common"),
        ae("Dizziness / hypotension", "common", "moderate"),
        ae("Renal function decline", "moderate"),
      ],
      warnings: [
        warn("contraindication", "Hyperkalemia / Addison disease (spironolactone)", "major", "See label."),
        warn("warning", "ACEI/ARB/ARNI + potassium combinations", "major", "Hyperkalemia — monitor."),
        warn("precaution", "Pregnancy (anti-androgenic effects of spironolactone)", "major", "Avoid."),
      ],
      special: { pregnancy: "Avoid spironolactone.", lactation: "Discuss.", renal: "Dose adjust / avoid in advanced CKD per product.", geriatric: "Hyperkalemia risk." },
      monitoring: ["Potassium", "Creatinine", "BP"],
      sourceKeys: ["dailymed", "esc_hf", "aha_hypertension", "ema"],
    },
  },
  insulin: {
    match: (m) => /insulin/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Type 1 diabetes mellitus"), ind("Type 2 diabetes when insulin required"), ind("Gestational diabetes / pregnancy diabetes (selected)", "high"), ind("Hyperkalemia acute management (IV regular insulin protocols)", "moderate", true, "Hospital protocols")],
      adverse: [
        ae("Hypoglycemia", "serious", "high", "Primary dose-limiting risk"),
        ae("Weight gain", "common"),
        ae("Injection-site lipodystrophy", "common", "moderate"),
        ae("Hypokalemia (esp. IV)", "serious", "moderate"),
        ae("Allergic reactions (rare with human/analogue insulins)", "serious", "low"),
      ],
      warnings: [
        warn("warning", "Hypoglycemia unawareness / driving safety", "major", "Educate on recognition and treatment."),
        warn("warning", "Dosing errors / mix-ups between insulin products", "major", "High-alert medication."),
        warn("precaution", "Renal/hepatic impairment", "moderate", "Increased hypo risk."),
      ],
      special: { pregnancy: "Insulin is standard when pharmacotherapy needed.", lactation: "Compatible.", renal: "Lower requirements often.", geriatric: "Hypoglycemia risk — simplify regimens." },
      monitoring: ["Glucose / CGM / HbA1c", "Hypoglycemia frequency", "Injection sites", "Ketones when indicated"],
      sourceKeys: ["dailymed", "ada_diabetes", "nice", "ema", "who"],
    },
  },
  tetracycline: {
    match: (m) => /tetracycline/i.test(m.drugClass) || /doxycycline|minocycline|tetracycline|tigecycline/i.test(m.genericName),
    patch: {
      indications: [ind("Respiratory / skin infections as labeled"), ind("Acne (selected)"), ind("Lyme / rickettsial / atypical infections"), ind("STI regimens (e.g., chlamydia — doxycycline)", "high"), ind("Malaria prophylaxis (doxycycline)", "high")],
      adverse: [
        ae("Photosensitivity", "common"),
        ae("GI upset / esophagitis", "common"),
        ae("Tooth discoloration / bone effects in children / pregnancy (class)", "serious", "high", "Generally avoid in 2nd/3rd trimester and young children for tooth risk — doxycycline nuances exist in short courses per some guidelines"),
        ae("Intracranial hypertension (rare)", "serious", "moderate"),
        ae("Hepatotoxicity (rare)", "serious", "low"),
      ],
      warnings: [
        warn("warning", "Pregnancy / children <8 years (class concerns)", "major", "Tooth/bone effects — see current guideline exceptions for doxycycline short courses."),
        warn("warning", "Esophagitis — take with water, remain upright", "moderate", "Counseling point."),
        warn("precaution", "Photosensitivity", "moderate", "Sun protection."),
      ],
      special: { pregnancy: "Generally avoid; discuss exceptions.", lactation: "Short doxycycline courses sometimes acceptable — discuss.", renal: "Doxycycline preferred among tetracyclines in renal impairment." },
      monitoring: ["Sun exposure counseling", "Pill esophagitis prevention"],
      sourceKeys: ["dailymed", "cdc_stis", "ema", "nice", "bnf"],
    },
  },
  sulfa_abx: {
    match: (m) => /sulfonamide antibiotic|trimethoprim\/sulfamethoxazole|co-trimoxazole/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("UTI"), ind("Pneumocystis jirovecii prophylaxis/treatment"), ind("MRSA skin infections (selected)", "moderate"), ind("Travelers diarrhea / other labeled infections", "moderate")],
      adverse: [
        ae("Rash / photosensitivity", "common"),
        ae("Severe cutaneous reactions (SJS/TEN)", "serious"),
        ae("Hyperkalemia (trimethoprim component)", "serious", "moderate"),
        ae("Bone marrow suppression / cytopenias", "serious", "moderate"),
        ae("Hepatitis / aseptic meningitis (rare)", "serious", "low"),
      ],
      warnings: [
        warn("contraindication", "Sulfa allergy / late pregnancy / marked hepatic failure (selected)", "major", "See label."),
        warn("warning", "Methotrexate interaction / warfarin potentiation", "major", "Clinically important."),
        warn("precaution", "G6PD deficiency", "moderate", "Hemolysis risk."),
      ],
      special: { pregnancy: "Avoid near term (kernicterus risk with sulfa); earlier pregnancy risk–benefit.", renal: "Dose adjust.", geriatric: "Hyperkalemia / renal risk." },
      monitoring: ["CBC with prolonged courses", "Potassium / creatinine", "Rash vigilance"],
      sourceKeys: ["dailymed", "ema", "nice", "bnf"],
    },
  },
  saba: {
    match: (m) => /saba|salbutamol|albuterol|levalbuterol|terbutaline/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Acute bronchospasm relief (asthma/COPD)"), ind("Exercise-induced bronchospasm prevention"), ind("Hyperkalemia acute shift (nebulized/IV protocols — off-label ED use)", "moderate", false)],
      adverse: [ae("Tremor, tachycardia, palpitations", "common"), ae("Nervousness / headache", "common"), ae("Hypokalemia / lactic acidosis with high doses", "serious", "moderate"), ae("Paradoxical bronchospasm (rare)", "serious", "low")],
      warnings: [
        warn("warning", "Increasing rescue use signals uncontrolled disease", "major", "Escalate controller therapy per GINA/GOLD."),
        warn("precaution", "Cardiovascular disease", "moderate", "Tachycardia/arrhythmia risk."),
      ],
      special: { pregnancy: "SABA rescue commonly used when needed.", lactation: "Compatible." },
      monitoring: ["Rescue frequency", "Inhaler technique", "HR with high-dose nebulization"],
      sourceKeys: ["dailymed", "gina_asthma", "gold_copd", "nice"],
    },
  },
  lama: {
    match: (m) => /lama|tiotropium|umeclidinium|glycopyrronium|aclidinium/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("COPD maintenance"), ind("Asthma maintenance (tiotropium Respimat — labeled)", "high")],
      adverse: [ae("Dry mouth", "common"), ae("Urinary retention (caution in BPH)", "moderate"), ae("Glaucoma precipitation if mist in eyes", "serious", "moderate"), ae("Paradoxical bronchospasm (rare)", "serious", "low")],
      warnings: [warn("warning", "Not for acute rescue", "major", "Maintenance only."), warn("precaution", "Narrow-angle glaucoma / urinary retention", "moderate", "Anticholinergic effects.")],
      monitoring: ["Exacerbation rate", "Inhaler technique"],
      sourceKeys: ["dailymed", "gold_copd", "gina_asthma", "nice"],
    },
  },
  ltra: {
    match: (m) => /leukotriene|montelukast|zafirlukast/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Asthma maintenance (not acute rescue)"), ind("Exercise-induced bronchoconstriction prevention"), ind("Allergic rhinitis (selected)")],
      adverse: [ae("Headache, abdominal pain", "common", "moderate"), ae("Neuropsychiatric events (agitation, depression, suicidal thoughts)", "serious", "high", "Boxed warning")],
      warnings: [warn("boxed", "Serious neuropsychiatric events", "major", "FDA boxed warning — counsel patients/caregivers; reconsider if psychiatric symptoms emerge."), warn("warning", "Not for status asthmaticus", "major", "Controller only.")],
      special: { pregnancy: "Discuss; often continued if benefit clear.", lactation: "Limited data — discuss.", pediatric: "Neuropsychiatric monitoring important." },
      monitoring: ["Mood / behavior changes", "Asthma control"],
      whyStillPrescribed: "Oral non-steroid option for asthma/allergic rhinitis; use individualized after neuropsychiatric risk counseling.",
      sourceKeys: ["dailymed", "fda", "gina_asthma", "nice", "ema"],
    },
  },
  gabapentinoid: {
    match: (m) => /gabapentinoid|gabapentin|pregabalin/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Neuropathic pain (product-specific)"), ind("Partial seizures adjunct (gabapentin/pregabalin)"), ind("Fibromyalgia (pregabalin — labeled US)", "high"), ind("Generalized anxiety (pregabalin — licensed some regions)", "moderate", true, "Jurisdiction-specific"), ind("Perioperative pain / off-label uses", "moderate", false)],
      adverse: [ae("Dizziness, somnolence, ataxia", "common"), ae("Peripheral edema / weight gain", "common"), ae("Respiratory depression risk with opioids", "serious"), ae("Misuse / dependence potential", "serious", "moderate"), ae("Suicidal thoughts (antiepileptic class warning)", "serious", "moderate")],
      warnings: [
        warn("warning", "CNS depression with opioids", "major", "Serious breathing problems — FDA warnings."),
        warn("warning", "Abrupt discontinuation", "moderate", "Seizure risk in epilepsy; withdrawal symptoms."),
        warn("precaution", "Renal impairment", "moderate", "Renally cleared — adjust dose."),
      ],
      special: { pregnancy: "Risk–benefit; possible neonatal risks.", renal: "Mandatory dose adjustment.", geriatric: "Fall risk." },
      monitoring: ["Sedation / falls", "Renal dosing", "Misuse risk"],
      withdrawal: "Taper — insomnia, nausea, anxiety, pain rebound, seizures in epilepsy patients possible.",
      sourceKeys: ["dailymed", "fda", "ema", "nice", "bnf"],
    },
  },
  digoxin: {
    match: (m) => /digoxin/i.test(m.genericName),
    patch: {
      indications: [ind("Heart failure rate/symptom adjunct (selected patients)"), ind("Rate control in atrial fibrillation")],
      adverse: [ae("Nausea, anorexia, visual changes (toxicity)", "serious"), ae("Arrhythmias including bradycardia / VT (toxicity)", "serious"), ae("Gynecomastia (chronic)", "moderate", "low")],
      warnings: [warn("warning", "Narrow therapeutic index", "major", "Toxicity risk with renal impairment, hypokalemia, drug interactions."), warn("warning", "Amiodarone / verapamil / macrolides raise levels", "major", "Dose adjust / monitor.")],
      special: { pregnancy: "May be used when needed — monitor.", renal: "Major determinant of clearance — adjust.", geriatric: "High toxicity risk." },
      monitoring: ["Digoxin level when indicated", "Electrolytes (K+, Mg2+)", "Renal function", "HR"],
      sourceKeys: ["dailymed", "esc_hf", "ema", "bnf"],
    },
  },
  amiodarone: {
    match: (m) => /amiodarone/i.test(m.genericName),
    patch: {
      indications: [ind("Life-threatening ventricular arrhythmias"), ind("Atrial arrhythmias rate/rhythm control (common use; risk–benefit)", "moderate", true, "Many uses are guideline-supported but toxicity substantial")],
      adverse: [ae("Pulmonary toxicity / fibrosis", "serious"), ae("Thyroid dysfunction (hypo or hyper)", "serious"), ae("Hepatotoxicity", "serious"), ae("Corneal microdeposits / optic neuropathy", "serious", "moderate"), ae("Bradycardia / QT prolongation", "serious"), ae("Photosensitivity / blue-gray skin", "common", "moderate")],
      warnings: [warn("boxed", "Pulmonary, hepatic, and proarrhythmic toxicities", "major", "Hospitalize for loading when for life-threatening VT/VF per US label."), warn("warning", "Numerous drug interactions (warfarin, digoxin, simvastatin, etc.)", "major", "Mandatory interaction check.")],
      special: { pregnancy: "Avoid if possible — fetal harm.", lactation: "Avoid.", hepatic: "Monitor LFTs.", renal: "Minimal renal clearance but metabolites persist." },
      monitoring: ["PFTs/CXR baseline as appropriate", "LFTs", "TFTs", "ECG", "Eye symptoms", "Drug interactions"],
      whyStillPrescribed: "Highly effective antiarrhythmic for many atrial and ventricular arrhythmias despite multi-organ toxicity — used when benefits justify intensive monitoring.",
      sourceKeys: ["dailymed", "ema", "esc_hf", "fda", "bnf"],
    },
  },
  heparinish: {
    match: (m) => /heparin|enoxaparin|lmwh|dalteparin|tinzaparin|fondaparinux/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("VTE treatment and prophylaxis"), ind("ACS / procedural anticoagulation (UFH)", "high"), ind("Bridging anticoagulation contexts", "moderate")],
      adverse: [ae("Bleeding", "serious"), ae("Heparin-induced thrombocytopenia (HIT)", "serious"), ae("Osteoporosis with long UFH", "moderate", "moderate"), ae("Injection-site hematoma", "common")],
      warnings: [warn("warning", "HIT history", "major", "Avoid heparin products; use alternatives."), warn("boxed", "Spinal/epidural hematoma (LMWH)", "major", "Neuraxial timing rules."), warn("warning", "Active major bleeding", "major", "Contraindicated.")],
      special: { pregnancy: "LMWH preferred anticoagulant in many pregnancy VTE settings.", lactation: "Compatible.", renal: "LMWH accumulate — adjust/avoid; UFH often preferred in severe CKD.", geriatric: "Bleeding risk." },
      monitoring: ["Anti-Xa when indicated", "Platelets (HIT surveillance)", "CBC / bleeding", "Renal function for LMWH"],
      sourceKeys: ["dailymed", "ema", "nice", "acog", "bnf"],
    },
  },
  gout: {
    match: (m) => /allopurinol|febuxostat|colchicine|probenecid/i.test(m.genericName),
    patch: {
      indications: [ind("Gout (urate lowering or flare)", "high", true, "Agent-specific roles"), ind("Tumor lysis syndrome prevention (allopurinol)", "high"), ind("Recurrent calcium stones with hyperuricosuria (selected)", "moderate")],
      adverse: [ae("Rash / severe SCARs including DRESS/SJS (allopurinol)", "serious"), ae("GI upset / diarrhea (colchicine)", "common"), ae("Myelosuppression / myopathy (colchicine toxicity)", "serious"), ae("Liver enzyme elevations (febuxostat)", "moderate")],
      warnings: [
        warn("warning", "HLA-B*5801 risk allele (allopurinol SCARs)", "major", "Screen in high-risk ancestries per labels/guidelines."),
        warn("warning", "Colchicine–CYP3A4/P-gp inhibitor interactions", "major", "Can be fatal."),
        warn("boxed", "Febuxostat CV death warning (US)", "major", "Use limited to allopurinol-intolerant in US labeling."),
      ],
      monitoring: ["Uric acid for ULT", "Rash vigilance", "CBC/CK if colchicine toxicity risk", "LFTs"],
      sourceKeys: ["dailymed", "ema", "nice", "fda", "bnf"],
    },
  },
  triptan: {
    match: (m) => /triptan|sumatriptan|rizatriptan|eletriptan|zolmitriptan|naratriptan|frovatriptan|almotriptan/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Acute migraine treatment"), ind("Cluster headache (sumatriptan injectable — labeled)", "high")],
      adverse: [ae("Chest/throat tightness / warm sensations (triptan sensations)", "common"), ae("Dizziness, somnolence", "common"), ae("Serotonin syndrome with serotonergic drugs (rare)", "serious", "moderate"), ae("Medication-overuse headache with frequent use", "moderate")],
      warnings: [warn("contraindication", "Ischemic heart disease / uncontrolled HTN / stroke history / significant CVD", "major", "Vasoconstrictive risk."), warn("contraindication", "Ergotamine coadministration within 24h", "major", "See label."), warn("warning", "Limit frequency to avoid medication-overuse headache", "moderate", "Guideline counseling.")],
      special: { pregnancy: "Limited data — discuss non-drug options and alternatives.", lactation: "Sumatriptan often considered compatible with timing — discuss." },
      monitoring: ["CV risk screening before use", "Attack frequency / overuse"],
      sourceKeys: ["dailymed", "nice", "ema", "bnf"],
    },
  },
  ondansetron: {
    match: (m) => /ondansetron|granisetron|palonosetron|dolasetron/i.test(m.genericName),
    patch: {
      indications: [ind("Chemotherapy-induced nausea/vomiting"), ind("Postoperative nausea/vomiting"), ind("Radiotherapy-associated nausea", "moderate"), ind("Pregnancy nausea (off-label common; risk debates)", "moderate", false)],
      adverse: [ae("Headache, constipation", "common"), ae("QT prolongation", "serious", "moderate"), ae("Serotonin syndrome with other serotonergic agents (rare)", "serious", "low")],
      warnings: [warn("warning", "QT prolongation — avoid in congenital long QT; caution with other QT drugs", "major", "FDA warning."), warn("precaution", "Hepatic impairment dose limits", "moderate", "See label.")],
      special: { pregnancy: "Used off-label frequently; discuss evolving evidence on possible small risk signals vs benefit.", hepatic: "Dose adjust in severe impairment." },
      monitoring: ["ECG if high risk", "Bowel function"],
      sourceKeys: ["dailymed", "fda", "ema", "bnf"],
    },
  },
  h2ra: {
    match: (m) => /h2-receptor|famotidine|cimetidine|nizatidine|ranitidine/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("GERD / heartburn"), ind("Peptic ulcer disease"), ind("Stress ulcer prophylaxis (ICU protocols — selected)", "moderate")],
      adverse: [ae("Headache, constipation/diarrhea", "common", "moderate"), ae("CNS effects in elderly / renal impairment (confusion)", "moderate"), ae("Rare blood dyscrasias", "serious", "low")],
      warnings: [warn("warning", "Ranitidine withdrawn due to NDMA impurity concerns", "major", "Historical — do not use ranitidine products."), warn("precaution", "Renal impairment", "moderate", "Dose adjust famotidine.")],
      special: { pregnancy: "Often considered when acid suppression needed.", renal: "Adjust dose.", geriatric: "CNS effects." },
      monitoring: ["Renal dosing", "Symptom control / deprescribe if possible"],
      whyStillPrescribed: "H2RAs remain options for milder acid symptoms or when PPIs not tolerated; less potent for erosive disease.",
      sourceKeys: ["dailymed", "fda", "ema", "nice"],
    },
  },
  methotrexate: {
    match: (m) => /methotrexate/i.test(m.genericName),
    patch: {
      indications: [ind("Rheumatoid arthritis (low-dose weekly)"), ind("Psoriasis / psoriatic arthritis"), ind("Oncology indications (higher doses — different protocols)", "high"), ind("Ectopic pregnancy medical management (specialist)", "high")],
      adverse: [ae("Nausea, stomatitis, fatigue", "common"), ae("Hepatotoxicity", "serious"), ae("Myelosuppression", "serious"), ae("Pneumonitis", "serious"), ae("Teratogenicity / embryotoxicity", "serious"), ae("Nephrotoxicity (esp. high dose)", "serious")],
      warnings: [
        warn("boxed", "Embryo-fetal toxicity; hypersensitivity; bone marrow/liver/lung/kidney toxicity; Pneumocystis risk with concomitant immunosuppressants", "major", "Weekly dosing errors can be fatal — clarify schedule."),
        warn("warning", "NSAIDs / trimethoprim-sulfa / PPI interactions (toxicity risk)", "major", "Monitor closely."),
        warn("contraindication", "Pregnancy (rheumatology dosing)", "major", "Effective contraception required."),
      ],
      special: { pregnancy: "Contraindicated for rheumatologic use — teratogen.", lactation: "Avoid.", renal: "Reduce/avoid — cleared renally.", hepatic: "Monitor LFTs; caution alcohol." },
      monitoring: ["CBC", "LFTs", "Creatinine", "Chest symptoms", "Pregnancy prevention"],
      whyStillPrescribed: "Anchor DMARD for RA with extensive efficacy evidence when monitored; toxicity is significant but manageable with protocols and folic acid co-therapy.",
      sourceKeys: ["dailymed", "fda", "ema", "nice", "bnf"],
    },
  },
  bisphosphonate: {
    match: (m) => /bisphosphonate|alendronate|risedronate|zoledronic|ibandronate/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Osteoporosis treatment/prevention as labeled"), ind("Paget disease of bone"), ind("Hypercalcemia of malignancy / oncology bone mets (IV agents)", "high")],
      adverse: [ae("Esophagitis / dyspepsia (oral)", "common"), ae("Acute phase reaction (IV)", "common"), ae("Osteonecrosis of the jaw (rare)", "serious"), ae("Atypical femoral fractures (long-term)", "serious", "moderate"), ae("Hypocalcemia", "moderate")],
      warnings: [warn("warning", "Strict administration instructions for oral agents", "major", "Reduce esophagitis risk."), warn("precaution", "Dental disease / invasive dental procedures", "moderate", "ONJ risk counseling."), warn("contraindication", "Esophageal abnormalities / inability to sit upright / hypocalcemia (oral)", "major", "See label.")],
      special: { pregnancy: "Avoid.", renal: "Avoid below CrCl thresholds (product-specific).", geriatric: "Fall/fracture benefit often clear if selected well." },
      monitoring: ["Calcium / vitamin D repletion", "Dental health", "Need for drug holiday after multi-year oral therapy (individualized)"],
      sourceKeys: ["dailymed", "nice", "ema", "fda"],
    },
  },
  pde5: {
    match: (m) => /pde5|sildenafil|tadalafil|vardenafil|avanafil/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Erectile dysfunction"), ind("Pulmonary arterial hypertension (specific products/doses)"), ind("BPH (tadalafil daily — labeled)", "high")],
      adverse: [ae("Headache, flushing, dyspepsia", "common"), ae("Nasal congestion, visual color changes (sildenafil)", "common", "moderate"), ae("Hypotension / syncope especially with nitrates", "serious"), ae("NAION / sudden hearing loss (rare)", "serious", "low"), ae("Priapism (rare)", "serious", "low")],
      warnings: [warn("contraindication", "Nitrate therapy", "major", "Profound hypotension — absolute contraindication."), warn("warning", "Alpha-blocker hypotension risk", "moderate", "Timing/separation counseling."), warn("warning", "CV status assessment before ED therapy", "moderate", "Sexual activity itself has CV demand.")],
      special: { pregnancy: "PAH indications may apply in specialist care — product-specific.", hepatic: "Dose adjust.", renal: "Dose adjust some agents." },
      monitoring: ["BP / nitrate history always", "Vision/hearing acute changes"],
      sourceKeys: ["dailymed", "ema", "nice", "fda"],
    },
  },
  nitrate: {
    match: (m) => /nitrate|nitroglycerin|glyceryl trinitrate|isosorbide/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Angina relief / prophylaxis"), ind("Acute coronary syndromes adjunct"), ind("Hypertensive emergencies / HF (selected IV)", "moderate")],
      adverse: [ae("Headache", "common"), ae("Hypotension / syncope", "serious"), ae("Reflex tachycardia", "moderate"), ae("Tolerance with continuous exposure", "moderate")],
      warnings: [warn("contraindication", "PDE5 inhibitors", "major", "Life-threatening hypotension."), warn("contraindication", "Severe hypotension / right ventricular infarct caution", "major", "Hemodynamic risk."), warn("warning", "Need nitrate-free interval to reduce tolerance (chronic)", "moderate", "Labeling regimens.")],
      monitoring: ["BP", "Headache management", "PDE5 washout timing"],
      sourceKeys: ["dailymed", "ema", "nice", "aha_hypertension"],
    },
  },
  atypical_antipsych: {
    match: (m) => /atypical antipsychotic|quetiapine|olanzapine|risperidone|aripiprazole|ziprasidone|lurasidone|paliperidone|clozapine/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Schizophrenia"), ind("Bipolar mania/depression (product-specific)"), ind("Adjunct MDD (selected agents)", "moderate"), ind("Off-label insomnia / agitation (common but cautioned)", "low", false, "Risks often outweigh for primary insomnia")],
      adverse: [ae("Sedation, dry mouth, constipation", "common"), ae("Weight gain / metabolic syndrome", "serious"), ae("Extrapyramidal symptoms / akathisia", "moderate"), ae("QT prolongation (selected agents)", "serious", "moderate"), ae("Orthostatic hypotension", "moderate"), ae("Tardive dyskinesia (long-term)", "serious"), ae("Neuroleptic malignant syndrome (rare)", "serious", "low")],
      warnings: [
        warn("boxed", "Increased mortality in elderly with dementia-related psychosis", "major", "Not approved for dementia psychosis."),
        warn("boxed", "Suicidality for antidepressants when used in young (adjunct contexts)", "major", "See labels."),
        warn("warning", "Metabolic monitoring required", "major", "Weight, glucose, lipids."),
      ],
      special: { pregnancy: "Specialist risk–benefit.", lactation: "Agent-specific.", geriatric: "Avoid in dementia-related psychosis generally." },
      monitoring: ["Weight / BMI", "Fasting glucose / HbA1c", "Lipids", "AIMS for TD", "BP / sedation"],
      withdrawal: "Taper to reduce rebound insomnia/agitation; cholinergic rebound possible with some agents.",
      whyStillPrescribed: "Core treatments for psychotic and bipolar disorders despite metabolic and mortality warnings in elderly dementia; indication discipline matters.",
      sourceKeys: ["dailymed", "fda", "ema", "nice", "bnf"],
    },
  },
  mood_anticonvulsant: {
    match: (m) => /mood stabilizer|anticonvulsant|lithium|valproate|carbamazepine|lamotrigine|oxcarbazepine/i.test(m.drugClass + m.genericName),
    patch: {
      indications: [ind("Bipolar disorder (agent-specific roles)"), ind("Epilepsy / seizure disorders as labeled"), ind("Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)", "moderate"), ind("Neuropathic pain (selected anticonvulsants)", "moderate")],
      adverse: [ae("Tremor, thirst, polyuria (lithium)", "common"), ae("Weight gain / tremor / hair loss (valproate)", "common"), ae("Rash / SJS-TEN risk (lamotrigine, carbamazepine)", "serious"), ae("Teratogenicity (valproate highest concern; carbamazepine/lithium also)", "serious"), ae("Hyponatremia (carbamazepine/oxcarbazepine)", "serious", "moderate"), ae("Agranulocytosis / aplastic anemia (carbamazepine rare)", "serious", "low")],
      warnings: [
        warn("boxed", "Valproate — hepatotoxicity, pancreatitis, fetal risk", "major", "Pregnancy prevention programs in UK/EU; avoid in WOCBP unless no alternative."),
        warn("boxed", "Lithium — toxicity; monitoring required", "major", "Narrow therapeutic index."),
        warn("boxed", "Lamotrigine / carbamazepine — serious rash", "major", "Slow titration; HLA-B*1502 screening in at-risk ancestries for carbamazepine."),
      ],
      special: { pregnancy: "Specialist care essential — valproate strongly restricted.", lactation: "Agent-specific.", renal: "Lithium heavily renal — caution.", hepatic: "Valproate hepatic risk." },
      monitoring: ["Drug levels (lithium/valproate/carbamazepine)", "LFTs / CBC", "Pregnancy prevention", "Sodium (CBZ)", "TSH/renal for lithium"],
      withdrawal: "Do not stop anticonvulsants abruptly — seizure risk; mood relapse risk in bipolar.",
      sourceKeys: ["dailymed", "mhra", "ema", "nice", "fda", "bnf"],
    },
  },
});

export { CLASS_TEMPLATES };
