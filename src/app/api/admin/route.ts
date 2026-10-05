import { NextRequest, NextResponse } from "next/server";
import { getSqlite } from "@/lib/db";

export const runtime = "nodejs";

/** Production requires ADMIN_PASSWORD; local/dev may fall back to "review". */
function expectedPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") return null;
  return "review";
}

function authorized(req: NextRequest) {
  const pwd = expectedPassword();
  if (pwd === null) return false;
  const header = req.headers.get("x-admin-password") ?? "";
  return header === pwd;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sqlite = getSqlite();
  const claims = sqlite
    .prepare(
      `SELECT c.*, m.generic_name, m.slug as med_slug
       FROM claims c
       LEFT JOIN medications m ON m.id = c.entity_id AND c.entity_type = 'medication'
       WHERE c.status IN ('draft','reviewed','rejected')
       ORDER BY c.id DESC`
    )
    .all();
  const reviews = sqlite
    .prepare(`SELECT * FROM content_reviews ORDER BY id DESC LIMIT 50`)
    .all();
  return NextResponse.json({ claims, reviews });
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { claimId, decision, reviewerNote, versionNote } = body as {
    claimId: number;
    decision: "approve" | "reject" | "needs_revision";
    reviewerNote?: string;
    versionNote?: string;
  };
  if (!claimId || !decision) {
    return NextResponse.json({ error: "claimId and decision required" }, { status: 400 });
  }
  const sqlite = getSqlite();
  const status =
    decision === "approve" ? "published" : decision === "reject" ? "rejected" : "draft";
  sqlite
    .prepare(
      `UPDATE claims SET status = ?, reviewer = ?, review_date = ?, version = version + 1 WHERE id = ?`
    )
    .run(status, "admin", new Date().toISOString().slice(0, 10), claimId);
  sqlite
    .prepare(
      `INSERT INTO content_reviews (claim_id, medication_id, reviewer_note, decision, version_note, timestamp)
       VALUES (?, NULL, ?, ?, ?, ?)`
    )
    .run(
      claimId,
      reviewerNote ?? "",
      decision,
      versionNote ?? "",
      new Date().toISOString()
    );
  return NextResponse.json({ ok: true, status });
}
