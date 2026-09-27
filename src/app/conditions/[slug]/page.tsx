import { notFound } from "next/navigation";
import Link from "next/link";
import { getConditionBySlug, listConditions } from "@/lib/data";
import { Disclaimer } from "@/components/Disclaimer";

export async function generateStaticParams() {
  const conditions = listConditions() as { slug: string }[];
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getConditionBySlug(slug);
  return { title: c ? String(c.name) : "Condition" };
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getConditionBySlug(slug);
  if (!c) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm text-teal-800">
        <Link href="/conditions">Conditions</Link> / {String(c.name)}
      </p>
      <h1 className="mt-2 text-3xl font-bold">{String(c.name)}</h1>
      <div className="mt-3 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
        This page describes a clinical pattern for education.{" "}
        <strong>It is not a personal diagnosis.</strong>
      </div>
      <div className="mt-4">
        <Disclaimer />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Summary</h2>
        <p className="mt-2 text-slate-700 leading-relaxed">{String(c.summary)}</p>
        {c.evidence_overview ? (
          <p className="mt-3 text-sm text-slate-600">{String(c.evidence_overview)}</p>
        ) : null}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Typical symptoms</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
          {(c.typicalSymptoms as string[]).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-xl font-semibold text-red-950">Red flags</h2>
        <ul className="mt-2 list-disc pl-5 text-sm text-red-900">
          {(c.redFlags as string[]).map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">When to seek care</h2>
        <p className="mt-2 text-slate-700">{String(c.when_to_seek_care)}</p>
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Symptom matching features</h2>
        <ul className="mt-3 space-y-3">
          {(
            c.symptoms as {
              symptom: string;
              synonyms: string;
              weight: number;
              supporting_feature?: string;
              against_feature?: string;
            }[]
          ).map((s, i) => {
            let synonyms: string[] = [];
            try {
              synonyms = JSON.parse(s.synonyms);
            } catch {
              synonyms = [];
            }
            return (
              <li key={i} className="text-sm">
                <span className="font-medium">{s.symptom}</span>
                <span className="text-slate-500"> (weight {s.weight})</span>
                {synonyms.length ? (
                  <span className="block text-slate-500">Synonyms: {synonyms.join(", ")}</span>
                ) : null}
                {s.supporting_feature ? (
                  <span className="block text-emerald-800">Supporting: {s.supporting_feature}</span>
                ) : null}
                {s.against_feature ? (
                  <span className="block text-amber-800">Against: {s.against_feature}</span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <p className="mt-6 text-sm">
        <Link href="/symptoms" className="text-teal-700 underline">
          Try the symptom explorer
        </Link>
      </p>
    </div>
  );
}
