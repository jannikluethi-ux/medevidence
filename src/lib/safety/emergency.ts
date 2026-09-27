/**
 * Deterministic emergency rules engine — NOT LLM-based.
 * Scans free-text input for emergency patterns before any content is shown.
 */

import type { Jurisdiction } from "@/lib/types";
import { EMERGENCY_NUMBERS } from "@/lib/types";

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

const RULES: RuleDef[] = [
  {
    name: "Acute coronary syndrome symptoms",
    groups: [
      ["chest pain", "crushing chest", "chest pressure", "chest tightness", "heart attack"],
      [
        "left arm",
        "arm numbness",
        "arm pain",
        "jaw pain",
        "sweating",
        "diaphoresis",
        "shortness of breath",
        "radiating",
        "radiation",
      ],
    ],
    urgency: "emergency",
    message:
      "Symptoms that may indicate a heart attack require immediate emergency care. Do not wait for online information. Call your local emergency number now.",
  },
  {
    name: "Stroke signs (FAST)",
    groups: [
      [
        "face droop",
        "facial droop",
        "arm weakness",
        "speech difficulty",
        "slurred speech",
        "stroke",
        "can't speak",
        "cannot speak",
        "one-sided weakness",
        "sudden numbness face",
        "sudden confusion",
      ],
    ],
    urgency: "emergency",
    message:
      "Possible stroke symptoms require immediate emergency care. Time-critical treatment may be needed. Call your local emergency number now.",
  },
  {
    name: "Anaphylaxis",
    groups: [
      [
        "anaphylaxis",
        "anaphylactic",
        "throat swelling",
        "tongue swelling",
        "can't breathe after",
        "severe allergic",
        "epipen",
        "epi-pen",
      ],
    ],
    urgency: "emergency",
    message:
      "Possible severe allergic reaction (anaphylaxis) is a medical emergency. Use epinephrine if prescribed and call emergency services immediately.",
  },
  {
    name: "Suicidal ideation / self-harm",
    groups: [
      [
        "kill myself",
        "suicide",
        "suicidal",
        "end my life",
        "want to die",
        "self-harm",
        "hurt myself",
        "no reason to live",
      ],
    ],
    urgency: "emergency",
    message:
      "If you are thinking about harming yourself, please seek help immediately. Contact emergency services or a crisis line in your country. You are not alone.",
  },
  {
    name: "Severe shortness of breath",
    groups: [
      [
        "can't breathe",
        "cannot breathe",
        "severe shortness of breath",
        "gasping for air",
        "blue lips",
        "turning blue",
        "respiratory distress",
      ],
    ],
    urgency: "emergency",
    message:
      "Severe breathing difficulty is a medical emergency. Call your local emergency number now.",
  },
  {
    name: "Severe bleeding",
    groups: [
      [
        "uncontrolled bleeding",
        "won't stop bleeding",
        "severe bleeding",
        "vomiting blood",
        "coughing blood",
        "blood in stool black",
        "massive bleeding",
        "hemorrhage",
      ],
    ],
    urgency: "emergency",
    message:
      "Severe or uncontrolled bleeding requires immediate emergency care. Call your local emergency number now.",
  },
  {
    name: "Overdose",
    groups: [
      [
        "overdose",
        "took too many pills",
        "too much medication",
        "poisoning",
        "ingested too much",
        "took entire bottle",
      ],
    ],
    urgency: "emergency",
    message:
      "Possible overdose or poisoning is a medical emergency. Call emergency services or your local poison control center immediately. Do not wait for symptoms.",
  },
  {
    name: "Sepsis / severe infection signs",
    groups: [
      ["fever", "high fever", "chills"],
      [
        "confusion",
        "extreme lethargy",
        "very low blood pressure",
        "rapid breathing",
        "mottled skin",
        "sepsis",
        "septic",
      ],
    ],
    urgency: "emergency",
    message:
      "Signs that may indicate a severe infection or sepsis require urgent medical evaluation. Seek emergency care now.",
  },
  {
    name: "Severe abdominal / acute abdomen",
    groups: [
      [
        "sudden severe abdominal",
        "worst abdominal pain",
        "rigid abdomen",
        "severe stomach pain sudden",
      ],
    ],
    urgency: "urgent",
    message:
      "Sudden severe abdominal pain can indicate a serious condition. Seek urgent medical care promptly.",
  },
];

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

export function scanEmergency(input: string): EmergencyMatch | null {
  if (!input || input.trim().length < 3) return null;
  const text = normalize(input);
  for (const rule of RULES) {
    const groupHits: string[] = [];
    let allGroupsMatch = true;

    for (const group of rule.groups) {
      const hit = group.find((term) => text.includes(normalize(term)));
      if (!hit) {
        allGroupsMatch = false;
        break;
      }
      groupHits.push(hit);
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

  // Also check single-group rules that are highly specific phrases
  // (already covered above). Extra: chest pain alone with radiation-like words in one pass
  if (
    (text.includes("crushing chest") || text.includes("chest pain")) &&
    (text.includes("left arm") ||
      text.includes("arm numbness") ||
      text.includes("sweating") ||
      text.includes("radiat"))
  ) {
    return {
      ruleName: "Acute coronary syndrome symptoms",
      urgency: "emergency",
      message:
        "Symptoms that may indicate a heart attack require immediate emergency care. Do not wait for online information. Call your local emergency number now.",
      numbers: EMERGENCY_NUMBERS,
      matchedTerms: ["chest pain / crushing chest", "radiation / arm / sweating"],
    };
  }

  return null;
}

export function getBuiltinEmergencyRules(): RuleDef[] {
  return RULES;
}
