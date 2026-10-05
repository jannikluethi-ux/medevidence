// Curated condition -> medicine links for "Find medicines by condition" (information-only reference).
//
// Rules (enforced by build.mjs):
//  - `ind` must match (substring) an indication that ALREADY exists in that medicine's data;
//    the exact indication text is copied into condition_medications.json.
//  - Links are hand-picked: only primary, medicine-specific indications are used. Several medicines
//    carry class-template indications that do not apply to them (e.g., opioid-pain rows on
//    loperamide/naloxone) — those are deliberately NOT used here.
//  - No ranking, no dosing. The page groups by form + prescription status and sorts A–Z.
//  - form: topical | oral | nasal | inhaled | injection
//  - avail: otc (non-prescription forms in many countries) | rx (prescription-only) | varies
//  - src (optional): source key that grounds THIS use (guideline or label); otherwise the medicine's own sources are shown.

const L = (med, ind, form, avail, note = null, src = null) => ({ med, ind, form, avail, note, src });

const PPI_NOTE = "Proton pump inhibitor. Low-strength packs for short-term heartburn are available without prescription in many countries; other uses are prescription-only.";
const HP_NOTE = "Used only as part of combination regimens to clear H. pylori (a common cause of ulcers) — not on its own.";
const OTC_PAIN = "Pain relief. NHS self-care advice names paracetamol or ibuprofen.";

