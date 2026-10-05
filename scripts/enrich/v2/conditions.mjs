// New conditions (conservative educational content) + extra symptom links on existing conditions.
const S = (symptom, synonyms, weight, supporting = null, against = null) => ({ symptom, synonyms, weight, supporting, against });

export const CONDITIONS_V2 = [
  {
    name: "Acute coronary syndrome (heart attack / unstable angina)",
    summary: "Acute coronary syndrome (ACS) covers heart attack (myocardial infarction) and unstable angina — reduced blood flow to the heart muscle, usually from a blocked coronary artery. It is a medical emergency; outcomes depend strongly on rapid treatment.",
    typical_symptoms: ["Chest pain, pressure or tightness (often >15 minutes)", "Pain spreading to arm, jaw, neck, back or upper abdomen", "Shortness of breath", "Sweating, nausea, lightheadedness", "Atypical presentations (e.g., breathlessness or fatigue only) are more common in women, older adults and people with diabetes"],
    red_flags: ["Chest pain or pressure lasting more than a few minutes", "Chest pain with breathlessness, sweating, nausea or fainting", "Collapse / loss of consciousness"],
    when_to_seek_care: "Call emergency services immediately (CH 144, EU 112, US 911, UK 999). Do not drive yourself. This site cannot assess chest pain.",
    evidence_overview: "Guidelines (ESC, AHA/ACC) emphasise immediate emergency assessment with ECG and troponin; time to reperfusion is strongly linked to outcomes.",
    symptoms: [
      S("chest pain", ["chest pressure", "chest tightness", "crushing chest pain"], 3, "Pressure-like, with exertion or at rest, radiating", "Sharp pain reproduced by pressing the chest wall is less typical (but does not exclude ACS)"),
      S("pain radiating to arm or jaw", ["left arm pain", "jaw pain"], 2.5),
      S("shortness of breath", ["breathlessness"], 1.5),
      S("cold sweat", ["sweating with chest pain"], 2),
      S("nausea", ["feeling sick"], 0.8),
      S("lightheadedness", ["dizziness", "near fainting"], 1),
    ],
  },
  {
    name: "Influenza (flu)",
    summary: "Influenza is an acute viral respiratory infection with seasonal epidemics (in Switzerland typically December–March). It usually starts suddenly with fever, muscle aches and cough. Most healthy adults recover within 1–2 weeks, but complications such as pneumonia are more likely in older people, pregnancy, and chronic illness.",
    typical_symptoms: ["Sudden fever and chills", "Muscle and body aches", "Dry cough", "Headache", "Marked tiredness", "Sore throat"],
    red_flags: ["Difficulty breathing or chest pain", "Confusion or drowsiness", "Fever that returns after improving", "Signs of dehydration", "High-risk groups (pregnancy, age 65+, chronic disease, immunosuppression)"],
    when_to_seek_care: "Seek medical advice early if you are in a high-risk group or symptoms are severe; seek urgent care for breathing difficulty, chest pain or confusion.",
    evidence_overview: "Vaccination reduces risk of infection and complications (WHO, FOPH/BAG). Antivirals such as oseltamivir modestly shorten illness when started early; benefit is greatest in high-risk patients (clinician decision).",
    symptoms: [
      S("fever", ["high temperature"], 1.5, "Sudden onset"),
      S("muscle aches", ["body aches", "myalgia"], 2, "Prominent generalised aches"),
      S("dry cough", ["cough"], 1.2),
      S("headache", [], 0.6),
      S("fatigue", ["exhaustion"], 1),
      S("chills", ["shivering"], 1.5),
    ],
  },
  {
    name: "Common cold (viral upper respiratory infection)",
    summary: "The common cold is a mild viral infection of the nose and throat (often rhinovirus). Symptoms build over 1–3 days and usually settle within 7–10 days, although cough can linger. Antibiotics do not help.",
    typical_symptoms: ["Runny or blocked nose", "Sneezing", "Sore or scratchy throat", "Mild cough", "Low-grade or no fever"],
    red_flags: ["High fever or symptoms lasting more than 10 days without improvement", "Shortness of breath", "Severe facial pain or swelling", "Earache in children"],
    when_to_seek_care: "Self-limiting in most people; see a clinician if symptoms are severe, last longer than expected, or you have breathing difficulty or a chronic lung condition.",
    evidence_overview: "Cochrane reviews show antibiotics do not benefit colds; symptomatic relief options (analgesics, decongestants for short periods) have modest effects.",
    symptoms: [
      S("runny nose", ["rhinorrhoea"], 2),
      S("nasal congestion", ["blocked nose", "stuffy nose"], 1.5),
      S("sneezing", [], 1.5),
      S("sore throat", ["scratchy throat"], 1.2),
      S("cough", [], 0.8),
    ],
  },
  {
    name: "Acute gastroenteritis (stomach bug)",
    summary: "Acute gastroenteritis is an infection or inflammation of the gut — most often viral (e.g., norovirus) — causing diarrhoea and/or vomiting, usually resolving within a few days. The main risk is dehydration, particularly in young children and older adults.",
    typical_symptoms: ["Diarrhoea", "Nausea and vomiting", "Abdominal cramps", "Low-grade fever"],
    red_flags: ["Signs of dehydration (very little urine, dizziness on standing, dry mouth)", "Blood in stool or black stools", "Persistent vomiting preventing fluid intake", "Severe abdominal pain", "Symptoms lasting more than a few days, or recent travel/antibiotic use"],
    when_to_seek_care: "Seek care urgently for dehydration, bloody diarrhoea, severe pain or persistent vomiting; infants, older adults and immunocompromised people should seek advice earlier.",
    evidence_overview: "Oral rehydration is the cornerstone of management (WHO). Antibiotics are usually not needed for viral gastroenteritis.",
    symptoms: [
      S("diarrhea", ["diarrhoea", "loose stools"], 2),
      S("vomiting", ["throwing up"], 2),
      S("nausea", ["feeling sick"], 1.2),
      S("abdominal cramps", ["stomach cramps"], 1.5),
      S("fever", [], 0.6),
    ],
  },
];

// condition name -> additional symptom rows
export const EXTRA_SYMPTOMS_V2 = {
  "Anemia (general overview)": [S("dizziness", ["lightheadedness"], 1)],
  "Atrial fibrillation": [S("dizziness", ["lightheadedness"], 0.8)],
  "Hypoglycemia": [S("dizziness", ["lightheadedness"], 1)],
  "Type 2 diabetes mellitus": [S("numbness or tingling in feet", ["pins and needles in feet"], 1, "Peripheral neuropathy can develop with longstanding diabetes")],
  "Low back pain (nonspecific overview)": [S("pain or tingling radiating down the leg", ["sciatica"], 1, null, "New leg weakness, saddle numbness or bladder/bowel change are red flags")],
  "Migraine": [S("vomiting with headache", ["vomiting"], 0.8)],
};
