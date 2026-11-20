import "server-only";
import postgres from "postgres";

type Sql = ReturnType<typeof postgres>;

const g = globalThis as unknown as { __oodleSql?: Sql; __oodleSqlUrl?: string; __oodleSchema?: Promise<void> };

/** Lazily-created, process-wide client (cached across dev hot reloads). Never logs the URL. */
export function sql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DB_NOT_CONFIGURED");
  if (g.__oodleSql && g.__oodleSqlUrl === url) return g.__oodleSql;
  // URL changed (e.g. .env edited during dev) — drop the old pool and its schema check.
  if (g.__oodleSql) {
    void g.__oodleSql.end({ timeout: 1 }).catch(() => {});
    g.__oodleSchema = undefined;
  }
  g.__oodleSqlUrl = url;
  // SSL: honour ?sslmode=… in the URL if present; otherwise try SSL and fall back ("prefer").
  let sslFromUrl = false;
  try {
    sslFromUrl = new URL(url).searchParams.has("sslmode");
  } catch {
    throw new Error("DB_BAD_URL");
  }
  g.__oodleSql = postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 5,
    ...(sslFromUrl ? {} : { ssl: "prefer" as const }),
    onnotice: () => {},
    connection: { statement_timeout: 5000, application_name: "oodle-web" },
  });
  return g.__oodleSql;
}

/** Creates the table/index once per process. Keep in sync with db/schema.sql. */
export function ensureSchema(): Promise<void> {
  if (!g.__oodleSchema) {
    const db = sql();
    g.__oodleSchema = (async () => {
      await db`
        CREATE TABLE IF NOT EXISTS freebie_registrations (
          id bigserial PRIMARY KEY,
          name text NOT NULL,
          phone text NOT NULL,
          email text NOT NULL,
          freebie text NOT NULL,
          ip_hash text,
          created_at timestamptz NOT NULL DEFAULT now()
        )`;
      await db`
        CREATE UNIQUE INDEX IF NOT EXISTS freebie_registrations_email_freebie_idx
          ON freebie_registrations (lower(email), freebie)`;
    })().catch((err) => {
      g.__oodleSchema = undefined; // retry on next request
      throw err;
    });
  }
  return g.__oodleSchema;
}
