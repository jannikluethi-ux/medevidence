# MedEvidence content audit — 2026-10-05

Audit of every medicine seed entry for class-template contamination, wrong indications, jurisdiction boilerplate, and placeholder adverse effects.

## Summary counts

- **medicines_audited**: 284
- **medicines_changed**: 201
- **indications_removed_or_corrected**: 921
- **boilerplate_regulatory_removed**: 198
- **placeholders_replaced_with_label_aes**: 65
- **placeholders_marked_unreviewed**: 0
- **condition_links_dropped**: 3
- **full_indication_overrides_applied**: 165

## Pre-fix suspicious patterns

- Shared identical indication list in class 'Proton pump inhibitor (PPI)' across ['Pantoprazole', 'Esomeprazole']
- Shared identical indication list in class 'Proton pump inhibitor (PPI)' across ['Lansoprazole', 'Rabeprazole', 'Dexlansoprazole']
- Shared identical indication list in class 'NSAID' across ['Diclofenac', 'Celecoxib', 'Meloxicam', 'Indomethacin', 'Ketorolac']
- Shared identical indication list in class 'Dihydropyridine calcium channel blocker' across ['Nifedipine', 'Felodipine']
- Shared identical indication list in class 'ACE inhibitor' across ['Enalapril', 'Perindopril', 'Benazepril']
- Shared identical indication list in class 'Angiotensin II receptor blocker (ARB)' across ['Valsartan', 'Olmesartan', 'Telmisartan']
- Shared identical indication list in class 'Loop diuretic' across ['Bumetanide', 'Torsemide']
- Shared identical indication list in class 'SGLT2 inhibitor' across ['Dapagliflozin', 'Canagliflozin']
- Shared identical indication list in class 'GLP-1 receptor agonist' across ['Liraglutide', 'Dulaglutide']
- Shared identical indication list in class 'HMG-CoA reductase inhibitor (statin)' across ['Pravastatin', 'Lovastatin', 'Pitavastatin']
- Shared identical indication list in class 'SSRI' across ['Citalopram', 'Paroxetine']
- Shared identical indication list in class 'SNRI' across ['Duloxetine', 'Desvenlafaxine']
- Shared identical indication list in class 'Fluoroquinolone antibiotic' across ['Moxifloxacin', 'Ofloxacin']
- Shared identical indication list in class 'Inhaled corticosteroid' across ['Budesonide (inhaled)', 'Beclomethasone (inhaled)']
- Shared identical indication list in class 'Systemic corticosteroid' across ['Methylprednisolone', 'Dexamethasone']
- Shared identical indication list in class 'Second-generation H1 antihistamine' across ['Fexofenadine', 'Desloratadine', 'Levocetirizine']
- Shared identical indication list in class 'P2Y12 inhibitor antiplatelet' across ['Prasugrel', 'Ticagrelor']
- Shared identical indication list in class 'Benzodiazepine' across ['Lorazepam', 'Alprazolam', 'Temazepam']
- Shared identical indication list in class 'Non-benzodiazepine hypnotic (Z-drug)' across ['Zolpidem', 'Zopiclone']
- Shared identical indication list in class 'Atypical antipsychotic' across ['Olanzapine', 'Risperidone']
- Shared identical indication list in class 'Thiazide-like diuretic' across ['Chlorthalidone', 'Indapamide']
- Shared identical indication list in class 'Opioid analgesic' across ['Oxycodone', 'Hydrocodone', 'Hydromorphone', 'Fentanyl']

## Known examples — before / after

### Loperamide

- **Before indications**: ['Acute nonspecific diarrhea', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)']
- **After indications**: ['Acute nonspecific diarrhea', 'Chronic diarrhea associated with inflammatory bowel disease (adjunct)']
- **Other fixes**: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified; Removed opioid monitoring items; kept ['(none — set drug-specific)']; Retained gut/cardiac-risk AEs; removed systemic opioid template AEs; Adjusted warnings toward labeled cardiac high-dose risk and appropriate use limits

### Naloxone

- **Before indications**: ['Known/suspected opioid overdose', 'Take-home naloxone harm reduction', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)']
- **After indications**: ['Known or suspected opioid overdose (emergency reversal)', 'Take-home naloxone for opioid overdose risk reduction']
- **Other fixes**: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified; Removed opioid monitoring items; kept ['(none — set drug-specific)']; Set antagonist-appropriate adverse effects and monitoring

### Colchicine

- **Before indications**: ['Acute gout; prophylaxis', 'Familial Mediterranean fever', 'Gout (urate lowering or flare)', 'Tumor lysis syndrome prevention (allopurinol)', 'Recurrent calcium stones with hyperuricosuria (selected)']
- **After indications**: ['Acute gout flares', 'Prophylaxis of gout flares', 'Familial Mediterranean fever', 'Cardiovascular risk reduction in selected coronary disease patients (low-dose — product-specific)']
- **Other fixes**: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified; Set to ['CBC/CK if colchicine toxicity risk', 'LFTs']; Removed allopurinol-specific AEs; ensured colchicine-relevant AEs; Dropped link

### Zolpidem

- **Before indications**: ['Short-term insomnia', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)']
- **After indications**: ['Short-term treatment of insomnia (sleep onset; some formulations also maintenance)']
- **Other fixes**: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified; Limited to insomnia-labeled use; removed seizure/alcohol/spasm framing; Dropped link

### Dexlansoprazole

- **Before indications**: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)']
- **After indications**: ['Gastroesophageal reflux disease (GERD)', 'Healing of erosive esophagitis', 'Maintenance of healed erosive esophagitis', 'Heartburn associated with non-erosive GERD']
- **Other fixes**: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified; Removed placeholders; retained class/label adverse effects already present

### Bumetanide

- **Before indications**: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Edema due to HF / cirrhosis / renal disease', 'Acute pulmonary edema', 'Hypertension (selected — not usually first-line)', 'Hypercalcemia adjunct (off-label contexts)']
- **After indications**: ['Edema associated with congestive heart failure', 'Edema associated with hepatic disease', 'Edema associated with renal disease (including nephrotic syndrome)']
- **Other fixes**: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified; Removed placeholders; retained class/label adverse effects already present


## Needs review

- (none flagged beyond items already corrected with conservative removals)


## Per-medicine findings and fixes

### Aciclovir (Acyclovir)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Alendronate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Osteoporosis treatment/prevention as labeled', 'Paget disease of bone', 'Hypercalcemia of malignancy / oncology bone mets (IV agents)'] → After: ['Osteoporosis treatment/prevention as labeled', 'Paget disease of bone']

### Allopurinol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Chronic gout / hyperuricemia', 'Tumor lysis prevention (selected)', 'Gout (urate lowering or flare)', 'Tumor lysis syndrome prevention (allopurinol)', 'Recurrent calcium stones with hyperuricosuria (selected)'] → After: ['Chronic gout / hyperuricemia', 'Tumor lysis syndrome prevention (selected oncology protocols)', 'Recurrent calcium stones with hyperuricosuria (selected)']

### Alprazolam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Anxiety disorders (short-term)', 'Panic disorder (with or without agoraphobia)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Amiodarone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Life-threatening ventricular arrhythmias', 'Atrial arrhythmias rate/rhythm control (common use; risk–benefit)'] → After: ['Life-threatening ventricular arrhythmias', 'Atrial arrhythmias rate/rhythm control']

### Amlodipine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Chronic stable angina (as labeled)', 'Angina (chronic stable / vasospastic — product-specific)', 'Raynaud phenomenon (often off-label)'] → After: ['Hypertension', 'Chronic stable angina / vasospastic angina (as labeled)']

