// Idempotent v2 enrichment build: new meds (meds_part7.json), sources, interactions,
// conditions + symptom links, and synonyms.json. Run: node scripts/enrich/v2/build.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MEDS_A } from "./meds-a.mjs";
import { MEDS_B } from "./meds-b.mjs";
import { MEDS_C } from "./meds-c.mjs";
import { MEDS_D } from "./meds-d.mjs";
import { MEDS_E } from "./meds-e.mjs";
import { MEDS_F } from "./meds-f.mjs";
import { SOURCES_V2 } from "./sources.mjs";
import { INTERACTIONS_V2 } from "./interactions.mjs";
import { CONDITIONS_V2, EXTRA_SYMPTOMS_V2 } from "./conditions.mjs";
import { MED_SYN_1 } from "./syn-meds-1.mjs";
import { MED_SYN_2 } from "./syn-meds-2.mjs";
import { MED_SYN_3 } from "./syn-meds-3.mjs";
import { CLASS_SYN } from "./syn-classes.mjs";
import { COND_SYN, SYMPTOM_SYN } from "./syn-conditions.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "..", "data");
const rd = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
const wr = (f, v) => fs.writeFileSync(path.join(DATA, f), JSON.stringify(v, null, 2) + "\n");

const errors = [];
const fail = (m) => errors.push(m);

