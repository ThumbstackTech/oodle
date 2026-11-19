import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";
import { FREEBIE_FILES, FRIENDLY, clientIp, hasAccess, isFreebieSlug, json, logError, rateLimit } from "@/lib/freebies-server";


const DIR = path.join(process.cwd(), "private", "freebies");

async function handle(req: NextRequest, slug: string, head: boolean) {
  try {
    if (!rateLimit(`dl:${clientIp(req)}`, 30, 10 * 60_000)) return json({ ok: false, error: FRIENDLY.rate }, 429);
    if (!isFreebieSlug(slug)) return json({ ok: false, error: "Not found." }, 404);
    if (!hasAccess(req)) return json({ ok: false, needsRegistration: true }, 401);

    const { file, title } = FREEBIE_FILES[slug];
    const headers = {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${title.replace(/[^\w .-]/g, "")}.pdf"`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    };
    if (head) return new Response(null, { status: 200, headers });
    const data = await readFile(path.join(DIR, file));
    return new Response(new Uint8Array(data), { status: 200, headers: { ...headers, "Content-Length": String(data.byteLength) } });
  } catch (err) {
    logError("download", err);
    return json({ ok: false, error: FRIENDLY.generic }, 500);
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  return handle(req, (await ctx.params).slug, false);
}

export async function HEAD(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  return handle(req, (await ctx.params).slug, true);
}
