#!/bin/bash
# Git hooks installer for project-omnilyth
# This ensures only EtherealCarnivore can commit to the repo

HOOK_DIR=".git/hooks"
HOOK_FILE="$HOOK_DIR/pre-commit"

echo "🔧 Setting up git hooks..."

# Check if .git exists
if [ ! -d ".git" ]; then
  echo "⚠️  Not a git repository, skipping hook installation"
  exit 0
fi

# Create hooks directory if it doesn't exist
mkdir -p "$HOOK_DIR"

# Create pre-commit hook
cat > "$HOOK_FILE" << 'EOF'
#!/bin/bash
# Pre-commit hook to validate commit author

ALLOWED_EMAIL="42915554+EtherealCarnivore@users.noreply.github.com"
ALLOWED_NAME="EtherealCarnivore"

current_name=$(git config user.name)
current_email=$(git config user.email)

if [ "$current_email" != "$ALLOWED_EMAIL" ] || [ "$current_name" != "$ALLOWED_NAME" ]; then
  echo ""
  echo "❌ COMMIT BLOCKED: Wrong git config detected"
  echo ""
  echo "Current config:"
  echo "  Name:  $current_name"
  echo "  Email: $current_email"
  echo ""
  echo "Required config:"
  echo "  Name:  $ALLOWED_NAME"
  echo "  Email: $ALLOWED_EMAIL"
  echo ""
  echo "Fix with:"
  echo "  git config user.name '$ALLOWED_NAME'"
  echo "  git config user.email '$ALLOWED_EMAIL'"
  echo ""
  exit 1
fi

# All good, allow commit
exit 0
EOF

# Make hook executable
chmod +x "$HOOK_FILE"

echo "✅ Git hooks installed successfully"
echo ""
echo "The pre-commit hook will now prevent commits with wrong author info."
echo "Current git config:"
echo "  Name:  $(git config user.name)"
echo "  Email: $(git config user.email)"
