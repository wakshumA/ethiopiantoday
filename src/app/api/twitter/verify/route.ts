import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

export async function GET() {
  try {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    // Try to get the authenticated user's info
    const me = await client.v2.me();
    
    return NextResponse.json({
      success: true,
      message: 'Twitter API connection successful!',
      user: {
        id: me.data.id,
        name: me.data.name,
        username: me.data.username,
      }
    });
  } catch (error: any) {
    console.error('Twitter API test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      errorCode: error.code,
      errorDetails: error.data || error.errors || 'No additional details',
      hint: 'Check if your app has Read and Write permissions enabled'
    }, { status: 500 });
  }
}
