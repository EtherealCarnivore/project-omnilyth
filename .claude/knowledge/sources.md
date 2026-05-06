# Curated Sources — Omnilyth Oracle

Every URL here has been hand-vetted. The Oracle prefers sources higher up in this list. New URLs the Oracle discovers and trusts get appended here with a one-line note and today's date.

---

## Primary wikis & data

- **https://poedb.tw/us/**
  GGPK-derived raw item/mod/skill data. Best for exact mod tier ranges, base item stats, drop tables, base type lists, skill gem stat scaling.
  Caveat: names with apostrophes need underscored URLs (e.g., `Shavronnes_Wrappings`, not `Shavronne's_Wrappings`).
  Last verified: 2026-05-06.

- **https://www.poewiki.net/wiki/Path_of_Exile_Wiki**
  Community-maintained wiki. Current and broadly accurate. First stop for game mechanics, item interactions, lore, league recaps.
  Caveat: may return 403 to programmatic `WebFetch`. Use `WebSearch` snippets when that happens, or cite the URL with a "couldn't fetch programmatically" note.
  Last verified: 2026-05-06.

---

## Official sources

- **https://www.pathofexile.com/forum/view-forum/patch-notes**
  Official patch notes. Authoritative for balance changes, new content, bug fixes. Use for any question about *when* a value or behaviour changed.
  Last verified: 2026-05-06.

- **https://www.pathofexile.com**
  Official news, league announcements, manifesto posts. Authoritative for league mechanic introductions and design intent.
  Last verified: 2026-05-06.

---

## Fallback wikis

- **https://pathofexile.fandom.com/wiki/Path_of_Exile_Wiki**
  Older fandom wiki. Often outdated; consult only when poewiki.net and poedb.tw don't have what you need.
  Caveat: same 403-on-fetch issue as poewiki.net at times.
  Last verified: 2026-05-06.

---

## Community guides & references

- **https://maxroll.gg/poe/**
  Build / craft / league guides. Concise reference for crafting sequences and farming strategies.
  Last verified: 2026-05-06.

- **https://www.poe-vault.com/**
  Build guides and beginner-focused mechanic explanations. Useful fallback for league-mechanic walkthroughs.
  Last verified: 2026-05-06.

- **https://devtrackers.gg/pathofexile/**
  Aggregated GGG dev posts. Authoritative for old mechanic statements that haven't been re-documented on the wiki.
  Last verified: 2026-05-06.

- **https://poe.ninja/**
  League economy data — prices, popular builds, gem usage. Useful for "what's worth right now" but not for mechanics. The Omnilyth app already proxies this for its calculators (see `workers/poe-ninja-proxy.js`).
  Last verified: 2026-05-06.

---

## Sister knowledge base

- **`C:/Users/Admin/Desktop/Git/PathOfBuilding/.claude/knowledge/`**
  PoB project's PoE 1 KB. Pre-populated with cached entries for major uniques, mechanics deep-dives, and quick references that overlap heavily with Omnilyth's needs. Always check this *before* fetching the web.
  Last verified: 2026-05-06.

---

## Source-fetch caveats (verified 2026-05-06)

- `poewiki.net` and `pathofexile.fandom.com` may return **403** to programmatic `WebFetch`. Use `WebSearch` summaries when those fetches fail.
- `poedb.tw/us/` works but uses *underscored title* URLs — names with apostrophes need underscored variants.
- Some `pathofexile.com` deep paths require specific cookies — for forum patch notes, the public view-forum URL works without auth.

---

## Allowlist (Claude Code settings)

`WebFetch` is gated by domain in `~/.claude/settings.local.json`. As of 2026-05-06, the following PoE-relevant domains are allowed:

- `gist.github.com`, `github.com`, `raw.githubusercontent.com`, `api.github.com`
- `www.pathofexile.com`
- `medium.com`
- `forums.d2jsp.org`
- `poedb.tw`
- `www.poewiki.net`
- `pathofexile.fandom.com`
- `maxroll.gg`
- `www.poe-vault.com`
- `devtrackers.gg`

If a fetch fails with a permission prompt, the user has not yet allowed that domain — surface the URL plainly and let the user decide whether to allow.

---

## How to add new sources

When the Oracle finds a useful new URL:

1. Append it under the right section (or add a new section).
2. One-line description of what it's good for.
3. `Last verified: YYYY-MM-DD` line.
4. If `WebFetch` to that domain failed (not allowlisted), note it so the user can decide whether to add it.
5. Don't include sources you can't vouch for. Better to skip a doubtful source than mislead future answers.
