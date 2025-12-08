#!/bin/bash

# Blog Generation Helper Script
# This script helps you generate blog posts easily

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
PORT=3000
TOKEN="${BLOG_GENERATION_SECRET:-my_secure_blog_token_12345}"

echo -e "${BLUE}🚀 Ethiopian Today - Blog Generator${NC}\n"

# Check if server is running
if ! lsof -ti:$PORT > /dev/null 2>&1; then
    echo -e "${RED}❌ Server not running on port $PORT${NC}"
    echo -e "Please start the server first: ${BLUE}npm run dev${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}\n"

# Menu
echo "Choose an option:"
echo "1) Generate new blog post"
echo "2) View all blog posts"
echo "3) Generate and view"
echo "4) Test auto-generate endpoint"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo -e "\n${BLUE}Generating blog post...${NC}"
        response=$(curl -s -X POST "http://localhost:$PORT/api/blog/generate" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
        
        if echo "$response" | grep -q "success"; then
            echo -e "${GREEN}✅ Blog post generated successfully!${NC}"
            echo "$response" | python3 -m json.tool
        else
            echo -e "${RED}❌ Generation failed${NC}"
            echo "$response" | python3 -m json.tool
        fi
        ;;
    
    2)
        echo -e "\n${BLUE}Fetching blog posts...${NC}"
        curl -s "http://localhost:$PORT/api/blog/posts" | python3 -m json.tool
        ;;
    
    3)
        echo -e "\n${BLUE}Generating blog post...${NC}"
        response=$(curl -s -X POST "http://localhost:$PORT/api/blog/generate" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
        
        if echo "$response" | grep -q "success"; then
            echo -e "${GREEN}✅ Blog post generated!${NC}\n"
            echo -e "${BLUE}All posts:${NC}"
            curl -s "http://localhost:$PORT/api/blog/posts" | python3 -m json.tool
            echo -e "\n${GREEN}View at: http://localhost:$PORT/blog${NC}"
        else
            echo -e "${RED}❌ Generation failed${NC}"
            echo "$response" | python3 -m json.tool
        fi
        ;;
    
    4)
        echo -e "\n${BLUE}Testing auto-generate endpoint...${NC}"
        response=$(curl -s -X POST "http://localhost:$PORT/api/blog/auto-generate" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json")
        
        if echo "$response" | grep -q "success"; then
            echo -e "${GREEN}✅ Auto-generate successful!${NC}"
            echo "$response" | python3 -m json.tool
        else
            echo -e "${RED}❌ Auto-generate failed${NC}"
            echo "$response" | python3 -m json.tool
        fi
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}"
