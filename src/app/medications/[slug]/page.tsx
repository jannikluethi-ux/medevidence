import { notFound } from "next/navigation";
import Link from "next/link";
import { getMedicationBySlug, listMedications } from "@/lib/data";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { RiskBucket } from "@/components/RiskBucket";
import { CitationList } from "@/components/CitationList";
import { Disclaimer } from "@/components/Disclaimer";
import { JurisdictionNote } from "@/components/JurisdictionSelector";

export async function generateStaticParams() {
  const meds = listMedications({ limit: 500 }) as { slug: string }[];
  return meds.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const med = getMedicationBySlug(slug);
  if (!med) return { title: "Medication" };
  return { title: String(med.generic_name) };
}

export default async function MedicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const med = getMedicationBySlug(slug);
  if (!med) notFound();

  const claims = med.claims as {
    id: number;
    claim_text: string;
    evidence_level: string;
    certainty_bucket: string;
    section: string;
    sources: { title: string; organization: string; url?: string | null; jurisdiction?: string | null }[];
  }[];

  const byBucket = {
    established: claims.filter((c) => c.certainty_bucket === "established"),
    probable: claims.filter((c) => c.certainty_bucket === "probable"),
    possible_emerging: claims.filter((c) => c.certainty_bucket === "possible_emerging"),
    not_established: claims.filter((c) => c.certainty_bucket === "not_established"),
  };

  const hasRisks =
    (med.adverse as { severity: string }[]).some((a) =>
      ["serious", "boxed"].includes(a.severity)
    ) || Boolean(med.why_still_prescribed);

  const sources = med.sources as {
    title: string;
    organization: string;
    url?: string | null;
    jurisdiction?: string | null;
  }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm text-teal-800">
        <Link href="/medications">Medications</Link> / {String(med.generic_name)}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{String(med.generic_name)}</h1>
      <p className="mt-1 text-teal-800">{String(med.drug_class)}</p>
      {(med.brandNames as string[]).length > 0 ? (
        <p className="mt-1 text-sm text-slate-500">
          Brand names (examples): {(med.brandNames as string[]).join(", ")}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {(med.routes as string[]).map((r) => (
          <span key={r} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs capitalize">
            {r}
          </span>
        ))}
      </div>

      <div className="mt-4">
        <JurisdictionNote status={med.regulatoryStatus as Record<string, string>} />
      </div>

      <div className="mt-4">
        <Disclaimer />
      </div>

      <article className="prose-medical mt-8 space-y-8">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>What it does</h2>
          <p className="text-slate-700 leading-relaxed">{String(med.mechanism)}</p>
          <p className="mt-3 text-sm text-slate-600">{String(med.evidence_quality_overview)}</p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>What it treats</h2>
          <ul className="mt-2 space-y-2">
            {(
              med.indications as {
                indication: string;
                approved_vs_off_label: string;
                evidence_level: string;
                notes?: string;
              }[]
            ).map((ind, i) => (
              <li key={i} className="flex flex-wrap items-start gap-2 text-sm">
                <span className="font-medium text-slate-800">{ind.indication}</span>
                <span className="rounded bg-slate-100 px-1.5 text-xs">{ind.approved_vs_off_label}</span>
                <EvidenceBadge level={ind.evidence_level} />
                {ind.notes ? <span className="w-full text-slate-500">{ind.notes}</span> : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Benefits</h2>
          <p className="text-slate-700 leading-relaxed">{String(med.benefits_summary)}</p>
        </section>

        {hasRisks && med.why_still_prescribed ? (
          <section className="rounded-xl border border-teal-200 bg-teal-50 p-5">
            <h2 className="!mt-0 text-teal-950">Why is this still prescribed?</h2>
            <p className="text-teal-950 leading-relaxed">{String(med.why_still_prescribed)}</p>
            <p className="mt-2 text-xs text-teal-800">
              Benefit–risk is individual. This section explains clinical context — it is not advice
              to continue or stop therapy.
            </p>
          </section>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Common side effects</h2>
          <ul className="mt-2 space-y-2">
            {(med.adverse as { effect: string; severity: string; frequency_note?: string; evidence_level: string }[])
              .filter((a) => a.severity === "common")
              .map((a, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">{a.effect}</span>
                  {a.frequency_note ? (
                    <span className="text-slate-500"> — {a.frequency_note}</span>
                  ) : null}{" "}
                  <EvidenceBadge level={a.evidence_level} />
                </li>
              ))}
          </ul>
        </section>

        <section className="rounded-xl border border-red-200 bg-red-50/40 p-5">
          <h2>Serious risks</h2>
          <ul className="mt-2 space-y-3">
            {(med.adverse as { effect: string; severity: string; frequency_note?: string; evidence_level: string }[])
              .filter((a) => a.severity === "serious" || a.severity === "boxed")
              .map((a, i) => (
                <li key={i} className="text-sm">
                  <span
                    className={
                      a.severity === "boxed"
                        ? "mr-2 rounded bg-red-700 px-1.5 py-0.5 text-xs font-bold uppercase text-white"
                        : "mr-2 rounded bg-orange-200 px-1.5 py-0.5 text-xs font-bold uppercase text-orange-950"
                    }
                  >
                    {a.severity === "boxed" ? "Boxed / prominent warning" : "Serious"}
                  </span>
                  <span className="font-medium">{a.effect}</span>
                  {a.frequency_note ? (
                    <span className="text-slate-600"> — {a.frequency_note}</span>
                  ) : null}{" "}
                  <EvidenceBadge level={a.evidence_level} />
                </li>
              ))}
          </ul>
          {(med.warnings as { type: string; population_or_condition: string; details: string; severity: string }[]).length >
          0 ? (
            <div className="mt-4">
              <h3>Who needs caution</h3>
              <ul className="mt-2 space-y-2">
                {(
                  med.warnings as {
                    type: string;
                    population_or_condition: string;
                    details: string;
                    severity: string;
                  }[]
                ).map((w, i) => (
                  <li key={i} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
                    <span className="font-semibold capitalize">{w.type}</span> —{" "}
                    <span className="font-medium">{w.population_or_condition}</span>
                    <p className="mt-1 text-slate-600">{w.details}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      If this applies to you, discuss with your prescriber — do not stop
                      prescription medicines abruptly unless a clinician tells you to in an
                      emergency context.
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Long-term evidence</h2>
          <p className="text-slate-700 leading-relaxed">
            {String(med.long_term_evidence || med.evidence_quality_overview)}
          </p>
        </section>

        <section>
          <h2>Emerging safety signals (known-risk system)</h2>
          <p className="mb-4 text-sm text-slate-600">
            Claims are bucketed by certainty. <strong>Association ≠ causation.</strong>{" "}
            Observational findings may reflect confounding. MedEvidence prefers label-backed
            established risks over media headlines.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {(
              Object.keys(byBucket) as (keyof typeof byBucket)[]
            ).map((bucket) => (
              <RiskBucket key={bucket} bucket={bucket}>
                {byBucket[bucket].length === 0 ? (
                  <p className="text-sm text-slate-500">No curated claims in this bucket yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {byBucket[bucket].map((c) => (
                      <li key={c.id} className="text-sm text-slate-800">
                        <p>{c.claim_text}</p>
                        <div className="mt-1">
                          <EvidenceBadge level={c.evidence_level} />
                        </div>
                        {c.sources?.length ? (
                          <div className="mt-2">
                            <CitationList sources={c.sources} title="Claim sources" />
                          </div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </RiskBucket>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Interactions</h2>
          <p className="text-sm text-slate-600">
            Use the{" "}
            <Link href={`/interactions?med=${slug}`} className="text-teal-700 underline">
              interaction checker
            </Link>{" "}
            to compare with other medicines. Serious interactions require clinician/pharmacist
            review — never stop anticoagulants or heart-failure medicines abruptly on your own.
          </p>
        </section>

        {med.special ? (
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2>Special populations</h2>
            <dl className="mt-2 grid gap-3 sm:grid-cols-2 text-sm">
              {(["pregnancy", "lactation", "renal", "hepatic", "geriatric", "pediatric"] as const).map(
                (k) => {
                  const val = (med.special as Record<string, string | null>)[k];
                  if (!val) return null;
                  return (
                    <div key={k}>
                      <dt className="font-semibold capitalize text-slate-800">{k}</dt>
                      <dd className="text-slate-600">{val}</dd>
                    </div>
                  );
                }
              )}
            </dl>
          </section>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Monitoring</h2>
          {(med.monitoring as { requirement: string }[]).length === 0 ? (
            <p className="text-sm text-slate-500">No structured monitoring rows in starter seed.</p>
          ) : (
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
              {(med.monitoring as { requirement: string }[]).map((m, i) => (
                <li key={i}>{m.requirement}</li>
              ))}
            </ul>
          )}
          {(med.withdrawal as { note: string }[]).length > 0 ? (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
              <strong>Withdrawal / discontinuation notes:</strong>
              <ul className="mt-1 list-disc pl-5">
                {(med.withdrawal as { note: string }[]).map((w, i) => (
                  <li key={i}>{w.note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Alternatives</h2>
          <p className="mb-2 text-xs text-slate-500">
            Alternatives are descriptive context for clinician discussion — not a ranking or switch
            recommendation.
          </p>
          {(med.alternatives as { alt_generic?: string; alt_slug?: string; alternative_name?: string; rationale: string }[])
            .length === 0 ? (
            <p className="text-sm text-slate-500">No linked alternatives in seed.</p>
          ) : (
            <ul className="space-y-2">
              {(
                med.alternatives as {
                  alt_generic?: string;
                  alt_slug?: string;
                  alternative_name?: string;
                  rationale: string;
                }[]
              ).map((a, i) => (
                <li key={i} className="text-sm">
                  {a.alt_slug ? (
                    <Link href={`/medications/${a.alt_slug}`} className="font-semibold text-teal-800">
                      {a.alt_generic || a.alternative_name}
                    </Link>
                  ) : (
                    <span className="font-semibold">{a.alternative_name}</span>
                  )}
                  <span className="text-slate-600"> — {a.rationale}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-sm">
            <Link href={`/compare?a=${slug}`} className="text-teal-700 underline">
              Compare side-by-side
            </Link>
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2>Evidence timeline</h2>
          <ol className="relative mt-4 space-y-4 border-l border-slate-200 pl-4">
            {claims.length === 0 ? (
              <li className="text-sm text-slate-500">
                Claims will appear here as the catalog is reviewed. Label-level facts are already
                reflected in structured sections above.
              </li>
            ) : (
              claims.map((c) => (
                <li key={c.id} className="text-sm">
                  <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-teal-600" />
                  <p className="font-medium capitalize text-slate-500">
                    {c.section?.replace(/_/g, " ")} · {c.certainty_bucket.replace(/_/g, " ")}
                  </p>
                  <p className="text-slate-800">{c.claim_text}</p>
                  <EvidenceBadge level={c.evidence_level} />
                </li>
              ))
            )}
          </ol>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <CitationList sources={sources} title="Sources for this medication page" />
        </section>
      </article>
    </div>
  );
}
