function cond(name, summary, typical, red, when, evidence, symptoms) {
  return {
    name,
    summary,
    typical_symptoms: typical,
    red_flags: red,
    when_to_seek_care: when,
    evidence_overview: evidence,
    symptoms,
  };
}
function sym(symptom, synonyms, weight, supporting, against) {
  const o = { symptom, synonyms, weight };
  if (supporting) o.supporting = supporting;
  if (against) o.against = against;
  return o;
}

export const EXTRA_CONDITIONS = [
  cond(
    "Eczema / atopic dermatitis",
    "Chronic relapsing inflammatory skin condition with barrier dysfunction and itch. Diagnosis is clinical; secondary infection and steroid misuse are common pitfalls.",
    ["itchy rash", "dry skin", "flexural eczema", "sleep disturbance from itch"],
    ["rapidly spreading redness with fever", "facial swelling", "pustules suggesting serious infection", "erythroderma"],
    "Seek care for uncontrolled itch, suspected infection, or infant involvement. Emergency care for systemic toxicity or severe widespread disease.",
    "Emollients are foundational. Topical corticosteroids/calcineurin inhibitors have trial support. Systemic agents reserved for refractory disease.",
    [sym("itchy rash", ["pruritus", "eczema itch"], 2, "Flexural accentuation supports atopic pattern", "Painful rapidly progressive rash needs infection/urgent eval"),
     sym("dry skin", ["xerosis"], 1.5),
     sym("sleep disturbance from itch", ["night itch"], 1.2)]
  ),
  cond(
    "Attention-deficit/hyperactivity disorder (adult overview)",
    "Neurodevelopmental condition with persistent inattention and/or hyperactivity-impulsivity impairing function. Adult diagnosis requires careful history; symptoms are not specific.",
    ["inattention", "restlessness", "disorganization", "impulsivity", "time blindness"],
    ["suicidal ideation", "substance withdrawal delirium", "sudden personality change"],
    "Seek evaluation via qualified clinician. Emergency care for suicidal ideation or acute psychiatric crisis. This overview does not diagnose ADHD.",
    "Stimulants and atomoxetine have RCT support in diagnosed ADHD. Diagnosis must exclude mimics; online checklists are insufficient.",
    [sym("inattention", ["can't focus", "distractibility"], 1.5),
     sym("restlessness", ["inner restlessness", "can't sit still"], 1.2),
     sym("disorganization", ["misses deadlines", "loses items"], 1.3)]
  ),
  cond(
    "Bipolar disorder (overview)",
    "Mood disorder with episodes of mania/hypomania and often depression. Self-labeling is unreliable; stimulant/substance effects and medical causes must be considered.",
    ["elevated or irritable mood", "decreased need for sleep", "racing thoughts", "depressive episodes", "impulsivity"],
    ["suicidal ideation", "psychosis with danger", "severe mania with no sleep for days"],
    "Urgent/emergency psychiatric care for mania with risk, psychosis, or suicidality. Do not stop mood stabilizers abruptly without clinical advice.",
    "Lithium, valproate, atypical antipsychotics, and lamotrigine have role-specific evidence. Valproate is highly restricted in people who can become pregnant.",
    [sym("decreased need for sleep", ["no need for sleep", "manic insomnia"], 2, "High energy despite little sleep is concerning for mania", "Insomnia alone is nonspecific"),
     sym("racing thoughts", ["flight of ideas"], 1.6),
     sym("elevated mood", ["euphoria", "unusually irritable mood"], 1.8)]
  ),
  cond(
    "Epilepsy / seizure disorder (overview)",
    "Tendency toward unprovoked seizures. First seizure workups differ from established epilepsy management. Driving and safety counseling are essential.",
    ["convulsive seizure", "staring spells", "post-ictal confusion", "tongue bite", "incontinence during event"],
    ["seizure >5 minutes / recurrent without recovery", "pregnancy seizure", "new focal deficit", "fever with stiff neck"],
    "Call emergency services for prolonged/recurrent seizures (status protocols). New first seizure needs prompt medical evaluation. Never stop antiseizure meds abruptly.",
    "Multiple antiseizure medications have RCT support; choice is syndrome- and patient-specific (pregnancy, interactions, comorbidities).",
    [sym("convulsive seizure", ["tonic-clonic", "fit", "grand mal"], 2.2),
     sym("staring spells", ["absence-like", "blank out"], 1.4),
     sym("post-ictal confusion", ["after-seizure confusion"], 1.6)]
  ),
  cond(
    "Community-acquired pneumonia (overview)",
    "Acute infection of the lung parenchyma acquired outside hospital. Severity tools and chest imaging guide site-of-care decisions.",
    ["cough", "fever", "dyspnea", "pleuritic chest pain", "sputum"],
    ["severe dyspnea / hypoxia", "confusion", "hypotension", "hemoptysis with instability", "immunocompromise with fever"],
    "Urgent care for breathing difficulty, confusion, or high-risk hosts. Emergency care for severe sepsis signs. Antibiotics are not always indicated before assessment.",
    "Empiric antibiotics follow local resistance and guidelines (e.g., IDSA/ATS, NICE). Viral pneumonia is common; stewardship matters.",
    [sym("fever with cough", ["productive cough fever"], 2),
     sym("dyspnea", ["shortness of breath", "breathlessness"], 1.8, "New hypoxia is a red flag", "Chronic stable DOE may be COPD/HF"),
     sym("pleuritic chest pain", ["pain on deep breath"], 1.4)]
  ),
  cond(
    "Acute sinusitis (rhinosinusitis)",
    "Inflammation of paranasal sinuses, usually viral. Bacterial infection is less common; antibiotics help only selected patients.",
    ["facial pain/pressure", "nasal congestion", "purulent rhinorrhea", "anosmia", "upper tooth pain"],
    ["orbital swelling/vision change", "severe headache with neck stiffness", "neurologic deficit", "frontal swelling"],
    "Seek care for symptoms >10 days without improvement, severe onset, or double-worsening. Emergency care for orbital/CNS complications.",
    "Guidelines emphasize symptomatic care; antibiotics reserved for specific criteria. Imaging not routine for uncomplicated acute cases.",
    [sym("facial pressure", ["sinus pressure", "face pain"], 1.8),
     sym("purulent nasal discharge", ["yellow green mucus"], 1.4),
     sym("nasal congestion", ["blocked nose"], 1.2)]
  ),
  cond(
    "Pharyngitis / tonsillitis",
    "Sore throat from viral or bacterial (including GAS) causes. Centor/FeverPAIN-type criteria and testing reduce unnecessary antibiotics.",
    ["sore throat", "odynophagia", "fever", "tender cervical nodes", "tonsillar exudate"],
    ["drooling / airway compromise", "trismus", "muffled hot-potato voice", "neck swelling", "scarlatiniform rash with toxicity"],
    "Emergency care for airway concern/peritonsillar abscess signs. Testing/treatment decisions for strep should be clinician-guided.",
    "Most pharyngitis is viral. Antibiotics for confirmed/highly likely GAS reduce complications in selected settings; symptom relief is central.",
    [sym("sore throat", ["throat pain", "pharyngitis"], 1.5),
     sym("painful swallowing", ["odynophagia"], 1.4),
     sym("tonsillar exudate", ["white spots on tonsils"], 1.6)]
  ),
  cond(
    "Cellulitis",
    "Bacterial infection of skin and subcutaneous tissue. Distinguish from stasis dermatitis, DVT, and necrotizing infections.",
    ["spreading skin redness", "warmth", "tenderness", "swelling", "fever"],
    ["rapid progression with severe pain out of proportion", "crepitus", "purple bullae", "hypotension", "immunocompromise with systemic symptoms"],
    "Urgent evaluation for expanding erythema with systemic symptoms. Emergency care for suspected necrotizing infection.",
    "Empiric antibiotics target streptococci/MSSA; MRSA coverage when risk factors. Elevation and comorbidity management matter.",
    [sym("spreading redness", ["expanding erythema", "cellulitis"], 2),
     sym("warm tender skin", ["hot skin patch"], 1.6),
     sym("fever with skin infection", ["fever and red skin"], 1.8)]
  ),
  cond(
    "Deep vein thrombosis (symptom overview)",
    "Thrombosis in deep veins, usually legs. Clinical prediction rules plus D-dimer/ultrasound pathways guide diagnosis — not self-diagnosis.",
    ["unilateral leg swelling", "calf pain", "warmth", "erythema", "leg heaviness"],
    ["signs of PE (pleuritic pain, dyspnea, hemoptysis, syncope)", "phlegmasia / threatened limb", "hemodynamic instability"],
    "Urgent medical assessment for possible DVT. Emergency care for PE symptoms or threatened limb. Do not start anticoagulants without clinical pathway.",
    "Anticoagulation is evidence-based once DVT/PE confirmed (or highly probable in selected protocols). Duration depends on provoked vs unprovoked and bleeding risk.",
    [sym("unilateral leg swelling", ["one leg swollen"], 2.2, "Asymmetry raises concern", "Bilateral chronic edema more often venous insufficiency/HF"),
     sym("calf pain", ["leg pain walking"], 1.4),
     sym("leg warmth and redness", ["hot calf"], 1.3)]
  ),
  cond(
    "Pulmonary embolism (overview)",
    "Venous thrombus embolizing to pulmonary arteries. Presentation ranges from subtle dyspnea to collapse.",
    ["sudden dyspnea", "pleuritic chest pain", "tachycardia", "hemoptysis", "syncope"],
    ["hypotension / shock", "severe hypoxemia", "syncope with suspected PE"],
    "Emergency care for suspected PE with instability. Urgent pathways for suspected PE without shock. This tool does not rule out PE.",
    "Diagnosis uses validated pathways (Wells/Geneva, D-dimer, CTPA/V/Q). Anticoagulation is standard when confirmed; thrombolysis reserved for selected massive PE.",
    [sym("sudden shortness of breath", ["sudden dyspnea"], 2.2),
     sym("pleuritic chest pain", ["pain on breathing"], 1.8),
     sym("coughing blood", ["hemoptysis"], 1.7)]
  ),
  cond(
    "Anemia (general overview)",
    "Low hemoglobin with diverse causes (iron deficiency, B12/folate, chronic disease, hemolysis, marrow disorders). Treat the cause, not only the number.",
    ["fatigue", "pallor", "dyspnea on exertion", "palpitations", "dizziness"],
    ["chest pain with anemia", "black stools / vomiting blood", "neurologic symptoms of B12 deficiency severe", "syncope"],
    "Seek care for progressive fatigue with pallor or bleeding signs. Emergency care for unstable bleeding or cardiac ischemia symptoms.",
    "Iron therapy helps iron deficiency; other anemias need different treatments. Blind iron use can harm hemochromatosis/other states.",
    [sym("fatigue with pallor", ["tired and pale"], 1.8),
     sym("dyspnea on exertion", ["winded easily"], 1.4),
     sym("black stools", ["melena"], 2.2, "Suggests GI bleeding — urgent", null)]
  ),
  cond(
    "Hypoglycemia",
    "Low blood glucose causing autonomic and neuroglycopenic symptoms — commonly medication-related in diabetes.",
    ["sweating", "tremor", "hunger", "confusion", "palpitations"],
    ["seizure", "loss of consciousness", "stroke-like deficit with low glucose"],
    "Treat known hypoglycemia per diabetes sick-day rules and seek help if severe/recurrent. Emergency care for seizure/unconsciousness (glucagon/EMS).",
    "Prevention focuses on medication review (insulin/sulfonylureas), meal timing, and education. Recheck glucose after treatment.",
    [sym("sweating and tremor", ["shaky sweaty"], 1.8, "In a person on insulin/sulfonylurea highly suggestive", "Panic attack can mimic"),
     sym("confusion with diabetes meds", ["odd behavior low sugar"], 2),
     sym("hunger sudden", ["sudden hunger"], 1.1)]
  ),
  cond(
    "Hyperthyroidism / thyrotoxicosis overview",
    "Excess thyroid hormone from Graves’, nodules, thyroiditis, or excess replacement. Symptoms overlap anxiety.",
    ["heat intolerance", "palpitations", "weight loss", "tremor", "anxiety"],
    ["thyroid storm features (fever, delirium, tachyarrhythmia)", "new AF with instability", "eye pain/vision change in Graves"],
    "Prompt clinician evaluation for suspected thyrotoxicosis. Emergency care for storm features. Do not adjust levothyroxine independently without advice.",
    "Antithyroid drugs, beta blockers for symptoms, radioiodine, and surgery are pathway-dependent. TSH suppression on replacement needs dose review.",
    [sym("heat intolerance", ["always hot", "heat sensitivity"], 1.5),
     sym("palpitations with weight loss", ["racing heart losing weight"], 1.8),
     sym("fine tremor", ["shaky hands"], 1.3)]
  ),
  cond(
    "Parkinson disease (overview)",
    "Neurodegenerative movement disorder with bradykinesia plus rest tremor/rigidity. Mimics include drug-induced parkinsonism.",
    ["rest tremor", "slowness of movement", "rigidity", "shuffling gait", "reduced arm swing"],
    ["sudden high fever with rigidity on antipsychotics (NMS)", "falls with head injury", "inability to swallow secretions"],
    "Neurology evaluation for suspected Parkinsonism. Emergency care for NMS-like presentations or serious aspiration.",
    "Levodopa remains most effective motor therapy; timing, complications, and non-motor symptoms need specialist frameworks.",
    [sym("rest tremor", ["pill rolling tremor"], 1.8),
     sym("slowness of movement", ["bradykinesia", "moves slowly"], 2),
     sym("shuffling gait", ["stooped shuffle"], 1.6)]
  ),
  cond(
    "Rheumatoid arthritis (overview)",
    "Autoimmune inflammatory arthritis, typically symmetric small joints, with systemic features and erosive potential.",
    ["morning stiffness >1 hour", "symmetric joint swelling", "hand/wrist pain", "fatigue"],
    ["hot swollen joint with fever (septic arthritis concern)", "rheumatoid lung/cardiac complications severe", "cervical instability symptoms"],
    "Rheumatology referral for suspected RA. Emergency care for septic arthritis possibility (single hot joint + fever).",
    "Early DMARD therapy (methotrexate anchor) improves outcomes. Steroids bridge; biologics/tsDMARDs for inadequate response.",
    [sym("morning stiffness", ["stiff hands in morning"], 1.8),
     sym("symmetric joint swelling", ["both hands swollen joints"], 2),
     sym("wrist pain inflammatory", ["painful swollen wrists"], 1.5)]
  ),
  cond(
    "Psoriasis",
    "Immune-mediated skin disease with plaques; associated with psoriatic arthritis and cardiometabolic comorbidity.",
    ["scaly plaques", "extensor surfaces", "nail pitting", "scalp scale", "itch"],
    ["erythroderma", "pustular psoriasis widespread", "joint destruction symptoms with fever"],
    "Dermatology care for moderate-severe disease. Urgent care for unstable widespread pustular/erythrodermic psoriasis.",
    "Topicals for limited disease; phototherapy/systemics/biologics for more extensive disease per guidelines.",
    [sym("scaly plaques", ["silvery scale plaques"], 2),
     sym("nail pitting", ["pitted nails"], 1.4),
     sym("scalp psoriasis", ["thick scalp scale"], 1.3)]
  ),
  cond(
    "Menopause / vasomotor symptoms",
    "Permanent cessation of menses with estrogen decline; vasomotor symptoms and genitourinary syndrome are common.",
    ["hot flashes", "night sweats", "vaginal dryness", "sleep disturbance", "irregular menses transitioning"],
    ["postmenopausal bleeding", "severe mood crisis / suicidality", "chest pain with hot sensations that could be cardiac"],
    "Discuss symptoms with clinician; postmenopausal bleeding needs evaluation. Emergency care for possible cardiac chest pain.",
    "Menopausal hormone therapy is most effective for vasomotor symptoms when appropriate; non-hormonal options exist. Risk–benefit is individualized (age, time since menopause, VTE/breast cancer risks).",
    [sym("hot flashes", ["hot flushes", "vasomotor"], 2),
     sym("night sweats", ["sweating at night"], 1.5),
     sym("vaginal dryness", ["GSM symptoms"], 1.3)]
  ),
  cond(
    "Benign prostatic hyperplasia (LUTS)",
    "Prostate enlargement contributing to lower urinary tract symptoms in many aging men. Overlap with infection, cancer, and neurologic bladder.",
    ["weak stream", "nocturia", "hesitancy", "incomplete emptying", "urgency"],
    ["inability to urinate", "fever with dysuria suggesting prostatitis/sepsis", "hematuria with weight loss"],
    "Urgent care for acute urinary retention. Evaluate infection/hematuria red flags. Discuss PSA testing pros/cons with clinician.",
    "Alpha blockers and 5-ARIs have evidence for LUTS/BPH; surgery for refractory obstruction. Rule out mimics.",
    [sym("weak urinary stream", ["poor flow"], 1.7),
     sym("nocturia", ["nighttime urination"], 1.3),
     sym("urinary hesitancy", ["difficulty starting urine"], 1.5)]
  ),
  cond(
    "Overactive bladder",
    "Urgency with or without urge incontinence, usually with frequency/nocturia, without infection or other obvious pathology.",
    ["urinary urgency", "frequency", "urge leakage", "nocturia"],
    ["red-flag hematuria", "neurologic deficits", "acute retention after starting anticholinergics"],
    "Seek care for hematuria, pain, or neurologic signs. Discuss behavioral therapies before/along with drugs.",
    "Bladder training and fluid management first-line. Antimuscarinics/beta-3 agonists have trial support; cognitive effects matter in elderly.",
    [sym("urinary urgency", ["sudden need to void"], 2),
     sym("urge incontinence", ["leak with urgency"], 1.8),
     sym("daytime frequency", ["urinates very often"], 1.3)]
  ),
  cond(
    "Glaucoma (chronic open-angle overview)",
    "Optic neuropathy often related to intraocular pressure, causing irreversible field loss if untreated. Early disease is asymptomatic.",
    ["gradual peripheral vision loss", "family history concern", "elevated IOP on exam", "halos uncommon in open-angle"],
    ["acute severe eye pain with nausea/halos (angle-closure)", "sudden vision loss"],
    "Emergency care for acute angle-closure symptoms. Routine eye exams detect open-angle disease early — not a symptom-first diagnosis.",
    "Pressure-lowering drops, laser, and surgery have evidence to slow progression. Adherence is critical.",
    [sym("gradual peripheral vision loss", ["tunnel vision gradual"], 1.6),
     sym("eye pain acute with nausea", ["severe eye pain vomiting"], 2.2, "Possible angle-closure emergency", null)]
  ),
  cond(
    "Otitis media (acute)",
    "Middle ear infection common in children; adults less often. Distinguish from otitis externa and referred pain.",
    ["ear pain", "fever", "hearing reduction", "irritability in children", "recent URI"],
    ["mastoid swelling", "neurologic signs", "severe vertigo with toxicity", "immunocompromise"],
    "Urgent care for severe symptoms or under-3 months with fever. Emergency for mastoiditis/neurologic signs.",
    "Many cases are viral/self-limited; antibiotics when criteria met (age, severity, bilateral). Analgesia is essential.",
    [sym("ear pain", ["otalgia", "earache"], 1.8),
     sym("fever with earache", ["fever ear pain"], 1.6),
     sym("reduced hearing brief", ["ear feels blocked"], 1.2)]
  ),
  cond(
    "Conjunctivitis (overview)",
    "Conjunctival inflammation — viral, bacterial, or allergic. Red flags distinguish sight-threatening disease.",
    ["red eye", "discharge", "gritty sensation", "itch (allergic)", "crusting"],
    ["severe pain", "photophobia with vision loss", "contact lens with white cornea spot", "vesicles on lid suggesting HSV", "pupil abnormality"],
    "Urgent ophthalmology for pain/photophobia/vision change/contact-lens keratitis suspicion. Allergic/viral cases often supportive.",
    "Avoid steroid drops without diagnosis. Antibiotics only when bacterial likely; stewardship important.",
    [sym("red eye with discharge", ["sticky red eye"], 1.6),
     sym("itchy watery eyes", ["allergic eye itch"], 1.5),
     sym("painful red eye vision change", ["red eye can't see"], 2.2, "Not simple conjunctivitis — urgent", null)]
  ),
  cond(
    "Low back pain (nonspecific overview)",
    "Most acute low back pain is nonspecific and improves with time. Red flags identify fracture, infection, cauda equina, malignancy.",
    ["lumbar ache", "muscle spasm", "pain worse with movement", "buttock referral"],
    ["saddle anesthesia", "new bowel/bladder incontinence", "progressive leg weakness", "fever with IVDU/back pain", "history of cancer with night pain"],
    "Emergency care for cauda equina signs. Urgent care for infection/cancer red flags. Imaging not routine early without red flags.",
    "Stay active, brief NSAID/analgesic courses if appropriate, and reassurance. Chronic pathways emphasize exercise and psychosocial factors.",
    [sym("low back pain", ["lumbago", "lumbar pain"], 1.5),
     sym("back spasm", ["muscle spasm back"], 1.2),
     sym("saddle numbness", ["numb between legs"], 2.5, "Cauda equina warning", null)]
  ),
  cond(
    "Tension-type headache",
    "Common primary headache with pressing bilateral pain and mild-moderate intensity, lacking migraine features usually.",
    ["bilateral pressing headache", "scalp tenderness", "mild photophobia alone uncommon", "stress association"],
    ["thunderclap onset", "fever/neck stiffness", "neurologic deficit", "new headache in pregnancy / cancer / immunosuppression"],
    "Emergency care for thunderclap or meningism. Recurrent headaches warrant clinician diagnosis to avoid missing migraine/secondary causes.",
    "Simple analgesics carefully to avoid medication-overuse headache; non-drug approaches emphasized. Not an excuse to miss secondary headache.",
    [sym("pressing bilateral headache", ["band-like headache"], 1.7),
     sym("stress headache", ["tension headache"], 1.3)]
  ),
  cond(
    "Medication-overuse headache",
    "Chronic headache from frequent acute headache medication use (often ≥10–15 days/month depending on agent). Diagnosis requires clinician input.",
    ["daily or near-daily headache", "frequent analgesic/triptan use", "morning headache", "partial relief only"],
    ["thunderclap", "focal neurology", "fever"],
    "Discuss prevention strategies with clinician; abrupt withdrawal of some agents needs supervision. Emergency for red-flag headaches.",
    "Prevention with appropriate prophylaxis and structured withdrawal of overused acute meds is guideline-supported.",
    [sym("daily headache with frequent painkillers", ["painkiller headache"], 2),
     sym("morning headache chronic", ["wake up headache every day"], 1.4)]
  ),
];
