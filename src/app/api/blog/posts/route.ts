import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const filePath = path.join(process.cwd(), 'public', 'blog-posts.json');

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        posts: [],
        total: 0,
        hasMore: false,
      });
    }

    // Read blog posts
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let posts: BlogPost[] = JSON.parse(fileContent);

    // Filter by category if specified
    if (category && category !== 'All') {
      posts = posts.filter(post => post.category === category);
    }

    const total = posts.length;
    const paginatedPosts = posts.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      posts: paginatedPosts,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
