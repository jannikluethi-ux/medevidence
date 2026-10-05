/**
 * Deterministic emergency rules engine — NOT LLM-based.
 * Scans free-text input for emergency patterns before any content is shown.
 *
 * Matching: input and terms are normalised (lowercase, diacritics stripped, apostrophes
 * removed — see src/lib/text.ts) and terms must start on a word boundary (terms of <=3 chars
 * must be whole words). A term ending in "$" must match as a whole word/phrase (e.g. "burn$"
 * matches "burn" but not "burning" or "heartburn"). Includes English, German, French and Italian
 * lay phrases. A rule may list `mask` phrases that are blanked out of the input before that rule
 * is evaluated, so a common benign phrase cannot trip an AND-rule (e.g. "acid reflux burns my
 * throat") while the rest of the input is still checked.
 * Rules are evaluated in order; all `emergency` rules come before `urgent` ones.
 * Deliberately conservative: it may over-trigger, it should not under-trigger.
 */

import type { Jurisdiction } from "@/lib/types";
import { EMERGENCY_NUMBERS } from "@/lib/types";
import { containsPhrase, containsTerm, normalize } from "@/lib/text";

export type EmergencyMatch = {
  ruleName: string;
  urgency: "emergency" | "urgent";
  message: string;
  numbers: Record<Jurisdiction, string>;
  matchedTerms: string[];
};

type RuleDef = {
  name: string;
  /** All groups must match (AND). Within a group, any synonym matches (OR). */
  groups: string[][];
  urgency: "emergency" | "urgent";
  message: string;
  /** Optional: phrases blanked out of the (normalised) input before this rule is evaluated. */
  mask?: string[];
};

const CHEST_TERMS = [
  "chest pain", "chest pains", "crushing chest", "chest pressure", "chest tightness", "tight chest",
  "pain in my chest", "pain in chest", "pain in the chest", "chest hurts", "chest discomfort",
  // de
  "brustschmerz", "schmerzen in der brust", "schmerz in der brust", "druck auf der brust", "engegefuhl in der brust", "brustenge", "thoraxschmerz",
  // fr / it
  "douleur thoracique", "douleur a la poitrine", "mal a la poitrine", "dolore al petto", "dolore toracico", "oppressione al petto",
];

