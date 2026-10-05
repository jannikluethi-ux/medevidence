// Added 2026-10-05 for "Find medicines by condition" (burns, heartburn).
// Label-level facts only (US labels on DailyMed checked 2026-10-05). Anything that varies by
// country is stated as "check local product information" rather than guessed.
import { med, I, A, W } from "./helpers.mjs";

export const MEDS_G = [
  med({
    name: "Silver sulfadiazine",
    brands: ["Silvadene", "Flamazine"],
    cls: "Topical sulfonamide antimicrobial (silver salt)",
    mech: "Silver sulfadiazine acts on bacterial cell membranes and cell walls; broad activity against many gram-negative and gram-positive bacteria (including Pseudomonas) and yeasts in burn wounds.",
    routes: ["topical"],
    reg: {
      US: "FDA-approved prescription cream (1%) — see current labeling on DailyMed",
    },
    eq: "Long-established labelled use for infection prevention in deeper burns. Systematic reviews of superficial and partial-thickness burns have not shown faster healing than other dressings, and some report slower healing, so many burn services now prefer other dressings — clinician decision.",
    ben: "Prescription cream used by clinicians to help prevent and treat infection in second- and third-degree burns. It is not a first-aid or self-care product for minor burns.",
    ind: [
      I("Adjunct for prevention and treatment of wound infection (sepsis) in second- and third-degree burns", "moderate", true, "Prescription-only; applied under medical supervision."),
      I("Infection in leg ulcers, pressure sores and skin graft donor sites (selected labels, e.g., UK)", "low", true, "Not part of the US labelled indication; check local product information."),
    ],
    ae: [
      A("Burning, itching or pain at the application site", "common", "moderate"),
      A("Transient leukopenia (low white blood cell count)", "common", "moderate", "Usually reversible; blood counts may be monitored in extensive burns"),
      A("Skin rash, contact dermatitis; rarely skin discolouration", "common", "moderate"),
      A("Sulfonamide-type reactions: blood dyscrasias, severe skin reactions (SJS/TEN), hepatitis, interstitial nephritis (rare)", "serious", "moderate"),
      A("Haemolysis in G6PD deficiency", "serious", "moderate"),
    ],
    warn: [
      W("contraindication", "Pregnant women approaching or at term, premature infants, and newborns during the first 2 months of life", "major", "Sulfonamides increase the risk of kernicterus (US label)."),
      W("contraindication", "Hypersensitivity to silver sulfadiazine or the cream's ingredients", "major", "Potential cross-sensitivity with other sulfonamides."),
      W("precaution", "G6PD deficiency", "moderate", "Haemolysis may occur."),
      W("precaution", "Extensive burns, kidney or liver impairment", "moderate", "Systemic absorption increases with burn area; serum sulfonamide levels, kidney function and urine (sulfa crystals) may need monitoring."),
    ],
    special: {
      pregnancy: "Use only if clearly justified; contraindicated approaching or at term (kernicterus risk).",
      lactation: "Sulfonamides pass into breast milk; clinician decision.",
      pediatric: "Contraindicated in premature infants and newborns during the first 2 months of life.",
      renal: "Accumulation possible if kidney function is impaired.",
      hepatic: "Accumulation possible if liver function is impaired.",
    },
    mon: ["In extensive burns: serum sulfonamide levels, kidney function, urine for sulfa crystals", "Blood counts (leukopenia)"],
    src: ["label_ssd", "dailymed", "bnf", "who"],
  }),
  med({
    name: "Povidone-iodine (topical antiseptic)",
    brands: ["Betadine"],
    cls: "Iodophor antiseptic",
    mech: "Releases free iodine, which kills bacteria, fungi and many viruses by oxidising microbial proteins and membranes.",
    routes: ["topical"],
    reg: {
      US: "Non-prescription first aid antiseptic (Drug Facts labelling); separate surgical skin-prep products also exist",
    },
    eq: "Long-established antiseptic; labelled for helping prevent infection in minor cuts, scrapes and burns and for skin preparation before procedures. Evidence that it improves healing of minor burns is limited.",
    ben: "Widely available antiseptic for minor wounds and for skin disinfection before procedures. Not for large, deep or serious burns.",
    ind: [
      I("First aid to help prevent infection in minor cuts, scrapes and burns (non-prescription products)", "moderate", true, "Label: ask a doctor before use on deep or puncture wounds, animal bites or serious burns."),
      I("Skin antisepsis before surgery, injections or other procedures", "high"),
    ],
    ae: [
      A("Local skin irritation, staining of skin", "common", "moderate"),
      A("Contact dermatitis / iodine hypersensitivity reactions", "common", "moderate"),
      A("Thyroid dysfunction from absorbed iodine with prolonged or large-area use (especially newborns)", "serious", "moderate"),
      A("Systemic iodine toxicity (e.g., metabolic acidosis, kidney impairment) when used on large burns or large wound areas", "serious", "low"),
    ],
    warn: [
      W("contraindication", "Thyroid disease (especially hyperthyroidism) and before or after radioactive iodine treatment", "major", "Absorbed iodine can affect thyroid function and interfere with radioiodine diagnostics/therapy — check local product information."),
      W("warning", "Large areas, deep wounds, animal bites or serious burns", "major", "Label: do not apply over large areas for longer than 1 week unless directed by a doctor; seek medical care for serious burns."),
      W("precaution", "Pregnancy, breastfeeding and newborns", "moderate", "Avoid prolonged or large-area use because of iodine absorption and thyroid effects."),
    ],
    special: {
      pregnancy: "Avoid prolonged or large-area use — iodine crosses the placenta and can affect the fetal thyroid.",
      lactation: "Iodine passes into breast milk; avoid prolonged or large-area use.",
      pediatric: "Newborns and young infants are especially sensitive to iodine absorption — use only on medical advice.",
      renal: "Caution with repeated large-area use in kidney impairment (iodine accumulation).",
    },
    mon: ["Thyroid function with prolonged or large-area use"],
    src: ["label_pvpi_firstaid", "dailymed", "who", "swissmedic_pi"],
  }),
  med({
    name: "Calcium carbonate (antacid)",
    brands: ["Tums", "Rennie"],
    cls: "Antacid (calcium salt)",
    mech: "Neutralises stomach acid on contact; works within minutes but for a short time and does not heal an inflamed oesophagus.",
    routes: ["oral"],
    reg: {
      US: "Non-prescription antacid (Drug Facts labelling); also sold as a calcium supplement",
    },
    eq: "Labelled for short-term relief of heartburn and acid indigestion; NHS advice lists antacids and alginates as pharmacy options for occasional heartburn. They relieve symptoms but do not treat the underlying cause.",
    ben: "Fast, short-acting relief of occasional heartburn. Some products (e.g., Rennie) also contain magnesium carbonate. Not intended for regular long-term use without medical advice.",
    ind: [
      I("Relief of heartburn, acid indigestion and sour stomach (non-prescription antacid)", "high"),
      I("Calcium supplementation when dietary intake is insufficient (supplement products)", "high"),
    ],
    ae: [
      A("Constipation, wind, bloating, belching", "common"),
      A("Hypercalcaemia / milk-alkali syndrome with high doses (especially with vitamin D or kidney impairment)", "serious", "moderate"),
      A("Kidney stones with excessive long-term use", "moderate", "low"),
      A("Reduced absorption of other medicines taken at the same time", "moderate"),
    ],
    warn: [
      W("interaction", "Many oral medicines (e.g., tetracycline and quinolone antibiotics, levothyroxine, iron, bisphosphonates)", "moderate", "Antacids can reduce their absorption — label advises asking a doctor or pharmacist if you take prescription drugs; doses are usually separated."),
      W("contraindication", "Hypercalcaemia, severe kidney impairment, calcium-containing kidney stones", "major", "Check local product information."),
      W("precaution", "Heartburn lasting more than 2 weeks, or with trouble swallowing, vomiting, weight loss or black stools", "major", "Label: do not use for more than 2 weeks except on a doctor's advice; these features need medical assessment."),
    ],
    special: {
      pregnancy: "Commonly used for heartburn in pregnancy; follow the lower pregnancy maximum stated on the label.",
      lactation: "Compatible at usual doses.",
      renal: "Avoid regular use in significant kidney impairment (hypercalcaemia risk).",
    },
    mon: null,
    src: ["label_caco3_antacid", "nhs_heartburn", "dailymed"],
  }),
];
