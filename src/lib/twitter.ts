import { TwitterApi } from 'twitter-api-v2';

// Initialize Twitter client
export function getTwitterClient() {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    throw new Error('Twitter API credentials are not configured');
  }

  // Initialize with OAuth 1.0a User context
  const client = new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret,
  });

  // Return the v2 client with user context (for posting tweets)
  return client;
}

// Post a tweet
export async function postTweet(text: string) {
  try {
    console.log('[Twitter Bot] Initializing Twitter client...');
    const client = getTwitterClient();
    
    console.log('[Twitter Bot] Posting tweet:', text.substring(0, 50) + '...');
    const tweet = await client.v2.tweet(text);
    
    console.log('[Twitter Bot] Tweet posted successfully! ID:', tweet.data.id);
    return { success: true, data: tweet };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[Twitter Bot] Error posting tweet:', errorMessage);
    console.error('[Twitter Bot] Full error:', error);
    return { success: false, error: errorMessage };
  }
}

// Post exchange rate update
export async function postExchangeRateUpdate(rates: {
  usd: number;
  eur: number;
  gbp: number;
  date: string;
}) {
  const text = `📊 Ethiopian Birr Exchange Rates Update (${rates.date})

💵 USD: ${rates.usd.toFixed(2)} ETB
💶 EUR: ${rates.eur.toFixed(2)} ETB
💷 GBP: ${rates.gbp.toFixed(2)} ETB

Stay updated at EthioExchangeRate.com
#Ethiopia #ExchangeRate #ETB #Finance`;

  return postTweet(text);
}

// Post economic news summary
export async function postEconomicNews(title: string, summary: string, url?: string) {
  let text = `📰 ${title}

${summary}

${url || 'Read more at EthioExchangeRate.com'}

#Ethiopia #Economy #News`;

  // Twitter limit is 280 characters
  if (text.length > 280) {
    const maxSummaryLength = 280 - title.length - 50; // Account for other text
    const truncatedSummary = summary.substring(0, maxSummaryLength) + '...';
    text = `📰 ${title}

${truncatedSummary}

${url || 'Read more at EthioExchangeRate.com'}

#Ethiopia #Economy #News`;
  }

  return postTweet(text);
}
