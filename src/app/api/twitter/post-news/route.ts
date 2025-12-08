import { NextResponse } from 'next/server';
import { postEconomicNews } from '@/lib/twitter';

export async function POST(request: Request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.TWITTER_BOT_SECRET;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, summary, url } = body;

    if (!title || !summary) {
      return NextResponse.json(
        { success: false, error: 'Title and summary are required' },
        { status: 400 }
      );
    }

    // Post to Twitter
    const result = await postEconomicNews(title, summary, url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Twitter post news API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
