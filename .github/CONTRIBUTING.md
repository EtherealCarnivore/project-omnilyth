# Contributing to Project Omnilyth

## Commit Author Requirements

This repository enforces strict commit author validation to maintain clean contribution history.

### Required Configuration

All commits MUST be authored by:
- **Name:** `EtherealCarnivore`
- **Email:** `42915554+EtherealCarnivore@users.noreply.github.com`

### Setup Your Git Config

Before making any commits, configure git:

```bash
git config user.name "EtherealCarnivore"
git config user.email "42915554+EtherealCarnivore@users.noreply.github.com"
```

### Automatic Protection

This repository has two layers of commit validation:

1. **Pre-commit Hook** - Automatically installed via `npm install`
   - Blocks commits with incorrect author BEFORE they're created
   - Shows clear error message with fix instructions

2. **GitHub Actions** - Validates all pushed commits
   - Runs on every push to master/main
   - Fails the workflow if wrong author detected

### Testing Your Setup

After configuring git, test that commits work:

```bash
# Verify config
git config user.name
git config user.email

# Make a test commit
echo "# Test" > test.txt
git add test.txt
git commit -m "Test commit"

# If successful, clean up
git reset HEAD~
rm test.txt
```

### Troubleshooting

**If commits are blocked:**

```bash
# Check current config
git config user.name
git config user.email

# Fix if needed
git config user.name "EtherealCarnivore"
git config user.email "42915554+EtherealCarnivore@users.noreply.github.com"
```

**If hooks aren't working:**

```bash
# Reinstall hooks
npm run setup-hooks

# Or manually
bash scripts/setup-hooks.sh
```

### Questions?

This strict validation ensures clean contribution history and proper attribution on GitHub.

For questions or issues, open a GitHub issue.

---

## Developer Certificate of Origin (DCO)

Contributions to Project Omnilyth are accepted under the **Developer Certificate of Origin v1.1** ([developercertificate.org](https://developercertificate.org/)).

Every commit must carry a `Signed-off-by:` trailer that matches the commit author:

```
Signed-off-by: Your Name <your.email@example.com>
```

You can add the trailer automatically with `git commit -s`. The trailer attests that you have the right to submit your contribution under the project's license — **GPL-3.0-or-later** for the main project, **MIT** for `workers/`.

Pull requests without a `Signed-off-by:` trailer on every commit will be flagged and cannot merge until the missing sign-offs are added (typically via `git rebase --signoff` and a force-push of the PR branch).

There is no separate paperwork — sign-off **is** the contribution agreement.

### Why DCO and not a CLA?

A CLA (Contributor License Agreement) would require each contributor to sign a separate document granting copyright assignment or a broad license-back. That's heavier weight and only pays off when a project wants the freedom to relicense in the future. DCO is the lightweight equivalent that keeps each contributor's copyright with them while still attesting they have the right to contribute their work.

A practical consequence: relicensing this project away from GPL-3.0 in the future would require permission from every contributor whose work is still in the codebase. We accept that trade-off.
