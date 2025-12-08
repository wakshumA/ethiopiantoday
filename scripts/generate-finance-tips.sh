#!/bin/bash

# Finance Tips Blog Generator
# Generates blog posts specifically for the Finance Tips category

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
PORT=3000
TOKEN="${BLOG_GENERATION_SECRET:-my_secure_blog_token_12345}"

echo -e "${YELLOW}💰 Finance Tips Blog Generator${NC}\n"

# Check if server is running
if ! lsof -ti:$PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ Server not running on port $PORT${NC}"
    echo -e "Please start the server first: ${BLUE}npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}\n"

echo -e "${BLUE}Generating Finance Tips blog post...${NC}"
echo -e "${YELLOW}This will create practical financial advice for Ethiopians dealing with currency exchange${NC}\n"

response=$(curl -s -X POST "http://localhost:$PORT/api/blog/generate" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"category":"Finance Tips"}')

if echo "$response" | grep -q "success"; then
    echo -e "${GREEN}✅ Finance Tips blog post generated successfully!${NC}\n"
    
    # Extract and display key info
    title=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['post']['title'])" 2>/dev/null || echo "")
    category=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['post']['category'])" 2>/dev/null || echo "")
    excerpt=$(echo "$response" | python3 -c "import sys, json; print(json.load(sys.stdin)['post']['excerpt'])" 2>/dev/null || echo "")
    
    echo -e "${BLUE}Title:${NC} $title"
    echo -e "${BLUE}Category:${NC} $category"
    echo -e "${BLUE}Excerpt:${NC} $excerpt"
    
    echo -e "\n${GREEN}View all posts at: http://localhost:$PORT/blog${NC}"
    echo -e "${GREEN}View Finance Tips: http://localhost:$PORT/blog?category=Finance+Tips${NC}"
else
    echo -e "${RED}❌ Generation failed${NC}"
    echo "$response" | python3 -m json.tool
    exit 1
fi

echo -e "\n${GREEN}Done!${NC}"
