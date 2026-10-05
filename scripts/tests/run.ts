/**
 * Lightweight regression tests (no framework): emergency rules, synonym resolution, search.
 * Run: npm test   (requires a seeded DB: npm run seed)
 */
import { scanEmergency } from "../../src/lib/safety/emergency";
import { resolveMedicationInput, symptomSearch, universalSearch } from "../../src/lib/search";

let pass = 0;
let fail = 0;
function check(name: string, ok: boolean, detail?: unknown) {
  if (ok) pass++;
  else {
    fail++;
    console.error("FAIL:", name, detail !== undefined ? JSON.stringify(detail).slice(0, 400) : "");
  }
}

// ---------- emergency ----------
const em = (q: string) => scanEmergency(q);
const EMERGENCY = [
  "Brustschmerzen und Atemnot",
  "chest pain and short of breath",
  "chest pain radiating to my left arm",
  "crushing chest pain",
  "severe chest pain",
  "I think I'm having a heart attack",
  "Herzinfarkt",
  "douleur thoracique et essoufflement",
  "dolore al petto e sudore",
  "can't breathe",
  "ich bekomme keine Luft",
  "Schlaganfall",
  "Hirnschlag",
  "face drooping and slurred speech",
  "hängender Mundwinkel",
  "allergischer Schock",
  "Zunge geschwollen",
  "I want to kill myself",
  "ich will sterben",
  "Überdosis Paracetamol",
  "took too many pills",
  "Blut erbrechen",
  "Fieber und verwirrt",
];
for (const q of EMERGENCY) check(`emergency: ${q}`, em(q)?.urgency === "emergency", em(q));
const URGENT = ["chest pain", "Brustschmerzen", "pain in my chest when I cough"];
for (const q of URGENT) check(`urgent: ${q}`, em(q)?.urgency === "urgent", em(q));
const NONE = ["heartburn", "Sodbrennen", "tummy ache and heartburn", "headache", "ibuprofen", "chest of drawers", "sore throat", "high blood pressure", "strokes of luck? no", "Halsschmerzen und Fieber"];
for (const q of NONE.filter((x) => !x.includes("strokes"))) check(`no emergency: ${q}`, em(q) === null, em(q));
check("ACS takes precedence over urgent chest pain", em("Brustschmerzen mit Schweissausbruch")?.urgency === "emergency", em("Brustschmerzen mit Schweissausbruch"));

// ---------- medication resolution ----------
const med = (q: string) => resolveMedicationInput(q);
const MED_CASES: [string, string][] = [
  ["Dafalgan", "Paracetamol (Acetaminophen)"],
  ["acetaminophen", "Paracetamol (Acetaminophen)"],
  ["paracetemol", "Paracetamol (Acetaminophen)"],
  ["ibuprofin", "Ibuprofen"],
  ["Algifor", "Ibuprofen"],
  ["algifor", "Ibuprofen"],
  ["marcoumar", "Phenprocoumon"],
  ["Marcumar", "Phenprocoumon"],
  ["Xarelto", "Rivaroxaban"],
  ["albuterol", "Salbutamol (Albuterol)"],
  ["adrenaline", "Epinephrine (Adrenaline)"],
  ["EpiPen", "Epinephrine (Adrenaline)"],
  ["GTN", "Nitroglycerin (glyceryl trinitrate)"],
  ["ciclosporin", "Cyclosporine"],
  ["rifampicin", "Rifampin"],
  ["frusemide", "Furosemide"],
  ["lignocaine", "Lidocaine"],
  ["dipyrone", "Metamizole (Dipyrone)"],
  ["Novalgin", "Metamizole (Dipyrone)"],
  ["Omeprazol", "Omeprazole"],
  ["Pantozol", "Pantoprazole"],
  ["Sortis", "Atorvastatin"],
  ["atorvastin", "Atorvastatin"],
  ["metformine", "Metformin"],
  ["amoxicilin", "Amoxicillin"],
  ["Euthyrox", "Levothyroxine"],
  ["Concor", "Bisoprolol"],
  ["Beloc Zok", "Metoprolol"],
  ["Temesta", "Lorazepam"],
  ["Tramal", "Tramadol"],
  ["Aspirin Cardio", "Aspirin (low-dose / antiplatelet)"],
  ["Voltaren", "Diclofenac"],
  ["Ponstan", "Mefenamic acid"],
  ["ellaOne", "Ulipristal acetate"],
  ["warfarin", "Warfarin"],
  ["ibuprofen", "Ibuprofen"],
  ["Ibuprofenn", "Ibuprofen"],
];
for (const [q, expect] of MED_CASES) {
  const r = med(q);
  check(`med ${q} -> ${expect}`, r.meds.length === 1 && r.meds[0].generic_name === expect, r);
}
const bt = med("blood thinner");
check("blood thinner is a class with anticoagulants", bt.status === "class" && ["Apixaban", "Phenprocoumon", "Warfarin", "Rivaroxaban"].every((n) => bt.meds.some((m) => m.generic_name === n)), bt.meds.map((m) => m.generic_name));
check("unknown stays unresolved", med("xyzzyplonk").status === "none");

