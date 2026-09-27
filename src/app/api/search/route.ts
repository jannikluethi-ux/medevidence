import { NextRequest, NextResponse } from "next/server";
import { universalSearch, logAudit } from "@/lib/search";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const result = universalSearch(q);
  logAudit({
    query: q,
    responseSummary: `search hits=${result.hits.length} emergency=${Boolean(result.emergency)}`,
    safetyFlags: result.emergency ? [result.emergency.ruleName] : [],
  });
  return NextResponse.json(result);
}
