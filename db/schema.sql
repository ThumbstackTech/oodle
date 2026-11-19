-- Freebie Factory registrations. Applied automatically on first use by src/lib/db.ts (ensureSchema).
CREATE TABLE IF NOT EXISTS freebie_registrations (
  id          bigserial PRIMARY KEY,
  name        text        NOT NULL,
  phone       text        NOT NULL,
  email       text        NOT NULL,
  freebie     text        NOT NULL,
  ip_hash     text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One row per person per freebie; repeat sign-ups are no-ops.
CREATE UNIQUE INDEX IF NOT EXISTS freebie_registrations_email_freebie_idx
  ON freebie_registrations (lower(email), freebie);
