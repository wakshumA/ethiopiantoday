import { NextResponse } from 'next/server';

export async function GET() {
  const credentials = {
    hasApiKey: !!process.env.TWITTER_API_KEY,
    hasApiSecret: !!process.env.TWITTER_API_SECRET,
    hasAccessToken: !!process.env.TWITTER_ACCESS_TOKEN,
    hasAccessSecret: !!process.env.TWITTER_ACCESS_SECRET,
    apiKeyLength: process.env.TWITTER_API_KEY?.length || 0,
    apiSecretLength: process.env.TWITTER_API_SECRET?.length || 0,
    accessTokenLength: process.env.TWITTER_ACCESS_TOKEN?.length || 0,
    accessSecretLength: process.env.TWITTER_ACCESS_SECRET?.length || 0,
  };

  return NextResponse.json({
    success: true,
    credentials,
    allConfigured: credentials.hasApiKey && 
                   credentials.hasApiSecret && 
                   credentials.hasAccessToken && 
                   credentials.hasAccessSecret
  });
}
