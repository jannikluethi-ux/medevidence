import { listMedications } from "@/lib/data";
import { MedCard } from "@/components/MedCard";
import { SearchBox } from "@/components/SearchBox";
import { Disclaimer } from "@/components/Disclaimer";
import { InterpretationNote } from "@/components/InterpretationNote";
import { universalSearch } from "@/lib/search";
import { getSqlite } from "@/lib/db";

export const metadata = { title: "Medications" };

export default async function MedicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  type Row = { id: number; slug: string; generic_name: string; drug_class: string; brand_names: string };
  let meds: Row[];
  let interpretation: ReturnType<typeof universalSearch>["interpretation"] = null;
  if (q.trim()) {
    // synonyms/brands/misspellings first, then plain name/brand/class text matches
    const res = universalSearch(q, 60);
    interpretation = res.interpretation;
    const sqlite = getSqlite();
    const byId = sqlite.prepare(`SELECT id, slug, generic_name, drug_class, brand_names FROM medications WHERE id = ?`);
    const resolved = res.hits.filter((h) => h.type === "medication").map((h) => byId.get(h.id) as Row).filter(Boolean);
    const like = listMedications({ q }) as Row[];
    const seen = new Set<number>();
    meds = [...resolved, ...like].filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
  } else {
    meds = listMedications({}) as Row[];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold">Medications</h1>
      <p className="mt-2 text-slate-600">
        Starter catalog of commonly used medicines with structured evidence fields. Not a
        complete formulary.
      </p>
      <div className="mt-4 max-w-xl">
        <SearchBox
          initialQuery={q}
          action="/medications"
          placeholder="Search generic or brand name (e.g. Dafalgan, Marcoumar, blood thinner)…"
        />
      </div>
      <InterpretationNote interpretation={interpretation} />
      <div className="mt-4">
        <Disclaimer compact />
      </div>
      <p className="mt-4 text-sm text-slate-500">{meds.length} medications shown</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {meds.map((m) => (
          <MedCard key={m.slug} med={m} />
        ))}
      </div>
    </div>
  );
}
