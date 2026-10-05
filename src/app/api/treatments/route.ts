import { NextRequest, NextResponse } from "next/server";
import { logAudit } from "@/lib/search";
import { lookupTreatments } from "@/lib/treatments";

export const runtime = "nodejs";

/**
 * GET /api/treatments?q=burn
 * Information-only reference lookup: medicines whose official labelling or major guidelines list
 * the condition as a use. Grouped by form + prescription status, alphabetical within each group.
 * Not a recommendation; no dosing; nothing personalised.
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const result = lookupTreatments(q);
  logAudit({
    query: q,
    responseSummary: `treatments status=${result.status} conditions=${result.conditions.map((c) => c.slug).join(",")} meds=${result.conditions.reduce((n, c) => n + c.total, 0)}`,
    safetyFlags: result.emergency ? [result.emergency.ruleName] : [],
  });
  return NextResponse.json({
    ...result,
    disclaimer:
      "Educational reference only — not a recommendation and not tailored to you. Medicines are listed because their official labelling or major guidelines list this use; within each group they are sorted alphabetically, not ranked. Ask a pharmacist or doctor before using any medicine.",
  });
}
