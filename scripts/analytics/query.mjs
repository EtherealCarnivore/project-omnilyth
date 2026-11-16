#!/usr/bin/env node
/*
 * query.mjs — read the page-analytics dataset written by the Worker's
 * POST /beacon (workers/poe-ninja-proxy.js handleBeacon).
 *
 * Per route over the last N days: views, visits with a measured stay,
 * average and median visible time, and the mobile share. Sorted by views.
 *
 * Env: CLOUDFLARE_API_TOKEN (needs "Account Analytics: Read").
 *      CLOUDFLARE_ACCOUNT_ID (defaults to the account in wrangler.toml).
 *
 * Usage: node scripts/analytics/query.mjs [--days 7] [--game poe1|poe2] [--json]
 *
 * Analytics Engine samples at high volume; every aggregate below is weighted
 * by _sample_interval so the numbers stay unbiased.
 */

const ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID || 'de762c1447c2671cda02a6d5412acf1c';
const TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const DATASET = 'omnilyth_pageviews';

const args = process.argv.slice(2);
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
const days = Number.parseInt(opt('--days', '7'), 10);
const game = opt('--game', null);
const asJson = args.includes('--json');

if (!TOKEN) {
  console.error('CLOUDFLARE_API_TOKEN is not set (needs Account Analytics: Read).');
  process.exit(1);
}
if (!Number.isInteger(days) || days < 1 || days > 90) {
  console.error('--days must be 1-90 (Analytics Engine keeps 90 days).');
  process.exit(1);
}
if (game && !['poe1', 'poe2'].includes(game)) {
  console.error('--game must be poe1 or poe2.');
  process.exit(1);
}

const gameFilter = game ? `AND blob3 = '${game}'` : '';

const sql = `
SELECT
  blob1 AS route,
  SUM(IF(blob2 = 'view', _sample_interval, 0)) AS views,
  SUM(IF(blob2 = 'leave', _sample_interval, 0)) AS stays,
  SUM(IF(blob2 = 'leave', _sample_interval * double1, 0))
    / IF(SUM(IF(blob2 = 'leave', _sample_interval, 0)) = 0, 1, SUM(IF(blob2 = 'leave', _sample_interval, 0))) AS avg_ms,
  quantileExactWeighted(0.5)(IF(blob2 = 'leave', double1, NULL), _sample_interval) AS median_ms,
  SUM(IF(blob2 = 'view' AND blob4 = 'mobile', _sample_interval, 0)) AS mobile_views
FROM ${DATASET}
WHERE timestamp > NOW() - INTERVAL '${days}' DAY ${gameFilter}
GROUP BY route
ORDER BY views DESC
LIMIT 200
FORMAT JSON`;

const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/analytics_engine/sql`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${TOKEN}` },
  body: sql,
});
const text = await res.text();
if (!res.ok) {
  console.error(`Analytics Engine SQL API -> HTTP ${res.status}\n${text}`);
  process.exit(1);
}
const rows = JSON.parse(text).data.map((r) => ({
  route: r.route,
  views: Math.round(Number(r.views)),
  stays: Math.round(Number(r.stays)),
  avgSec: Math.round(Number(r.avg_ms) / 100) / 10,
  medianSec: r.median_ms == null ? null : Math.round(Number(r.median_ms) / 100) / 10,
  mobilePct: Number(r.views) ? Math.round((100 * Number(r.mobile_views)) / Number(r.views)) : 0,
}));

if (asJson) {
  console.log(JSON.stringify({ days, game: game || 'all', fetchedAt: new Date().toISOString(), rows }, null, 2));
} else {
  console.log(`Page analytics, last ${days} day(s), game: ${game || 'all'}\n`);
  console.log('| Route | Views | Stays | Avg stay (s) | Median stay (s) | Mobile % |');
  console.log('|---|---:|---:|---:|---:|---:|');
  for (const r of rows) {
    console.log(`| ${r.route} | ${r.views} | ${r.stays} | ${r.avgSec} | ${r.medianSec ?? '-'} | ${r.mobilePct} |`);
  }
  if (!rows.length) console.log('| (no data yet) | | | | | |');
}
