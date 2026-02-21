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
