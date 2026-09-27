import { listSources } from "@/lib/data";
import { Disclaimer } from "@/components/Disclaimer";
import { CitationList } from "@/components/CitationList";

export const metadata = { title: "Sources" };

export default function SourcesPage() {
  const sources = listSources() as {
    id: number;
    title: string;
    organization: string;
    url?: string | null;
    jurisdiction?: string | null;
    evidence_type: string;
  }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Sources & sourcing policy</h1>
      <p className="mt-2 max-w-3xl text-slate-600">
        Every structured claim should attach authoritative sources (FDA DailyMed labels, EMA,
        NICE, Swissmedic, WHO, major guidelines). We do <strong>not</strong> invent PMIDs or
        study titles. When a statistic is uncertain, we phrase qualitatively and lower the
        evidence badge.
      </p>
      <div className="mt-4">
        <Disclaimer />
      </div>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">How sourcing works</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Seed and editorial content cite real organizations and public URLs where possible.</li>
          <li>Claim rows link to sources via <code>claim_sources</code>.</li>
          <li>Jurisdiction labels (US/EU/UK/CH) clarify which regulator a note reflects.</li>
          <li>Catalog is a starter set — absence of a drug is not a safety judgment.</li>
          <li>Future LLM answers (disabled in MVP) must cite retrieved source IDs only.</li>
        </ol>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <CitationList sources={sources} title={`Browse ${sources.length} seeded sources`} />
      </section>
    </div>
  );
}
