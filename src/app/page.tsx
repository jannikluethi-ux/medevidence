import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { Disclaimer } from "@/components/Disclaimer";
import { listMedications, listConditions } from "@/lib/data";

export default function HomePage() {
  const meds = listMedications({ limit: 6 }) as { slug: string; generic_name: string }[];
  const conditions = listConditions() as { slug: string; name: string }[];
  const featuredConditions = conditions.slice(0, 6);

  return (
    <div>
      <section className="bg-gradient-to-b from-teal-900 to-teal-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-teal-100">
            Evidence · Uncertainty · Safety first
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            Understand your treatment options.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-teal-50">
            Explore medications, conditions, interactions, and evidence strength — with sources
            on every claim. Not an AI doctor. Willing to say we don&apos;t know yet.
          </p>
          <div className="mt-8 max-w-2xl rounded-2xl bg-white/10 p-4 backdrop-blur">
            <SearchBox large />
          </div>
          <p className="mt-3 text-sm text-teal-100">
            Try: omeprazole · warfarin + ibuprofen · persistent heartburn and stomach pain ·
            crushing chest pain and left arm numbness
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-10">
        <div className="rounded-2xl border-2 border-teal-200 bg-white p-6 shadow-sm" data-testid="home-treatments-card">
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
            <h2 className="text-2xl font-bold text-slate-900">What is used for…?</h2>
            <Link href="/treatments" className="text-sm font-medium text-teal-700 hover:underline">
              Find medicines by condition →
            </Link>
          </div>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Type a condition or complaint to see which medicines list it as a use in their official labelling or major
            guidelines. Information only — not a recommendation. Ask a pharmacist or doctor before using any medicine.
          </p>
          <form action="/treatments" method="get" role="search" className="mt-4 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <label htmlFor="home-treatments-q" className="sr-only">
              Condition or complaint
            </label>
            <input
              id="home-treatments-q"
              name="q"
              type="search"
              placeholder="e.g. burn, heartburn, hay fever…"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-200"
            />
            <button
              type="submit"
              className="rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Look up
            </button>
          </form>
          <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>Try:</span>
            {["burn", "heartburn", "headache", "hay fever"].map((e) => (
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
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-3">
        {[
          {
            href: "/symptoms",
            title: "Symptom explorer",
            body: "Describe what you’re experiencing. See possible explanations — never a diagnosis.",
          },
          {
            href: "/interactions",
            title: "Interaction checker",
            body: "Check pairs of medicines for established interaction severity and follow-up advice.",
          },
          {
            href: "/evidence",
            title: "Evidence explorer",
            body: "Learn how High / Moderate / Low / Very low / No established evidence badges work.",
          },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-400"
          >
            <h2 className="text-lg font-semibold text-slate-900">{c.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{c.body}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-6">
        <Disclaimer />
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-16 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">Featured medications</h2>
            <Link href="/medications" className="text-sm text-teal-700">
              Browse all
            </Link>
          </div>
          <ul className="space-y-2">
            {meds.map((m) => (
              <li key={m.slug}>
                <Link
                  href={`/medications/${m.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-teal-400"
                >
                  {m.generic_name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">High-volume conditions</h2>
            <Link href="/conditions" className="text-sm text-teal-700">
              Browse all
            </Link>
          </div>
          <ul className="space-y-2">
            {featuredConditions.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/conditions/${c.slug}`}
                  className="block rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-teal-400"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
