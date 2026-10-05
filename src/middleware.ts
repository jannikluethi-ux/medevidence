import { NextResponse, type NextRequest } from "next/server";

/**
 * Site-wide HTTP Basic Auth gate.
 *
 * Runs on EVERY request (pages, API routes, /_next/static assets, public files
 * such as robots.txt). There is deliberately no matcher and no excluded path.
 *
 * Env:
 *   SITE_USERNAME  username (not secret). Defaults to "family" if unset.
 *   SITE_PASSWORD  password (secret). No default, ever.
 *
 * Fail closed: if SITE_PASSWORD is missing/empty and NODE_ENV is anything other
 * than "development" (i.e. `next build` + `next start`), every request gets
 * 503 "Site locked: not configured".
 * Local `next dev` without SITE_PASSWORD: access is allowed (no gate) so local
 * development works out of the box. Set SITE_PASSWORD in .env.local to test the
 * gate locally.
 */

const REALM = 'Basic realm="MedEvidence (private)"';
const DEFAULT_USERNAME = "family";

const baseHeaders: Record<string, string> = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

const encoder = new TextEncoder();

async function sha256(value: string): Promise<Uint8Array> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return new Uint8Array(digest);
}

/**
 * Constant-time-ish string comparison for the edge runtime (no
 * crypto.timingSafeEqual there). Both inputs are hashed to fixed-length
 * SHA-256 digests first, so neither the length nor the position of the first
 * mismatching character leaks; the digests are then compared with a
 * branch-free XOR accumulator.
 */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header) return null;
  const match = /^Basic\s+([A-Za-z0-9+/=]+)\s*$/i.exec(header);
  if (!match) return null;
  let decoded: string;
  try {
    const binary = atob(match[1]);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    decoded = new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
  const idx = decoded.indexOf(":");
  if (idx < 0) return null;
  return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      ...baseHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "WWW-Authenticate": REALM,
    },
  });
}

function locked(): NextResponse {
  return new NextResponse("Site locked: not configured", {
    status: 503,
    headers: { ...baseHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function middleware(req: NextRequest) {
  const expectedPass = process.env.SITE_PASSWORD ?? "";
  const expectedUser = process.env.SITE_USERNAME || DEFAULT_USERNAME;

  if (expectedPass === "") {
    if (process.env.NODE_ENV === "development") return NextResponse.next();
    return locked();
  }

  const creds = parseBasicAuth(req.headers.get("authorization"));
  if (!creds) return unauthorized();

  // Evaluate both comparisons (no short-circuit) before deciding.
  const [userOk, passOk] = await Promise.all([
    safeEqual(creds.user, expectedUser),
    safeEqual(creds.pass, expectedPass),
  ]);
  if (!(userOk && passOk)) return unauthorized();

  const res = NextResponse.next();
  for (const [k, v] of Object.entries(baseHeaders)) res.headers.set(k, v);
  return res;
}