// ---- Burns (EN / DE / FR / IT). Whole-word forms ("$") so "heartburn", "burning urine" and
// "burning feet" do not trigger burn rules. Heartburn phrases ("brulures d'estomac", "acid reflux") are masked.
const BURN_TERMS = [
  "burn$", "burns$", "burnt$", "burned$", "scald$", "scalds$", "scalded$", "scalding$",
  // de
  "verbrennung", "verbrannt", "verbrennt", "verbruhung", "verbruht", "brandwunde", "brandverletzung", "brandblase",
  // fr
  "brulure", "brule$", "brulee$", "brules$", "brulees$",
  // it
  "ustion", "scottatur", "scottato$", "scottata$", "bruciatur",
];
const BURN_MASK = [
  "heartburn", "heart burn", "acid reflux", "reflux", "brulure d estomac", "brulures d estomac", "brulure destomac", "brulures destomac", "bruciore di stomaco", "sodbrennen",
  "burning urine", "brulure en urinant", "brulures urinaires",
];
const CHEM_ELEC_PHRASES = [
  "chemical burn", "acid burn", "alkali burn", "caustic burn", "bleach burn", "electrical burn", "electric burn",
  "electrocuted", "electrocution", "electric shock", "high voltage", "struck by lightning", "lightning strike",
  // de
  "veratzung", "veratzt", "saureverletzung", "laugenverletzung", "chemische verbrennung", "elektrische verbrennung",
  "stromunfall", "stromschlag", "elektrischer schlag", "blitzschlag",
  // fr
  "brulure chimique", "brulure electrique", "brulure par acide", "electrocution", "electrise", "electrisation",
  "decharge electrique", "foudroye",
  // it
  "ustione chimica", "ustione elettrica", "ustione da acido", "folgorazione", "folgorato", "scossa elettrica", "colpito da un fulmine",
];
const CHEM_ELEC_QUALIFIERS = [
  "chemical", "acid", "alkali", "caustic", "bleach", "lye", "drain cleaner", "oven cleaner", "electric", "electrical", "power line", "socket",
  "chemisch", "saure", "lauge", "abflussreiniger", "strom", "elektrisch", "steckdose",
  "chimique", "acide", "soude", "javel", "electrique", "prise electrique",
  "chimic", "acido", "soda caustica", "candeggina", "elettric", "presa elettrica",
];
const SMOKE_PHRASES = [
  "smoke inhalation", "inhaled smoke", "breathed in smoke", "breathing in smoke", "trapped in a fire", "trapped in fire",
  "house fire", "singed nose hair", "singed nasal hair", "soot in mouth", "soot around mouth", "soot in nose",
  // de
  "rauchvergiftung", "rauchgasvergiftung", "rauchgas", "rauch eingeatmet", "rauchinhalation", "wohnungsbrand", "hausbrand",
  // fr
  "inhalation de fumee", "intoxication a la fumee", "intoxication aux fumees", "fumee inhalee", "respire de la fumee", "incendie",
  // it
  "inalazione di fumo", "intossicazione da fumo", "fumo inalato", "respirato fumo", "incendio",
];
const SMOKE_QUALIFIERS = ["smoke", "fumes", "airway", "inhal", "rauch", "atemweg", "fumee", "voies respiratoires", "fumo", "vie respiratorie"];
const SERIOUS_BURN_QUALIFIERS = [
  // size / depth
  "large", "larger", "big$", "bigger", "huge", "extensive", "deep", "charred", "blackened", "leathery", "full thickness",
  "third degree", "3rd degree", "all over", "whole arm", "whole leg", "whole back", "circumferential", "all the way around",
  "gross", "grossflachig", "tief", "verkohlt", "dritten grades", "3 grades",
  "grande", "etendue", "profonde", "carbonise", "troisieme degre", "3e degre",
  "estesa", "profonda", "carbonizzat", "terzo grado",
  // sites: face, hands, feet, genitals, bottom, major joints, neck
  "face", "facial", "eye$", "eyes$", "eyelid", "lip$", "lips$", "ear$", "ears$", "neck", "hand$", "hands$", "finger", "fingers",
  "foot$", "feet$", "toe$", "toes$", "sole of", "genital", "genitals", "groin", "penis", "vagina", "vulva", "scrotum", "testicle",
  "buttock", "bottom", "perineum", "joint", "joints", "knee", "elbow", "shoulder", "wrist", "ankle", "hip$", "armpit",
  "gesicht", "auge", "augen", "lippe", "ohr$", "ohren", "hals$", "hand$", "hande$", "handflache", "finger", "fuss$", "fusse$", "fusssohle",
  "zeh", "genital", "intimbereich", "penis", "scheide", "hoden", "gesass", "po$", "gelenk", "knie", "ellbogen", "schulter", "handgelenk", "knochel", "achsel",
  "visage", "yeux", "oeil", "paupiere", "levre", "oreille", "cou$", "main$", "mains$", "doigt", "pied$", "pieds$", "orteil",
  "parties genitales", "organes genitaux", "parties intimes", "fesse", "articulation", "genou", "coude", "epaule", "poignet", "cheville", "aisselle",
  "viso", "faccia", "occhi", "occhio", "palpebr", "labbr", "orecchi", "collo", "mano$", "mani$", "dito", "dita", "piede", "piedi",
  "genitali", "parti intime", "glute", "sedere", "articolazion", "ginocchi", "gomito", "spalla", "polso", "caviglia", "ascella",
  // vulnerable people: babies / young children / older adults
  "baby", "babies", "infant", "newborn", "toddler", "under 5", "my child", "my son", "my daughter", "elderly", "older person", "older adult",
  "grandmother", "grandfather", "grandma", "grandpa", "granny", "old man", "old woman", 
  "saugling", "kleinkind", "neugeboren", "mein kind", "meine tochter", "mein sohn", "senior", "seniorin", "grossmutter", "grossvater", "oma$", "opa$", "altere person", "alterer mensch",
  "bebe", "nourrisson", "nouveau ne", "mon enfant", "mon fils", "ma fille", "personne agee", "grand mere", "grand pere", "mamie", "papi",
  "neonato", "lattante", "bambino", "bambina", "mio figlio", "mia figlia", "anziano", "anziana", "nonna", "nonno",
];

