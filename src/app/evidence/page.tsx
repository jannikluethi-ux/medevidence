import { EvidenceBadge } from "@/components/EvidenceBadge";
import { RiskBucket } from "@/components/RiskBucket";
import { Disclaimer } from "@/components/Disclaimer";
import Link from "next/link";

export const metadata = { title: "Evidence explorer" };

export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Evidence explorer</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        MedEvidence surfaces how confident we are — and where we are not. We would rather show{" "}
        <em>No established evidence</em> than invent a study.
      </p>
      <div className="mt-4">
        <Disclaimer />
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Evidence strength badges</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(
            [
              ["high", "Consistent evidence from regulatory labeling, high-quality RCTs, or strong guidelines."],
              ["moderate", "Supportive evidence with some limitations (smaller trials, consistent observational + mechanistic, or solid guidelines with caveats)."],
              ["low", "Limited or inconsistent evidence; interpret cautiously."],
              ["very_low", "Case reports, weak observational signals, or heavy uncertainty."],
              ["no_established", "Claimed use/effect is not established — or evidence argues against it."],
            ] as const
          ).map(([level, desc]) => (
            <div key={level} className="rounded-xl border border-slate-200 bg-white p-4">
              <EvidenceBadge level={level} />
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Known risk vs emerging concern</h2>
        <p className="mt-2 text-sm text-slate-600">
          Used especially for long-term safety discussions (see{" "}
          <Link href="/medications/omeprazole" className="text-teal-700 underline">
            omeprazole
          </Link>
          ).
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <RiskBucket bucket="established">
            <p className="text-sm">
              Described in authoritative labeling/safety communications with clear clinical
              relevance (e.g., PPI hypomagnesemia with prolonged use).
            </p>
          </RiskBucket>
          <RiskBucket bucket="probable">
            <p className="text-sm">
              Strongly supported but may have residual uncertainty about frequency or mechanism.
            </p>
          </RiskBucket>
          <RiskBucket bucket="possible_emerging">
            <p className="text-sm">
              Observational associations or early signals.{" "}
              <strong>Association ≠ causation.</strong> Do not panic-stop medicines based on
              headlines alone.
            </p>
          </RiskBucket>
          <RiskBucket bucket="not_established">
            <p className="text-sm">
              Not established as causal; evidence conflicting or insufficient. We say so
              explicitly.
            </p>
          </RiskBucket>
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-xl font-semibold">Evidence types we tag</h2>
        <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {[
            "Regulatory (labels, SmPC, safety communications)",
            "Guideline (NICE, ESC, ADA, GINA, GOLD, WHO…)",
            "RCT",
            "Observational",
            "Case report",
            "Mechanistic",
            "Early research",
            "Expert opinion",
          ].map((t) => (
            <li key={t} className="rounded-lg bg-slate-50 px-3 py-2">
              {t}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
        <h2 className="text-lg font-semibold">MVP AI policy</h2>
        <p className="mt-2">
          External LLMs are <strong>not</strong> used for medical answers in this MVP (see{" "}
          <code className="rounded bg-white px-1">src/lib/ai/stub.ts</code>). Future AI layers
          must cite retrieved database sources only and never fabricate studies.
        </p>
      </section>
    </div>
  );
}
