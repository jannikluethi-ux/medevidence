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
- Seed JSON under `scripts/data/` (`meds_part1..6.json`, `conditions.json`, `interactions.json`, `sources.json`, `claims.json`); enrichment helpers live in `scripts/enrich/` for regenerating depth

## Seed catalog (expanded)

Approximate seeded counts after the content expansion pass:

| Entity | Count |
| --- | ---: |
| Medications | ~204 |
| Conditions | ~55 |
| Condition–symptom links | ~200+ |
| Interactions (curated pairs) | ~100 |
| Sources | ~62 |
| Claims (+ claim_sources) | ~89 |
| Adverse-effect rows | ~1,490 |
| Indication rows | ~1,070 |
| Warnings / contraindications | ~850 |
| Monitoring requirements | ~670 |
| Special-population rows | ~180 |
| Withdrawal notes | ~63 |
| Alternatives | ~29 |

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
