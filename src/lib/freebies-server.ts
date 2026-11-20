import "server-only";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { freebies } from "@/content/site";

/* ---------------- Whitelist ---------------- */

/** slug → on-disk file in /private/freebies + the download name. User input never reaches a path. */
export const FREEBIE_FILES: Record<string, { file: string; title: string }> = {
  "my-500-challenge": { file: "My 500 Challenge.pdf", title: "My 500 Challenge" },
  "think-it-through": { file: "The Think it Through Challenge.pdf", title: "The Think it Through Challenge" },
  "my-first-little-business": { file: "My First Little Business.pdf", title: "My First Little Business" },
  "7-day-brave-challenge": { file: "7 - Day Brave Challenge.pdf", title: "7-Day Brave Challenge" },
  "little-detectives": { file: "The Little Detectives.pdf", title: "The Little Detectives" },
};

export function isFreebieSlug(v: unknown): v is string {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(FREEBIE_FILES, v);
}

// Guard: every item on the page must have a file, and vice versa.
if (process.env.NODE_ENV !== "production") {
  for (const it of freebies.items) if (!isFreebieSlug(it.slug)) console.warn(`[freebies] no file for slug ${it.slug}`);
}

/* ---------------- Responses ---------------- */

const NO_STORE = { "Cache-Control": "no-store" };

export const FRIENDLY = {
  generic: "Something went wrong — please try again.",
  unavailable: "Downloads are taking a short break — please try again soon.",
  rate: "Too many tries — please wait a minute and try again.",
  forbidden: "This request isn't allowed.",
  bad: "Please check your details and try again.",
} as const;

export function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

/** Server-side log without PII or secrets: a tag and an error code only. */
export function logError(tag: string, err: unknown) {
  const code =
    err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : err instanceof Error ? err.message.slice(0, 60) : "unknown";
  console.error(`[freebies:${tag}] ${code}`);
}

/* ---------------- Config ---------------- */

/** Which required env vars are present. Booleans only — never the values. */
export function configStatus() {
  const s = process.env.FREEBIE_SECRET;
  return { db: !!process.env.DATABASE_URL, secret: !!s && s.length >= 32 };
}

/** Returns a 503 response (and logs what's missing) if the server isn't configured; otherwise null. */
export function notConfigured(tag: string, need: { db?: boolean; secret?: boolean }) {
  const c = configStatus();
  const missing = (need.db && !c.db) || (need.secret && !c.secret);
  if (!missing) return null;
  console.error(`[freebies:${tag}] MISSING_ENV db=${c.db} secret=${c.secret}`);
  return json({ ok: false, error: FRIENDLY.unavailable }, 503);
}

/* ---------------- Request guards ---------------- */

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
}

/** Same-origin only: Origin (or Referer) host must equal the request host. */
export function sameOrigin(req: NextRequest): boolean {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const src = req.headers.get("origin") ?? req.headers.get("referer");
  if (!host || !src) return false;
  try {
    return new URL(src).host === host;
  } catch {
    return false;
  }
}

/** Simple fixed-window limiter (per process). Swap for Redis/Upstash on multi-instance hosting. */
const buckets = new Map<string, { n: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  b.n += 1;
  return b.n <= limit;
}

/** Reads a JSON body capped at maxBytes. Returns null for anything that isn't small, valid JSON. */
export async function readJson(req: NextRequest, maxBytes = 2048): Promise<Record<string, unknown> | null> {
  if (!(req.headers.get("content-type") ?? "").toLowerCase().startsWith("application/json")) return null;
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > maxBytes) return null;
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/* ---------------- Validation ---------------- */

const clean = (v: unknown, max: number) =>
  typeof v === "string"
    ? v
        .replace(/[\u0000-\u001f\u007f]/g, "")
        .trim()
        .slice(0, max)
    : "";

export type Registration = { name: string; phone: string; email: string; freebie: string };

export function validate(body: Record<string, unknown>): { data?: Registration; errors?: Record<string, string> } {
  const name = clean(body.name, 80);
  const phone = clean(body.phone, 20);
  const email = clean(body.email, 254).toLowerCase();
  const freebie = body.freebie;
  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell us your name.";
  if (!/^\+?[\d\s-]{10,15}$/.test(phone)) errors.phone = "Please enter a valid contact number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email.";
  if (!isFreebieSlug(freebie)) errors.freebie = FRIENDLY.bad;
  if (Object.keys(errors).length) return { errors };
  return { data: { name, phone, email, freebie: freebie as string } };
}

/* ---------------- Signed access cookie ---------------- */

export const ACCESS_COOKIE = "oodle_freebies";
const YEAR_S = 60 * 60 * 24 * 365;

function secret(): string {
  const s = process.env.FREEBIE_SECRET;
  if (!s || s.length < 32) throw new Error("FREEBIE_SECRET_MISSING");
  return s;
}

const hmac = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function hashIp(ip: string): string {
  return createHash("sha256").update(`${secret()}:${ip}`).digest("hex").slice(0, 32);
}

export function setAccessCookie(res: NextResponse) {
  const payload = `${randomUUID()}.${Math.floor(Date.now() / 1000) + YEAR_S}`;
  res.cookies.set(ACCESS_COOKIE, `${payload}.${hmac(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/freebies",
    maxAge: YEAR_S,
  });
}

export function hasAccess(req: NextRequest): boolean {
  const raw = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!raw || raw.length > 200) return false;
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [id, exp, sig] = parts;
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^\d{10}$/.test(exp)) return false;
  if (Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(hmac(`${id}.${exp}`));
  const given = Buffer.from(sig);
  return expected.length === given.length && timingSafeEqual(expected, given);
}
