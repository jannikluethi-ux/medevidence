import { NextRequest, NextResponse } from "next/server";
import { findInteractions, logAudit } from "@/lib/search";
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

  return NextResponse.json({ emergency, meds, interactions });
}
