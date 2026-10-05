// Class / lay terms that expand to several medications (search & recognition only).
const ANTICOAG = ["Warfarin", "Phenprocoumon", "Acenocoumarol", "Apixaban", "Rivaroxaban", "Edoxaban", "Dabigatran", "Heparin (unfractionated)", "Enoxaparin"];
const DOAC = ["Apixaban", "Rivaroxaban", "Edoxaban", "Dabigatran"];
const VKA = ["Phenprocoumon", "Acenocoumarol", "Warfarin"];
const ANTIPLT = ["Aspirin (low-dose / antiplatelet)", "Clopidogrel", "Prasugrel", "Ticagrelor"];
const STATINS = ["Atorvastatin", "Rosuvastatin", "Simvastatin", "Pravastatin", "Pitavastatin", "Lovastatin"];
const LIPID = [...STATINS, "Ezetimibe", "Fenofibrate", "Evolocumab"];
const DIURETICS = ["Furosemide", "Torsemide", "Bumetanide", "Hydrochlorothiazide", "Chlorthalidone", "Indapamide", "Spironolactone", "Eplerenone"];
const ABX = ["Amoxicillin", "Amoxicillin/clavulanate", "Phenoxymethylpenicillin (Penicillin V)", "Flucloxacillin", "Cefuroxime", "Cefalexin (Cephalexin)", "Ceftriaxone", "Azithromycin", "Clarithromycin", "Doxycycline", "Minocycline", "Ciprofloxacin", "Levofloxacin", "Moxifloxacin", "Ofloxacin", "Trimethoprim/sulfamethoxazole", "Trimethoprim", "Nitrofurantoin", "Fosfomycin", "Clindamycin", "Metronidazole", "Gentamicin", "Vancomycin", "Linezolid", "Aztreonam", "Rifampin", "Rifaximin"];
const PAIN = ["Paracetamol (Acetaminophen)", "Ibuprofen", "Metamizole (Dipyrone)", "Naproxen", "Diclofenac", "Mefenamic acid", "Celecoxib", "Etoricoxib", "Tramadol", "Codeine", "Tapentadol", "Morphine", "Oxycodone"];
const NSAID = ["Ibuprofen", "Naproxen", "Diclofenac", "Mefenamic acid", "Celecoxib", "Etoricoxib", "Meloxicam", "Indomethacin", "Ketorolac"];
const OPIOID = ["Tramadol", "Codeine", "Tapentadol", "Morphine", "Oxycodone", "Hydrocodone", "Hydromorphone", "Fentanyl", "Buprenorphine", "Methadone"];
const SLEEP = ["Zolpidem", "Zopiclone", "Eszopiclone", "Temazepam", "Melatonin", "Diphenhydramine"];
const BENZO = ["Diazepam", "Lorazepam", "Oxazepam", "Alprazolam", "Clonazepam", "Temazepam"];
const SSRI = ["Sertraline", "Escitalopram", "Citalopram", "Fluoxetine", "Paroxetine", "Fluvoxamine"];
const ANTIDEP = [...SSRI, "Venlafaxine", "Desvenlafaxine", "Duloxetine", "Mirtazapine", "Bupropion", "Trazodone", "Vortioxetine", "Amitriptyline"];
const PPI = ["Omeprazole", "Esomeprazole", "Pantoprazole", "Lansoprazole", "Rabeprazole", "Dexlansoprazole"];
const INHALERS = ["Salbutamol (Albuterol)", "Budesonide/formoterol", "Beclometasone/formoterol", "Fluticasone/salmeterol", "Fluticasone furoate/vilanterol", "Fluticasone (inhaled)", "Budesonide (inhaled)", "Beclomethasone (inhaled)", "Tiotropium", "Umeclidinium/vilanterol", "Ipratropium"];
const ICS = ["Beclomethasone (inhaled)", "Budesonide (inhaled)", "Fluticasone (inhaled)"];
const PILL = ["Oral contraceptives (combined) — class overview", "Ethinylestradiol contraceptives", "Desogestrel (progestogen-only pill)"];
const EC = ["Levonorgestrel emergency contraception", "Ulipristal acetate"];
const STEROIDS = ["Prednisone / Prednisolone", "Methylprednisolone", "Dexamethasone"];
const GLP1 = ["Semaglutide", "Liraglutide", "Dulaglutide", "Tirzepatide"];
const WEIGHT = ["Semaglutide", "Liraglutide", "Tirzepatide"];
const ANTIHIST = ["Cetirizine", "Levocetirizine", "Loratadine", "Desloratadine", "Fexofenadine", "Bilastine", "Diphenhydramine", "Hydroxyzine"];
const BB = ["Metoprolol", "Bisoprolol", "Atenolol", "Carvedilol", "Nebivolol", "Propranolol", "Labetalol", "Sotalol"];
const ACEI = ["Lisinopril", "Ramipril", "Enalapril", "Perindopril", "Benazepril"];
const ARB = ["Losartan", "Valsartan", "Candesartan", "Irbesartan", "Olmesartan", "Telmisartan"];
const CCB = ["Amlodipine", "Nifedipine", "Felodipine", "Diltiazem", "Verapamil"];
const BP = [...ACEI, ...ARB, "Amlodipine", "Nifedipine", "Felodipine", "Hydrochlorothiazide", "Chlorthalidone", "Indapamide", "Metoprolol", "Bisoprolol", "Nebivolol"];
const INSULIN = ["Insulin glargine", "Insulin degludec", "Insulin aspart", "Insulin lispro"];
const DMTAB = ["Metformin", "Gliclazide", "Glimepiride", "Sitagliptin", "Linagliptin", "Empagliflozin", "Dapagliflozin", "Canagliflozin", "Pioglitazone"];
const SGLT2 = ["Empagliflozin", "Dapagliflozin", "Canagliflozin"];
const DPP4 = ["Sitagliptin", "Linagliptin"];
const ANTIFUNGAL = ["Fluconazole", "Terbinafine", "Clotrimazole"];
const ANTIVIRAL = ["Aciclovir (Acyclovir)", "Valaciclovir (Valacyclovir)", "Oseltamivir", "Paxlovid (nirmatrelvir/ritonavir)"];
const LAX = ["Macrogol (Polyethylene glycol)", "Lactulose", "Bisacodyl"];
const ANTIEMETIC = ["Ondansetron", "Metoclopramide", "Domperidone"];
const ANTIPSYCH = ["Quetiapine", "Olanzapine", "Risperidone", "Aripiprazole", "Clozapine", "Haloperidol"];
const ADHD = ["Methylphenidate", "Lisdexamfetamine", "Atomoxetine", "Amphetamine salts (mixed)"];
const SMOKE = ["Varenicline", "Nicotine replacement therapy", "Bupropion"];
const BISPHOS = ["Alendronate", "Risedronate", "Zoledronic acid"];
const TRIPTAN = ["Sumatriptan", "Rizatriptan"];
const PDE5 = ["Sildenafil", "Tadalafil"];
const HRT = ["Estradiol", "Progesterone (micronised)"];
const FEVER = ["Paracetamol (Acetaminophen)", "Ibuprofen", "Metamizole (Dipyrone)"];
const IRON = ["Ferrous sulfate", "Ferric carboxymaltose"];
const MUSCLE = ["Baclofen", "Tizanidine"];
const NASAL = ["Xylometazoline", "Mometasone (nasal)"];
const PENICILLINS = ["Phenoxymethylpenicillin (Penicillin V)", "Amoxicillin", "Amoxicillin/clavulanate", "Flucloxacillin"];
const ANTIEPI = ["Levetiracetam", "Lamotrigine", "Valproate (valproic acid / divalproex)", "Carbamazepine", "Phenytoin", "Topiramate"];

