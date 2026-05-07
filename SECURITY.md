# Security policy

## Reporting a vulnerability

Please report security vulnerabilities **privately** via [GitHub Security Advisories](https://github.com/EtherealCarnivore/project-omnilyth/security/advisories/new), not in public issues.

We aim to respond within 72 hours. After triage, we will work with you on a disclosure timeline appropriate to the severity.

## Scope

In scope:

- The Omnilyth web app (bundled JavaScript shipped to GitHub Pages and the live deployment at `omnilyth.app`)
- The Cloudflare Worker proxy (`workers/poe-ninja-proxy.js`)
- Local data integrity — issues with `src/data/*` that could mislead users in ways affecting their Path of Exile accounts (e.g., maliciously crafted regex output that exfiltrates stash content, or data that recommends destructive crafting actions)

Out of scope:

- Third-party API behavior (poe.ninja, official PoE APIs, poewiki.net) — please report those upstream.
- The Omnilyth Watcher desktop binary — covered by its own (separate) policy once that project ships its own `SECURITY.md`.
- Path of Exile game-mechanics correctness — those are bug reports, not security issues; please open a normal GitHub issue.

## Supported versions

Only the current `master` branch and the live deployment receive security updates. Forks are not supported.
