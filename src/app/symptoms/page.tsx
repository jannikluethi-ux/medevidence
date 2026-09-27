import { SearchBox } from "@/components/SearchBox";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { symptomSearch, universalSearch } from "@/lib/search";
import Link from "next/link";

export const metadata = { title: "Symptom explorer" };

export default async function SymptomsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { emergency, matches } = q ? symptomSearch(q) : { emergency: null, matches: [] };
  const { hits } = q ? universalSearch(q, 8) : { hits: [] };
  const medHits = hits.filter((h) => h.type === "medication");

  return (
    <div>
      {emergency ? <EmergencyBanner match={emergency} /> : null}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900">What are you experiencing?</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Describe symptoms in everyday language. We match keywords to conditions in our starter
          catalog and show <strong>possible explanations</strong> — not a diagnosis.
        </p>
        <div className="mt-6 max-w-2xl">
          <SearchBox initialQuery={q} action="/symptoms" large />
        </div>

        <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
          <strong>Symptoms alone cannot establish a diagnosis.</strong> Many conditions share
          overlapping features. A clinician integrates history, exam, and tests. Emergency
          features always take priority over online matching.
        </div>

        <div className="mt-6">
          <Disclaimer />
        </div>

        {q ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold">
              Possible explanations for &ldquo;{q}&rdquo;
            </h2>
            {matches.length === 0 ? (
              <p className="mt-3 text-slate-600">
                No strong symptom matches in the starter catalog. Try different wording, or browse{" "}
                <Link href="/conditions" className="text-teal-700 underline">
                  conditions
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {matches.map((m) => (
                  <li
                    key={m.conditionId}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">
                        <Link href={`/conditions/${m.slug}`} className="text-teal-800 hover:underline">
                          {m.name}
                        </Link>
                      </h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        Match weight {m.score.toFixed(1)} · not a probability
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{m.summary}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Matched features:</span>{" "}
                      {m.matchedSymptoms.join(", ")}
                    </p>
                    {m.supporting.length > 0 ? (
                      <p className="mt-1 text-sm text-emerald-800">
                        Supporting: {m.supporting.join(" · ")}
                      </p>
                    ) : null}
                    {m.against.length > 0 ? (
                      <p className="mt-1 text-sm text-amber-800">
                        Against / caveats: {m.against.join(" · ")}
                      </p>
                    ) : null}
                    {m.redFlags.length > 0 ? (
                      <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-900">
                        <strong>Red flags:</strong> {m.redFlags.join(" · ")}
                      </div>
                    ) : null}
                    <p className="mt-3 text-sm text-slate-700">
                      <strong>When to seek care:</strong> {m.whenToSeekCare}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {medHits.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-lg font-semibold">Related medication matches</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {medHits.map((h) => (
                    <li key={h.slug}>
                      <Link
                        href={`/medications/${h.slug}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm hover:border-teal-400"
                      >
                        {h.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}
      </div>
    </div>
  );
}
