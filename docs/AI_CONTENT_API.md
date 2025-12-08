# AI Content Generation API

This API endpoint generates AI-written articles for Ethiopian Today.

## Setup

1. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

## Usage

### Generate an Article

**Endpoint:** `POST /api/ai/generate-article`

**Request Body:**
```json
{
  "topic": "Ethiopia's Growing Tech Industry",
  "category": "technology",
  "keywords": ["startups", "innovation", "Addis Ababa"],
  "length": "medium"
}
```

**Parameters:**
- `topic` (required): The subject of the article
- `category` (optional): One of: news, technology, economy, politics, sports, entertainment
- `keywords` (optional): Array of keywords to include
- `length` (optional): short (400-600 words), medium (700-1000 words), long (1200-1800 words)

**Response:**
```json
{
  "success": true,
  "article": {
    "title": "Article Title",
    "excerpt": "Brief summary...",
    "content": "Full article in markdown...",
    "tags": ["tag1", "tag2"],
    "imagePrompt": "Description for image",
    "category": "technology",
    "author": "AI Assistant",
    "createdAt": "2025-12-01T..."
  }
}
```

## Example Usage

```bash
curl -X POST http://localhost:3000/api/ai/generate-article \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Ethiopian Coffee Export Growth",
    "category": "economy",
    "length": "medium"
  }'
```

## Categories

- **news**: General news and current events
- **technology**: Tech innovations and developments
- **economy**: Economic trends, business, finance
- **politics**: Political developments and policies
- **sports**: Sports news and events
- **entertainment**: Arts, culture, entertainment
