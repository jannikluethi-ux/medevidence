import { med, I, A, W, US_OK } from "./helpers.mjs";

export const MEDS_F = [
  med({
    name: "Rizatriptan",
    brands: ["Maxalt"],
    cls: "Triptan (5-HT1B/1D agonist)",
    mech: "Cranial vasoconstriction and inhibition of trigeminal neuropeptide release via 5-HT1B/1D agonism.",
    routes: ["oral", "orodispersible"],
    reg: { US: US_OK },
    eq: "RCTs and meta-analyses show rizatriptan is among the more effective oral triptans for acute migraine.",
    ben: "Fast-acting acute migraine treatment; frequent use risks medication-overuse headache.",
    ind: [
      I("Acute treatment of migraine with or without aura (adults)"),
      I("Acute migraine in children/adolescents 6–17 years (US label)", "moderate"),
    ],
    ae: [
      A("Dizziness, somnolence, fatigue", "common"),
      A("Chest, throat or jaw tightness/pressure", "common", "moderate"),
      A("Myocardial ischaemia / coronary vasospasm (rare)", "serious"),
      A("Serotonin syndrome with serotonergic drugs (rare)", "serious", "moderate"),
      A("Medication-overuse headache with frequent use", "moderate"),
    ],
    warn: [
      W("contraindication", "Coronary artery disease, previous stroke/TIA, uncontrolled hypertension, peripheral vascular disease, hemiplegic/basilar migraine", "major", "See label."),
      W("precaution", "Propranolol co-therapy", "moderate", "Raises rizatriptan levels — product-specific dose limits."),
      W("contraindication", "MAOIs within 14 days", "major", "Rizatriptan is MAO-A metabolised."),
    ],
    special: {
      pregnancy: "Triptan pregnancy registries are broadly reassuring (mostly sumatriptan) — clinician decision.",
      lactation: "Limited data; brief interruption sometimes advised.",
      hepatic: "Caution in moderate impairment.",
      geriatric: "CV risk assessment.",
    },
    mon: ["Headache days per month (overuse risk)", "Cardiovascular risk factors"],
    src: ["dailymed", "nice", "aan", "ema"],
  }),
];
