import Link from "next/link";
import { parseJsonArray } from "@/lib/utils";

export function MedCard({
  med,
}: {
  med: {
    slug: string;
    generic_name: string;
    drug_class: string;
    brand_names?: string;
  };
}) {
  const brands = parseJsonArray(med.brand_names);
  return (
    <Link
      href={`/medications/${med.slug}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-400 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-600"
    >
      <h3 className="text-lg font-semibold text-slate-900">{med.generic_name}</h3>
      <p className="text-sm text-teal-800">{med.drug_class}</p>
      {brands.length > 0 ? (
        <p className="mt-1 text-xs text-slate-500">Also known as: {brands.slice(0, 4).join(", ")}</p>
      ) : null}
    </Link>
  );
}
