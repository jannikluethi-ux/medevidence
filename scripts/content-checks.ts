/**
 * Seed-time / test-time content integrity checks.
 * Catches class-template indication regressions, four-jurisdiction boilerplate,
 * and known-wrong drug–indication pairs.
 */
import fs from "fs";
import path from "path";

const DATA = path.join(__dirname, "data");

type Med = {
  genericName: string;
  drugClass: string;
  indications: { indication: string }[];
  regulatoryStatus?: Record<string, string>;
  adverse?: { effect: string }[];
};

const STD_FOUR = {
  US: "FDA-approved (see current labeling)",
  EU: "Authorized in EU / national procedures (see SmPC)",
  UK: "Licensed (see MHRA product information)",
  CH: "Authorized (see Swissmedic product information)",
};

/** Known-wrong drug → indication substring denylist */
export const INDICATION_DENYLIST: Record<string, string[]> = {
  Loperamide: [
    "moderate to severe acute pain",
    "cancer / palliative pain",
    "chronic non-cancer pain",
    "antitussive",
  ],
  Naloxone: [
    "moderate to severe acute pain",
    "cancer / palliative pain",
    "chronic non-cancer pain",
    "antitussive",
  ],
  Colchicine: ["tumor lysis syndrome prevention (allopurinol)"],
  Zolpidem: [
    "seizure / status epilepticus",
    "muscle spasm (diazepam)",
    "alcohol withdrawal",
    "acute anxiety / panic",
  ],
  Zopiclone: [
    "seizure / status epilepticus",
    "muscle spasm (diazepam)",
    "alcohol withdrawal",
    "acute anxiety / panic",
  ],
  Eszopiclone: [
    "seizure / status epilepticus",
    "muscle spasm (diazepam)",
    "alcohol withdrawal",
    "acute anxiety / panic",
  ],
  Dexlansoprazole: [
    "peptic ulcer disease",
    "h. pylori eradication",
    "zollinger",
    "nsaid-associated ulcer",
  ],
  Bumetanide: ["hypertension"],
};

const BOILERPLATE_INDS = [
  "see labeling for approved indications",
  "guideline-supported uses within class",
  "additional labeled indications — see current smpc/pi",
  "guideline-supported uses within pharmacologic class",
];

const PLACEHOLDER_AE = [
  "see class adverse effect profile",
  "class-specific serious risks — review labeling",
];

/** Classes allowed to share identical indication lists (empty = none by default). */
const SHARED_INDICATION_ALLOWLIST = new Set<string>([
  // Legitimate near-identical labeled uses within class (reviewed 2026-10-05)
  "Second-generation H1 antihistamine",
]);

const MAX_SHARED_WITHOUT_ALLOWLIST = 1; // >1 identical full lists in a class fails unless allowlisted

export function loadAllMeds(): Med[] {
  const meds: Med[] = [];
  for (let i = 1; i <= 7; i++) {
    const p = path.join(DATA, `meds_part${i}.json`);
    if (!fs.existsSync(p)) continue;
    meds.push(...(JSON.parse(fs.readFileSync(p, "utf8")) as Med[]));
  }
  return meds;
}

export function runContentChecks(meds: Med[] = loadAllMeds()): string[] {
  const errors: string[] = [];

  for (const m of meds) {
    const reg = m.regulatoryStatus;
    if (
      reg &&
      reg.US === STD_FOUR.US &&
      reg.EU === STD_FOUR.EU &&
      reg.UK === STD_FOUR.UK &&
      reg.CH === STD_FOUR.CH
    ) {
      errors.push(`${m.genericName}: four-jurisdiction authorisation boilerplate present`);
    }
    if (reg?.CH === STD_FOUR.CH) {
      errors.push(`${m.genericName}: unverified Swissmedic boilerplate claim`);
    }

    for (const ind of m.indications || []) {
      const low = ind.indication.toLowerCase();
      for (const b of BOILERPLATE_INDS) {
        if (low === b) errors.push(`${m.genericName}: boilerplate indication "${ind.indication}"`);
      }
    }

    for (const a of m.adverse || []) {
      const low = a.effect.toLowerCase();
      for (const p of PLACEHOLDER_AE) {
        if (low === p) errors.push(`${m.genericName}: placeholder adverse "${a.effect}"`);
      }
    }

    const deny = INDICATION_DENYLIST[m.genericName];
    if (deny) {
      for (const ind of m.indications || []) {
        const low = ind.indication.toLowerCase();
        for (const bad of deny) {
          if (low.includes(bad.toLowerCase())) {
            errors.push(`${m.genericName}: denylist indication contains "${bad}": ${ind.indication}`);
          }
        }
      }
    }
  }

  // Shared identical indication lists within a drug class
  const byClass = new Map<string, Map<string, string[]>>();
  for (const m of meds) {
    const key = [...(m.indications || []).map((i) => i.indication)].sort().join("||");
    if ((m.indications || []).length < 2) continue;
    if (!byClass.has(m.drugClass)) byClass.set(m.drugClass, new Map());
    const g = byClass.get(m.drugClass)!;
    if (!g.has(key)) g.set(key, []);
    g.get(key)!.push(m.genericName);
  }
  for (const [dc, groups] of byClass) {
    if (SHARED_INDICATION_ALLOWLIST.has(dc)) continue;
    for (const [, names] of groups) {
      if (names.length > MAX_SHARED_WITHOUT_ALLOWLIST) {
        errors.push(
          `drugClass "${dc}": ${names.length} drugs share identical indication lists (${names.join(", ")}) — allowlist or differentiate`
        );
      }
    }
  }

  return errors;
}

/** CLI / seed helper — throws on failure */
export function assertContentChecks(): void {
  const errors = runContentChecks();
  if (errors.length) {
    throw new Error("Content integrity checks failed:\n" + errors.join("\n"));
  }
}

// Run directly: npx tsx scripts/content-checks.ts
const isDirect = typeof require !== "undefined" && require.main === module;
if (isDirect) {
  const errors = runContentChecks();
  if (errors.length) {
    console.error("FAIL content checks:");
    for (const e of errors) console.error(" -", e);
    process.exit(1);
  }
  console.log("Content checks passed.");
}
