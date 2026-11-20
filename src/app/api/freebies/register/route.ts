import type { NextRequest } from "next/server";
import { ensureSchema, sql } from "@/lib/db";
import { FRIENDLY, clientIp, notConfigured, hashIp, json, logError, rateLimit, readJson, sameOrigin, setAccessCookie, validate } from "@/lib/freebies-server";


const MIN_FILL_MS = 2000;

export async function POST(req: NextRequest) {
  try {
    if (!sameOrigin(req)) return json({ ok: false, error: FRIENDLY.forbidden }, 403);

    const ip = clientIp(req);
    if (!rateLimit(`reg:${ip}`, 5, 10 * 60_000)) return json({ ok: false, error: FRIENDLY.rate }, 429);

    const body = await readJson(req);
    if (!body) return json({ ok: false, error: FRIENDLY.bad }, 400);

    // Bots: honeypot filled or submitted impossibly fast → pretend success, store nothing.
    const openedAt = Number(body.openedAt);
    if ((typeof body.website === "string" && body.website.length > 0) || !Number.isFinite(openedAt) || Date.now() - openedAt < MIN_FILL_MS) {
      return json({ ok: true });
    }

    const { data, errors } = validate(body);
    if (!data) return json({ ok: false, error: FRIENDLY.bad, errors }, 400);

    const off = notConfigured("register", { db: true, secret: true });
    if (off) return off;

    await ensureSchema();
    const db = sql();
    await db`
      INSERT INTO freebie_registrations (name, phone, email, freebie, ip_hash)
      VALUES (${data.name}, ${data.phone}, ${data.email}, ${data.freebie}, ${hashIp(ip)})
      ON CONFLICT DO NOTHING`;

    const res = json({ ok: true });
    setAccessCookie(res);
    return res;
  } catch (err) {
    logError("register", err);
    return json({ ok: false, error: FRIENDLY.generic }, 500);
  }
}
