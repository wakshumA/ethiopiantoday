import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import { validateBearerToken, validateRequestBody, BlogPostInputSchema } from '@/lib/security';
import { securityLogger } from '@/lib/security-logger';

// Initialize Groq only when needed (not at module load)
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

// Helper to get base URL
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // Fallback for development
  return 'http://localhost:3000';
}

// Fetch data from various sources
async function fetchNBEData() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/rates/nbe`);
    const data = await response.json();
    console.log('[fetchNBEData] Success');
    return data;
  } catch (error) {
    console.error('[fetchNBEData] Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function fetchParallelMarketData() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/rates/parallel`);
    const data = await response.json();
    console.log('[fetchParallelMarketData] Success');
    return data;
  } catch (error) {
    console.error('[fetchParallelMarketData] Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function fetchTopNews() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/news/top`);
    const data = await response.json();
    console.log('[fetchTopNews] Success');
    return data;
  } catch (error) {
    console.error('[fetchTopNews] Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

async function fetchHistoricalData() {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/rates/historical`);
    const data = await response.json();
    console.log('[fetchHistoricalData] Success');
    return data;
  } catch (error) {
    console.error('[fetchHistoricalData] Error:', error instanceof Error ? error.message : error);
    return null;
  }
}

// Generate blog post using AI
async function generateBlogPost(context: any, preferredCategory?: string): Promise<BlogPost | null> {
  try {
    const categoryGuidance = preferredCategory 
      ? `You MUST use the category "${preferredCategory}" and tailor the content specifically for this category.`
      : `Choose ONE of these categories based on the content: "Exchange Rates", "Finance Tips"`;

    const contentGuidance = preferredCategory === 'Finance Tips'
      ? `Write practical financial advice and tips for Ethiopians dealing with currency exchange, remittances, and foreign transactions. Focus on:
- Money-saving strategies for currency exchange
- How to get the best exchange rates
- Avoiding common mistakes in remittances
- Planning for currency fluctuations
- Budgeting tips for international transactions
- Tax implications and legal considerations`
      : `Write a blog post that:
1. Analyzes current exchange rate trends
2. Compares official vs parallel market rates
3. Provides practical insights for remittance senders and businesses
4. References recent economic news when relevant
5. Is 800-1200 words, professional yet accessible
6. Includes actionable recommendations`;

    const prompt = `You are an expert financial journalist specializing in Ethiopian economics and currency markets.

Based on the following data, write a comprehensive, engaging blog post:

NBE Exchange Rates:
${JSON.stringify(context.nbeData, null, 2)}

Parallel Market Rates:
${JSON.stringify(context.parallelData, null, 2)}

Recent News Headlines:
${context.topNews?.items?.slice(0, 5).map((item: any) => `- ${item.title}`).join('\n')}

Historical Trends:
${JSON.stringify(context.historicalData?.data?.slice(0, 10), null, 2)}

${contentGuidance}

${categoryGuidance}

Format your response as JSON:
{
  "title": "Engaging title here",
  "excerpt": "2-sentence summary (max 160 chars)",
  "content": "Full markdown-formatted blog post content",
  "category": "${preferredCategory || 'One of the categories above'}",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content || '';
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    // Clean up control characters and invalid JSON escapes
    jsonText = jsonText
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
      .replace(/\n/g, '\\n') // Escape newlines properly
      .replace(/\r/g, '\\r') // Escape carriage returns
      .replace(/\t/g, '\\t'); // Escape tabs

    const aiResponse = JSON.parse(jsonText);

    // Create blog post object
    const blogPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: aiResponse.title,
      excerpt: aiResponse.excerpt,
      content: aiResponse.content,
      category: aiResponse.category,
      author: 'Ethiopian Today',
      date: new Date().toISOString(),
      readTime: `${Math.ceil(aiResponse.content.split(' ').length / 200)} min read`,
      tags: aiResponse.tags || [],
      featured: false,
    };

    return blogPost;
  } catch (error) {
    console.error('Error generating blog post:', error);
    return null;
  }
}

// Save blog post to JSON file
function saveBlogPost(blogPost: BlogPost) {
  const filePath = path.join(process.cwd(), 'public', 'blog-posts.json');
  
  let posts: BlogPost[] = [];
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    posts = JSON.parse(fileContent);
  }

  // Add new post at the beginning
  posts.unshift(blogPost);

  // Keep only last 100 posts
  posts = posts.slice(0, 100);

  fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.BLOG_GENERATION_SECRET;
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    
    if (!validateBearerToken(authHeader, expectedToken)) {
      securityLogger.log({
        type: 'auth_failure',
        ip: clientIp,
        path: '/api/blog/generate',
        details: 'Invalid or missing bearer token'
      });
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate and sanitize request body
    const rawBody = await request.json().catch(() => ({}));
    const validation = validateRequestBody(BlogPostInputSchema, rawBody);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error },
        { status: 400 }
      );
    }
    
    const preferredCategory = validation.data.category;

    // Fetch all data sources
    console.log('[Blog Generate] Fetching data sources...');
    const [nbeData, parallelData, topNews, historicalData] = await Promise.all([
      fetchNBEData(),
      fetchParallelMarketData(),
      fetchTopNews(),
      fetchHistoricalData(),
    ]);

    console.log('[Blog Generate] Data fetched. NBE:', nbeData?.rates?.length, 'Parallel:', parallelData?.rates?.length, 'News:', topNews?.items?.length);

    const context = {
      nbeData,
      parallelData,
      topNews,
      historicalData,
    };

    // Generate blog post
    console.log('[Blog Generate] Generating blog post...');
    const blogPost = await generateBlogPost(context, preferredCategory);

    if (!blogPost) {
      console.error('[Blog Generate] Failed to generate blog post - blogPost is null');
      return NextResponse.json(
        { error: 'Failed to generate blog post' },
        { status: 500 }
      );
    }

    console.log('[Blog Generate] Blog post generated. Saving to file...');
    // Save to file
    saveBlogPost(blogPost);

    console.log('[Blog Generate] Blog post saved successfully:', blogPost.id);
    return NextResponse.json({
      success: true,
      message: 'Blog post generated successfully',
      post: blogPost,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[Blog Generate] Error in blog generation:', errorMsg);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMsg : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to generate a new blog post',
    usage: 'POST /api/blog/generate with Authorization header',
  });
}