// ---------- normalisation (must match src/lib/text.ts) ----------
export function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’‘`´]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// ---------- 1. meds ----------
const legacyMeds = [1, 2, 3, 4, 5, 6].flatMap((i) => rd(`meds_part${i}.json`));
const legacyNames = new Set(legacyMeds.map((m) => m.genericName.toLowerCase()));
const newMeds = [...MEDS_A, ...MEDS_B, ...MEDS_C, ...MEDS_D, ...MEDS_E, ...MEDS_F].filter((m) => {
  if (legacyNames.has(m.genericName.toLowerCase())) {
    console.warn("skip existing med:", m.genericName);
    return false;
  }
  return true;
});

// sources
const sources = rd("sources.json");
const srcKeys = new Set(sources.map((s) => s.key));
let addedSources = 0;
for (const s of SOURCES_V2) if (!srcKeys.has(s.key)) { sources.push(s); srcKeys.add(s.key); addedSources++; }

const PLACEHOLDER = /see class adverse effect|class adverse effect profile|placeholder|lorem|todo/i;
const seenNew = new Set();
for (const m of newMeds) {
  const n = m.genericName;
  if (seenNew.has(n)) fail(`duplicate new med ${n}`);
  seenNew.add(n);
  if ((m.indications || []).length < 2) fail(`${n}: <2 indications`);
  if ((m.adverse || []).length < 4) fail(`${n}: <4 adverse effects`);
  if (!m.adverse.some((a) => /serious|severe|major|boxed/i.test(a.severity))) fail(`${n}: no serious AE`);
  if ((m.warnings || []).length < 2) fail(`${n}: <2 warnings`);
  if (!m.special || Object.values(m.special).filter(Boolean).length < 2) fail(`${n}: special populations missing`);
  if (!m.sourceKeys?.length) fail(`${n}: no sources`);
  for (const k of m.sourceKeys) if (!srcKeys.has(k)) fail(`${n}: unknown source ${k}`);
  const blob = JSON.stringify(m);
  if (PLACEHOLDER.test(blob)) fail(`${n}: placeholder text`);
  for (const [j, v] of Object.entries(m.regulatoryStatus)) {
    if (/approved in all|authorised in US, EU, UK and Switzerland/i.test(v)) fail(`${n}: boilerplate regulatory ${j}`);
  }
}
const allMedNames = new Set([...legacyMeds.map((m) => m.genericName), ...newMeds.map((m) => m.genericName)]);

// ---------- 2. interactions ----------
const interactions = rd("interactions.json");
const pairKey = (a, b) => [a, b].sort().join("||");
const ixKeys = new Set(interactions.map((i) => pairKey(i.medA, i.medB)));
let addedIx = 0;
for (const ix of INTERACTIONS_V2) {
  if (!allMedNames.has(ix.medA)) fail(`interaction unknown med ${ix.medA}`);
  if (!allMedNames.has(ix.medB)) fail(`interaction unknown med ${ix.medB}`);
  for (const k of ix.sourceKeys) if (!srcKeys.has(k)) fail(`interaction ${ix.medA}+${ix.medB}: unknown source ${k}`);
  const key = pairKey(ix.medA, ix.medB);
  if (ixKeys.has(key)) continue;
  ixKeys.add(key);
  interactions.push(ix);
  addedIx++;
}

// ---------- 3. conditions ----------
const conditions = rd("conditions.json");
const condNames = new Set(conditions.map((c) => c.name));
let addedConds = 0, addedSymLinks = 0;
for (const c of CONDITIONS_V2) if (!condNames.has(c.name)) { conditions.push(c); condNames.add(c.name); addedConds++; }
for (const [cname, rows] of Object.entries(EXTRA_SYMPTOMS_V2)) {
  const c = conditions.find((x) => x.name === cname);
  if (!c) { fail(`extra symptoms: unknown condition ${cname}`); continue; }
  for (const r of rows) if (!c.symptoms.some((s) => s.symptom === r.symptom)) { c.symptoms.push(r); addedSymLinks++; }
}
const canonicalSymptoms = new Set(conditions.flatMap((c) => c.symptoms.map((s) => s.symptom)));

// ---------- 4. synonyms ----------
const KINDS = new Set(["brand", "international_name", "lay_term", "misspelling", "abbreviation", "german", "french", "italian"]);
const rows = new Map(); // key -> row
const split = (s) => (s ? s.split("|").map((x) => x.trim()).filter(Boolean) : []);
const canonNorm = new Map(); // target_type|target -> normalized canonical
function add(term, kind, language, region, targetType, target) {
  if (!KINDS.has(kind)) fail(`bad kind ${kind}`);
  term = term.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  if (!term) return;
  const nt = normalize(term);
  if (!nt) return;
  const ck = targetType + "|" + target;
  if (canonNorm.get(ck) === nt) return; // identical to canonical name
  const key = nt + "|" + ck;
  const ex = rows.get(key);
  if (ex) {
    if (kind === "brand" && ex.kind === "brand" && region) {
      const regs = new Set([...(ex.region ? ex.region.split(",") : []), ...region.split(",")]);
      ex.region = [...regs].join(",");
    }
    return;
  }
  rows.set(key, { term, normalized_term: nt, kind, language: language || null, region: region || null, target_type: targetType, target });
}
for (const n of allMedNames) canonNorm.set("medication|" + n, normalize(n));
for (const n of condNames) canonNorm.set("condition|" + n, normalize(n));

function addLangs(entry, targetType, target, enKind) {
  for (const t of split(entry.intl)) add(t, "international_name", "en", null, targetType, target);
  for (const t of split(entry.en)) add(t, enKind, "en", null, targetType, target);
  for (const t of split(entry.abbr)) add(t, "abbreviation", null, null, targetType, target);
  for (const t of split(entry.de)) add(t, "german", "de", null, targetType, target);
  for (const t of split(entry.fr)) add(t, "french", "fr", null, targetType, target);
  for (const t of split(entry.it)) add(t, "italian", "it", null, targetType, target);
  for (const t of split(entry.miss)) add(t, "misspelling", null, null, targetType, target);
}

// 4a. curated med entries
const MED_SYN = { ...MED_SYN_1, ...MED_SYN_2, ...MED_SYN_3 };
for (const [name, e] of Object.entries(MED_SYN)) {
  if (!e) continue;
  if (!allMedNames.has(name)) { fail(`synonyms: unknown med ${name}`); continue; }
  for (const b of split(e.b)) {
    const [bn, reg] = b.split("@");
    add(bn, "brand", null, reg || null, "medication", name);
  }
  addLangs(e, "medication", name, "lay_term");
}
// 4b. auto: brand names from data + parenthetical / base names
const NOT_BRAND = /^(various|generic|many|multiple|none|n\/a|historical)/i;
for (const m of [...legacyMeds, ...newMeds]) {
  for (const b of m.brandNames || []) {
    if (NOT_BRAND.test(b) || /generics?\b/i.test(b) || b.length > 40) continue;
    add(b, "brand", null, null, "medication", m.genericName);
  }
  const base = m.genericName.replace(/\s*\(.*$/, "").replace(/\s+—.*$/, "").trim();
  if (base && base !== m.genericName && !/\//.test(base)) add(base, "international_name", "en", null, "medication", m.genericName);
  const inner = m.genericName.match(/\(([^)]+)\)/)?.[1];
  if (inner && /^[A-Za-z][A-Za-z\- ]+$/.test(inner) && !/(dose|historical|withdrawn|nasal|inhaled|combined|micronised|pill|overview|antiplatelet|rheumatologic|unfractionated|mixed)/i.test(inner)) {
    add(inner, "international_name", "en", null, "medication", m.genericName);
  }
}
// 4c. classes
for (const c of CLASS_SYN) {
  for (const t of c.targets) {
    if (!allMedNames.has(t)) { fail(`class synonyms: unknown med ${t}`); continue; }
    addLangs(c, "medication", t, "lay_term");
  }
}
// 4d. conditions
for (const c of COND_SYN) {
  for (const t of c.targets) {
    if (!condNames.has(t)) { fail(`condition synonyms: unknown condition ${t}`); continue; }
    addLangs(c, "condition", t, "lay_term");
  }
}
for (const n of condNames) {
  const base = n.replace(/\s*\(.*$/, "").trim();
  if (base !== n) add(base, "international_name", "en", null, "condition", n);
}
// 4e. symptoms
for (const s of SYMPTOM_SYN) {
  for (const t of s.targets) {
    if (!canonicalSymptoms.has(t)) { fail(`symptom synonyms: unknown canonical symptom "${t}"`); continue; }
    addLangs(s, "symptom", t, "lay_term");
  }
}

if (errors.length) {
  console.error("VALIDATION FAILED:\n" + errors.join("\n"));
  process.exit(1);
}

const synonyms = [...rows.values()].sort((a, b) => a.target_type.localeCompare(b.target_type) || a.target.localeCompare(b.target) || a.kind.localeCompare(b.kind) || a.term.localeCompare(b.term));

wr("meds_part7.json", newMeds);
wr("sources.json", sources);
wr("interactions.json", interactions);
wr("conditions.json", conditions);
fs.writeFileSync(path.join(DATA, "synonyms.json"), "[\n" + synonyms.map((r) => JSON.stringify(r)).join(",\n") + "\n]\n");

const byKind = {}, byType = {};
for (const r of synonyms) { byKind[r.kind] = (byKind[r.kind] || 0) + 1; byType[r.target_type] = (byType[r.target_type] || 0) + 1; }
console.log(JSON.stringify({
  newMeds: newMeds.length, totalMeds: allMedNames.size,
  sources: sources.length, addedSources,
  interactions: interactions.length, addedIx,
  conditions: conditions.length, addedConds, addedSymLinks,
  synonyms: synonyms.length, byKind, byType,
}, null, 2));
