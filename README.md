# MedEvidence

Evidence-based medication intelligence MVP — **not an AI doctor**. Structured medication/condition data, interaction checking, symptom exploration, evidence-strength badges, and a deterministic emergency safety layer.

## Quick start

```bash
cd /workspace/medevidence
npm install
npm run seed          # builds SQLite DB under data/medevidence.db
npm run dev           # http://localhost:3000
```

Production build:

```bash
npm run build         # re-seeds then next build
npm start
```

Admin review password: set `ADMIN_PASSWORD` (default `review`) in `.env.local`.

## Architecture

- **Next.js 15 App Router** + TypeScript + Tailwind CSS
- **SQLite** via `better-sqlite3` (+ Drizzle schema types in `src/lib/db/schema.ts`)
- **FTS5** search over medications & conditions; symptom matching via `condition_symptoms`
- **Emergency rules** in `src/lib/safety/emergency.ts` (deterministic, not LLM)
- **AI stub** in `src/lib/ai/stub.ts` — external LLMs disabled for medical answers in MVP
- Pages: `/` `/symptoms` `/medications/[slug]` `/conditions/[slug]` `/interactions` `/compare` `/evidence` `/safety` `/sources` `/admin`
- APIs: `/api/search` `/api/symptoms` `/api/interactions` `/api/compare` `/api/admin`
- Seed JSON under `scripts/data/` (`meds_part1..7.json`, `conditions.json`, `interactions.json`, `sources.json`, `claims.json`, `synonyms.json`); enrichment helpers live in `scripts/enrich/` (v2 build: `npm run enrich:v2`, idempotent)

## Seed catalog (expanded)

Approximate seeded counts after the content expansion pass:

| Entity | Count |
| --- | ---: |
| Medications | 281 |
| Conditions | 59 |
| Condition–symptom links | 230 |
| Interactions (curated pairs) | 173 |
| Sources | 74 |
| Claims (+ claim_sources) | 89 |
| Synonym rows (brands, international names, lay/DE/FR/IT terms, misspellings, abbreviations) | ~6,400 |
| Adverse-effect rows | ~1,815 |
| Indication rows | ~1,260 |
| Warnings / contraindications | ~1,060 |
| Monitoring requirements | ~870 |
| Special-population rows | ~257 |
| Withdrawal notes | ~79 |
| Alternatives | ~29 |

### Synonyms layer (search / recognition only)

- Table `synonyms` (+ `synonyms_fts`): `term`, `normalized_term`, `target_type` (medication|condition|symptom), `target_id`, `target_label`, `kind` (brand|international_name|lay_term|misspelling|abbreviation|german|french|italian), `language`, `region`.
- Curated in `scripts/enrich/v2/syn-*.mjs`, generated to `scripts/data/synonyms.json` by `npm run enrich:v2`; the seed resolves targets by exact canonical name.
- Used by universal search (`/symptoms`, `/medications`, `/api/search` — shows "Showing results for … (you searched: …)"), the symptom matcher (lay/German phrases → canonical symptoms), interaction checker and compare (brand names such as `?a=Marcoumar&b=Algifor`), and the "Also known as" box on medication pages. Levenshtein fallback for misspellings.
- Synonyms never drive dosing or treatment logic. Brand region tags are indicative only.
- Tests: `npm test` (emergency rules, synonym resolution, search).

### Quality bar

- Essentially all meds have **≥3 adverse effects** and **≥2 indications** (most have substantially more)
- Exemplars (omeprazole, warfarin, sertraline, amoxicillin, metformin, atorvastatin, levofloxacin) carry rich AE/indication/warning/monitoring content
- Class-aware deepening for PPIs, NSAIDs, ACEI/ARBs, statins, SSRIs/SNRIs, fluoroquinolones, DOACs/warfarin, opioids, benzos, inhalers, diabetes agents, contraceptives, and more
- New high-use meds added across cardiology, psychiatry, ID, endocrinology, pulmonology, neurology, rheumatology, and women’s health

## Seed limitations (honest gaps)

This is still **not a complete formulary or a substitute for labeling / clinical judgment**:

- Coverage prioritizes common primary-care and selected specialty medicines; many hospital-only, oncology, and niche agents are absent
- Interaction checker is a **curated pair list** — absence of a pair does **not** mean safe to combine
- Frequency language is often qualitative; **no fabricated PMIDs, paper titles, or invented approvals**
- Emerging observational safety signals are labeled as association ≠ causation (e.g., some long-term PPI topics)
- Jurisdiction notes are high-level (US/EU/UK/CH) — always defer to current local SmPC/PI
- Non-drug alternatives are only sparsely modeled as free-text alternative names

Expand by editing JSON under `scripts/data/` (or re-running enrichment under `scripts/enrich/`) and `npm run seed`.

## Product rules (non-negotiable)

- Never diagnose with certainty, prescribe, or tell users to start/stop/change prescriptions
- Never fabricate studies, approvals, or adverse effects
- Association ≠ causation for emerging signals
- Emergency banners appear **before** educational content when patterns match
- Jurisdiction selector filters regulatory notes (US / EU / UK / CH)

## Sample URLs

- http://localhost:3000/
- http://localhost:3000/medications/omeprazole
- http://localhost:3000/medications/sertraline
- http://localhost:3000/interactions?a=warfarin&b=ibuprofen
- http://localhost:3000/symptoms?q=persistent%20heartburn
- http://localhost:3000/symptoms?q=crushing%20chest%20pain%20and%20left%20arm%20numbness
- http://localhost:3000/compare?a=amlodipine&b=lisinopril
- http://localhost:3000/admin
