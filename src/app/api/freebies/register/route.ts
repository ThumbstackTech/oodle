import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ensureSchema, sql } from "@/lib/db";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Saves a freebie registration. Always answers { ok: true } — failures are only logged server-side. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const name = clean(body.name, 80);
    const phone = clean(body.phone, 20);
    const email = clean(body.email, 254).toLowerCase();
    const freebie = clean(body.freebie, 60);
    if (name && phone && email && freebie) {
      await ensureSchema();
      await sql()`
        INSERT INTO freebie_registrations (name, phone, email, freebie)
        VALUES (${name}, ${phone}, ${email}, ${freebie})
        ON CONFLICT DO NOTHING`;
    }
  } catch (err) {
    const code = err && typeof err === "object" && "code" in err ? String((err as { code: unknown }).code) : err instanceof Error ? err.message.slice(0, 60) : "unknown";
    console.error(`[freebies:register] ${code}`);
  }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
