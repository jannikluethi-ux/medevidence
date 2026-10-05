import Link from "next/link";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Disclaimer } from "@/components/Disclaimer";
import { lookupTreatments, type ConditionTreatments, type TreatmentAvailability } from "@/lib/treatments";
import { cn } from "@/lib/utils";

export const metadata = { title: "Find medicines by condition" };

const EXAMPLES = ["burn", "heartburn", "headache", "hay fever", "sunburn", "Verbrennung"];

const availStyles: Record<TreatmentAvailability, string> = {
  otc: "border-emerald-300 bg-emerald-50 text-emerald-900",
  varies: "border-slate-300 bg-slate-50 text-slate-700",
  rx: "border-violet-300 bg-violet-50 text-violet-900",
};

function SearchForm({ q }: { q: string }) {
  return (
    <form action="/treatments" method="get" role="search" className="w-full">
      <label htmlFor="treatments-q" className="sr-only">
        Condition or complaint
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="treatments-q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Type a condition or complaint, e.g. burn, heartburn, hay fever…"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />
        <button
          type="submit"
          className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Look up
        </button>
      </div>
    </form>
  );
}

function ConditionSection({ c }: { c: ConditionTreatments }) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" data-testid="condition-result" data-condition={c.slug}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-bold text-slate-900">
          <Link href={`/conditions/${c.slug}`} className="hover:underline">
            {c.name}
          </Link>
        </h2>
        {c.matchedVia ? (
          <span className="text-xs text-slate-500">
            matched “{c.matchedVia.term}” ({c.matchedVia.kindLabel})
          </span>
        ) : null}
      </div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-700">{c.summary}</p>

      {c.redFlags.length || c.firstAid.length ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {c.redFlags.length ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4" data-testid="red-flags">
              <h3 className="font-semibold text-red-950">Get urgent medical help (CH 144 · EU 112) if…</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-900">
                {c.redFlags.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {c.firstAid.length ? (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4" data-testid="first-aid">
              <h3 className="font-semibold text-teal-950">First aid and self-care basics</h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-teal-950">
                {c.firstAid.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      ) : null}

      <h3 className="mt-6 text-lg font-semibold text-slate-900">
        Medicines whose official labelling or major guidelines list this use
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Grouped by form and prescription status. Alphabetical within each group — not ranked, not a recommendation, no doses.
      </p>

      {c.total === 0 ? (
        <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700" data-testid="no-listed-meds">
          No listed medicines for this condition yet.{" "}
          <Link href={`/conditions/${c.slug}`} className="text-teal-700 underline">
            Read about {c.name}
          </Link>
          .
        </p>
      ) : (
        <div className="mt-4 space-y-5">
          {c.groups.map((g) => (
            <div key={g.key} data-testid="med-group" data-group={g.key}>
              <h4 className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
                {g.formLabel}
                <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", availStyles[g.availability])}>
                  {g.availabilityLabel}
                </span>
              </h4>
              <ul className="mt-2 grid gap-3 md:grid-cols-2">
                {g.items.map((m) => (
                  <li key={m.slug} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <Link href={`/medications/${m.slug}`} className="font-semibold text-teal-800 hover:underline">
                        {m.name}
                      </Link>
                      {m.evidenceLevel ? <EvidenceBadge level={m.evidenceLevel} /> : null}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{m.drugClass}</p>
                    <p className="mt-2 text-sm text-slate-800">
                      <span className="font-medium">Listed use:</span> {m.indication}
                      {m.approval && m.approval !== "approved" ? (
                        <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-900">{m.approval}</span>
                      ) : null}
                    </p>
                    {m.note ? <p className="mt-1 text-sm text-slate-600">{m.note}</p> : null}
                    {m.source ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Source{m.source.specificToUse ? "" : " (medicine information)"}:{" "}
                        {m.source.url ? (
                          <a href={m.source.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-800">
                            {m.source.organization} — {m.source.title}
                          </a>
                        ) : (
                          <>
                            {m.source.organization} — {m.source.title}
                          </>
                        )}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {c.whenToSeekCare ? (
        <p className="mt-5 text-sm text-slate-700">
          <strong>When to seek care:</strong> {c.whenToSeekCare}
        </p>
      ) : null}
      {c.seeAlso.length ? (
        <p className="mt-3 text-sm text-slate-600">
          See also:{" "}
          {c.seeAlso.map((s, i) => (
            <span key={s.slug}>
              {i > 0 ? " · " : null}
              <Link href={`/treatments?q=${encodeURIComponent(s.name)}`} className="text-teal-700 underline">
                {s.name}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}

export default async function TreatmentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: rawQ = "" } = await searchParams;
  const q = typeof rawQ === "string" ? rawQ : "";
  const result = lookupTreatments(q);

  return (
    <div>
      {result.emergency ? <EmergencyBanner match={result.emergency} /> : null}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">Reference lookup</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Find medicines by condition</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Type a condition or complaint to see which medicines in our catalog list it as a use in their official
          labelling or in major guidelines. Works with everyday words, brand-free terms and German, French or Italian.
        </p>
        <div className="mt-6 max-w-2xl">
          <SearchForm q={q} />
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>Examples:</span>
            {EXAMPLES.map((e) => (
              <Link
                key={e}
                href={`/treatments?q=${encodeURIComponent(e)}`}
                className="rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700 hover:border-teal-500 hover:text-teal-800"
              >
                {e}
              </Link>
            ))}
          </p>
        </div>

        <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 text-amber-950" role="note" data-testid="educational-note">
          <p className="font-semibold">Educational reference only — not a recommendation.</p>
          <p className="mt-1 text-sm leading-relaxed">
            This list is not tailored to you and does not say which medicine is right for you or how much to take.{" "}
            <strong>Ask a pharmacist or doctor before using any medicine</strong> — they can check suitability, other
            medicines you take, allergies, pregnancy and age. If symptoms are severe or you are worried, seek medical
            care (emergency: CH 144 · EU 112).
          </p>
        </div>

        {result.status === "results"
          ? result.conditions.map((c) => <ConditionSection key={c.id} c={c} />)
          : null}

        {result.status === "no_match" ? (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5" data-testid="empty-state">
            <h2 className="text-xl font-semibold text-slate-900">No listed medicines for this term yet</h2>
            <p className="mt-2 text-sm text-slate-700">
              We could not match “{result.query}” to a condition in our catalog, so we are not showing any medicines
              (we never guess). Try another word for the condition, or describe what you are experiencing in the{" "}
              <Link href={`/symptoms?q=${encodeURIComponent(result.query)}`} className="font-medium text-teal-700 underline">
                symptom explorer
              </Link>
              .
            </p>
            {result.suggestions.length ? (
              <p className="mt-3 text-sm text-slate-700">
                Did you mean:{" "}
                {result.suggestions.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 ? ", " : null}
                    <Link href={`/treatments?q=${encodeURIComponent(s.term)}`} className="font-medium text-teal-700 underline">
                      {s.term}
                    </Link>
                    {s.term !== s.label ? <span className="text-slate-500"> ({s.label})</span> : null}
                  </span>
                ))}
                ?
              </p>
            ) : null}
            {result.recognisedSymptoms.length ? (
              <p className="mt-3 text-sm text-slate-700">
                This looks like a symptom ({result.recognisedSymptoms.join(", ")}). Symptoms can have many causes —
                the{" "}
                <Link href={`/symptoms?q=${encodeURIComponent(result.query)}`} className="text-teal-700 underline">
                  symptom explorer
                </Link>{" "}
                shows possible explanations and when to seek care.
              </p>
            ) : null}
            {result.medicationHints.length ? (
              <p className="mt-3 text-sm text-slate-700">
                This looks like a medicine name. Its listed uses are on its page:{" "}
                {result.medicationHints.map((m, i) => (
                  <span key={m.slug}>
                    {i > 0 ? ", " : null}
                    <Link href={`/medications/${m.slug}`} className="font-medium text-teal-700 underline">
                      {m.name}
                    </Link>
                  </span>
                ))}
                .
              </p>
            ) : null}
          </section>
        ) : null}

        <div className="mt-10">
          <Disclaimer />
        </div>
        <p className="mt-3 text-xs text-slate-500">
          How this list is built: each entry links a condition to an indication already recorded for that medicine
          (from official product information or major guidelines), checked when the database is built. Availability
          labels are general and differ between countries and pack sizes. Browse all{" "}
          <Link href="/conditions" className="underline">
            conditions
          </Link>{" "}
          or{" "}
          <Link href="/medications" className="underline">
            medications
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
