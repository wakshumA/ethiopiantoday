#!/bin/bash

# Rotating Category Blog Generator
# Generates blog posts in different categories on rotation

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

PORT=3000
TOKEN="${BLOG_GENERATION_SECRET:-my_secure_blog_token_12345}"

# Categories to rotate through
CATEGORIES=("Exchange Rates" "Finance Tips")

echo -e "${BLUE}🔄 Rotating Category Blog Generator${NC}\n"

# Check server
if ! lsof -ti:$PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ Server not running${NC}"
    exit 1
fi

# Get current day of year to determine category
DAY_OF_YEAR=$(date +%j)
CATEGORY_INDEX=$((DAY_OF_YEAR % ${#CATEGORIES[@]}))
CATEGORY="${CATEGORIES[$CATEGORY_INDEX]}"

echo -e "${YELLOW}📅 Today's category: ${CATEGORY}${NC}\n"

response=$(curl -s -X POST "http://localhost:$PORT/api/blog/generate" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"category\":\"$CATEGORY\"}")

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✅ Blog post generated in ${CATEGORY} category!${NC}\n"
    title=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['post']['title'])" 2>/dev/null || echo "")
    echo -e "${BLUE}Title:${NC} $title"
    echo -e "\n${GREEN}View at: http://localhost:$PORT/blog${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
    echo "$response" | python3 -m json.tool
    exit 1
fi
