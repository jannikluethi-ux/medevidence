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

Admin password: set `ADMIN_PASSWORD` in `.env.local` for local use (development only falls back to a local default if unset; production requires the env var).

## Site password (HTTP Basic Auth)

The **entire site** (every page, API route, `/_next/static` asset, `robots.txt`, favicon) is behind HTTP Basic Auth, enforced by `src/middleware.ts`. There are no excluded paths, not even a health check.

| Env var | Purpose |
| --- | --- |
| `SITE_USERNAME` | Login username (not secret). Defaults to `family` if unset. |
| `SITE_PASSWORD` | Login password (secret). **No default.** |

- **Production (`next start`)**: if `SITE_PASSWORD` is missing or empty, every request returns `503 Site locked: not configured` (fail closed).
- **Local `npm run dev`**: if `SITE_PASSWORD` is unset the gate is **disabled** (open access, for convenience). Put `SITE_PASSWORD=...` in `.env.local` (git-ignored) to test the gate locally.
- Credentials are compared in constant time (SHA-256 both sides, then XOR-compare the digests; the edge runtime has no `timingSafeEqual`).
- Wrong or missing credentials return `401` with `WWW-Authenticate: Basic realm="MedEvidence (private)"`. All responses carry `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store`.
- The admin console (`/admin`) still uses its own `ADMIN_PASSWORD` sent as the `x-admin-password` header, so it does not clash with Basic Auth. Log in to the site first, then enter the admin password on `/admin`.
- **Local production preview without a password (`SITE_AUTH_DISABLED=1`)**: skips the gate **only** for requests whose `Host` is `localhost`, `127.0.0.1` or `[::1]`, whose client address is loopback (every `X-Forwarded-For` hop is `127.x`/`::1` — Next.js fills that header with the socket address when the client sends none), whose `X-Forwarded-Host` (if any) is also loopback and that carry no other proxy headers (`X-Real-IP`, `Forwarded`, `CF-Connecting-IP`, `True-Client-IP`), on a machine where `RENDER`/`VERCEL` are not set. All other requests keep the normal gate (401, or 503 if `SITE_PASSWORD` is unset). The `Host` header is client-supplied, so only combine it with a loopback-bound server: `SITE_AUTH_DISABLED=1 SITE_PASSWORD= npx next start -H 127.0.0.1 -p 3000`. Never set it on a deployed instance.


## Deploy to Render

Free web service for private family testing. The SQLite DB is rebuilt at build time (`npm run seed` inside `npm run build`) and read from the service disk at runtime. On the free plan the disk is ephemeral: **admin writes are lost on redeploy/restart** — acceptable for testing.

### Blueprint (recommended)

1. Push this repo to GitHub (already on `main`).
2. In Render: **New → Blueprint**, connect the `medevidence` repo.
3. Render reads `render.yaml` (service name `medevidence`, Node, free plan, `npm ci && npm run build` / `npm start`).
4. Confirm and create. `SITE_PASSWORD` and `ADMIN_PASSWORD` are auto-generated; `SITE_USERNAME` is `family`.
5. Open the service URL after the first deploy finishes. The browser asks for a username and password: use `SITE_USERNAME` / `SITE_PASSWORD`.

### Manual Web Service

1. **New → Web Service**, pick the GitHub repo.
2. Runtime: Node. Build: `npm ci && npm run build`. Start: `npm start`.
3. Plan: Free. Set env vars: `NODE_VERSION=20`, `SITE_USERNAME=family`, `SITE_PASSWORD` (generate a strong secret), `ADMIN_PASSWORD` (generate a strong secret), `NEXT_TELEMETRY_DISABLED=1`. Leave **Health Check Path** empty (every path requires auth). Do **not** set `NODE_ENV=production` at install time so `npm ci` still installs build-time devDependencies (`tsx`, `typescript`, Tailwind).
4. Deploy. Find the admin password under Environment in the Render dashboard.

### Site password: find, change, share

- **Find it**: Render dashboard → service `medevidence` → **Environment** → `SITE_PASSWORD` (click the eye icon to reveal / copy). The username is `SITE_USERNAME` (default `family`).
- **Change it**: same page → edit `SITE_PASSWORD` → **Save, rebuild, and deploy** (or *Save and deploy*). The new value is read at runtime when the service restarts; old credentials stop working after the deploy. Never set it to an empty value: the site then returns 503 for everyone.
- **Share it**: send username and password to family members over a private channel (e.g. Signal, in person or a password manager share), never in this public repo, an issue or a commit. Rotate it when someone should lose access.
- **No health check**: `render.yaml` sets no `healthCheckPath`; Render uses its default port check. Do not add a health path in the dashboard; it would get a 401.

`next start` listens on Render’s `$PORT` automatically (the start script does not hardcode a port).

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
| Medications | 284 |
| Conditions | 61 |
| Condition–symptom links | 230 |
| Condition → medicine links (Find by condition) | 103 |
| Interactions (curated pairs) | 173 |
| Sources | 82 |
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

### Find medicines by condition (`/treatments`, `/api/treatments?q=`)

- Information-only reference lookup: type a condition or complaint (`burn`, `heartburn`, `Verbrennung`, `brûlure`, `ustione`, `hay fever`…) and see **medicines whose official labelling or major guidelines list this use**. No ranking, no dosing, no questions about the user; grouped by form (topical / oral / nasal / inhaled / injection) and prescription status, alphabetical within each group; each entry links to the medication page with its evidence badge and source.
- Query → condition resolution uses the synonyms layer (exact term, then phrases within the query). Unknown terms are **never guessed**: fuzzy matches are only offered as "Did you mean" links, and the page shows "No listed medicines for this term yet" with a link to the symptom explorer.
- The emergency rules engine runs on the query first (burn rules: chemical/electrical burns, smoke inhalation, large/deep/charred burns, burns on face/hands/feet/genitals/joints, burns in babies/children/older people; severe sunburn).
- Links are curated in `scripts/enrich/v2/treatments.mjs` → `scripts/data/condition_medications.json` → table `condition_medications`. Each link must match an indication already present in that medicine's data; `npm run enrich:v2` and the seed both fail otherwise. Conditions can carry `first_aid` steps (shown for Burns and Sunburn).

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
- http://localhost:3000/treatments?q=burn
- http://localhost:3000/symptoms?q=persistent%20heartburn
- http://localhost:3000/symptoms?q=crushing%20chest%20pain%20and%20left%20arm%20numbness
- http://localhost:3000/compare?a=amlodipine&b=lisinopril
- http://localhost:3000/admin
