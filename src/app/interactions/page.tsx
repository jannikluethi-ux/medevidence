import { listMedications } from "@/lib/data";
import { findInteractions, medicationSuggestions, resolveMedicationInput } from "@/lib/search";
import { MedResolutionNotes } from "@/components/MedResolutionNotes";
import { scanEmergency } from "@/lib/safety/emergency";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { InteractionForm } from "./InteractionForm";
import Link from "next/link";

export const metadata = { title: "Interaction checker" };

export default async function InteractionsPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string; q?: string; med?: string }>;
}) {
  const sp = await searchParams;
  const meds = listMedications({ limit: 500 }) as {
    id: number;
    slug: string;
    generic_name: string;
  }[];

  // Inputs may be slugs, generic names, brand names (e.g. "Marcoumar", "Algifor"), international
  // names, or common misspellings — resolve them via the synonyms layer.
  const rawInputs = (["a", "b", "c", "med"] as const)
    .map((key) => ({ key, raw: (sp[key] ?? "").trim() }))
    .filter((x) => x.raw);
  const resolutions = rawInputs.map((x) => ({ key: x.key, res: resolveMedicationInput(x.raw) }));
  const selected: typeof meds = [];
  for (const r of resolutions) {
    if (r.res.meds.length === 1) {
      const m = meds.find((x) => x.id === r.res.meds[0].id);
      if (m && !selected.some((s) => s.id === m.id)) selected.push(m);
    }
  }
  const selectedSlugs = rawInputs.map((x) => x.raw);
  const suggestions = medicationSuggestions();
  const passthrough = Object.fromEntries(rawInputs.map((x) => [x.key, x.raw]));
  // Also allow id selection via form posting slugs only
  const ids = selected.map((m) => m.id);
  const interactions = findInteractions(ids) as {
    severity: string;
    mechanism: string;
    clinical_effect: string;
    established_vs_theoretical: string;
    evidence_level: string;
    professional_followup: string;
    med_a_name: string;
    med_b_name: string;
    med_a_slug: string;
    med_b_slug: string;
  }[];

  const emergency = scanEmergency(sp.q ?? selected.map((m) => m.generic_name).join(" "));

  return (
    <div>
      {emergency ? <EmergencyBanner match={emergency} /> : null}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Interaction checker</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Select 2–3 medicines from the starter catalog. Results show structured interaction
          rows only — no fabricated AI guesses. For serious interactions,{" "}
          <strong>consult a prescriber or pharmacist urgently</strong>; do not stop prescription
          medicines abruptly on your own.
        </p>
        <div className="mt-4">
          <Disclaimer />
        </div>

        <div className="mt-6">
          <InteractionForm suggestions={suggestions} initial={selectedSlugs} />
        </div>
        <MedResolutionNotes resolutions={resolutions} basePath="/interactions" param={passthrough} />

        {ids.length >= 2 ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              Results for {selected.map((m) => m.generic_name).join(" + ")}
            </h2>
            {interactions.length === 0 ? (
              <p className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                No curated interaction row for this pair in the starter database. Absence of a
                row is <strong>not proof of safety</strong> — check a clinician/pharmacist and
                current labeling.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {interactions.map((ix, i) => (
                  <li
                    key={i}
                    className={
                      ix.severity === "contraindicated" || ix.severity === "major"
                        ? "rounded-xl border border-red-300 bg-red-50 p-5"
                        : "rounded-xl border border-amber-200 bg-amber-50 p-5"
                    }
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-slate-900 px-2 py-0.5 text-xs font-bold uppercase text-white">
                        {ix.severity}
                      </span>
                      <span className="text-sm font-medium capitalize text-slate-700">
                        {ix.established_vs_theoretical}
                      </span>
                      <EvidenceBadge level={ix.evidence_level} />
                    </div>
                    <p className="mt-2 font-semibold text-slate-900">
                      <Link href={`/medications/${ix.med_a_slug}`} className="text-teal-800">
                        {ix.med_a_name}
                      </Link>
                      {" + "}
                      <Link href={`/medications/${ix.med_b_slug}`} className="text-teal-800">
                        {ix.med_b_name}
                      </Link>
                    </p>
                    <p className="mt-2 text-sm text-slate-800">{ix.clinical_effect}</p>
                    {ix.mechanism ? (
                      <p className="mt-1 text-sm text-slate-600">
                        <strong>Mechanism:</strong> {ix.mechanism}
                      </p>
                    ) : null}
                    <p className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-slate-800">
                      <strong>Professional follow-up:</strong> {ix.professional_followup}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <p className="mt-6 text-sm text-slate-500">Select at least two medications to check.</p>
        )}

        <p className="mt-8 text-sm text-slate-500">
          Examples:{" "}
          <Link href="/interactions?a=warfarin&b=ibuprofen" className="text-teal-700 underline">
            warfarin + ibuprofen
          </Link>
          {" · "}
          <Link href="/interactions?a=Marcoumar&b=Algifor" className="text-teal-700 underline">
            Marcoumar + Algifor
          </Link>
          {" · "}
          <Link href="/interactions?a=Xarelto&b=Aspirin" className="text-teal-700 underline">
            Xarelto + Aspirin
          </Link>
          <span className="block text-xs">You can type generic names, brand names (CH/EU/US/UK) or common spellings.</span>
        </p>
      </div>
    </div>
  );
}
