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
 *
 * SITE_AUTH_DISABLED=1 (local production preview only): skips the gate ONLY for
 * requests that are unmistakably local — Host is localhost / 127.0.0.1 / [::1],
 * every X-Forwarded-For hop is a loopback address (Next.js fills this header
 * with the socket's remote address when the client did not send one), any
 * X-Forwarded-Host is also a loopback name, no other proxy headers (X-Real-IP,
 * Forwarded, CF-Connecting-IP, True-Client-IP) are present, and the process is
 * not running on a hosting platform (RENDER / VERCEL unset). Every other request
 * still gets the normal gate (Basic Auth, or 503 when SITE_PASSWORD is unset).
 * Only use this with a server bound to loopback, e.g.
 * `SITE_AUTH_DISABLED=1 npx next start -H 127.0.0.1 -p 3000`. Never set it on a
 * deployed instance.
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

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
/** Proxy headers that must be entirely absent for the local bypass. */
const PROXY_HEADERS = ["x-real-ip", "forwarded", "cf-connecting-ip", "true-client-ip"];

/** "127.0.0.1:3000" / "localhost" / "[::1]:3000" -> bare lowercase hostname. */
function hostnameOf(hostHeader: string): string {
  const host = hostHeader.trim().toLowerCase();
  return host.startsWith("[") ? host.slice(0, host.indexOf("]") + 1) : host.split(":")[0];
}

function isLoopbackIp(ip: string): boolean {
  const v = ip.trim().toLowerCase();
  return /^127(\.\d{1,3}){3}$/.test(v) || v === "::1" || /^::ffff:127(\.\d{1,3}){3}$/.test(v);
}

/**
 * True only for SITE_AUTH_DISABLED=1 + loopback Host + loopback client address
 * (every X-Forwarded-For hop) + no external proxy headers + not on a hosting platform.
 */
function localAuthBypass(req: NextRequest): boolean {
  if (process.env.SITE_AUTH_DISABLED !== "1") return false;
  if (process.env.RENDER || process.env.VERCEL) return false;
  const host = req.headers.get("host") ?? "";
  if (!host.trim() || !LOCAL_HOSTNAMES.has(hostnameOf(host))) return false;
  const fwdHost = req.headers.get("x-forwarded-host");
  if (fwdHost !== null && !fwdHost.split(",").every((h) => LOCAL_HOSTNAMES.has(hostnameOf(h)))) return false;
  // Next.js sets X-Forwarded-For to the socket address when the client did not
  // send one, so this must be present and every hop must be loopback.
  const xff = req.headers.get("x-forwarded-for");
  if (!xff || !xff.split(",").every(isLoopbackIp)) return false;
  for (const h of PROXY_HEADERS) if (req.headers.has(h)) return false;
  return true;
}

export async function middleware(req: NextRequest) {
  if (localAuthBypass(req)) {
    const res = NextResponse.next();
    for (const [k, v] of Object.entries(baseHeaders)) res.headers.set(k, v);
    return res;
  }

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
