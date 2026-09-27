import Link from "next/link";

export function ConditionCard({
  condition,
}: {
  condition: { slug: string; name: string; summary: string };
}) {
  return (
    <Link
      href={`/conditions/${condition.slug}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-400 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-slate-900">{condition.name}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-slate-600">{condition.summary}</p>
      <p className="mt-2 text-xs font-medium text-teal-700">Possible explanation — not a diagnosis →</p>
    </Link>
  );
}