### Amoxicillin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Amoxicillin/clavulanate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Amphetamine salts (mixed)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Apixaban

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['NVAF — stroke prevention', 'DVT/PE treatment and recurrence reduction', 'Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE', 'Secondary prevention of recurrent VTE', 'VTE prophylaxis after hip/knee replacement (product-specific)', 'CAD/PAD risk reduction (rivaroxaban low-dose regimens — labeled)'] → After: ['Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE and reduction of recurrence', 'VTE prophylaxis after hip/knee replacement (as labeled)']

### Aripiprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Schizophrenia', 'Bipolar I', 'Adjunct MDD', 'Irritability in autistic disorder (pediatric labeled)', 'Tourette disorder (labeled)', 'Bipolar mania/depression (product-specific)', 'Adjunct MDD (selected agents)', 'Off-label insomnia / agitation (common but cautioned)'] → After: ['Schizophrenia', 'Bipolar I', 'Adjunct MDD', 'Irritability in autistic disorder (pediatric labeled)', 'Tourette disorder (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Aspirin (low-dose / antiplatelet)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Secondary prevention after MI/ischemic stroke/ASCVD', 'Pain/fever (higher doses)', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)', 'Secondary prevention after ACS / stent / ischemic stroke or TIA (as labeled)', 'PAD symptomatic management (selected)', 'Primary prevention only in selected higher-risk patients (aspirin) — guideline-narrowed'] → After: ['Secondary prevention after MI / ischemic stroke / ASCVD', 'Pain/fever (higher doses)', 'Acute coronary syndromes (chewed/loading dose protocols)']

### Atenolol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Angina', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)', 'Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)'] → After: ['Hypertension', 'Angina pectoris', 'Post-MI (as labeled)']

### Atomoxetine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['ADHD (children/adults as labeled)', 'Additional labeled / guideline uses — see SmPC/PI'] → After: ['ADHD (children/adults as labeled)']

### Atorvastatin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Familial hypercholesterolemia (hetero/homo — product-specific)', 'Prevention of cardiovascular events', 'Primary hyperlipidemia / mixed dyslipidemia', 'Atherosclerotic cardiovascular disease risk reduction / secondary prevention', 'Primary prevention in elevated CV risk as labeled/guideline-supported', 'Primary prevention in diabetes / elevated risk as labeled/guidelines', 'Secondary prevention post-ACS'] → After: ['Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (hetero/homo — as labeled)', 'Prevention of cardiovascular events in high-risk patients']

### Azathioprine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Azithromycin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Aztreonam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Beclomethasone (inhaled)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Asthma maintenance', 'COPD (selected ICS-containing regimens — not monotherapy first-line)', 'Allergic rhinitis (intranasal formulations — related products)'] → After: ['Asthma maintenance']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Benazepril

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Heart failure with reduced ejection fraction (as labeled)', 'Post-myocardial infarction / CV risk reduction (product-specific)', 'Diabetic nephropathy / CKD with albuminuria (selected ACEIs)'] → After: ['Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Bisoprolol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Chronic heart failure', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)', 'Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)'] → After: ['Hypertension', 'Chronic heart failure (HFrEF)', 'Angina pectoris']

### Budesonide (inhaled)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Asthma maintenance', 'COPD (selected ICS-containing regimens — not monotherapy first-line)', 'Allergic rhinitis (intranasal formulations — related products)'] → After: ['Asthma maintenance']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Budesonide/formoterol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Asthma maintenance (and MART where licensed)', 'COPD', 'COPD (selected ICS-containing regimens — not monotherapy first-line)', 'Allergic rhinitis (intranasal formulations — related products)'] → After: ['Asthma maintenance (and MART where licensed)', 'COPD (as labeled)']

### Bumetanide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Edema due to HF / cirrhosis / renal disease', 'Acute pulmonary edema', 'Hypertension (selected — not usually first-line)', 'Hypercalcemia adjunct (off-label contexts)'] → After: ['Edema associated with congestive heart failure', 'Edema associated with hepatic disease', 'Edema associated with renal disease (including nephrotic syndrome)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Buprenorphine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Opioid use disorder', 'Moderate-severe pain (selected formulations)', 'Neonatal opioid withdrawal protocols (off-label/specialist)', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Opioid use disorder (maintenance / induction as labeled)', 'Moderate to severe pain (selected formulations)', 'Neonatal opioid withdrawal protocols']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Bupropion

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Canagliflozin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Type 2 diabetes mellitus', 'Heart failure (HFrEF/HFpEF — agent-specific labeled)', 'CKD / diabetic kidney disease progression risk reduction (agent-specific)', 'CV death risk reduction in T2DM with CVD (empagliflozin — labeled)'] → After: ['Type 2 diabetes mellitus', 'CV risk reduction in T2DM with established CVD / risk factors (as labeled)', 'Diabetic kidney disease progression risk reduction (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Candesartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension; HF as labeled', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)', 'Stroke risk reduction in hypertension with LVH (losartan — labeled)'] → After: ['Hypertension', 'Heart failure (as labeled)']

### Carbamazepine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Epilepsy (focal); trigeminal neuralgia', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Epilepsy (focal seizures / generalized tonic-clonic — as labeled)', 'Trigeminal neuralgia', 'Acute manic / mixed episodes in bipolar I (selected products)']

### Carvedilol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['HFrEF', 'Hypertension', 'Post-MI LV dysfunction as labeled', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)', 'Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)'] → After: ['HFrEF', 'Hypertension', 'Post-MI left ventricular dysfunction']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Ceftriaxone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Celecoxib

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Osteoarthritis', 'Rheumatoid arthritis', 'Ankylosing spondylitis', 'Acute pain / primary dysmenorrhea (as labeled)', 'Juvenile rheumatoid arthritis (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Cetirizine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Allergic rhinitis', 'Urticaria', 'Urticaria / chronic spontaneous urticaria (selected)', 'Allergic conjunctivitis symptomatic relief (selected)'] → After: ['Allergic rhinitis', 'Urticaria']

### Chlorthalidone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Edema (selected contexts)', 'Nephrolithiasis prevention with hypercalciuria (off-label / selected)'] → After: ['Hypertension', 'Edema (selected contexts)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Ciprofloxacin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Selected complicated UTI and other labeled infections', 'Complicated UTI / pyelonephritis (when appropriate)', 'Selected respiratory / skin / bone infections as labeled', 'Anthrax / plague (selected agents — labeled)', 'Uncomplicated infections only when no alternatives (per FDA safety communications)'] → After: ['Complicated UTI / pyelonephritis (when appropriate)', 'Selected susceptible infections as labeled (not first-line for uncomplicated infections)']

### Citalopram

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Major depressive disorder', 'Generalized anxiety disorder / panic disorder / social anxiety (product-specific)', 'Obsessive-compulsive disorder (selected SSRIs)', 'PTSD / PMDD (selected SSRIs as labeled)', 'Bulimia nervosa (fluoxetine — labeled)'] → After: ['Major depressive disorder']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Clarithromycin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Clindamycin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Clonazepam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Seizure disorders as labeled', 'Panic disorder', 'REM sleep behavior / akathisia (off-label)', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Seizure disorders (Lennox-Gastaut, akinetic, myoclonic — as labeled)', 'Panic disorder']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Clonidine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'ADHD (extended-release — labeled US)', 'Menopausal flushing / withdrawal adjuncts (off-label)', 'Opioid/alcohol withdrawal supportive (off-label)'] → After: ['Hypertension', 'ADHD (extended-release — labeled US)', 'Menopausal flushing / opioid withdrawal adjuncts']

### Clopidogrel

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['ACS / recent MI/stroke / PAD as labeled', 'Secondary prevention after ACS / stent / ischemic stroke or TIA (as labeled)', 'PAD symptomatic management (selected)', 'Primary prevention only in selected higher-risk patients (aspirin) — guideline-narrowed'] → After: ['ACS / recent MI / recent stroke / established PAD as labeled']

### Clozapine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Treatment-resistant schizophrenia', 'Reduction of recurrent suicidal behavior in schizophrenia/schizoaffective', 'Bipolar mania/depression (product-specific)', 'Adjunct MDD (selected agents)', 'Off-label insomnia / agitation (common but cautioned)'] → After: ['Treatment-resistant schizophrenia', 'Reduction of recurrent suicidal behavior in schizophrenia/schizoaffective disorder']

### Codeine

- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Mild to moderate pain (selected adults)', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Mild to moderate pain (selected adults)', 'Antitussive (selected products)']

