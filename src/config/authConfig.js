/**
 * authConfig.js — feature flag for the login / hidden-menu auth system.
 *
 * AUTH_ENABLED gates the whole auth feature. When false (the default), the
 * system is fully dormant: AuthContext never calls the auth endpoints, no
 * auth-gated menus appear, and /login + gated routes redirect home. The
 * feature ships in source but does nothing.
 *
 * Flip to true ONLY after the Cloudflare D1 database is provisioned and the
 * Worker auth endpoints are live:
 *   1. wrangler d1 create omnilyth-auth  (+ uncomment the binding in wrangler.toml)
 *   2. wrangler d1 execute ... --file=workers/schema.sql
 *   3. wrangler secret put AUTH_SECRET
 *   4. seed the first admin (scripts/hash-password.mjs)
 *   5. wrangler deploy
 *   6. set AUTH_ENABLED: true here, rebuild, redeploy the site
 */
export const AUTH_CONFIG = {
  AUTH_ENABLED: false,
};
