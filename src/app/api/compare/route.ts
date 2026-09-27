import { NextRequest, NextResponse } from "next/server";
import { getMedsForCompare } from "@/lib/data";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const slugs = (req.nextUrl.searchParams.get("slugs") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const meds = getMedsForCompare(slugs);
  return NextResponse.json({
    meds,
    note: "Comparison is descriptive only — MedEvidence never assigns an overall best score.",
  });
}
