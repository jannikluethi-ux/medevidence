import { listConditions } from "@/lib/data";
import { ConditionCard } from "@/components/ConditionCard";
import { SearchBox } from "@/components/SearchBox";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata = { title: "Conditions" };

export default async function ConditionsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const conditions = listConditions({ q: q || undefined }) as {
    slug: string;
    name: string;
    summary: string;
  }[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Conditions</h1>
      <p className="mt-2 text-slate-600">
        High-volume conditions for symptom matching and context. Pages describe patterns — they
        do not diagnose you.
      </p>
      <div className="mt-4 max-w-xl">
        <SearchBox initialQuery={q} action="/conditions" placeholder="Search conditions…" />
      </div>
      <div className="mt-4">
        <Disclaimer compact />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {conditions.map((c) => (
          <ConditionCard key={c.slug} condition={c} />
        ))}
      </div>
    </div>
  );
}
