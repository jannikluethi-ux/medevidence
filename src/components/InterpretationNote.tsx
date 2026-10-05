import Link from "next/link";
import type { SearchInterpretation, SymptomInterpretation } from "@/lib/search";

/** "Showing results for Paracetamol (you searched: Dafalgan — brand name, CH)" */
export function InterpretationNote({ interpretation }: { interpretation: SearchInterpretation | null }) {
  if (!interpretation || interpretation.matches.length === 0) return null;
  const m = interpretation.matches;
  const unique = m.filter((x, i) => m.findIndex((y) => y.label === x.label && y.type === x.type) === i);
  const via = unique[0];
  const many = unique.length > 1;
  return (
    <div className="mt-4 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-950" data-testid="interpretation-note">
      {interpretation.mode === "fuzzy" ? <span>Did you mean </span> : <span>Showing results for </span>}
      {unique.slice(0, many ? 12 : 1).map((x, i) => (
        <span key={x.type + x.label}>
          {i > 0 ? ", " : null}
          {x.slug ? (
            <Link href={`/${x.type === "medication" ? "medications" : "conditions"}/${x.slug}`} className="font-semibold underline">
              {x.label}
            </Link>
          ) : (
            <strong>{x.label}</strong>
          )}
        </span>
      ))}
      {unique.length > 12 ? <span> and {unique.length - 12} more</span> : null}
      {interpretation.mode === "fuzzy" ? "?" : null}{" "}
      <span className="text-teal-800">
        (you searched: <em>{interpretation.searched}</em>
        {interpretation.mode !== "fuzzy" ? <> — {via.kindLabel}</> : null}
        {many && interpretation.mode !== "fuzzy" ? "; this term covers several medicines/conditions" : ""})
      </span>
      <span className="mt-1 block text-xs text-teal-800">
        Synonyms help you find information; they do not mean products are interchangeable. Brand names and availability
        differ by country — check with a pharmacist.
      </span>
    </div>
  );
}

export function SymptomInterpretationNote({ interpretation }: { interpretation: SymptomInterpretation }) {
  if (!interpretation.length) return null;
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800" data-testid="symptom-interpretation">
      <span className="font-medium">We understood: </span>
      {interpretation.map((x, i) => (
        <span key={x.phrase}>
          {i > 0 ? " · " : null}
          <em>{x.phrase}</em> → {x.meaning.join(", ")}
        </span>
      ))}
    </div>
  );
}
