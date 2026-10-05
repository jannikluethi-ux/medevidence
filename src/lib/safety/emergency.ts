/**
 * Deterministic emergency rules engine — NOT LLM-based.
 * Scans free-text input for emergency patterns before any content is shown.
 *
 * Matching: input and terms are normalised (lowercase, diacritics stripped, apostrophes
 * removed — see src/lib/text.ts) and terms must start on a word boundary (terms of <=3 chars
 * must be whole words). Includes English, German, French and Italian lay phrases.
 * Rules are evaluated in order; all `emergency` rules come before `urgent` ones.
 * Deliberately conservative: it may over-trigger, it should not under-trigger.
 */

import type { Jurisdiction } from "@/lib/types";
import { EMERGENCY_NUMBERS } from "@/lib/types";
import { containsTerm, normalize } from "@/lib/text";

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
};

const CHEST_TERMS = [
  "chest pain", "chest pains", "crushing chest", "chest pressure", "chest tightness", "tight chest",
  "pain in my chest", "pain in chest", "pain in the chest", "chest hurts", "chest discomfort",
  // de
  "brustschmerz", "schmerzen in der brust", "schmerz in der brust", "druck auf der brust", "engegefuhl in der brust", "brustenge", "thoraxschmerz",
  // fr / it
  "douleur thoracique", "douleur a la poitrine", "mal a la poitrine", "dolore al petto", "dolore toracico", "oppressione al petto",
];

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
];

// Pre-normalise terms once.
const COMPILED = RULES.map((r) => ({ ...r, ngroups: r.groups.map((g) => g.map((t) => ({ raw: t, norm: normalize(t) }))) }));

export function scanEmergency(input: string): EmergencyMatch | null {
  if (!input || input.trim().length < 3) return null;
  const text = normalize(input);
  for (const rule of COMPILED) {
    const groupHits: string[] = [];
    let allGroupsMatch = true;
    for (const group of rule.ngroups) {
      const hit = group.find((t) => containsTerm(text, t.norm));
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
