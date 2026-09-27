import { listMedications } from "@/lib/data";
import { MedCard } from "@/components/MedCard";
import { SearchBox } from "@/components/SearchBox";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata = { title: "Medications" };

export default async function MedicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const meds = listMedications({ q: q || undefined }) as {
    slug: string;
    generic_name: string;
    drug_class: string;
    brand_names: string;
  }[];

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
          placeholder="Search generic or brand name…"
        />
      </div>
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
