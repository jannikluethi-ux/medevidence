import { listMedications, getMedicationBySlug } from "@/lib/data";
import { Disclaimer } from "@/components/Disclaimer";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { CompareForm } from "./CompareForm";
import Link from "next/link";

export const metadata = { title: "Medication comparison" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; c?: string }>;
}) {
  const sp = await searchParams;
  const all = listMedications({ limit: 500 }) as {
    slug: string;
    generic_name: string;
  }[];
  const slugs = [sp.a, sp.b, sp.c].filter(Boolean) as string[];
  const meds = slugs
    .map((s) => getMedicationBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getMedicationBySlug>>[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Medication comparison</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Side-by-side structured fields for 2–3 medicines.{" "}
        <strong>No overall &ldquo;best&rdquo; score</strong> — different patients need different
        tradeoffs.
      </p>
      <div className="mt-4">
        <Disclaimer />
      </div>
      <div className="mt-6">
        <CompareForm meds={all} initial={slugs} />
      </div>

      {meds.length >= 2 ? (
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="border border-slate-200 p-3">Field</th>
                {meds.map((m) => (
                  <th key={String(m.slug)} className="border border-slate-200 p-3">
                    <Link href={`/medications/${m.slug}`} className="text-teal-800">
                      {String(m.generic_name)}
                    </Link>
                    <div className="font-normal text-slate-500">{String(m.drug_class)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-200 p-3 font-medium">Mechanism</td>
                {meds.map((m) => (
                  <td key={String(m.slug) + "mech"} className="border border-slate-200 p-3 align-top">
                    {String(m.mechanism)}
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 p-3 font-medium">Key indications</td>
                {meds.map((m) => (
                  <td key={String(m.slug) + "ind"} className="border border-slate-200 p-3 align-top">
                    <ul className="list-disc pl-4">
                      {(m.indications as { indication: string; evidence_level: string }[])
                        .slice(0, 4)
                        .map((i, idx) => (
                          <li key={idx}>
                            {i.indication} <EvidenceBadge level={i.evidence_level} />
                          </li>
                        ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-slate-200 p-3 font-medium">Serious / boxed risks</td>
                {meds.map((m) => (
                  <td key={String(m.slug) + "adv"} className="border border-slate-200 p-3 align-top">
                    <ul className="list-disc pl-4">
                      {(m.adverse as { effect: string; severity: string }[])
                        .filter((a) => a.severity === "serious" || a.severity === "boxed")
                        .map((a, idx) => (
                          <li key={idx}>
                            <span className="uppercase text-xs text-red-700">{a.severity}</span>{" "}
                            {a.effect}
                          </li>
                        ))}
                    </ul>
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-200 p-3 font-medium">Benefits summary</td>
                {meds.map((m) => (
                  <td key={String(m.slug) + "ben"} className="border border-slate-200 p-3 align-top">
                    {String(m.benefits_summary)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-slate-200 p-3 font-medium">Why still prescribed?</td>
                {meds.map((m) => (
                  <td key={String(m.slug) + "why"} className="border border-slate-200 p-3 align-top">
                    {String(m.why_still_prescribed || "—")}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-3 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">
            This table intentionally has <strong>no winner column</strong> and no composite score.
            Choosing therapy requires a clinician who knows the patient&apos;s history, labs, and
            preferences.
          </p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-500">
          Example:{" "}
          <Link href="/compare?a=amlodipine&b=lisinopril" className="text-teal-700 underline">
            amlodipine vs lisinopril
          </Link>
        </p>
      )}
    </div>
  );
}
