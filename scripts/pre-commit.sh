#!/bin/bash

# Pre-commit hook to prevent committing secrets
# Install: cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

echo "🔍 Checking for secrets before commit..."

# Check if .env.local is being committed
if git diff --cached --name-only | grep -q "\.env\.local"; then
    echo "❌ ERROR: Attempting to commit .env.local file!"
    echo "   This file contains secrets and should never be committed."
    echo "   Add it to .gitignore immediately."
    exit 1
fi

# Check for common secret patterns
SECRETS_FOUND=0

# API Keys
if git diff --cached | grep -i "api[_-]key.*=.*[\"'][a-zA-Z0-9]\{20,\}[\"']" > /dev/null; then
    echo "⚠️  WARNING: Possible API key found in staged changes"
    SECRETS_FOUND=1
fi

# AWS Keys
if git diff --cached | grep -E "AKIA[0-9A-Z]{16}" > /dev/null; then
    echo "⚠️  WARNING: Possible AWS access key found in staged changes"
    SECRETS_FOUND=1
fi

# Private Keys
if git diff --cached | grep -i "BEGIN.*PRIVATE KEY" > /dev/null; then
    echo "⚠️  WARNING: Private key found in staged changes"
    SECRETS_FOUND=1
fi

# Generic secrets
if git diff --cached | grep -iE "(password|secret|token).*=.*['\"][^'\"]{20,}['\"]" > /dev/null; then
    echo "⚠️  WARNING: Possible secret found in staged changes"
    SECRETS_FOUND=1
fi

if [ $SECRETS_FOUND -eq 1 ]; then
    echo ""
    echo "❌ COMMIT BLOCKED: Potential secrets detected!"
    echo ""
    echo "If this is a false positive, you can:"
    echo "  1. Review the changes carefully"
    echo "  2. Use git commit --no-verify (NOT RECOMMENDED)"
    echo ""
    exit 1
fi

echo "✅ No secrets detected. Proceeding with commit..."
exit 0