const BURN_MESSAGE_TAIL =
  " While waiting: cool the burn under cool running water for 20 minutes (not ice), remove jewellery and clothing that is not stuck, keep the person warm, and cover loosely with cling film or a clean non-fluffy cloth. Do not put ice, butter, oils or creams on it.";

const RULES: RuleDef[] = [
  {
    name: "Acute coronary syndrome symptoms",
    groups: [
      CHEST_TERMS,
      [
        "left arm", "arm numbness", "arm pain", "jaw pain", "sweating", "sweaty", "cold sweat", "clammy", "diaphoresis",
        "shortness of breath", "short of breath", "breathless", "cant breathe", "cannot breathe", "difficulty breathing",
        "trouble breathing", "struggling to breathe", "radiat", "nausea", "nauseous", "vomiting", "lightheaded", "light headed",
        "faint", "dizzy", "collapse",
        // de
        "atemnot", "kurzatmig", "luftnot", "keine luft", "schweiss", "schwitz", "ubelkeit", "erbrechen", "linker arm", "linken arm",
        "kiefer", "ausstrahl", "schwindel", "ohnmacht",
        // fr / it
        "essouffl", "sueur", "bras gauche", "machoire", "nausee", "malaise", "fiato corto", "mancanza di respiro", "affanno",
        "sudore", "braccio sinistro", "mascella",
      ],
    ],
    urgency: "emergency",
    message:
      "Symptoms that may indicate a heart attack require immediate emergency care. Do not wait for online information. Call your local emergency number now (Switzerland 144, EU 112).",
  },
  {
    name: "Severe / sudden chest pain or possible heart attack",
    groups: [
      [
        "severe chest pain", "crushing chest", "sudden chest pain", "worst chest pain", "heart attack", "myocardial infarction",
        "starke brustschmerz", "heftige brustschmerz", "plotzliche brustschmerz", "herzinfarkt",
        "infarctus", "crise cardiaque", "douleur thoracique intense", "infarto", "attacco di cuore", "attacco cardiaco", "forte dolore al petto",
      ],
    ],
    urgency: "emergency",
    message:
      "If you or someone near you may be having a heart attack or has severe or sudden chest pain now, call emergency services immediately (Switzerland 144, EU 112). Do not drive yourself.",
  },
  {
    name: "Stroke signs (FAST)",
    groups: [
      [
        "face droop", "facial droop", "face drooping", "drooping face", "arm weakness", "speech difficulty", "slurred speech",
        "stroke", "cant speak", "cannot speak", "one sided weakness", "sudden numbness", "sudden confusion", "sudden weakness",
        // de
        "schlaganfall", "hirnschlag", "hangender mundwinkel", "hangende gesichtshalfte", "sprachstorung", "verwaschene sprache",
        "plotzliche lahmung", "halbseitige lahmung", "plotzliche taubheit",
        // fr / it
        "avc", "accident vasculaire", "paralysie faciale", "ictus", "paresi facciale", "bocca storta",
      ],
    ],
    urgency: "emergency",
    message:
      "Possible stroke symptoms require immediate emergency care. Time-critical treatment may be needed. Call your local emergency number now (Switzerland 144, EU 112).",
  },
  {
    name: "Anaphylaxis",
    groups: [
      [
        "anaphylaxis", "anaphylactic", "throat swelling", "tongue swelling", "swollen tongue", "throat closing", "cant breathe after",
        "severe allergic", "epipen", "epi pen",
        "anaphylaxie", "anaphylaktisch", "allergischer schock", "zunge geschwollen", "geschwollene zunge", "hals schwillt zu",
        "choc anaphylactique", "shock anafilattico",
      ],
    ],
    urgency: "emergency",
    message:
      "Possible severe allergic reaction (anaphylaxis) is a medical emergency. Use an adrenaline (epinephrine) auto-injector if prescribed and call emergency services immediately (Switzerland 144, EU 112).",
  },
  {
    name: "Suicidal ideation / self-harm",
    groups: [
      [
        "kill myself", "suicide", "suicidal", "end my life", "want to die", "self harm", "hurt myself", "no reason to live",
        "suizid", "selbstmord", "will sterben", "mochte sterben", "mich umbringen", "mir das leben nehmen", "nicht mehr leben",
        "me tuer", "envie de mourir", "suicidio", "voglio morire", "uccidermi", "togliermi la vita",
      ],
    ],
    urgency: "emergency",
    message:
      "If you are thinking about harming yourself, please seek help immediately. Contact emergency services or a crisis line — in Switzerland: Die Dargebotene Hand / La Main Tendue 143, Pro Juventute (children & young people) 147, emergency 144. You are not alone.",
  },
  {
    name: "Severe shortness of breath",
    groups: [
      [
        "cant breathe", "cannot breathe", "severe shortness of breath", "gasping for air", "blue lips", "turning blue",
        "respiratory distress", "struggling to breathe", "cant get air",
        "schwere atemnot", "starke atemnot", "kann nicht atmen", "bekomme keine luft", "kriege keine luft", "blaue lippen", "erstick",
        "ne peux pas respirer", "detresse respiratoire", "non riesco a respirare",
      ],
    ],
    urgency: "emergency",
    message:
      "Severe breathing difficulty is a medical emergency. Call your local emergency number now (Switzerland 144, EU 112).",
  },
  {
    name: "Severe bleeding",
    groups: [
      [
        "uncontrolled bleeding", "wont stop bleeding", "severe bleeding", "vomiting blood", "coughing blood", "coughing up blood",
        "blood in stool black", "black tarry stool", "massive bleeding", "hemorrhage", "haemorrhage",
        "blut erbrechen", "erbreche blut", "bluterbrechen", "bluthusten", "blut husten", "starke blutung", "teerstuhl",
        "vomissement de sang", "vomir du sang", "vomito di sangue", "emorragia",
      ],
    ],
    urgency: "emergency",
    message:
      "Severe or uncontrolled bleeding requires immediate emergency care. Call your local emergency number now (Switzerland 144, EU 112).",
  },
  {
    name: "Overdose",
    groups: [
      [
        "overdose", "took too many pills", "too many tablets", "too much medication", "poisoning", "ingested too much", "took entire bottle",
        "uberdosis", "vergiftung", "zu viele tabletten", "zu viel tabletten", "zu viele medikamente",
        "surdose", "intoxication", "sovradosaggio", "avvelenamento",
      ],
    ],
    urgency: "emergency",
    message:
      "Possible overdose or poisoning is a medical emergency. Call emergency services (Switzerland 144) or a poisons centre immediately — in Switzerland Tox Info Suisse 145. Do not wait for symptoms.",
  },
  {
    name: "Sepsis / severe infection signs",
    groups: [
      ["fever", "high fever", "chills", "fieber", "schuttelfrost", "fievre", "febbre"],
      [
        "confusion", "confused", "extreme lethargy", "very low blood pressure", "rapid breathing", "mottled skin", "sepsis", "septic",
        "verwirrt", "verwirrtheit", "blutvergiftung", "confus", "confuso",
      ],
    ],
    urgency: "emergency",
    message:
      "Signs that may indicate a severe infection or sepsis require urgent medical evaluation. Seek emergency care now (Switzerland 144, EU 112).",
  },
  {
    name: "Chemical or electrical burn",
    groups: [CHEM_ELEC_PHRASES],
    urgency: "emergency",
    message:
      "Chemical and electrical burns always need emergency medical assessment — electrical injuries can damage the heart and deep tissues even when the skin looks minor. Call 144 (Switzerland) or 112 (EU) now. Do not touch someone still in contact with an electrical source: switch off the power first. For chemicals, brush off any powder, remove contaminated clothing (protect your own hands) and rinse with plenty of running water for at least 20 minutes; for the eyes, keep rinsing while help is on the way. Poisons advice in Switzerland: Tox Info Suisse 145.",
  },
  {
    name: "Chemical or electrical burn",
    groups: [BURN_TERMS, CHEM_ELEC_QUALIFIERS],
    mask: BURN_MASK,
    urgency: "emergency",
    message:
      "Chemical and electrical burns always need emergency medical assessment — electrical injuries can damage the heart and deep tissues even when the skin looks minor. Call 144 (Switzerland) or 112 (EU) now. Do not touch someone still in contact with an electrical source: switch off the power first. For chemicals, brush off any powder, remove contaminated clothing (protect your own hands) and rinse with plenty of running water for at least 20 minutes; for the eyes, keep rinsing while help is on the way. Poisons advice in Switzerland: Tox Info Suisse 145.",
  },
  {
    name: "Smoke inhalation / airway burn",
    groups: [SMOKE_PHRASES],
    urgency: "emergency",
    message:
      "Breathing in smoke or hot gases can injure the airway and cause carbon monoxide poisoning; swelling can develop over hours even if breathing seems fine at first. Call 144 (Switzerland) or 112 (EU) now — especially with a hoarse voice, cough, noisy or difficult breathing, soot around the mouth or nose, singed facial hair, headache, confusion or drowsiness. Move to fresh air only if it is safe.",
  },
  {
    name: "Smoke inhalation / airway burn",
    groups: [BURN_TERMS, SMOKE_QUALIFIERS],
    mask: BURN_MASK,
    urgency: "emergency",
    message:
      "Breathing in smoke or hot gases can injure the airway and cause carbon monoxide poisoning; swelling can develop over hours even if breathing seems fine at first. Call 144 (Switzerland) or 112 (EU) now — especially with a hoarse voice, cough, noisy or difficult breathing, soot around the mouth or nose, singed facial hair, headache, confusion or drowsiness. Move to fresh air only if it is safe.",
  },
  {
    name: "Serious burn (size, depth, location or age)",
    groups: [BURN_TERMS, SERIOUS_BURN_QUALIFIERS],
    mask: BURN_MASK,
    urgency: "emergency",
    message:
      "This may be a serious burn. Burns that are large (bigger than the person's hand) or deep, look charred, white or leathery, are on the face, hands, feet, genitals, bottom or a major joint — and burns in babies, young children or older people — need urgent medical care. Call 144 (Switzerland) or 112 (EU), or go to an emergency department now." +
      BURN_MESSAGE_TAIL,
  },
  // ---- urgent (evaluated after every emergency rule) ----
  {
    name: "Chest pain — needs prompt medical assessment",
    groups: [CHEST_TERMS],
    urgency: "urgent",
    message:
      "Chest pain can have serious causes that cannot be assessed online. If it is severe, sudden, lasts more than a few minutes, or comes with breathlessness, sweating, nausea, fainting or pain spreading to the arm, jaw or back, call emergency services now (Switzerland 144, EU 112). Otherwise, seek medical assessment promptly (today).",
  },
  {
    name: "Severe abdominal / acute abdomen",
    groups: [
      [
        "sudden severe abdominal", "worst abdominal pain", "rigid abdomen", "severe stomach pain sudden",
        "plotzliche starke bauchschmerzen", "starkste bauchschmerzen", "brettharter bauch",
      ],
    ],
    urgency: "urgent",
    message:
      "Sudden severe abdominal pain can indicate a serious condition. Seek urgent medical care promptly.",
  },
  {
    name: "Severe sunburn / possible heat illness",
    groups: [
      ["sunburn", "sun burn", "sunburnt", "sonnenbrand", "coup de soleil", "coups de soleil", "erytheme solaire", "scottatura solare", "scottature solari", "eritema solare"],
      [
        "blister", "swollen", "swelling", "fever", "high temperature", "chills", "shivery", "shivering", "dizzy", "dizziness", "faint", "vomit", "being sick",
        "headache", "cramps", "confus", "very tired", "baby", "infant", "toddler", "newborn", "large area", "all over",
        "blase", "blasen", "geschwollen", "fieber", "schuttelfrost", "schwindel", "erbrechen", "kopfschmerz", "krampf", "verwirrt", "saugling", "kleinkind",
        "cloque", "ampoule", "gonfle", "fievre", "frissons", "vertige", "vomiss", "mal de tete", "crampe", "confus", "bebe", "nourrisson",
        "vescic", "bolle", "gonfi", "febbre", "brividi", "vertigin", "vomit", "mal di testa", "crampi", "confus", "neonato", "lattante",
      ],
    ],
    urgency: "urgent",
    message:
      "Severe sunburn — blistering or swelling, fever or chills, dizziness, vomiting, headache, cramps or unusual tiredness, or any sunburn in a baby or young child — needs prompt medical advice today, as it can come with heat exhaustion or heatstroke. If the person is confused, faints or has a very high temperature, call 144 (Switzerland) or 112 (EU).",
  },
];

