#!/bin/bash

# Security Audit Script for Ethiopian Today
# Run this before deploying to production

echo "🔍 Starting Security Audit..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ISSUES=0

# 1. Check if .env.local is in .gitignore
echo "1. Checking .gitignore configuration..."
if grep -q "\.env.*\.local\|\.env\.local" .gitignore 2>/dev/null; then
    echo -e "${GREEN}✓${NC} .env.local is in .gitignore"
else
    echo -e "${RED}✗${NC} .env.local is NOT in .gitignore - CRITICAL!"
    ISSUES=$((ISSUES+1))
fi

# 2. Check if .env.local exists and contains secrets
echo ""
echo "2. Checking for .env.local file..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check for weak/default secrets
    if grep -q "your_" .env.local 2>/dev/null; then
        echo -e "${RED}✗${NC} Found default placeholder values in .env.local"
        echo "   Please replace all 'your_*' placeholders with actual values"
        ISSUES=$((ISSUES+1))
    else
        echo -e "${GREEN}✓${NC} No placeholder values found"
    fi
    
    # Check secret strength (minimum 20 chars)
    if grep -E "SECRET=.{0,19}$" .env.local 2>/dev/null | grep -v "^#" > /dev/null; then
        echo -e "${YELLOW}⚠${NC}  Some secrets appear to be too short (< 20 chars)"
        echo "   Generate strong tokens: openssl rand -base64 32"
    fi
else
    echo -e "${RED}✗${NC} .env.local file not found"
    echo "   Copy .env.example to .env.local and fill in the values"
    ISSUES=$((ISSUES+1))
fi

# 3. Check npm audit
echo ""
echo "3. Running npm audit..."
if command -v npm &> /dev/null; then
    AUDIT_RESULT=$(npm audit --json 2>/dev/null || echo '{}')
    HIGH=$(echo "$AUDIT_RESULT" | grep -o '"high":[0-9]*' | grep -o '[0-9]*' || echo "0")
    CRITICAL=$(echo "$AUDIT_RESULT" | grep -o '"critical":[0-9]*' | grep -o '[0-9]*' || echo "0")
    
    if [ "$CRITICAL" -gt 0 ]; then
        echo -e "${RED}✗${NC} Found $CRITICAL critical vulnerabilities"
        echo "   Run: npm audit fix --force"
        ISSUES=$((ISSUES+1))
    elif [ "$HIGH" -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC}  Found $HIGH high severity vulnerabilities"
        echo "   Run: npm audit fix"
    else
        echo -e "${GREEN}✓${NC} No critical vulnerabilities found"
    fi
else
    echo -e "${YELLOW}⚠${NC}  npm not found, skipping audit"
fi

# 4. Check for exposed API keys in code
echo ""
echo "4. Scanning for hardcoded secrets..."
if grep -r "sk-[a-zA-Z0-9]\{20,\}" src/ --exclude-dir=node_modules 2>/dev/null; then
    echo -e "${RED}✗${NC} Found potential hardcoded API keys in source code!"
    ISSUES=$((ISSUES+1))
else
    echo -e "${GREEN}✓${NC} No hardcoded API keys found in source code"
fi

# 5. Check middleware exists
echo ""
echo "5. Checking security middleware..."
if [ -f "src/middleware.ts" ]; then
    echo -e "${GREEN}✓${NC} Security middleware exists"
else
    echo -e "${RED}✗${NC} Security middleware not found"
    ISSUES=$((ISSUES+1))
fi

# 6. Check for HTTPS in production
echo ""
echo "6. Checking environment configuration..."
if [ "$NODE_ENV" = "production" ]; then
    if [ -z "$ALLOWED_ORIGIN" ] || [ "$ALLOWED_ORIGIN" = "*" ]; then
        echo -e "${YELLOW}⚠${NC}  ALLOWED_ORIGIN is not restricted in production"
        echo "   Set to your production domain for better security"
    else
        echo -e "${GREEN}✓${NC} ALLOWED_ORIGIN is configured"
    fi
else
    echo -e "${YELLOW}ℹ${NC}  Running in development mode"
fi

# 7. Check file permissions
echo ""
echo "7. Checking sensitive file permissions..."
if [ -f ".env.local" ]; then
    PERMS=$(ls -la .env.local | awk '{print $1}')
    if [[ $PERMS == *"rw-------"* ]] || [[ $PERMS == *"rw-r-----"* ]]; then
        echo -e "${GREEN}✓${NC} .env.local has appropriate permissions"
    else
        echo -e "${YELLOW}⚠${NC}  .env.local permissions may be too open"
        echo "   Run: chmod 600 .env.local"
    fi
fi

# 8. Check for git hooks
echo ""
echo "8. Checking for pre-commit hooks..."
if [ -f ".git/hooks/pre-commit" ]; then
    echo -e "${GREEN}✓${NC} Pre-commit hook exists"
else
    echo -e "${YELLOW}ℹ${NC}  No pre-commit hook found"
    echo "   Consider adding hooks to prevent committing secrets"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ Security audit passed!${NC}"
    echo "  All checks completed successfully."
else
    echo -e "${RED}✗ Security audit found $ISSUES issue(s)${NC}"
    echo "  Please address the issues above before deploying."
    exit 1
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Additional recommendations:"
echo "  • Enable 2FA on all service accounts (GitHub, Vercel, etc.)"
echo "  • Rotate API keys every 90 days"
echo "  • Set up monitoring and alerts for security events"
echo "  • Review security logs regularly"
echo "  • Keep dependencies updated"
echo ""
