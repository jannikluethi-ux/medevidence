import { NextRequest, NextResponse } from "next/server";
import { getMedsForCompare } from "@/lib/data";
import { resolveMedicationInput } from "@/lib/search";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  // accept slugs, generic names, brand names or synonyms (e.g. slugs=Dafalgan,Algifor)
  const resolved = slugs.map((s) => resolveMedicationInput(s));
  const canonical = resolved.map((r, i) => (r.meds.length === 1 ? r.meds[0].slug : slugs[i]));
  const meds = getMedsForCompare(canonical);
  return NextResponse.json({
    meds,
    resolved,
    note: "Comparison is descriptive only — MedEvidence never assigns an overall best score.",
  });
}
