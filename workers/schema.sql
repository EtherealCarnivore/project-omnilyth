-- Omnilyth auth — Cloudflare D1 schema.
--
-- Apply (remote):
--   wrangler d1 execute omnilyth-auth --remote --file=workers/schema.sql
--
-- Seed the first admin (generate the record with scripts/hash-password.mjs):
--   node scripts/hash-password.mjs "your-temp-password"
--   wrangler d1 execute omnilyth-auth --remote --command \
--     "INSERT INTO users (username, password, is_admin, must_reset) VALUES ('admin', '<record>', 1, 1);"
--
-- That admin can then create / reset the other ~4 users via /auth/admin/set-password.

CREATE TABLE IF NOT EXISTS users (
  username   TEXT PRIMARY KEY,
  password   TEXT NOT NULL,                       -- "pbkdf2$<iter>$<saltB64url>$<hashB64url>"
  is_admin   INTEGER NOT NULL DEFAULT 0,          -- 1 = may set others' passwords
  must_reset INTEGER NOT NULL DEFAULT 1,          -- 1 = force a password change on next login
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