// Pre-normalise terms once. A trailing "$" means whole-word/phrase match.
type CompiledTerm = { raw: string; norm: string; whole: boolean };
const compileTerm = (t: string): CompiledTerm => {
  const whole = t.endsWith("$");
  return { raw: whole ? t.slice(0, -1) : t, norm: normalize(whole ? t.slice(0, -1) : t), whole };
};
const termHit = (text: string, t: CompiledTerm) => (t.whole ? containsPhrase(text, t.norm) : containsTerm(text, t.norm));
const applyMask = (text: string, mask: string[]) => {
  if (!mask.length) return text;
  let out = " " + text + " ";
  for (const m of mask) out = out.split(" " + m + " ").join("   ");
  return out.trim().replace(/\s+/g, " ");
};
const COMPILED = RULES.map((r) => ({
  ...r,
  ngroups: r.groups.map((g) => g.map(compileTerm)),
  nmask: (r.mask ?? []).map((m) => normalize(m)).filter(Boolean),
}));

export function scanEmergency(input: string): EmergencyMatch | null {
  if (!input || input.trim().length < 3) return null;
  const text = normalize(input);
  for (const rule of COMPILED) {
    const ruleText = applyMask(text, rule.nmask);
    const groupHits: string[] = [];
    let allGroupsMatch = true;
    for (const group of rule.ngroups) {
      const hit = group.find((t) => termHit(ruleText, t));
      if (!hit) {
        allGroupsMatch = false;
        break;
      }
      groupHits.push(hit.raw);
    }
    if (allGroupsMatch) {
      return {
        ruleName: rule.name,
        urgency: rule.urgency,
        message: rule.message,
        numbers: EMERGENCY_NUMBERS,
        matchedTerms: groupHits,
      };
    }
  }
  return null;
}

export function getBuiltinEmergencyRules(): RuleDef[] {
  return RULES;
}