// each: targets, en (lay_term), abbr, de, fr, it
export const CLASS_SYN = [
  { targets: ANTICOAG, en: "blood thinner|blood thinners|anticoagulant|anticoagulants|anticoagulation", de: "Blutverdünner|Blutverdünnung|Gerinnungshemmer|Antikoagulans|Antikoagulanzien", fr: "anticoagulants|fluidifiant sanguin", it: "anticoagulante|anticoagulanti" },
  { targets: ANTIPLT, en: "blood thinner|blood thinners|antiplatelet|antiplatelets|antiplatelet agent", de: "Blutverdünner|Plättchenhemmer|Thrombozytenaggregationshemmer", fr: "antiagrégant plaquettaire", it: "antiaggregante" },
  { targets: DOAC, en: "direct oral anticoagulant|novel oral anticoagulant", abbr: "DOAC|DOACs|NOAC|NOACs|NOAK|DOAK" },
  { targets: VKA, en: "vitamin K antagonist|coumarin|coumarins", abbr: "VKA", de: "Vitamin-K-Antagonist|Cumarine|Cumarin" },
  { targets: STATINS, en: "statin|statins|cholesterol pill|cholesterol tablets", de: "Statin|Statine", fr: "statine|statines", it: "statina|statine" },
  { targets: LIPID, en: "cholesterol medicine|cholesterol lowering|lipid lowering", de: "Cholesterinsenker|Lipidsenker", fr: "hypocholestérolémiant", it: "anticolesterolo" },
  { targets: DIURETICS, en: "water pill|water pills|water tablet|water tablets|diuretic|diuretics", de: "Entwässerungstabletten|Wassertabletten|Diuretikum|Diuretika", fr: "diurétique", it: "diuretico|diuretici" },
  { targets: ABX, en: "antibiotic|antibiotics", de: "Antibiotikum|Antibiotika", fr: "antibiotique|antibiotiques", it: "antibiotico|antibiotici" },
  { targets: PENICILLINS, en: "penicillin|penicillins", de: "Penicillin", it: "penicillina" },
  { targets: PAIN, en: "painkiller|painkillers|pain killer|pain killers|pain relief|pain reliever|pain medication|pain medicine|pain tablets", de: "Schmerzmittel|Schmerztablette|Schmerztabletten|Analgetikum|Analgetika", fr: "antidouleur|antidouleurs|analgésique", it: "antidolorifico|antidolorifici|analgesico" },
  { targets: NSAID, en: "anti-inflammatory|anti-inflammatories|anti inflammatory|non-steroidal anti-inflammatory", abbr: "NSAID|NSAIDs|NSAR|AINS|FANS", de: "Entzündungshemmer|nichtsteroidale Antirheumatika", fr: "anti-inflammatoire", it: "antinfiammatorio" },
  { targets: OPIOID, en: "opioid|opioids|opiate|opiates|narcotic painkiller", de: "Opioid|Opioide|Opiat|Opiate", fr: "opioïde|opioïdes", it: "oppioide|oppioidi" },
  { targets: SLEEP, en: "sleeping pill|sleeping pills|sleeping tablet|sleeping tablets|sleep aid|sleep medication", de: "Schlaftablette|Schlaftabletten|Schlafmittel", fr: "somnifère|somnifères", it: "sonnifero|sonniferi" },
  { targets: BENZO, en: "benzo|benzos|benzodiazepine|benzodiazepines|tranquilliser|tranquilizer|tranquillizers|nerve pills", de: "Beruhigungsmittel|Benzodiazepin|Benzodiazepine", fr: "tranquillisant|anxiolytique", it: "ansiolitico|benzodiazepina" },
  { targets: ANTIDEP, en: "antidepressant|antidepressants|happy pills", de: "Antidepressivum|Antidepressiva", fr: "antidépresseur|antidépresseurs", it: "antidepressivo|antidepressivi" },
  { targets: SSRI, en: "selective serotonin reuptake inhibitor", abbr: "SSRI|SSRIs" },
  { targets: PPI, en: "proton pump inhibitor|proton pump inhibitors|acid blocker|acid blockers|stomach protector|stomach protection", abbr: "PPI|PPIs|IPP", de: "Magenschutz|Magenschutzmittel|Säureblocker|Protonenpumpenhemmer|Protonenpumpeninhibitor", fr: "protecteur gastrique|inhibiteur de la pompe à protons", it: "gastroprotettore|inibitore di pompa protonica" },
  { targets: [...PPI, "Famotidine"], en: "heartburn medicine|heartburn tablets|acid reflux medicine|antacid", de: "Säurehemmer|Mittel gegen Sodbrennen", fr: "antiacide", it: "antiacido" },
  { targets: INHALERS, en: "inhaler|inhalers|puffer|puffers|asthma inhaler|asthma spray", de: "Inhalator|Asthmaspray|Asthmaspray|Dosieraerosol", fr: "inhalateur|pompe pour l'asthme", it: "inalatore|spray per asma" },
  { targets: ["Salbutamol (Albuterol)"], en: "blue inhaler|reliever inhaler|rescue inhaler|reliever|asthma pump" , de: "Notfallspray|blaues Spray" },
  { targets: ICS, en: "brown inhaler|preventer inhaler|steroid inhaler|preventer", de: "Kortisonspray|Cortisonspray" },
  { targets: PILL, en: "the pill|birth control pill|birth control pills|birth control|contraceptive pill|contraceptive pills|oral contraceptive", de: "Antibabypille|die Pille|Pille|Verhütungspille", fr: "pilule|pilule contraceptive", it: "pillola|pillola anticoncezionale" },
  { targets: ["Desogestrel (progestogen-only pill)"], en: "mini pill|minipill|progestogen-only pill|progestin-only pill", abbr: "POP", de: "Minipille" },
  { targets: EC, en: "morning after pill|morning-after pill|emergency contraception|emergency contraceptive|emergency pill", de: "Pille danach|Notfallverhütung", fr: "pilule du lendemain|contraception d'urgence", it: "pillola del giorno dopo|contraccezione d'emergenza" },
  { targets: STEROIDS, en: "steroid tablets|steroid pills|steroids|oral steroids|corticosteroid|cortisone", de: "Kortison|Cortison|Kortisontabletten|Glukokortikoid", fr: "cortisone|corticoïde", it: "cortisone|cortisonico" },
  { targets: GLP1, en: "GLP-1 agonist|GLP-1 receptor agonist|GLP1", abbr: "GLP-1|GLP1-RA" },
  { targets: WEIGHT, en: "weight loss injection|weight-loss jab|weight loss jab|weight loss drug|fat jab", de: "Abnehmspritze|Fettweg-Spritze", fr: "piqûre pour maigrir", it: "puntura dimagrante" },
  { targets: ANTIHIST, en: "antihistamine|antihistamines|allergy pill|allergy pills|allergy tablets|hay fever tablets", de: "Antihistaminikum|Antihistaminika|Allergietabletten|Allergiemittel", fr: "antihistaminique", it: "antistaminico|antistaminici" },
  { targets: BB, en: "beta blocker|beta blockers|beta-blocker|beta-blockers", de: "Betablocker", fr: "bêtabloquant|bêta-bloquant", it: "betabloccante|beta bloccante" },
  { targets: ACEI, en: "ACE inhibitor|ACE inhibitors", abbr: "ACEi|ACEI", de: "ACE-Hemmer", fr: "IEC|inhibiteur de l'enzyme de conversion", it: "ACE inibitore" },
  { targets: ARB, en: "angiotensin receptor blocker|angiotensin II receptor blocker|sartan|sartans", abbr: "ARB|ARBs", de: "Sartan|Sartane|AT1-Blocker", fr: "sartan|sartans", it: "sartano|sartani" },
  { targets: CCB, en: "calcium channel blocker|calcium channel blockers|calcium blocker", abbr: "CCB", de: "Calciumantagonist|Kalziumantagonist", fr: "inhibiteur calcique", it: "calcio antagonista" },
  { targets: BP, en: "blood pressure pills|blood pressure tablets|blood pressure medication|blood pressure medicine|antihypertensive|antihypertensives", de: "Blutdrucksenker|Blutdruckmittel|Blutdrucktabletten|Antihypertensivum", fr: "antihypertenseur|médicament pour la tension", it: "antipertensivo|farmaco per la pressione" },
  { targets: INSULIN, en: "insulin|insulin injection|insulin pen", de: "Insulinspritze|Insulinpen", fr: "insuline", it: "insulina" },
  { targets: DMTAB, en: "diabetes pills|diabetes tablets|diabetes medication|diabetes medicine|antidiabetic", de: "Antidiabetika|Antidiabetikum|Diabetesmedikament|Zuckertabletten", fr: "antidiabétique", it: "antidiabetico" },
  { targets: SGLT2, en: "SGLT2 inhibitor|gliflozin|gliflozins", abbr: "SGLT2|SGLT-2" },
  { targets: DPP4, en: "DPP-4 inhibitor|gliptin|gliptins", abbr: "DPP-4|DPP4" },
  { targets: ANTIFUNGAL, en: "antifungal|antifungals|thrush treatment", de: "Antimykotikum|Pilzmittel", fr: "antifongique", it: "antimicotico" },
  { targets: ANTIVIRAL, en: "antiviral|antivirals", de: "Virostatikum|Virostatika", fr: "antiviral", it: "antivirale" },
  { targets: LAX, en: "laxative|laxatives|stool softener", de: "Abführmittel|Laxans|Laxanzien", fr: "laxatif|laxatifs", it: "lassativo|lassativi" },
  { targets: ANTIEMETIC, en: "anti-sickness|anti sickness|antiemetic|antiemetics|nausea medicine|anti-nausea", de: "Antiemetikum|Mittel gegen Übelkeit", fr: "antiémétique|antivomitif", it: "antiemetico" },
  { targets: ["Levothyroxine"], en: "thyroid tablet|thyroid tablets|thyroid hormone|thyroid pill|thyroid medication", de: "Schilddrüsenhormon|Schilddrüsentabletten", fr: "hormone thyroïdienne", it: "ormone tiroideo" },
  { targets: MUSCLE, en: "muscle relaxant|muscle relaxants|muscle relaxer", de: "Muskelrelaxans|Muskelrelaxanzien", fr: "myorelaxant", it: "miorilassante" },
  { targets: ANTIPSYCH, en: "antipsychotic|antipsychotics|neuroleptic", de: "Neuroleptikum|Neuroleptika|Antipsychotikum", fr: "neuroleptique|antipsychotique", it: "antipsicotico|neurolettico" },
  { targets: ADHD, en: "ADHD medication|ADHD medicine|stimulant medication", de: "ADHS-Medikament|Stimulanzien", fr: "médicament TDAH" },
  { targets: SMOKE, en: "stop smoking medicine|stop smoking tablets|quit smoking", de: "Rauchstopp|Raucherentwöhnung", fr: "sevrage tabagique", it: "smettere di fumare" },
  { targets: ["Nicotine replacement therapy"], en: "nicotine patch|nicotine patches|nicotine gum|nicotine lozenge|nicotine spray", de: "Nikotinpflaster|Nikotinkaugummi", fr: "patch nicotine|gomme à la nicotine", it: "cerotto alla nicotina" },
  { targets: ["Epinephrine (Adrenaline)"], en: "adrenaline pen|epinephrine pen|epi pen|epi-pen|allergy pen|auto-injector|adrenaline auto-injector", de: "Adrenalinpen|Adrenalin-Autoinjektor|Notfallpen", fr: "stylo d'adrénaline", it: "penna di adrenalina" },
  { targets: IRON, en: "iron|iron tablets|iron pills|iron supplement", de: "Eisen|Eisentabletten|Eisenpräparat", fr: "fer|comprimés de fer", it: "ferro" },
  { targets: ["Ferric carboxymaltose"], en: "iron infusion|iron drip|IV iron", de: "Eiseninfusion", fr: "perfusion de fer", it: "infusione di ferro" },
  { targets: ["Vitamin D3 (Cholecalciferol)"], en: "vitamin D|vitamin D supplement", de: "Vitamin D", it: "vitamina D" },
  { targets: PDE5, en: "erection pills|erectile dysfunction pills|ED pills|PDE5 inhibitor", de: "Potenzmittel|Potenzpille", fr: "pilule de l'érection", it: "pillola per l'erezione" },
  { targets: HRT, en: "hormone replacement therapy|menopause hormone therapy", abbr: "HRT|MHT", de: "Hormonersatztherapie|Hormontherapie Wechseljahre", fr: "THS|traitement hormonal substitutif", it: "terapia ormonale sostitutiva" },
  { targets: TRIPTAN, en: "triptan|triptans|migraine tablets", de: "Triptan|Triptane|Migränemittel", fr: "triptan|triptans", it: "triptano|triptani" },
  { targets: FEVER, en: "fever reducer|fever medicine|antipyretic", de: "Fiebermittel|Fiebersenker|fiebersenkend", fr: "antipyrétique", it: "antipiretico|antifebbrile" },
  { targets: NASAL, en: "nasal spray|nose spray", de: "Nasenspray|Schnupfenspray", fr: "spray nasal", it: "spray nasale" },
  { targets: ["Xylometazoline"], en: "decongestant nasal spray|decongestant spray", de: "abschwellendes Nasenspray", fr: "décongestionnant nasal", it: "decongestionante nasale" },
  { targets: ["Acetylcysteine"], en: "mucolytic|expectorant|mucus thinner", de: "Schleimlöser|Hustenlöser", fr: "mucolytique|fluidifiant bronchique", it: "mucolitico" },
  { targets: ["Butylscopolamine (Hyoscine butylbromide)"], en: "antispasmodic|cramp relief", de: "Krampflöser|Spasmolytikum", fr: "antispasmodique", it: "antispastico" },
  { targets: BISPHOS, en: "bisphosphonate|bisphosphonates|osteoporosis medicine", de: "Bisphosphonat|Bisphosphonate", fr: "bisphosphonate", it: "bifosfonato" },
  { targets: ANTIEPI, en: "antiepileptic|anti-epileptic|anticonvulsant|seizure medication", de: "Antiepileptikum|Antiepileptika", fr: "antiépileptique", it: "antiepilettico" },
  { targets: ["Loperamide"], en: "diarrhoea tablets|diarrhea medicine|anti-diarrhoeal", de: "Durchfallmittel", fr: "antidiarrhéique", it: "antidiarroico" },
];
