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
  // Added 2026-10-05 for "Find medicines by condition". First-aid wording follows NHS "Burns and scalds"
  // (reviewed 31 Mar 2026), NHS "Sunburn" (reviewed 24 Nov 2025) and the WHO burns fact sheet.
  {
    name: "Burns (minor, superficial)",
    summary: "A minor (superficial) burn damages only the top layer(s) of skin. It is usually caused by dry heat (e.g., a hot pan or iron), hot liquids or steam (scalds). The skin is red and painful and may form small blisters. Small superficial burns can often be cared for at home and usually heal within about 2 weeks. Large, deep, chemical or electrical burns are different — they need medical care.",
    typical_symptoms: ["Red, painful skin", "Swelling", "Small blisters (in partial-thickness burns)", "Peeling skin as it heals"],
    red_flags: [
      "Large burns (bigger than the injured person's hand), deep burns, or burns that look charred, white, brown or leathery — deep burns may hurt less, not more",
      "Burns on the face, hands, feet, genitals, bottom, or over a major joint (e.g., knee, elbow, shoulder)",
      "Chemical burns (acids, alkalis, cleaning products) or electrical burns, including from a low-voltage source",
      "Any burn in a baby or child under 5, an older adult (over 60), or someone pregnant, with diabetes, heart, lung or liver disease, or a weakened immune system",
      "Smoke inhalation or burns near the mouth or nose: cough, hoarse voice, noisy or difficult breathing, soot around the nose or mouth, singed nasal hair or eyebrows",
      "Burns that go all the way around a limb, the neck or the chest",
      "Signs of shock (pale, clammy skin, fast breathing, confusion, fainting)",
      "Signs of infection while healing: increasing pain, spreading redness or swelling, pus, a bad smell, or fever",
    ],
    when_to_seek_care: "Call 144 (Switzerland) or 112 (EU), or go to an emergency department, for any burn with a red flag above. Do not drive yourself. Ask a pharmacist or doctor if you are not sure how serious a burn is, if it is not healing after 2 weeks, or if it shows signs of infection.",
    evidence_overview: "First-aid advice (cool running water for 20 minutes, no ice, butter, oils or creams, cover loosely) follows NHS and WHO guidance. Medicines listed for this condition relieve pain or are labelled to help prevent infection — none is shown to make minor burns heal faster.",
    first_aid: [
      "Stop the burning: move away from the heat source. For electrical burns, switch off the power before touching the person.",
      "Cool the burn under cool running water for 20 minutes, as soon as possible (it still helps up to 3 hours after the injury). If there is no running water, use cool bottled water or a wet towel.",
      "Do not use ice or iced water, and do not put butter, oils, toothpaste or creams on a fresh burn.",
      "Remove clothing and jewellery near the burn — but not anything stuck to the skin.",
      "Keep the person warm (especially children) while you cool the burn itself, to avoid getting too cold.",
      "Once cooled, cover the burn loosely with cling film laid on top (not wrapped around) or a clean, non-fluffy dressing. Do not use plasters or sticky dressings.",
      "Do not burst blisters.",
      "Paracetamol or ibuprofen can help with pain — follow the leaflet and ask a pharmacist if you are unsure.",
    ],
    symptoms: [
      S("thermal skin injury", ["burnt skin", "burned skin", "scald", "scalded skin", "skin burned by hot liquid", "touched something hot"], 3),
      S("red, painful skin after heat contact", ["red painful skin after touching something hot"], 2),
      S("blistering after heat or hot liquid", ["blister after scald"], 1.5),
    ],
  },
  {
    name: "Sunburn",
    summary: "Sunburn is skin damage caused by too much ultraviolet (UV) light from the sun or sunbeds. Skin feels hot, sore or painful and may flake or peel after a few days; severe sunburn can blister. It usually gets better within about 7 days. Repeated sunburn increases the risk of skin cancer.",
    typical_symptoms: ["Skin that feels hot, sore or painful", "Redness (may be less visible on black or brown skin)", "Flaking or peeling after a few days", "Blisters in severe sunburn"],
    red_flags: [
      "Blistered or swollen skin, especially over a large area",
      "Very high temperature, or feeling hot, cold or shivery",
      "Feeling very tired, dizzy or sick, headache, or muscle cramps (possible heat exhaustion)",
      "Confusion, fainting or collapse (possible heatstroke) — call 144 (CH) / 112 (EU)",
      "Any sunburn in a baby or young child",
    ],
    when_to_seek_care: "Get urgent medical advice (doctor, pharmacist or a medical helpline) if the skin is blistered or swollen, you feel hot, shivery, very tired, dizzy or sick, have a headache or cramps, or a baby or young child is sunburnt. Severe sunburn can come with heat exhaustion or heatstroke; for confusion, collapse or a very high temperature call 144 (Switzerland) or 112 (EU).",
    evidence_overview: "Self-care advice follows NHS guidance. Pain relievers (paracetamol, ibuprofen) relieve discomfort; no medicine reverses UV skin damage.",
    first_aid: [
      "Get out of the sun as soon as possible.",
      "Cool the skin with a cool shower, bath or damp towel (take care that babies and young children do not get too cold).",
      "Apply an after-sun cream or spray, or an unperfumed moisturiser. Do not use petroleum jelly, ice or ice packs.",
      "Drink plenty of water and avoid alcohol.",
      "Do not pop blisters, scratch, or pull off peeling skin; avoid tight clothing over the sunburn.",
      "Paracetamol or ibuprofen can help with pain — follow the leaflet and ask a pharmacist if you are unsure.",
      "Keep sunburnt skin covered from direct sunlight until it has fully healed.",
    ],
    symptoms: [
      S("red, sore skin after sun exposure", ["sunburnt skin", "sunburned skin", "sunburn", "sun burn", "sonnenbrand", "coup de soleil", "scottatura solare"], 3),
      S("peeling skin after sun exposure", ["peeling sunburn"], 1.5),
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
