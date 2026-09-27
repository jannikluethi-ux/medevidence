import { NextRequest, NextResponse } from "next/server";
import { symptomSearch, logAudit } from "@/lib/search";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const result = symptomSearch(q);
  logAudit({
    query: q,
    responseSummary: `symptom matches=${result.matches.length}`,
    safetyFlags: result.emergency ? [result.emergency.ruleName] : [],
  });
  return NextResponse.json(result);
}
