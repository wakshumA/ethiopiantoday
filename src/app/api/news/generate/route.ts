import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY 
  ? new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  : null

type NewsArticle = {
  id: string
  title: string
  content: string
  summary: string
  category: 'exchange-rate' | 'economy'
  publishedAt: string
}

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!groq || !process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please set GROQ_API_KEY environment variable.',
          article: null
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { rates, topic, category = 'exchange-rate' } = body

    if (!rates || !topic) {
      return NextResponse.json({ error: 'Missing rates or topic' }, { status: 400 })
    }

    let prompt = ''
    let systemContent = ''

    if (category === 'exchange-rate') {
      systemContent = 'You are an expert Ethiopian economic journalist who writes clear, factual news articles about exchange rates and currency markets.'
      prompt = `You are a professional Ethiopian economic journalist. Write a brief, factual news article about the Ethiopian Birr exchange rates.

Current Exchange Rates:
${JSON.stringify(rates, null, 2)}

Topic: ${topic}

Write a concise news article (2-3 paragraphs) covering:
1. Current exchange rate situation
2. Key trends or changes
3. Economic implications for Ethiopia

Keep it professional, factual, and under 200 words. Format as JSON with:
{
  "title": "engaging headline",
  "summary": "one-sentence summary",
  "content": "full article text with paragraphs separated by \\n\\n"
}`
    } else {
      systemContent = 'You are an expert Ethiopian economic journalist who writes about economic development, business trends, and investment opportunities in Ethiopia.'
      prompt = `You are a professional Ethiopian economic journalist. Write a brief, factual news article about the Ethiopian economy.

Topic: ${topic}

Write a concise news article (2-3 paragraphs) covering recent economic developments, such as:
1. Economic growth and GDP trends
2. Key sectors (agriculture, manufacturing, services, technology)
3. Investment opportunities and challenges
4. Government economic policies
5. Trade and export performance

Focus on positive developments, opportunities, and realistic challenges. Keep it professional, factual, and under 200 words. Format as JSON with:
{
  "title": "engaging headline about Ethiopian economy",
  "summary": "one-sentence summary",
  "content": "full article text with paragraphs separated by \\n\\n"
}`
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemContent,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 800,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    const article: NewsArticle = {
      id: `auto-${Date.now()}`,
      title: parsed.title,
      content: parsed.content,
      summary: parsed.summary,
      category: category as 'exchange-rate' | 'economy',
      publishedAt: new Date().toISOString(),
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('[News Generation] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate article' },
      { status: 500 }
    )
  }
}
