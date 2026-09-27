import { Disclaimer } from "@/components/Disclaimer";
import { getBuiltinEmergencyRules } from "@/lib/safety/emergency";
import Link from "next/link";

export const metadata = { title: "Safety" };

export default function SafetyPage() {
  const rules = getBuiltinEmergencyRules();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Safety & emergency guidance</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Before any educational content, MedEvidence runs a <strong>deterministic rules engine</strong>{" "}
        (not an LLM) for emergency patterns. Matching phrases show a full-width urgent banner first.
      </p>
      <div className="mt-4">
        <Disclaimer />
      </div>

      <section className="mt-8 rounded-xl border border-red-300 bg-red-50 p-5">
        <h2 className="text-xl font-semibold text-red-950">Emergency numbers</h2>
        <ul className="mt-3 grid gap-2 text-sm text-red-950 sm:grid-cols-2">
          <li><strong>Switzerland (CH):</strong> 144</li>
          <li><strong>European Union:</strong> 112</li>
          <li><strong>United States:</strong> 911</li>
          <li><strong>United Kingdom:</strong> 999</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Patterns we scan for</h2>
        <ul className="mt-4 space-y-3">
          {rules.map((r) => (
            <li key={r.name} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-semibold">
                {r.name}{" "}
                <span className="rounded bg-red-100 px-1.5 text-xs uppercase text-red-800">
                  {r.urgency}
                </span>
              </p>
              <p className="mt-1 text-sm text-slate-600">{r.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                Keyword groups (AND across groups):{" "}
                {r.groups.map((g) => `[${g.slice(0, 3).join(" | ")}…]`).join(" + ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700">
        <h2 className="text-lg font-semibold text-slate-900">Prescription medicines</h2>
        <p className="mt-2">
          MedEvidence <strong>never</strong> tells you to start, stop, or change a prescription
          medicine on your own. If an interaction or contraindication is serious, we say to{" "}
          <strong>consult a prescriber urgently</strong>. Abrupt cessation of some drugs (e.g.,
          beta-blockers, benzodiazepines, SSRIs, corticosteroids, anticoagulants) can be
          dangerous.
        </p>
        <p className="mt-3">
          Try the engine:{" "}
          <Link
            href="/symptoms?q=crushing%20chest%20pain%20and%20left%20arm%20numbness"
            className="text-teal-700 underline"
          >
            crushing chest pain and left arm numbness
          </Link>
        </p>
      </section>
    </div>
  );
}
