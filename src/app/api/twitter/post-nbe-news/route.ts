import { NextResponse } from 'next/server';
import { postEconomicNews } from '@/lib/twitter';

export async function POST(request: Request) {
  try {
    // Verify authorization (use either CRON_SECRET or TWITTER_BOT_SECRET)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const botSecret = process.env.TWITTER_BOT_SECRET;
    
    const isAuthorized = 
      (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
      (botSecret && authHeader === `Bearer ${botSecret}`);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch NBE news
    const nbeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/nbe`);
    const nbeData = await nbeResponse.json();

    if (!nbeData.success || !nbeData.news || nbeData.news.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No NBE news available' },
        { status: 404 }
      );
    }

    // Get the latest news item
    const latestNews = nbeData.news[0];
    
    // Create a summary from the title
    let summary = latestNews.excerpt || latestNews.title;
    if (summary.length > 200) {
      summary = summary.substring(0, 197) + '...';
    }

    // Post to Twitter
    const result = await postEconomicNews(
      latestNews.title,
      summary,
      latestNews.url
    );

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'NBE news posted to Twitter successfully' : 'Failed to post to Twitter',
      news: latestNews,
      tweetData: result.data,
      error: result.error,
    });
  } catch (error) {
    console.error('Error in NBE Twitter post API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
