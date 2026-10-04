# Brief for Swiss regulatory counsel — MedEvidence

**Date:** 4 October 2026  
**From:** Carlos Rodriguez (Zurich)  
**Status:** Pre-launch educational prototype. Not placed on the market as a medical device.  
**Ask:** Written qualification of intended purpose, and a launch checklist under Swiss medical-device and medicines-advertising law. This note is a product description for counsel, not a self-classification.

## What exists

MedEvidence is a public Next.js website (source: https://github.com/jannikluethi-ux/medevidence) with a seeded catalogue of about 204 medicines and 55 conditions. It is aimed at lay people. A temporary public tunnel was used for family testing. There is no legal entity, no clinician sign-off, no privacy notice, and no terms of use. The default admin password is `review` and the admin page is linked in the public navigation.

Stated aim: help people understand medicines, conditions, interactions, and how strong the evidence is. It is not meant to diagnose or prescribe. Footers say that. The product still does the following:

1. Free-text symptom search that ranks “possible explanations” with a numeric match weight.
2. A checker for the user’s own medicines (about 100 curated pairs: severity, mechanism, what could happen, professional follow-up).
3. A keyword emergency banner that tells the user to seek urgent care and names 144 / 112 / 911 / 999.
4. Medicine pages: indications, benefits, side effects, “why is this still prescribed?”, alternatives, evidence grades.
5. A jurisdiction control labelled US / EU / UK / CH. It changes a note only. About 198 of 204 entries use the same sentence claiming FDA, EU, UK, and Swissmedic authorisation. That sentence is boilerplate, not a per-product Swissmedic check.

External language models are switched off. Answers come from the database and templates. Many adverse effects are class-level, not product-label text. Rebuilds wipe the database, including any review marks.

## Intended-purpose question we need answered

We have not chosen a purpose in the legal sense. We see two designs and need you to say which, if either, can be offered to the public in Switzerland without a medical-device conformity assessment, and what must be removed or rewritten:

- **A. Non-personal reference.** Static monographs only. No symptom ranking, no “my medicines” interaction engine, no personalised emergency interpretation.
- **B. Decision support.** Keep symptom ranking, interaction checking, and the emergency banner for a named person’s situation (lay user and/or clinician).

Please treat promotional pages and the live functions as part of intended purpose, not the disclaimer alone. We expect you to use MedDO (SR 812.213), IvDO where relevant, Swissmedic’s medical-device-software sheet (BW630_30_007, valid from 21 April 2026), and MDCG 2019-11. If B is a device, please indicate the likely classification route (including MDR Annex VIII Rule 11 as applied in Switzerland), economic-operator duties (manufacturer or CH-REP, PRRC, CHRN), languages, and whether a family-test URL is already “placing on the market.”

## Other questions for the same mandate

1. **Advertising.** Do “what it treats,” alternatives, and “why still prescribed,” shown to the public for prescription-only medicines (including opioids and benzodiazepines), breach HMG/LPTh Arts. 31–32 and the current AWV (SR 812.212.5)? What wording is information rather than advertising?
2. **Swiss authorisation claims.** Must every “authorised in Switzerland” line be removed until checked against swissmedicinfo?
3. **Liability.** What entity, terms, and insurance are realistic for A versus B? We will not rely on a disclaimer to exclude injury liability.
4. **Data.** Symptom and medicine text can appear in URLs and, on some API routes, in an audit log. No user accounts today. What FADP notice and retention are required before any public URL? We may later accept EU users (GDPR Art. 9).
5. **EU, UK, US.** Out of scope for this mandate except a one-line warning if a Swiss conclusion does not travel. We will not claim those markets until separately advised. US patient-facing clinical decision support is outside the FDA health-professional non-device exclusion, as we understand it.

## What we will not do before your letter

We will not market the site, sell it, or present it as clinically validated. We can keep a private family look only if you confirm that is not placing on the market. We will not add diagnosis, dosing instructions, or “stop/start this medicine” advice.

## Documents we can send

Repository, this brief, a short screen recording or URLs of the symptom, interaction, and emergency screens, and the seed note that jurisdiction flags are not product-specific.

**Contact:** Carlos Rodriguez, Zurich. Please reply in English or German.