### Colchicine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Acute gout; prophylaxis', 'Familial Mediterranean fever', 'Gout (urate lowering or flare)', 'Tumor lysis syndrome prevention (allopurinol)', 'Recurrent calcium stones with hyperuricosuria (selected)'] → After: ['Acute gout flares', 'Prophylaxis of gout flares', 'Familial Mediterranean fever', 'Cardiovascular risk reduction in selected coronary disease patients (low-dose — product-specific)']
- **Field**: `monitoring`
  - Problem: Allopurinol/gout-class monitoring mixed into colchicine
  - Fix: Set to ['CBC/CK if colchicine toxicity risk', 'LFTs']
- **Field**: `adverse`
  - Problem: Allopurinol-class adverse effects on colchicine
  - Fix: Removed allopurinol-specific AEs; ensured colchicine-relevant AEs
- **Field**: `condition_medications`
  - Problem: Condition link 'Gout' → indication 'Acute gout; prophylaxis' not in medication indications after fix
  - Fix: Dropped link

### Cyclosporine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Dabigatran

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE', 'Secondary prevention of recurrent VTE', 'VTE prophylaxis after hip/knee replacement (product-specific)', 'CAD/PAD risk reduction (rivaroxaban low-dose regimens — labeled)'] → After: ['Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE and reduction of recurrence', 'VTE prophylaxis after hip replacement (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Dapagliflozin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Type 2 diabetes mellitus', 'Heart failure (HFrEF/HFpEF — agent-specific labeled)', 'CKD / diabetic kidney disease progression risk reduction (agent-specific)', 'CV death risk reduction in T2DM with CVD (empagliflozin — labeled)'] → After: ['Type 2 diabetes mellitus', 'Heart failure (HFrEF and HFpEF — as labeled)', 'Chronic kidney disease (as labeled)', 'CV risk / HF hospitalization risk reduction as labeled']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Desloratadine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Allergic rhinitis', 'Urticaria / chronic spontaneous urticaria (selected)', 'Allergic conjunctivitis symptomatic relief (selected)'] → After: ['Allergic rhinitis', 'Chronic idiopathic urticaria']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Desvenlafaxine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Major depressive disorder', 'Generalized anxiety disorder (selected SNRIs)', 'Diabetic peripheral neuropathic pain / fibromyalgia / chronic musculoskeletal pain (duloxetine — labeled)', 'Panic / social anxiety (venlafaxine XR — labeled)'] → After: ['Major depressive disorder']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Dexamethasone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Inflammatory / allergic / autoimmune flares as labeled', 'Asthma / COPD exacerbations (systemic short courses)', 'Adrenal insufficiency replacement (physiologic dosing — selected agents)', 'Oncology / antiemetic adjunct / COVID protocols (context-specific)'] → After: ['Inflammatory / allergic / autoimmune conditions as labeled', 'Cerebral edema / oncology / antiemetic protocols (selected)', 'Severe COVID-19 requiring oxygen / ventilation (guideline-supported)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Dexlansoprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)'] → After: ['Gastroesophageal reflux disease (GERD)', 'Healing of erosive esophagitis', 'Maintenance of healed erosive esophagitis', 'Heartburn associated with non-erosive GERD']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Diazepam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Anxiety (short-term); alcohol withdrawal; seizures as labeled', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Anxiety disorders (short-term)', 'Acute alcohol withdrawal', 'Muscle spasm', 'Adjunct in convulsive disorders / status epilepticus (selected routes)']

### Diclofenac

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Pain (mild to moderate)', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Ankylosing spondylitis / acute migraine (selected products)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Digoxin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Heart failure (adjunct)', 'AF rate control', 'Heart failure rate/symptom adjunct (selected patients)', 'Rate control in atrial fibrillation'] → After: ['Heart failure (adjunct for rate/symptom control in selected patients)', 'Atrial fibrillation rate control']

### Diltiazem

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension; angina; AF rate control', 'Chronic stable angina', 'Rate control in atrial fibrillation/flutter', 'IV for acute rate control (selected)'] → After: ['Hypertension', 'Chronic stable angina', 'Rate control in atrial fibrillation/flutter']

### Diphenhydramine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Allergic reactions', 'Insomnia (short-term OTC — not preferred in elderly)', 'Motion sickness / antitussive combos', 'Allergic rhinitis', 'Urticaria / chronic spontaneous urticaria (selected)', 'Allergic conjunctivitis symptomatic relief (selected)'] → After: ['Allergic reactions / allergic rhinitis', 'Allergic rhinitis', 'Insomnia (short-term OTC — not preferred in elderly)', 'Motion sickness']

### Doxazosin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['BPH; hypertension', 'Hypertension (not usually first-line)', 'BPH symptoms'] → After: ['BPH symptoms', 'Hypertension (not usually first-line)']