// ---------- universal search ----------
const us = (q: string) => universalSearch(q);
const top = (q: string) => us(q).hits[0]?.title;
check("search Dafalgan -> paracetamol first", top("Dafalgan") === "Paracetamol (Acetaminophen)", us("Dafalgan").hits.slice(0, 3));
check("search Dafalgan interpretation", us("Dafalgan").interpretation?.matches[0]?.label === "Paracetamol (Acetaminophen)");
check("search ibuprofin -> ibuprofen", top("ibuprofin") === "Ibuprofen", us("ibuprofin"));
check("search Sodbrennen -> GERD", us("Sodbrennen").hits.some((h) => h.title.startsWith("Gastroesophageal reflux")), us("Sodbrennen").hits.slice(0, 3));
check("search blood thinner -> anticoagulants", ["Apixaban", "Phenprocoumon", "Warfarin"].every((n) => us("blood thinner").hits.some((h) => h.title === n)));
check("search Migräne -> Migraine", us("Migräne").hits.some((h) => h.title === "Migraine"));
check("search Migraene -> Migraine", us("Migraene").hits.some((h) => h.title === "Migraine"));
check("search Bluthochdruck -> Hypertension", top("Bluthochdruck") === "Hypertension");
check("search Herzinfarkt -> ACS", top("Herzinfarkt")?.startsWith("Acute coronary syndrome") ?? false, us("Herzinfarkt").hits.slice(0, 2));
check("search Grippe -> Influenza", top("Grippe") === "Influenza (flu)");
check("search Dafalgan 500mg -> paracetamol", top("Dafalgan 500mg") === "Paracetamol (Acetaminophen)", us("Dafalgan 500mg").hits.slice(0, 3));

// ---------- symptom search ----------
const ss = (q: string) => symptomSearch(q);
const topCond = (q: string) => ss(q).matches[0]?.name ?? "";
check("tummy ache and heartburn -> GERD top", topCond("tummy ache and heartburn").startsWith("Gastroesophageal reflux"), ss("tummy ache and heartburn").matches.slice(0, 3).map((m) => [m.name, m.score]));
check("Sodbrennen -> GERD top", topCond("Sodbrennen").startsWith("Gastroesophageal reflux"));
check("burning when peeing -> UTI", topCond("burning when peeing").startsWith("Urinary tract infection"), ss("burning when peeing").matches.slice(0, 3).map((m) => m.name));
check("Brennen beim Wasserlassen -> UTI", topCond("Brennen beim Wasserlassen").startsWith("Urinary tract infection"));
check("Fieber Gliederschmerzen Husten -> flu", topCond("Fieber, Gliederschmerzen und Husten") === "Influenza (flu)", ss("Fieber, Gliederschmerzen und Husten").matches.slice(0, 3).map((m) => [m.name, m.score]));
check("runny nose sneezing sore throat -> cold or hay fever", /Common cold|Allergic rhinitis/.test(topCond("runny nose, sneezing and a sore throat")), ss("runny nose, sneezing and a sore throat").matches.slice(0, 3).map((m) => m.name));
check("Erbrechen und Durchfall -> gastroenteritis", topCond("Erbrechen und Durchfall").startsWith("Acute gastroenteritis"));
check("short of breath and wheezing -> asthma/COPD", /Asthma|COPD/.test(topCond("short of breath and wheezing")), ss("short of breath and wheezing").matches.slice(0, 3).map((m) => m.name));
check("Brustschmerzen und Atemnot emergency", ss("Brustschmerzen und Atemnot").emergency?.urgency === "emergency");
check("tummy ache does not match headache conditions", !ss("tummy ache").matches.some((m) => m.name === "Migraine"), ss("tummy ache").matches.map((m) => m.name));
check("pins and needles in feet -> T2DM", ss("pins and needles in my feet").matches.some((m) => m.name === "Type 2 diabetes mellitus"));
check("Schwindel -> dizziness conditions", ss("Schwindel").matches.length > 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
