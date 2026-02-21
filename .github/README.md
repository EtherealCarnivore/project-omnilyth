# Repository Automation

This directory contains GitHub workflows and repository configuration.

## Workflows

### Validate Commit Author (`validate-author.yml`)

Ensures all commits are authored by the repository owner.

**Triggers:**
- Push to `master` or `main` branch
- Pull requests to `master` or `main` branch

**What it checks:**
- Commit author name: `EtherealCarnivore`
- Commit author email: `42915554+EtherealCarnivore@users.noreply.github.com`

**On failure:**
- Workflow fails with clear error message
- Shows which commit(s) have wrong author
- Provides fix instructions

## Local Protection

In addition to GitHub Actions, this repository uses a pre-commit hook to prevent wrong authors locally.

**Auto-installation:**
```bash
npm install  # Hooks install automatically
```

**Manual installation:**
```bash
npm run setup-hooks
```

**Location:**
- Script: `scripts/setup-hooks.sh`
- Hook: `.git/hooks/pre-commit` (not tracked in git)

## Why This Setup?

This dual-layer protection ensures:
1. **Local prevention** - Catches mistakes before commit
2. **Remote validation** - Final check on GitHub
3. **Clean history** - All commits properly attributed
4. **Automatic setup** - No manual configuration needed

## Troubleshooting

If you encounter issues with commit validation:

1. Check your git config:
   ```bash
   git config user.name
   git config user.email
   ```

2. Fix if needed:
   ```bash
   git config user.name "EtherealCarnivore"
   git config user.email "42915554+EtherealCarnivore@users.noreply.github.com"
   ```

3. Reinstall hooks:
   ```bash
   npm run setup-hooks
   ```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.
