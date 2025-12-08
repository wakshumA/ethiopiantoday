import { TwitterApi } from 'twitter-api-v2';

// Initialize Twitter client
export function getTwitterClient() {
  const appKey = process.env.TWITTER_API_KEY;
  const appSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    throw new Error('Twitter API credentials are not configured');
  }

  return new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });
}

// Post a tweet
export async function postTweet(text: string) {
  try {
    const client = getTwitterClient();
    const tweet = await client.v2.tweet(text);
    return { success: true, data: tweet };
  } catch (error) {
    console.error('Error posting tweet:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
