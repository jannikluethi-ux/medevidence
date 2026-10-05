import { NextRequest, NextResponse } from "next/server";
import { findInteractions, logAudit, resolveMedicationInput } from "@/lib/search";
import { getSqlite } from "@/lib/db";
import { scanEmergency } from "@/lib/safety/emergency";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids") ?? "";
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const emergency = scanEmergency(q);
  const ids = idsParam
    .split(",")
    .map((x) => Number(x.trim()))
    .filter((n) => !Number.isNaN(n) && n > 0);
  // names=marcoumar,algifor — brand names / synonyms / slugs resolved via the synonyms layer
  const names = (req.nextUrl.searchParams.get("names") ?? "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, 5);
  const resolved = names.map((n) => resolveMedicationInput(n));
  for (const r of resolved) if (r.meds.length === 1 && !ids.includes(r.meds[0].id)) ids.push(r.meds[0].id);

  const interactions = findInteractions(ids);
  const sqlite = getSqlite();
  const meds = ids.map((id) =>
    sqlite.prepare(`SELECT id, generic_name, slug FROM medications WHERE id = ?`).get(id)
  );

  logAudit({
    query: `interactions:${ids.join(",")}`,
    responseSummary: `found=${interactions.length}`,
    safetyFlags: emergency ? [emergency.ruleName] : [],
  });

  return NextResponse.json({ emergency, meds, interactions, resolved });
}