export const CONDITION_MEDS = [
  {
    condition: "Burns (minor, superficial)",
    links: [
      L("Paracetamol (Acetaminophen)", "Mild to moderate pain", "oral", "otc", "Pain relief while a minor burn heals — NHS first-aid advice names paracetamol or ibuprofen.", "nhs_burns"),
      L("Ibuprofen", "Mild to moderate pain", "oral", "otc", "Pain relief while a minor burn heals — NHS first-aid advice names paracetamol or ibuprofen.", "nhs_burns"),
      L("Lidocaine", "Temporary relief of pain from minor burns", "topical", "varies", "Some non-prescription lidocaine gels/sprays are labelled for minor burn pain (e.g., in the US). NHS and WHO first-aid advice is not to put creams on a fresh burn — cool it first and ask a pharmacist before applying anything.", "label_lidocaine_burn"),
      L("Povidone-iodine (topical antiseptic)", "First aid to help prevent infection in minor cuts", "topical", "otc", "Antiseptic labelled to help prevent infection in minor burns. Not for large, deep or serious burns; avoid with thyroid disease. Cool the burn first — first-aid guidance advises against applying products to a fresh burn.", "label_pvpi_firstaid"),
      L("Silver sulfadiazine", "Adjunct for prevention and treatment of wound infection", "topical", "rx", "Prescription-only. Labelled for deeper (second- and third-degree) burns treated by a clinician — listed for reference, not for self-treatment of minor burns.", "label_ssd"),
    ],
  },
  {
    condition: "Sunburn",
    links: [
      L("Paracetamol (Acetaminophen)", "Mild to moderate pain", "oral", "otc", OTC_PAIN, "nhs_sunburn"),
      L("Ibuprofen", "Mild to moderate pain", "oral", "otc", OTC_PAIN, "nhs_sunburn"),
      L("Lidocaine", "Temporary relief of pain from minor burns and sunburn", "topical", "varies", "Some non-prescription lidocaine gels/sprays are labelled for sunburn pain (e.g., in the US) — check the individual product leaflet.", "label_lidocaine_burn"),
    ],
  },
  {
    condition: "Gastroesophageal reflux disease (GERD)",
    links: [
      L("Calcium carbonate (antacid)", "Relief of heartburn", "oral", "otc", "Antacid for occasional heartburn; short-term relief only.", "label_caco3_antacid"),
      L("Famotidine", "Heartburn / GERD / ulcers as labeled", "oral", "varies", "H2-receptor antagonist. Low-strength non-prescription packs exist in some countries."),
      L("Omeprazole", "Gastroesophageal reflux disease (GERD)", "oral", "varies", PPI_NOTE, "nhs_heartburn"),
      L("Esomeprazole", "Gastroesophageal reflux disease (GERD)", "oral", "varies", PPI_NOTE, "nhs_heartburn"),
      L("Pantoprazole", "Gastroesophageal reflux disease (GERD)", "oral", "varies", PPI_NOTE, "nhs_heartburn"),
      L("Lansoprazole", "Gastroesophageal reflux disease (GERD)", "oral", "varies", PPI_NOTE, "nhs_heartburn"),
      L("Rabeprazole", "Gastroesophageal reflux disease (GERD)", "oral", "rx", "Proton pump inhibitor."),
      L("Dexlansoprazole", "Gastroesophageal reflux disease (GERD)", "oral", "rx", "Proton pump inhibitor (not marketed in every country)."),
      L("Metoclopramide", "Symptomatic GERD in adults", "oral", "rx", "US label only, short-term; boxed warning for tardive dyskinesia. Since 2013 the EU no longer supports its use for chronic conditions such as reflux.", "ema_metoclopramide"),
    ],
  },
  {
    condition: "Peptic ulcer disease",
    links: [
      L("Omeprazole", "Peptic ulcer disease / H. pylori", "oral", "rx", "Proton pump inhibitor."),
      L("Esomeprazole", "H. pylori eradication (combination regimens)", "oral", "rx", "Proton pump inhibitor."),
      L("Lansoprazole", "Peptic ulcer disease", "oral", "rx", "Proton pump inhibitor."),
      L("Pantoprazole", "Peptic ulcer disease", "oral", "rx", "Proton pump inhibitor."),
      L("Rabeprazole", "Peptic ulcer disease", "oral", "rx", "Proton pump inhibitor."),
      L("Famotidine", "Peptic ulcer disease", "oral", "rx", "H2-receptor antagonist."),
      L("Amoxicillin", "H. pylori combination regimens", "oral", "rx", HP_NOTE),
      L("Clarithromycin", "H. pylori regimens (clarithromycin-containing)", "oral", "rx", HP_NOTE),
      L("Metronidazole", "H. pylori regimens", "oral", "rx", HP_NOTE),
    ],
  },
  {
    condition: "Tension-type headache",
    links: [
      L("Paracetamol (Acetaminophen)", "Mild to moderate pain", "oral", "otc", "Pain relief. Using pain relievers on many days a month can cause medication-overuse headache."),
      L("Ibuprofen", "Mild to moderate pain", "oral", "otc", "Pain relief. Using pain relievers on many days a month can cause medication-overuse headache."),
      L("Aspirin (low-dose / antiplatelet)", "Pain/fever (higher doses)", "oral", "otc", "Higher-strength aspirin products only (not low-dose 'cardio' aspirin). Not for children and teenagers (Reye's syndrome)."),
      L("Naproxen", "Pain (mild to moderate)", "oral", "varies", "NSAID pain reliever."),
      L("Amitriptyline", "Migraine and tension-type headache prophylaxis", "oral", "rx", "Prescribed by a doctor to prevent frequent headaches; licensing for this use varies by country."),
    ],
  },
  {
    condition: "Migraine",
    links: [
      L("Sumatriptan", "Acute migraine treatment", "oral", "varies", "Triptan for migraine attacks; also nasal spray and injection. Some low-strength tablets are pharmacy medicines in a few countries."),
      L("Rizatriptan", "Acute treatment of migraine", "oral", "rx", "Triptan for migraine attacks."),
      L("Paracetamol (Acetaminophen)", "Mild to moderate pain", "oral", "otc", "Pain relief during attacks; guidelines (e.g., NICE) include paracetamol for acute migraine.", "nice"),
      L("Ibuprofen", "Mild to moderate pain", "oral", "otc", "Pain relief during attacks; guidelines (e.g., NICE) include ibuprofen for acute migraine.", "nice"),
      L("Aspirin (low-dose / antiplatelet)", "Pain/fever (higher doses)", "oral", "otc", "Higher-strength aspirin products only (not low-dose 'cardio' aspirin); guidelines (e.g., NICE) include aspirin for acute migraine. Not for children and teenagers.", "nice"),
      L("Metoclopramide", "Short-term prevention/treatment of nausea and vomiting", "oral", "rx", "For nausea that comes with migraine attacks; short-term use only (neurological side-effects)."),
      L("Propranolol", "Migraine prophylaxis", "oral", "rx", "Prescribed to reduce how often attacks happen."),
      L("Topiramate", "Migraine prophylaxis", "oral", "rx", "Prescribed to reduce how often attacks happen. Harmful in pregnancy — pregnancy-prevention requirements apply."),
      L("Amitriptyline", "Migraine and tension-type headache prophylaxis", "oral", "rx", "Prescribed to reduce how often attacks happen; licensing for this use varies by country."),
    ],
  },
  {
    condition: "Allergic rhinitis",
    links: [
      L("Cetirizine", "Allergic rhinitis", "oral", "otc", "Non-sedating antihistamine (some people still feel drowsy)."),
      L("Loratadine", "Allergic rhinitis / urticaria", "oral", "otc", "Non-sedating antihistamine."),
      L("Fexofenadine", "Allergic rhinitis", "oral", "varies", "Non-sedating antihistamine."),
      L("Desloratadine", "Allergic rhinitis", "oral", "varies", "Non-sedating antihistamine."),
      L("Levocetirizine", "Allergic rhinitis", "oral", "varies", "Non-sedating antihistamine."),
      L("Bilastine", "Allergic rhinoconjunctivitis", "oral", "varies", "Non-sedating antihistamine."),
      L("Diphenhydramine", "Allergic rhinitis", "oral", "otc", "Older, sedating antihistamine — causes drowsiness and can impair driving."),
      L("Montelukast", "Allergic rhinitis (selected)", "oral", "rx", "Leukotriene receptor antagonist; carries a warning about mood and behaviour changes."),
      L("Mometasone (nasal)", "Seasonal and perennial allergic rhinitis", "nasal", "varies", "Steroid nasal spray."),
      L("Xylometazoline", "Nasal congestion in allergic rhinitis", "nasal", "otc", "Decongestant spray for short-term use only (labels typically limit use to about 7 days — longer use can cause rebound congestion)."),
    ],
  },
  {
    condition: "Urinary tract infection (cystitis)",
    links: [
      L("Nitrofurantoin", "Uncomplicated lower UTI", "oral", "rx", "Antibiotic."),
      L("Fosfomycin", "Uncomplicated cystitis in women", "oral", "rx", "Antibiotic (single-dose sachet)."),
      L("Trimethoprim", "Uncomplicated lower urinary tract infection", "oral", "rx", "Antibiotic."),
      L("Trimethoprim/sulfamethoxazole", "UTI (susceptible organisms)", "oral", "rx", "Antibiotic."),
      L("Cefalexin (Cephalexin)", "Urinary tract infections", "oral", "rx", "Antibiotic."),
      L("Cefuroxime", "Uncomplicated urinary tract infections", "oral", "rx", "Antibiotic."),
      L("Ciprofloxacin", "Complicated UTI / pyelonephritis", "oral", "rx", "Fluoroquinolone antibiotic — reserved for complicated infections because of serious side-effect warnings."),
    ],
  },
  {
    condition: "Common cold (viral upper respiratory infection)",
    links: [
      L("Paracetamol (Acetaminophen)", "Mild to moderate pain", "oral", "otc", "Relief of aches, sore throat and fever. Antibiotics do not help colds."),
      L("Ibuprofen", "Mild to moderate pain", "oral", "otc", "Relief of aches, sore throat and fever. Antibiotics do not help colds."),
      L("Xylometazoline", "Nasal congestion due to common cold", "nasal", "otc", "Decongestant spray for short-term use only (labels typically limit use to about 7 days)."),
    ],
  },
  {
    condition: "Influenza (flu)",
    links: [
      L("Oseltamivir", "Influenza treatment (within early symptom window)", "oral", "rx", "Antiviral; works best when started within about 48 hours of symptoms."),
      L("Paracetamol (Acetaminophen)", "Fever", "oral", "otc", "Relief of fever and aches."),
      L("Ibuprofen", "Fever", "oral", "otc", "Relief of fever and aches."),
    ],
  },
  {
    condition: "Constipation (functional)",
    links: [
      L("Macrogol (Polyethylene glycol)", "Chronic constipation", "oral", "otc", "Osmotic laxative."),
      L("Lactulose", "Constipation", "oral", "varies", "Osmotic laxative."),
      L("Bisacodyl", "Constipation (short-term)", "oral", "otc", "Stimulant laxative for short-term use."),
    ],
  },
  {
    condition: "Acute gastroenteritis (stomach bug)",
    links: [
      L("Loperamide", "Acute nonspecific diarrhea", "oral", "otc", "Relieves diarrhoea in adults. Not for bloody diarrhoea, high fever or young children. Oral rehydration (drinking fluids / rehydration solution) is the mainstay of care."),
    ],
  },
  {
    condition: "Insomnia disorder",
    links: [
      L("Zolpidem", "Short-term insomnia", "oral", "rx", "Short-term use only; risk of dependence and next-day impairment."),
      L("Zopiclone", "Short-term insomnia", "oral", "rx", "Short-term use only; risk of dependence and next-day impairment."),
      L("Melatonin", "Insomnia / jet lag", "oral", "varies", "Licensing differs by country (medicine in some, supplement in others)."),
    ],
  },
  {
    condition: "Gout",
    links: [
      L("Colchicine", "Acute gout; prophylaxis", "oral", "rx", "For flares and flare prevention."),
      L("Etoricoxib", "Acute gouty arthritis (short-term)", "oral", "rx", "NSAID (not approved in the US)."),
      L("Allopurinol", "Chronic gout / hyperuricemia", "oral", "rx", "Long-term urate-lowering treatment."),
      L("Febuxostat", "Chronic hyperuricaemia in gout", "oral", "rx", "Long-term urate-lowering treatment."),
    ],
  },
  {
    condition: "Iron deficiency anemia",
    links: [
      L("Ferrous sulfate", "Iron deficiency anemia", "oral", "varies", "Oral iron. The cause of iron deficiency should be investigated by a doctor."),
      L("Ferric carboxymaltose", "Iron deficiency when oral iron is ineffective", "injection", "rx", "Intravenous iron given in clinic or hospital."),
    ],
  },
  {
    condition: "Hypothyroidism",
    links: [
      L("Levothyroxine", "Hypothyroidism (replacement)", "oral", "rx", "Thyroid hormone replacement; dose is set from blood tests."),
    ],
  },
  {
    condition: "Eczema / atopic dermatitis",
    links: [
      L("Tacrolimus", "Moderate–severe atopic dermatitis (topical ointment", "topical", "rx", "Topical ointment (e.g., Protopic) — not the same as tacrolimus tablets."),
      L("Hydroxyzine", "Pruritus (urticaria, atopic dermatitis)", "oral", "rx", "Sedating antihistamine for itch."),
    ],
  },
  {
    condition: "Pharyngitis / tonsillitis",
    links: [
      L("Paracetamol (Acetaminophen)", "Mild to moderate pain", "oral", "otc", "Pain and fever relief. Most sore throats are viral and get better without antibiotics."),
      L("Ibuprofen", "Mild to moderate pain", "oral", "otc", "Pain and fever relief. Most sore throats are viral and get better without antibiotics."),
      L("Phenoxymethylpenicillin (Penicillin V)", "Streptococcal pharyngitis / tonsillitis", "oral", "rx", "Antibiotic — only for bacterial (streptococcal) infection."),
      L("Amoxicillin", "Otitis media / streptococcal pharyngitis", "oral", "rx", "Antibiotic — only for bacterial infection."),
    ],
  },
  {
    condition: "Cellulitis",
    links: [
      L("Flucloxacillin", "Staphylococcal skin and soft-tissue infections", "oral", "rx", "Antibiotic (not marketed in the US)."),
      L("Cefalexin (Cephalexin)", "Skin and soft-tissue infections", "oral", "rx", "Antibiotic."),
      L("Clindamycin", "Skin/soft tissue infections", "oral", "rx", "Antibiotic."),
      L("Phenoxymethylpenicillin (Penicillin V)", "Mild–moderate skin infections such as erysipelas", "oral", "rx", "Antibiotic for streptococcal skin infection."),
    ],
  },
  {
    condition: "Osteoarthritis",
    links: [
      L("Paracetamol (Acetaminophen)", "Osteoarthritis symptomatic relief", "oral", "otc", "Pain relief; benefit in osteoarthritis is modest."),
      L("Ibuprofen", "Inflammatory conditions (e.g., osteoarthritis", "oral", "otc", "NSAID; long-term use carries stomach, heart and kidney risks."),
      L("Naproxen", "Inflammatory conditions (e.g., osteoarthritis", "oral", "varies", "NSAID; long-term use carries stomach, heart and kidney risks."),
      L("Diclofenac", "Inflammatory conditions (e.g., osteoarthritis", "oral", "rx", "NSAID; long-term use carries stomach, heart and kidney risks."),
      L("Celecoxib", "Inflammatory conditions (e.g., osteoarthritis", "oral", "rx", "COX-2 selective NSAID."),
      L("Etoricoxib", "Osteoarthritis and rheumatoid arthritis symptoms", "oral", "rx", "COX-2 selective NSAID (not approved in the US)."),
    ],
  },
  {
    condition: "Asthma",
    links: [
      L("Salbutamol (Albuterol)", "Acute bronchospasm relief", "inhaled", "rx", "Reliever inhaler."),
      L("Budesonide/formoterol", "Asthma maintenance (and MART where licensed)", "inhaled", "rx", "Combination inhaler; in some plans used as both preventer and reliever."),
      L("Beclometasone/formoterol", "Asthma maintenance", "inhaled", "rx", "Combination inhaler."),
      L("Fluticasone/salmeterol", "Asthma maintenance", "inhaled", "rx", "Combination preventer inhaler."),
      L("Fluticasone furoate/vilanterol", "Asthma maintenance", "inhaled", "rx", "Combination preventer inhaler."),
      L("Budesonide (inhaled)", "Asthma maintenance", "inhaled", "rx", "Steroid preventer inhaler."),
      L("Beclomethasone (inhaled)", "Asthma maintenance", "inhaled", "rx", "Steroid preventer inhaler."),
      L("Fluticasone (inhaled)", "Asthma maintenance", "inhaled", "rx", "Steroid preventer inhaler."),
      L("Montelukast", "Asthma maintenance (not acute rescue)", "oral", "rx", "Add-on tablet; not for an acute attack."),
    ],
  },
  {
    condition: "Anaphylaxis",
    links: [
      L("Epinephrine (Adrenaline)", "Emergency treatment of anaphylaxis", "injection", "rx", "Adrenaline auto-injector. After using it, call 144 (CH) / 112 (EU)."),
    ],
  },
];
