/**
 * refresh-featured-creators.js — Refresh avatar / banner URLs for the
 * featured creators in src/config/featuredCreators.js.
 *
 * YouTube serves tokenised CDN URLs that rotate occasionally; this script
 * fetches each channel's public page and extracts the current s160 avatar
 * and w1707 banner URLs by regex-matching the embedded JSON. No API key,
 * no third-party API, no jsdom — just fetch + regex.
 *
 *   npm run featured-creators:refresh           dry-run; prints what would change
 *   npm run featured-creators:refresh -- --write  writes updates back to the config
 *
 * Optional positional args (handles starting with @) override the
 * config-driven handle list:
 *
 *   node scripts/refresh-featured-creators.js @Iva_m1 @Other_Channel
 *
 * Fails loud if YouTube's HTML structure changes — a silent zero-data
 * write is the worst failure mode.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = join(__dirname, '..', 'src', 'config', 'featuredCreators.js');

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const PATTERNS = {
  externalId: /"externalId":"(UC[A-Za-z0-9_-]+)"/,
  title: /"channelMetadataRenderer":\{"title":"((?:[^"\\]|\\.)+)"/,
  avatar: /(https:\/\/yt3\.googleusercontent\.com\/[A-Za-z0-9_-]+=s160-c-k-c0x00ffffff-no-rj)/,
  banner: /(https:\/\/yt3\.googleusercontent\.com\/[A-Za-z0-9_-]+=w1707-fcrop64=[A-Za-z0-9,_-]+(?:-k-c0xffffffff)?(?:-no-nd)?-rj)/,
};

async function fetchChannelData(handle) {
  const url = `https://www.youtube.com/${handle}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const html = await res.text();

  const out = { handle };
  for (const [key, re] of Object.entries(PATTERNS)) {
    const m = html.match(re);
    if (!m) {
      throw new Error(
        `Could not extract "${key}" from ${url} — YouTube HTML may have shifted; refresh PATTERNS in scripts/refresh-featured-creators.js.`
      );
    }
    out[key] = m[1];
  }
  // Decode \u escapes in title (YouTube serializes some chars as < etc.)
  out.title = JSON.parse(`"${out.title}"`);
  return out;
}

function findHandlesInConfig(src) {
  const handles = new Set();
  const re = /handle:\s*'(@[^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) handles.add(m[1]);
  return [...handles];
}

function rewriteUrls(src, oldUrl, newUrl) {
  if (!oldUrl || oldUrl === newUrl) return src;
  return src.split(oldUrl).join(newUrl);
}

async function main() {
  const args = process.argv.slice(2);
  const writeMode = args.includes('--write');
  const handleArgs = args.filter((a) => a.startsWith('@'));

  let configSrc = readFileSync(CONFIG_PATH, 'utf8');
  const handles = handleArgs.length ? handleArgs : findHandlesInConfig(configSrc);

  if (!handles.length) {
    console.error('No handles found in config and none passed as args. Nothing to refresh.');
    process.exit(1);
  }

  console.log(`Refreshing ${handles.length} creator(s): ${handles.join(', ')}\n`);

  const results = [];
  for (const handle of handles) {
    try {
      const data = await fetchChannelData(handle);
      results.push(data);
      console.log(`  ✓ ${handle} → ${data.title} (${data.externalId})`);
      console.log(`      avatar: ${data.avatar}`);
      console.log(`      banner: ${data.banner}\n`);
    } catch (err) {
      console.error(`  ✗ ${handle}: ${err.message}\n`);
      process.exitCode = 1;
    }
  }

  // For each refreshed creator, replace any avatar/banner URLs in the config
  // that share its CDN id-prefix with the freshly-fetched URL.
  let updated = configSrc;
  let changed = false;
  for (const data of results) {
    const avatarPrefix = data.avatar.split('=')[0]; // e.g. https://yt3.googleusercontent.com/_lzsI…
    const bannerPrefix = data.banner.split('=')[0];
    const reAvatar = new RegExp(
      `${escapeRegex(avatarPrefix)}=s\\d+-c-k-c0x00ffffff-no-rj(?:\\?[^'"\\s]*)?`,
      'g'
    );
    const reBanner = new RegExp(
      `${escapeRegex(bannerPrefix)}=w\\d+-fcrop64=[A-Za-z0-9,_-]+(?:-k-c0xffffffff)?(?:-no-nd)?-rj(?:\\?[^'"\\s]*)?`,
      'g'
    );
    const beforeAvatar = updated;
    updated = updated.replace(reAvatar, data.avatar);
    const beforeBanner = updated;
    updated = updated.replace(reBanner, data.banner);
    if (beforeAvatar !== updated || beforeBanner !== updated) changed = true;
  }

  if (!changed) {
    console.log('Config already current — no URL changes needed.');
    return;
  }

  if (writeMode) {
    writeFileSync(CONFIG_PATH, updated, 'utf8');
    console.log(`→ Wrote ${CONFIG_PATH}. Review the diff before committing.`);
  } else {
    console.log('Dry-run: config WOULD be updated. Re-run with --write to apply.');
    console.log(`(Target file: ${CONFIG_PATH})`);
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

main().catch((err) => {
  console.error('Refresh failed:', err);
  process.exit(1);
});