### Doxycycline

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Dulaglutide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Type 2 diabetes mellitus', 'Chronic weight management (selected doses/products — labeled)', 'CV risk reduction in T2DM with CVD (selected agents)'] → After: ['Type 2 diabetes mellitus', 'CV risk reduction in T2DM with established CVD / multiple risk factors (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Duloxetine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Major depressive disorder', 'Generalized anxiety disorder (selected SNRIs)', 'Diabetic peripheral neuropathic pain / fibromyalgia / chronic musculoskeletal pain (duloxetine — labeled)', 'Panic / social anxiety (venlafaxine XR — labeled)'] → After: ['Major depressive disorder', 'Generalized anxiety disorder', 'Diabetic peripheral neuropathic pain', 'Fibromyalgia', 'Chronic musculoskeletal pain (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Edoxaban

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE', 'Secondary prevention of recurrent VTE', 'VTE prophylaxis after hip/knee replacement (product-specific)', 'CAD/PAD risk reduction (rivaroxaban low-dose regimens — labeled)'] → After: ['Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Empagliflozin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Type 2 diabetes mellitus', 'Heart failure (HFrEF/HFpEF — agent-specific labeled)', 'Chronic kidney disease', 'CKD / diabetic kidney disease progression risk reduction (agent-specific)', 'CV death risk reduction in T2DM with CVD (empagliflozin — labeled)'] → After: ['Type 2 diabetes mellitus', 'Heart failure (HFrEF and HFpEF — as labeled)', 'Chronic kidney disease (as labeled)', 'CV death risk reduction in T2DM with established CVD']

### Enalapril

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Heart failure with reduced ejection fraction (as labeled)', 'Post-myocardial infarction / CV risk reduction (product-specific)', 'Diabetic nephropathy / CKD with albuminuria (selected ACEIs)'] → After: ['Hypertension', 'Heart failure', 'Asymptomatic left ventricular dysfunction (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Enoxaparin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['DVT/PE treatment and prophylaxis; ACS', 'VTE treatment and prophylaxis', 'ACS / procedural anticoagulation (UFH)', 'Bridging anticoagulation contexts'] → After: ['VTE treatment and prophylaxis', 'ACS / procedural anticoagulation as labeled']

### Eplerenone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'HFrEF / HF outcome benefit as labeled', 'Resistant hypertension / primary aldosteronism', 'Edema / ascites in cirrhosis (spironolactone)', 'Acne / hirsutism (spironolactone off-label)'] → After: ['HFrEF after MI / chronic HFrEF (as labeled)', 'Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Escitalopram

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Major depressive disorder', 'Generalized anxiety disorder / panic disorder / social anxiety (product-specific)', 'Obsessive-compulsive disorder (selected SSRIs)', 'PTSD / PMDD (selected SSRIs as labeled)', 'Bulimia nervosa (fluoxetine — labeled)'] → After: ['Major depressive disorder', 'Generalized anxiety disorder']

### Esomeprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['GERD / erosive esophagitis', 'H. pylori eradication (combination regimens)', 'Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)'] → After: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'H. pylori eradication (combination regimens)', 'NSAID-associated gastric ulcer risk reduction (as labeled)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)']

### Eszopiclone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Insomnia', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Insomnia (sleep onset and/or sleep maintenance)']
- **Field**: `warnings/indications`
  - Problem: Benzodiazepine-class indications/warnings contaminated Z-drug entry
  - Fix: Limited to insomnia-labeled use; removed seizure/alcohol/spasm framing

### Ethinylestradiol contraceptives

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Contraception (as part of CHC)', 'Cycle control / acne selected products', 'Prevention of pregnancy', 'Emergency contraception (levonorgestrel / ulipristal products)', 'Menstrual cycle regulation / acne / endometriosis symptoms (selected CHCs — labeled)'] → After: ['Contraception (as part of combined hormonal contraceptives)', 'Cycle control / acne (selected combination products)']

### Ezetimibe

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Primary hyperlipidemia; homozygous FH as labeled', 'Primary hyperlipidemia ± statin', 'Homozygous familial hypercholesterolemia adjunct', 'Sitosterolemia'] → After: ['Primary hyperlipidemia ± statin', 'Homozygous familial hypercholesterolemia (as labeled)']

### Famotidine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Heartburn / GERD / ulcers as labeled', 'GERD / heartburn', 'Peptic ulcer disease', 'Stress ulcer prophylaxis (ICU protocols — selected)'] → After: ['Heartburn / GERD / ulcers as labeled', 'Peptic ulcer disease', 'GERD / heartburn']

### Felodipine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Angina (chronic stable / vasospastic — product-specific)', 'Raynaud phenomenon (often off-label)'] → After: ['Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Fenofibrate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Severe hypertriglyceridemia', 'Mixed dyslipidemia adjunct (selected)', 'Diabetic retinopathy progression adjunct (some regions — fenofibrate)'] → After: ['Severe hypertriglyceridemia', 'Mixed dyslipidemia adjunct (selected)']

### Fentanyl

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Severe acute pain (e.g., perioperative / transmucosal products as labeled)', 'Chronic pain in opioid-tolerant patients (transdermal / certain transmucosal — labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Ferrous sulfate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Fexofenadine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Allergic rhinitis', 'Urticaria / chronic spontaneous urticaria (selected)', 'Allergic conjunctivitis symptomatic relief (selected)'] → After: ['Allergic rhinitis', 'Chronic idiopathic urticaria']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Finasteride

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Fluconazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Fluoxetine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Major depressive disorder', 'OCD, bulimia, panic (as labeled)', 'Generalized anxiety disorder / panic disorder / social anxiety (product-specific)', 'Obsessive-compulsive disorder (selected SSRIs)', 'PTSD / PMDD (selected SSRIs as labeled)', 'Bulimia nervosa (fluoxetine — labeled)'] → After: ['Major depressive disorder', 'Obsessive-compulsive disorder', 'Bulimia nervosa', 'Panic disorder', 'Premenstrual dysphoric disorder (selected products)']

### Fluticasone (inhaled)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Asthma maintenance', 'COPD (selected ICS-containing regimens — not monotherapy first-line)', 'Allergic rhinitis (intranasal formulations — related products)'] → After: ['Asthma maintenance', 'COPD (selected ICS-containing regimens — not monotherapy first-line)']

### Fluticasone/salmeterol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Asthma maintenance', 'COPD (selected ICS-containing regimens — not monotherapy first-line)', 'Allergic rhinitis (intranasal formulations — related products)'] → After: ['Asthma maintenance', 'COPD maintenance (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Fluvoxamine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Obsessive-compulsive disorder (selected SSRIs)', 'Social anxiety (some regions)', 'Depression (jurisdiction-specific)', 'Major depressive disorder', 'Generalized anxiety disorder / panic disorder / social anxiety (product-specific)', 'PTSD / PMDD (selected SSRIs as labeled)', 'Bulimia nervosa (fluoxetine — labeled)'] → After: ['Obsessive-compulsive disorder', 'Social anxiety disorder (some regions)', 'Major depressive disorder (jurisdiction-dependent)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Fosfomycin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Uncomplicated cystitis in women (single-dose sachet regimens)', 'Additional labeled / guideline uses — see SmPC/PI'] → After: ['Uncomplicated cystitis in women (single-dose sachet regimens)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['Class-related adverse effects — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Furosemide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Edema due to HF / cirrhosis / renal disease', 'Acute pulmonary edema', 'Hypertension (selected — not usually first-line)', 'Hypercalcemia adjunct (off-label contexts)'] → After: ['Edema associated with congestive heart failure, cirrhosis of the liver, and renal disease', 'Acute pulmonary edema', 'Hypertension (alone or in combination)']

### Gabapentin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Postherpetic neuralgia', 'Partial seizures adjunct (gabapentin/pregabalin)', 'Neuropathic pain (product-specific)', 'Fibromyalgia (pregabalin — labeled US)', 'Generalized anxiety (pregabalin — licensed some regions)', 'Perioperative pain / off-label uses'] → After: ['Postherpetic neuralgia', 'Partial-onset seizures (adjunct)']

### Gabapentin enacarbil

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Restless legs syndrome', 'Postherpetic neuralgia', 'Neuropathic pain (product-specific)', 'Partial seizures adjunct (gabapentin/pregabalin)', 'Fibromyalgia (pregabalin — labeled US)', 'Generalized anxiety (pregabalin — licensed some regions)', 'Perioperative pain / off-label uses'] → After: ['Restless legs syndrome', 'Postherpetic neuralgia']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Gentamicin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Gliclazide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Type 2 diabetes mellitus', 'Add-on when metformin insufficient (guideline pathways)', 'Not for type 1 diabetes or DKA'] → After: ['Type 2 diabetes mellitus']

### Heparin (unfractionated)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['VTE, ACS, perioperative anticoagulation', 'VTE treatment and prophylaxis', 'ACS / procedural anticoagulation (UFH)', 'Bridging anticoagulation contexts'] → After: ['VTE treatment and prophylaxis', 'ACS / procedural anticoagulation']

### Hydrochlorothiazide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Edema', 'Edema (selected contexts)', 'Nephrolithiasis prevention with hypercalciuria (off-label / selected)'] → After: ['Hypertension', 'Edema']

### Hydrocodone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Moderate to severe pain (often in combination products)', 'Severe chronic pain requiring around-the-clock opioid when alternatives inadequate (ER products)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Hydromorphone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Hydroxychloroquine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['SLE; rheumatoid arthritis', 'COVID-19 treatment', 'Systemic lupus erythematosus', 'Malaria treatment/prophylaxis as labeled', 'COVID-19 outpatient (not established for routine use)'] → After: ['Rheumatoid arthritis', 'Systemic lupus erythematosus', 'Malaria treatment/prophylaxis as labeled']

### Ibuprofen

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Mild to moderate pain', 'Fever', 'Inflammatory arthritis conditions (Rx strengths)', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Mild to moderate pain', 'Fever', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea']

### Indapamide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Edema (selected contexts)', 'Nephrolithiasis prevention with hypercalciuria (off-label / selected)'] → After: ['Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Indomethacin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Moderate to severe rheumatoid arthritis / osteoarthritis / ankylosing spondylitis', 'Acute gouty arthritis', 'Acute painful shoulder (bursitis/tendinitis)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Insulin aspart

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Diabetes mellitus requiring prandial insulin', 'Type 1 diabetes mellitus', 'Type 2 diabetes when insulin required', 'Gestational diabetes / pregnancy diabetes (selected)', 'Hyperkalemia acute management (IV regular insulin protocols)'] → After: ['Diabetes mellitus requiring prandial insulin', 'Type 1 diabetes mellitus', 'Type 2 diabetes when insulin required']

### Insulin glargine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Diabetes mellitus requiring basal insulin', 'Type 1 diabetes mellitus', 'Type 2 diabetes when insulin required', 'Gestational diabetes / pregnancy diabetes (selected)', 'Hyperkalemia acute management (IV regular insulin protocols)'] → After: ['Diabetes mellitus requiring basal insulin', 'Type 1 diabetes mellitus', 'Type 2 diabetes when insulin required']

### Ipratropium

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Irbesartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Diabetic nephropathy in type 2 diabetes with hypertension', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)', 'Stroke risk reduction in hypertension with LVH (losartan — labeled)'] → After: ['Hypertension', 'Diabetic nephropathy in type 2 diabetes with hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Isoniazid

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Isosorbide mononitrate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Angina prophylaxis', 'Angina relief / prophylaxis', 'Acute coronary syndromes adjunct', 'Hypertensive emergencies / HF (selected IV)'] → After: ['Angina prophylaxis']

### Ketorolac

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Short-term (≤5 days) management of moderately severe acute pain requiring analgesia at opioid level']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Labetalol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)', 'Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)'] → After: ['Hypertension', 'Hypertensive emergencies (IV — as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Lamotrigine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Epilepsy; bipolar I maintenance', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Epilepsy (adjunctive / monotherapy as labeled)', 'Maintenance treatment of bipolar I disorder to delay mood episodes']

### Lansoprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)'] → After: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'NSAID-associated gastric ulcer healing / risk reduction (as labeled)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Levetiracetam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Focal and generalized seizures as labeled', 'Status epilepticus IV (guideline use)', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Focal and generalized seizures as labeled', 'Myoclonic seizures / primary generalized tonic-clonic (as labeled)', 'Status epilepticus (IV — guideline use in many settings)']

### Levocetirizine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Allergic rhinitis', 'Urticaria / chronic spontaneous urticaria (selected)', 'Allergic conjunctivitis symptomatic relief (selected)'] → After: ['Allergic rhinitis', 'Chronic idiopathic urticaria']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Levofloxacin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Selected bacterial infections as labeled', 'Complicated UTI / pyelonephritis (when appropriate)', 'Selected respiratory / skin / bone infections as labeled', 'Anthrax / plague (selected agents — labeled)', 'Uncomplicated infections only when no alternatives (per FDA safety communications)'] → After: ['Selected bacterial infections as labeled (respiratory, UTI, skin — when appropriate)']

### Levonorgestrel emergency contraception

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Emergency contraception (levonorgestrel / ulipristal products)', 'Prevention of pregnancy', 'Menstrual cycle regulation / acne / endometriosis symptoms (selected CHCs — labeled)'] → After: ['Emergency contraception']

### Levothyroxine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypothyroidism (replacement)', 'TSH suppression in selected thyroid cancer protocols', 'Myxedema coma (IV formulations — specialist)'] → After: ['Hypothyroidism (replacement)', 'TSH suppression in selected thyroid cancer protocols', 'Myxedema coma (IV formulations — specialist)']

### Linezolid

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Liraglutide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Type 2 diabetes mellitus', 'Chronic weight management (selected doses/products — labeled)', 'CV risk reduction in T2DM with CVD (selected agents)'] → After: ['Type 2 diabetes mellitus (Victoza)', 'Chronic weight management (Saxenda — labeled dose/product)', 'CV risk reduction in T2DM with established CVD (Victoza — as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Lisinopril

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Heart failure (HFrEF)', 'Post-myocardial infarction / CV risk reduction (product-specific)', 'Heart failure with reduced ejection fraction (as labeled)', 'Diabetic nephropathy / CKD with albuminuria (selected ACEIs)'] → After: ['Hypertension', 'Heart failure (HFrEF)', 'Acute myocardial infarction (within 24 hours in hemodynamically stable patients — as labeled)']

### Lithium carbonate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Bipolar disorder (mania/maintenance)', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Bipolar disorder (mania / maintenance)']

### Loperamide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Acute nonspecific diarrhea', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Acute nonspecific diarrhea', 'Chronic diarrhea associated with inflammatory bowel disease (adjunct)']
- **Field**: `monitoring`
  - Problem: Opioid-class monitoring template applied to non-opioid
  - Fix: Removed opioid monitoring items; kept ['(none — set drug-specific)']
- **Field**: `adverse`
  - Problem: Systemic opioid-class adverse effects template on peripheral antimotility agent
  - Fix: Retained gut/cardiac-risk AEs; removed systemic opioid template AEs
- **Field**: `warnings`
  - Problem: Opioid misuse warnings inappropriate as primary framing for labeled antidiarrheal use
  - Fix: Adjusted warnings toward labeled cardiac high-dose risk and appropriate use limits

### Loratadine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Allergic rhinitis / urticaria', 'Urticaria / chronic spontaneous urticaria (selected)', 'Allergic conjunctivitis symptomatic relief (selected)'] → After: ['Allergic rhinitis / urticaria']

### Lorazepam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Anxiety disorders (short-term)', 'Insomnia due to anxiety or transient situational stress (short-term)', 'Preoperative sedation / amnesia', 'Status epilepticus (IV)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Losartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Diabetic nephropathy (type 2) as labeled', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)'] → After: ['Hypertension', 'Diabetic nephropathy in type 2 diabetes with hypertension', 'Stroke risk reduction in hypertension with left ventricular hypertrophy (as labeled)']

### Lovastatin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (hetero/homo — product-specific)', 'Atherosclerotic cardiovascular disease risk reduction / secondary prevention', 'Primary prevention in elevated CV risk as labeled/guideline-supported'] → After: ['Primary hyperlipidemia', 'Primary prevention of coronary heart disease (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Meloxicam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Osteoarthritis', 'Rheumatoid arthritis', 'Juvenile rheumatoid arthritis (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Metformin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Type 2 diabetes mellitus (first-line in many guidelines when tolerated)', 'Prediabetes / diabetes prevention (guideline off-label in some regions)', 'PCOS metabolic features (commonly used off-label)'] → After: ['Type 2 diabetes mellitus (first-line in many guidelines when tolerated)', 'Prediabetes / diabetes prevention in selected high-risk adults']

### Methotrexate (low-dose rheumatologic)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Rheumatoid arthritis (low-dose weekly)', 'Psoriasis / other labeled uses', 'Psoriasis / psoriatic arthritis', 'Oncology indications (higher doses — different protocols)', 'Ectopic pregnancy medical management (specialist)'] → After: ['Rheumatoid arthritis (low-dose weekly)', 'Psoriasis / psoriatic arthritis as labeled']

### Methylphenidate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Methylprednisolone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Inflammatory / allergic / autoimmune flares as labeled', 'Asthma / COPD exacerbations (systemic short courses)', 'Adrenal insufficiency replacement (physiologic dosing — selected agents)', 'Oncology / antiemetic adjunct / COVID protocols (context-specific)'] → After: ['Inflammatory / allergic / autoimmune conditions as labeled', 'Asthma / COPD exacerbations (short courses)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Metoprolol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'Angina', 'Heart failure (ER succinate)', 'Post-MI', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)', 'Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)'] → After: ['Hypertension', 'Angina pectoris', 'Heart failure (metoprolol succinate ER)', 'Post-MI']

### Metronidazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Minocycline

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Respiratory / skin infections as labeled', 'Acne (selected)', 'Lyme / rickettsial / atypical infections', 'STI regimens (e.g., chlamydia — doxycycline)', 'Malaria prophylaxis (doxycycline)'] → After: ['Susceptible bacterial infections as labeled', 'Inflammatory acne (selected)']

### Mirabegron

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Mirtazapine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Montelukast

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Asthma prophylaxis (not acute attack)', 'Allergic rhinitis (selected)', 'Asthma maintenance (not acute rescue)', 'Exercise-induced bronchoconstriction prevention'] → After: ['Asthma maintenance (not acute rescue)', 'Allergic rhinitis (selected)', 'Exercise-induced bronchoconstriction prevention (as labeled)']

### Morphine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Severe pain', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain', 'Chronic pain only with careful selection (generally last-line)']

### Moxifloxacin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Complicated UTI / pyelonephritis (when appropriate)', 'Selected respiratory / skin / bone infections as labeled', 'Anthrax / plague (selected agents — labeled)', 'Uncomplicated infections only when no alternatives (per FDA safety communications)'] → After: ['Community-acquired pneumonia and other labeled susceptible infections']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Naloxone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Known/suspected opioid overdose', 'Take-home naloxone harm reduction', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Known or suspected opioid overdose (emergency reversal)', 'Take-home naloxone for opioid overdose risk reduction']
- **Field**: `monitoring`
  - Problem: Opioid-class monitoring template applied to non-opioid
  - Fix: Removed opioid monitoring items; kept ['(none — set drug-specific)']
- **Field**: `adverse/warnings/monitoring`
  - Problem: Opioid-agonist class content applied to opioid antagonist
  - Fix: Set antagonist-appropriate adverse effects and monitoring

### Naproxen

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Pain and inflammation', 'Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea (selected NSAIDs)', 'Migraine / headache symptomatic relief (selected)'] → After: ['Pain (mild to moderate)', 'Fever / antipyresis', 'Inflammatory conditions (e.g., osteoarthritis, rheumatoid arthritis) as labeled', 'Dysmenorrhea', 'Ankylosing spondylitis / acute gout (as labeled)']

### Nebivolol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)', 'Migraine prophylaxis / tremor / performance anxiety (selected agents, often off-label)'] → After: ['Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Nifedipine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Angina (chronic stable / vasospastic — product-specific)', 'Raynaud phenomenon (often off-label)'] → After: ['Hypertension (extended-release)', 'Angina (chronic stable / vasospastic — as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Nitrofurantoin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Nitroglycerin (glyceryl trinitrate)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Acute angina pectoris', 'Angina relief / prophylaxis', 'Acute coronary syndromes adjunct', 'Hypertensive emergencies / HF (selected IV)'] → After: ['Acute angina pectoris', 'Angina prophylaxis', 'Acute coronary syndromes adjunct (IV protocols)']

### Ofloxacin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Complicated UTI / pyelonephritis (when appropriate)', 'Selected respiratory / skin / bone infections as labeled', 'Anthrax / plague (selected agents — labeled)', 'Uncomplicated infections only when no alternatives (per FDA safety communications)'] → After: ['Selected susceptible infections as labeled (UTI, skin, STI historically)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Olanzapine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Schizophrenia', 'Bipolar mania/depression (product-specific)', 'Adjunct MDD (selected agents)', 'Off-label insomnia / agitation (common but cautioned)'] → After: ['Schizophrenia', 'Bipolar I disorder (acute mania / mixed / maintenance as labeled)', 'Treatment-resistant depression (adjunct with fluoxetine — as labeled)']

### Olmesartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)'] → After: ['Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Omeprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease / H. pylori combination therapy', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'H. pylori eradication (combination regimens)', 'NSAID-associated ulcer risk reduction (selected regimens)'] → After: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease / H. pylori combination therapy', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)']

### Ondansetron

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Chemotherapy-induced and postoperative nausea/vomiting', 'Chemotherapy-induced nausea/vomiting', 'Radiotherapy-associated nausea', 'Pregnancy nausea (off-label common; risk debates)'] → After: ['Chemotherapy-induced nausea/vomiting', 'Radiotherapy-induced nausea/vomiting', 'Postoperative nausea/vomiting']

### Oral contraceptives (combined) — class overview

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Prevention of pregnancy', 'Selected noncontraceptive labeled uses', 'Emergency contraception (levonorgestrel / ulipristal products)', 'Menstrual cycle regulation / acne / endometriosis symptoms (selected CHCs — labeled)'] → After: ['Prevention of pregnancy', 'Selected noncontraceptive labeled uses (acne, PMDD — product-specific)']

### Oseltamivir

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Oxybutynin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Oxycodone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Severe chronic pain requiring around-the-clock opioid when alternatives inadequate']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Pantoprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['GERD / erosive esophagitis', 'Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)'] → After: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'Peptic ulcer disease']

### Paracetamol (Acetaminophen)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Mild to moderate pain', 'Fever', 'Pain (mild to moderate)', 'Osteoarthritis symptomatic relief (adjunct)', 'Post-vaccine / viral illness symptomatic care'] → After: ['Mild to moderate pain', 'Fever', 'Osteoarthritis symptomatic relief (adjunct)']

### Paroxetine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Major depressive disorder', 'Generalized anxiety disorder / panic disorder / social anxiety (product-specific)', 'Obsessive-compulsive disorder (selected SSRIs)', 'PTSD / PMDD (selected SSRIs as labeled)', 'Bulimia nervosa (fluoxetine — labeled)'] → After: ['Major depressive disorder', 'Obsessive-compulsive disorder', 'Panic disorder', 'Social anxiety disorder', 'Generalized anxiety disorder', 'Post-traumatic stress disorder', 'Premenstrual dysphoric disorder (selected products)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Perindopril

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Heart failure with reduced ejection fraction (as labeled)', 'Post-myocardial infarction / CV risk reduction (product-specific)', 'Diabetic nephropathy / CKD with albuminuria (selected ACEIs)'] → After: ['Hypertension', 'Stable coronary artery disease — risk reduction (as labeled)', 'Heart failure (selected products/jurisdictions)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Phenytoin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Focal and generalized tonic-clonic seizures', 'Status epilepticus (IV fosphenytoin/phenytoin protocols)', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Focal and generalized tonic-clonic seizures', 'Status epilepticus (IV fosphenytoin/phenytoin protocols)', 'Seizure prophylaxis after neurosurgery (as labeled)']

### Pitavastatin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (hetero/homo — product-specific)', 'Atherosclerotic cardiovascular disease risk reduction / secondary prevention', 'Primary prevention in elevated CV risk as labeled/guideline-supported'] → After: ['Primary hyperlipidemia / mixed dyslipidemia']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Potassium chloride

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypokalemia treatment/prevention', 'Additional labeled indications — see current SmPC/PI', 'Guideline-supported uses within pharmacologic class'] → After: ['Hypokalemia treatment and prevention']

### Prasugrel

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Secondary prevention after ACS / stent / ischemic stroke or TIA (as labeled)', 'PAD symptomatic management (selected)', 'Primary prevention only in selected higher-risk patients (aspirin) — guideline-narrowed'] → After: ['ACS managed with PCI — reduction of thrombotic events (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Pravastatin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (hetero/homo — product-specific)', 'Atherosclerotic cardiovascular disease risk reduction / secondary prevention', 'Primary prevention in elevated CV risk as labeled/guideline-supported'] → After: ['Primary hyperlipidemia / mixed dyslipidemia', 'Primary and secondary prevention of coronary events (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Prednisone / Prednisolone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Multiple inflammatory/autoimmune conditions', 'Asthma/COPD exacerbations (short courses)', 'Inflammatory / allergic / autoimmune flares as labeled', 'Asthma / COPD exacerbations (systemic short courses)', 'Adrenal insufficiency replacement (physiologic dosing — selected agents)', 'Oncology / antiemetic adjunct / COVID protocols (context-specific)'] → After: ['Multiple inflammatory / autoimmune conditions as labeled', 'Asthma / COPD exacerbations (short courses)']

### Pregabalin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Diabetic neuropathy / postherpetic neuralgia', 'Fibromyalgia (US)', 'Neuropathic pain (product-specific)', 'Partial seizures adjunct (gabapentin/pregabalin)', 'Fibromyalgia (pregabalin — labeled US)', 'Generalized anxiety (pregabalin — licensed some regions)', 'Perioperative pain / off-label uses'] → After: ['Diabetic peripheral neuropathy', 'Postherpetic neuralgia', 'Fibromyalgia (US)', 'Partial-onset seizures (adjunct)', 'Neuropathic pain (EU and other labels)', 'Generalized anxiety disorder (licensed some regions)']

### Propranolol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension / angina / arrhythmia as labeled', 'Migraine prophylaxis', 'Essential tremor', 'Performance anxiety (off-label common)', 'Thyrotoxicosis symptomatic control', 'Angina pectoris', 'Heart failure with reduced ejection fraction (evidence-based agents: carvedilol, bisoprolol, metoprolol succinate)', 'Post-MI / rate control in AF (selected)'] → After: ['Hypertension', 'Angina pectoris', 'Arrhythmias as labeled', 'Migraine prophylaxis', 'Essential tremor', 'Performance anxiety / situational anxiety']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Quetiapine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Schizophrenia; bipolar disorder as labeled', 'Bipolar mania/depression (product-specific)', 'Adjunct MDD (selected agents)', 'Off-label insomnia / agitation (common but cautioned)'] → After: ['Schizophrenia', 'Bipolar disorder as labeled', 'Adjunct MDD (extended-release — as labeled)']

### Rabeprazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)', 'NSAID-associated ulcer risk reduction (selected regimens)'] → After: ['Gastroesophageal reflux disease (GERD)', 'Erosive esophagitis healing / maintenance', 'Peptic ulcer disease', 'H. pylori eradication (combination regimens)', 'Pathological hypersecretory conditions (e.g., Zollinger–Ellison)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Ramipril

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hypertension', 'CV risk reduction / HF as labeled', 'Heart failure with reduced ejection fraction (as labeled)', 'Post-myocardial infarction / CV risk reduction (product-specific)', 'Diabetic nephropathy / CKD with albuminuria (selected ACEIs)'] → After: ['Hypertension', 'Heart failure after MI / CV risk reduction as labeled', 'Reduction of CV events in high-risk patients (as labeled)']

### Ranitidine (historical / withdrawn)

- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Historical: GERD/ulcers — products largely withdrawn', 'GERD / heartburn', 'Peptic ulcer disease', 'Stress ulcer prophylaxis (ICU protocols — selected)'] → After: ['Historical: GERD/ulcers — products largely withdrawn due to NDMA impurity concerns']

### Rifampin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Rifaximin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['Class-related adverse effects — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Risperidone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Schizophrenia', 'Bipolar mania/depression (product-specific)', 'Adjunct MDD (selected agents)', 'Off-label insomnia / agitation (common but cautioned)'] → After: ['Schizophrenia', 'Bipolar mania', 'Irritability associated with autistic disorder (pediatric — as labeled)']

### Rivaroxaban

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['NVAF stroke prevention; VTE as labeled', 'Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE', 'Secondary prevention of recurrent VTE', 'VTE prophylaxis after hip/knee replacement (product-specific)', 'CAD/PAD risk reduction (rivaroxaban low-dose regimens — labeled)'] → After: ['Stroke prevention in nonvalvular atrial fibrillation', 'Treatment of DVT / PE and reduction of recurrence', 'VTE prophylaxis after hip/knee replacement (as labeled)', 'CV risk reduction in CAD/PAD (vascular dose — as labeled)']

### Rosuvastatin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hyperlipidemia / primary prevention as labeled', 'Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (hetero/homo — product-specific)', 'Atherosclerotic cardiovascular disease risk reduction / secondary prevention', 'Primary prevention in elevated CV risk as labeled/guideline-supported'] → After: ['Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (as labeled)', 'Primary prevention of CV events in elevated-risk patients (as labeled)']

### Sacubitril/valsartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['HFrEF', 'Hypertension', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)'] → After: ['Chronic heart failure with reduced ejection fraction']

### Salbutamol (Albuterol)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Semaglutide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Type 2 diabetes (as labeled)', 'Chronic weight management (Wegovy)', 'Type 2 diabetes mellitus', 'Chronic weight management (selected doses/products — labeled)', 'CV risk reduction in T2DM with CVD (selected agents)'] → After: ['Type 2 diabetes mellitus (Ozempic / Rybelsus)', 'Chronic weight management (Wegovy)', 'CV risk reduction in T2DM with established CVD (as labeled)']

### Sertraline

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Major depressive disorder', 'OCD', 'Panic disorder, PTSD, social anxiety (as labeled)', 'Generalized anxiety disorder / panic disorder / social anxiety (product-specific)', 'Obsessive-compulsive disorder (selected SSRIs)', 'PTSD / PMDD (selected SSRIs as labeled)', 'Bulimia nervosa (fluoxetine — labeled)'] → After: ['Major depressive disorder', 'Obsessive-compulsive disorder', 'Panic disorder', 'Post-traumatic stress disorder', 'Social anxiety disorder', 'Premenstrual dysphoric disorder']

### Sildenafil

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Erectile dysfunction', 'Pulmonary arterial hypertension (Revatio)', 'Pulmonary arterial hypertension (specific products/doses)', 'BPH (tadalafil daily — labeled)'] → After: ['Erectile dysfunction', 'Pulmonary arterial hypertension (Revatio)']

### Simvastatin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Hyperlipidemia / CV prevention', 'Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (hetero/homo — product-specific)', 'Atherosclerotic cardiovascular disease risk reduction / secondary prevention', 'Primary prevention in elevated CV risk as labeled/guideline-supported'] → After: ['Primary hyperlipidemia / mixed dyslipidemia', 'Familial hypercholesterolemia (as labeled)', 'CV event risk reduction in high-risk patients (as labeled)']

### Sitagliptin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Type 2 diabetes mellitus (monotherapy or combination)', 'Add-on to metformin / other antihyperglycemics as labeled', 'Not for type 1 diabetes or DKA'] → After: ['Type 2 diabetes mellitus (monotherapy or combination)']

### Spironolactone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['HFrEF', 'Resistant hypertension / primary aldosteronism', 'HFrEF / HF outcome benefit as labeled', 'Edema / ascites in cirrhosis (spironolactone)', 'Acne / hirsutism (spironolactone off-label)'] → After: ['HFrEF / NYHA class III–IV heart failure (as labeled)', 'Hypertension (usually add-on / resistant)', 'Primary hyperaldosteronism', 'Edema / ascites in cirrhosis', 'Acne / hirsutism']

### St. John's wort

- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Mild depressive symptoms (jurisdiction-dependent)', 'Additional labeled indications — see current SmPC/PI', 'Guideline-supported uses within pharmacologic class'] → After: ['Mild depressive symptoms (jurisdiction-dependent; herbal/supplement status varies)']

### Sumatriptan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Acute migraine treatment', 'Cluster headache (sumatriptan injectable — labeled)'] → After: ['Acute migraine treatment', 'Cluster headache (sumatriptan injectable — labeled)']

### Tadalafil

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Erectile dysfunction', 'BPH', 'Pulmonary arterial hypertension (Adcirca)', 'Pulmonary arterial hypertension (specific products/doses)', 'BPH (tadalafil daily — labeled)'] → After: ['Erectile dysfunction', 'BPH', 'Pulmonary arterial hypertension (Adcirca)']

### Tamsulosin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Telmisartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)'] → After: ['Hypertension', 'CV risk reduction in high-risk patients (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Temazepam

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Short-term treatment of insomnia']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Terbinafine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Ticagrelor

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Secondary prevention after ACS / stent / ischemic stroke or TIA (as labeled)', 'PAD symptomatic management (selected)', 'Primary prevention only in selected higher-risk patients (aspirin) — guideline-narrowed'] → After: ['ACS — reduction of CV death/MI/stroke (as labeled)']

### Tiotropium

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Tirzepatide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Type 2 diabetes mellitus', 'Chronic weight management (Zepbound — labeled)', 'Obstructive sleep apnea with obesity (selected labeled expansion)', 'Chronic weight management (selected doses/products — labeled)', 'CV risk reduction in T2DM with CVD (selected agents)'] → After: ['Type 2 diabetes mellitus', 'Chronic weight management (Zepbound — labeled)', 'Obstructive sleep apnea with obesity (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Topiramate

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Epilepsy', 'Migraine prophylaxis', 'Weight / binge-eating off-label contexts', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Epilepsy (as labeled)', 'Migraine prophylaxis']

### Torsemide

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Edema due to HF / cirrhosis / renal disease', 'Acute pulmonary edema', 'Hypertension (selected — not usually first-line)', 'Hypercalcemia adjunct (off-label contexts)'] → After: ['Edema associated with heart failure, renal disease, or hepatic disease', 'Hypertension']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Tramadol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Moderate to moderately severe pain', 'Moderate to severe acute pain when non-opioids insufficient', 'Cancer / palliative pain (selected)', 'Chronic non-cancer pain only with careful selection (generally last-line)', 'Antitussive (codeine — labeled in some products)'] → After: ['Moderate to moderately severe pain']

### Trazodone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Trimethoprim/sulfamethoxazole

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Umeclidinium/vilanterol

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['COPD maintenance', 'Not for asthma as primary labeled use for this combo — check label', 'Asthma maintenance (tiotropium Respimat — labeled)'] → After: ['COPD maintenance']

### Valproate (valproic acid / divalproex)

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Epilepsy; bipolar mania as labeled', 'Bipolar disorder (agent-specific roles)', 'Epilepsy / seizure disorders as labeled', 'Migraine prophylaxis (valproate/topiramate — not first-line in women of childbearing potential)', 'Neuropathic pain (selected anticonvulsants)'] → After: ['Epilepsy (as labeled)', 'Manic episodes associated with bipolar disorder', 'Migraine prophylaxis']

### Valsartan

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['See labeling for approved indications', 'Guideline-supported uses within class', 'Hypertension', 'Heart failure / post-MI (selected ARBs as labeled)', 'Diabetic nephropathy (selected ARBs, e.g., type 2)'] → After: ['Hypertension', 'Heart failure (NYHA class II–IV)', 'Post-MI left ventricular failure / dysfunction (as labeled)']
- **Field**: `adverse`
  - Problem: Placeholder adverse text: ['See class adverse effect profile', 'Class-specific serious risks — review labeling']
  - Fix: Removed placeholders; retained class/label adverse effects already present

### Vancomycin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified

### Venlafaxine

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Major depressive disorder', 'GAD, social anxiety, panic', 'Generalized anxiety disorder (selected SNRIs)', 'Diabetic peripheral neuropathic pain / fibromyalgia / chronic musculoskeletal pain (duloxetine — labeled)', 'Panic / social anxiety (venlafaxine XR — labeled)'] → After: ['Major depressive disorder', 'Generalized anxiety disorder', 'Social anxiety disorder', 'Panic disorder']

### Verapamil

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Angina; hypertension; SVT/AF rate control', 'Angina', 'Rate control / SVT (selected)', 'Cluster headache prophylaxis (off-label high-dose specialist)'] → After: ['Angina', 'Hypertension', 'Rate control / SVT (selected)', 'Cluster headache prophylaxis']

### Warfarin

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['VTE treatment/prevention', 'Stroke prevention in AF (selected)', 'Mechanical heart valve anticoagulation', 'Prophylaxis/treatment of venous thrombosis and PE', 'Thromboembolic complications of AF / cardiac valve replacement', 'Secondary prevention after MI (selected contexts)', 'Antiphospholipid syndrome / mechanical valves (often preferred anticoagulant class)'] → After: ['Prophylaxis/treatment of venous thrombosis and PE', 'Thromboembolic complications of AF / cardiac valve replacement', 'Mechanical heart valve anticoagulation', 'Secondary prevention after MI (selected contexts)']

### Zolpidem

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Short-term insomnia', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Short-term treatment of insomnia (sleep onset; some formulations also maintenance)']
- **Field**: `warnings/indications`
  - Problem: Benzodiazepine-class indications/warnings contaminated Z-drug entry
  - Fix: Limited to insomnia-labeled use; removed seizure/alcohol/spasm framing
- **Field**: `condition_medications`
  - Problem: Condition link 'Insomnia disorder' → indication 'Short-term insomnia' not in medication indications after fix
  - Fix: Dropped link

### Zopiclone

- **Field**: `regulatoryStatus`
  - Problem: Four-jurisdiction authorisation boilerplate (US/EU/UK/CH claimed without verification)
  - Fix: Replaced with US=FDA-approved; EU/UK/CH=authorisation status not verified
- **Field**: `indications`
  - Problem: Indications replaced with label-accurate curated set (class-template contamination and/or inaccurate uses)
  - Fix: Before: ['Short-term insomnia', 'Acute anxiety / panic (short-term)', 'Seizure / status epilepticus (selected agents/routes)', 'Alcohol withdrawal (selected protocols)', 'Muscle spasm (diazepam)', 'Insomnia short-term (selected)'] → After: ['Short-term treatment of insomnia']
- **Field**: `warnings/indications`
  - Problem: Benzodiazepine-class indications/warnings contaminated Z-drug entry
  - Fix: Limited to insomnia-labeled use; removed seizure/alcohol/spasm framing
- **Field**: `condition_medications`
  - Problem: Condition link 'Insomnia disorder' → indication 'Short-term insomnia' not in medication indications after fix
  - Fix: Dropped link

## Addendum (post-fix verification)

- Remapped 3 condition→medicine links that broke after indication wording changes (Zolpidem insomnia, Zopiclone insomnia, Colchicine gout) instead of leaving them dropped; added a Colchicine prophylaxis link.
- Cleaned residual opioid-agonist adverse effects from Loperamide and Naloxone; cleaned allopurinol/febuxostat AEs from Colchicine; tightened Zolpidem warnings/AEs.
- Automated regression checks live in `scripts/content-checks.ts` (invoked from `scripts/seed.ts` and `npm test`): denylist of known-wrong pairs, shared identical indication-list detection, four-jurisdiction boilerplate ban, placeholder AE ban.
- Final condition_medications link count: 104 (0 broken vs medication indications).
