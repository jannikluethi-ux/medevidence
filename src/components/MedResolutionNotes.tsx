import Link from "next/link";
import type { MedResolution } from "@/lib/search/synonyms";
import { kindLabel } from "@/lib/search/synonyms";

/** Explains how free-text medicine inputs (brands, synonyms, misspellings) were interpreted. */
export function MedResolutionNotes({ resolutions, basePath, param }: { resolutions: { key: string; res: MedResolution }[]; basePath: string; param?: Record<string, string> }) {
  const notes = resolutions.filter((r) => r.res.input && r.res.status !== "slug" && r.res.status !== "canonical");
  if (!notes.length) return null;
  return (
    <div className="mt-4 space-y-2 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-teal-950" data-testid="med-resolution">
      {notes.map(({ key, res }) => {
        if (res.status === "none")
          return (
            <p key={key}>
              <strong>&ldquo;{res.input}&rdquo;</strong> was not recognised in the catalogue. Try the generic name or pick from the suggestions.
            </p>
          );
        if (res.status === "class")
          return (
            <div key={key}>
              <p>
                <strong>&ldquo;{res.input}&rdquo;</strong> ({res.via ? kindLabel(res.via.kind, res.via.region, res.via.language) : "term"}) covers several
                medicines — choose one:
              </p>
              <ul className="mt-1 flex flex-wrap gap-2">
                {res.meds.map((m) => {
                  const params = new URLSearchParams({ ...(param ?? {}), [key]: m.slug });
                  return (
                    <li key={m.slug}>
                      <Link href={`${basePath}?${params.toString()}`} className="rounded-full border border-teal-300 bg-white px-2.5 py-0.5 hover:border-teal-600">
                        {m.generic_name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        return (
          <p key={key}>
            Interpreted <strong>&ldquo;{res.input}&rdquo;</strong> as{" "}
            <Link href={`/medications/${res.meds[0].slug}`} className="font-semibold underline">
              {res.meds[0].generic_name}
            </Link>{" "}
            <span className="text-teal-800">
              ({res.status === "fuzzy" ? "closest spelling match" : res.via ? kindLabel(res.via.kind, res.via.region, res.via.language) : "synonym"})
            </span>
          </p>
        );
      })}
    </div>
  );
}
