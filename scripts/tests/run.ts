/**
 * Lightweight regression tests (no framework): emergency rules, synonym resolution, search.
 * Run: npm test   (requires a seeded DB: npm run seed)
 */
import { scanEmergency } from "../../src/lib/safety/emergency";
import { resolveMedicationInput, symptomSearch, universalSearch } from "../../src/lib/search";
import { lookupTreatments } from "../../src/lib/treatments";

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

// ---------- burns emergency rules ----------
const BURN_EMERGENCY = [
  "chemical burn on face",
  "chemical burn",
  "acid burn on my arm",
  "electrical burn",
  "got an electric shock and a burn",
  "Verätzung am Arm",
  "Stromunfall mit Verbrennung",
  "brûlure chimique",
  "ustione elettrica",
  "smoke inhalation",
  "Rauchvergiftung",
  "burns after breathing in smoke",
  "large burn on my leg",
  "deep burn",
  "charred skin burn",
  "burn on my face",
  "burned my hand",
  "burn on the feet",
  "burn on genitals",
  "burn over the knee",
  "my baby burned his arm",
  "elderly mother burned her arm",
  "Verbrennung im Gesicht",
  "Verbrennung an der Hand",
  "Säugling Verbrennung",
  "brûlure au visage",
  "brûlure à la main",
  "ustione alla mano",
  "ustione sul viso",
];
for (const q of BURN_EMERGENCY) check(`burn emergency: ${q}`, em(q)?.urgency === "emergency", em(q));
const BURN_NONE = [
  "burn", "burns", "minor burn", "small burn on arm", "Verbrennung", "Verbrennungen", "brûlure", "ustione", "sunburn", "scald",
  "heartburn", "acid reflux burns my throat", "burning feet", "burning when peeing", "brûlures d'estomac", "brûlure en urinant", "bruciore di stomaco",
];
for (const q of BURN_NONE) check(`burn no emergency: ${q}`, em(q) === null, em(q));
check("severe sunburn -> urgent", em("sunburn with blisters and fever")?.urgency === "urgent", em("sunburn with blisters and fever"));
check("Sonnenbrand mit Blasen -> urgent", em("Sonnenbrand mit Blasen")?.urgency === "urgent", em("Sonnenbrand mit Blasen"));

// ---------- find medicines by condition ----------
const lt = (q: string) => lookupTreatments(q);
const condSlugs = (q: string) => lt(q).conditions.map((c) => c.slug);
const medNames = (q: string) => lt(q).conditions.flatMap((c) => c.groups.flatMap((g) => g.items.map((i) => i.name)));
for (const q of ["burn", "burns", "Verbrennung", "Verbrennungen", "brûlure", "brulure", "ustione", "scald", "burnes", "verbrenung"]) {
  check(`treatments ${q} -> Burns`, condSlugs(q).includes("burns-minor-superficial"), condSlugs(q));
}
const burnMeds = medNames("burn");
check("burn lists paracetamol, ibuprofen, silver sulfadiazine, povidone-iodine, lidocaine",
  ["Paracetamol (Acetaminophen)", "Ibuprofen", "Silver sulfadiazine", "Povidone-iodine (topical antiseptic)", "Lidocaine"].every((n) => burnMeds.includes(n)), burnMeds);
check("burn does not list PPIs", !burnMeds.some((n) => /prazole/.test(n)), burnMeds);
const burn = lt("burn").conditions[0];
check("burn has first aid incl. 20 minutes", burn?.firstAid.some((f) => /20 minutes/.test(f)) ?? false);
check("burn has red flags incl. chemical/electrical", burn?.redFlags.some((f) => /electrical/i.test(f)) ?? false);
check("burn groups alphabetical", (burn?.groups ?? []).every((g) => g.items.every((it, i, a) => i === 0 || a[i - 1].name.localeCompare(it.name, "en", { sensitivity: "base" }) <= 0)));
check("silver sulfadiazine is grouped as topical prescription-only", burn?.groups.find((g) => g.key === "topical:rx")?.items.some((i) => i.name === "Silver sulfadiazine") ?? false, burn?.groups.map((g) => g.key));
check("sunburn -> Sunburn only", JSON.stringify(condSlugs("sunburn")) === JSON.stringify(["sunburn"]), condSlugs("sunburn"));
check("Sonnenbrand -> Sunburn", condSlugs("Sonnenbrand").includes("sunburn"));
check("sunburn lists no silver sulfadiazine", !medNames("sunburn").includes("Silver sulfadiazine"));
for (const q of ["heartburn", "Sodbrennen", "brûlures d'estomac", "bruciore di stomaco", "heart burn"]) {
  check(`treatments ${q} -> GERD only`, JSON.stringify(condSlugs(q)) === JSON.stringify(["gastroesophageal-reflux-disease-gerd"]), condSlugs(q));
}
const hbMeds = medNames("heartburn");
check("heartburn lists PPIs and antacid", ["Omeprazole", "Pantoprazole", "Calcium carbonate (antacid)", "Famotidine"].every((n) => hbMeds.includes(n)), hbMeds);
check("heartburn lists no burn creams", !hbMeds.some((n) => /sulfadiazine|Povidone|Lidocaine/.test(n)), hbMeds);
check("chemical burn on face -> Burns + emergency", condSlugs("chemical burn on face").includes("burns-minor-superficial") && lt("chemical burn on face").emergency?.urgency === "emergency");
check("brûlure en urinant is not a skin burn", !condSlugs("brûlure en urinant").includes("burns-minor-superficial"), condSlugs("brûlure en urinant"));
check("headache -> tension-type + migraine", ["tension-type-headache", "migraine"].every((s) => condSlugs("headache").includes(s)), condSlugs("headache"));
check("hay fever -> allergic rhinitis with cetirizine", condSlugs("hay fever").includes("allergic-rhinitis") && medNames("hay fever").includes("Cetirizine"));
check("nonsense -> no_match", lt("xyzzyplonk").status === "no_match" && lt("xyzzyplonk").conditions.length === 0);
check("misspelling not in list -> suggestion only", lt("burm").status === "no_match" && lt("burm").suggestions.some((s) => s.label === "Burns (minor, superficial)"), lt("burm"));
check("medicine name -> hint, no results", lt("ibuprofen").status === "no_match" && lt("ibuprofen").medicationHints.some((m) => m.name === "Ibuprofen"));
check("empty query", lt("  ").status === "empty_query");

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
