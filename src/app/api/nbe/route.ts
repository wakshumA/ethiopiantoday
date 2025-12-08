import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

interface NBERate {
  currency: string;
  code: string;
  buying: number;
  selling: number;
  date?: string;
}

interface NBENews {
  title: string;
  date: string;
  url: string;
  excerpt?: string;
}

async function fetchNBERates(): Promise<{ rates: NBERate[]; date: string } | null> {
  try {
    const response = await fetch('https://nbe.gov.et/exchange/indicatives-rates/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('NBE rates fetch failed:', response.status);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const rates: NBERate[] = [];
    let dateStr = '';

    // Try to find the date
    $('input[type="text"], .date, .exchange-date').each((_, elem) => {
      const val = $(elem).val() || $(elem).text();
      const valStr = Array.isArray(val) ? val.join('') : String(val);
      if (valStr && valStr.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
        dateStr = valStr;
      }
    });

    // Try to parse the table
    $('table tbody tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        const currency = $(cells[0]).text().trim();
        const buying = parseFloat($(cells[1]).text().replace(/[^0-9.]/g, ''));
        const selling = parseFloat($(cells[2]).text().replace(/[^0-9.]/g, ''));

        if (currency && !isNaN(buying) && !isNaN(selling)) {
          // Map currency names to codes
          const codeMap: Record<string, string> = {
            'US DOLLAR': 'USD',
            'EURO': 'EUR',
            'POUND STERLING': 'GBP',
            'JAPANESE YEN': 'JPY',
            'CANADIAN DOLLAR': 'CAD',
            'AUSTRALIAN DOLLAR': 'AUD',
            'SWISS FRANC': 'CHF',
            'CHINESE YUAN': 'CNY',
            'SAUDI RIYAL': 'SAR',
            'UAE DIRHAM': 'AED',
            'KUWAITI DINAR': 'KWD',
          };

          const code = codeMap[currency.toUpperCase()] || currency.substring(0, 3).toUpperCase();

          rates.push({
            currency,
            code,
            buying,
            selling,
            date: dateStr,
          });
        }
      }
    });

    return rates.length > 0 ? { rates, date: dateStr } : null;
  } catch (error) {
    console.error('Error fetching NBE rates:', error);
    return null;
  }
}

async function fetchNBENews(): Promise<NBENews[]> {
  try {
    const response = await fetch('https://nbe.gov.et/news/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('NBE news fetch failed:', response.status);
      return [];
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const news: NBENews[] = [];

    // Try to find news items
    $('article, .news-item, .post, .entry').slice(0, 10).each((_, elem) => {
      const $elem = $(elem);
      const title = $elem.find('h1, h2, h3, .title, .entry-title').first().text().trim();
      const dateText = $elem.find('.date, .published, time, .entry-date').first().text().trim();
      const link = $elem.find('a').first().attr('href') || '';
      const excerpt = $elem.find('.excerpt, .entry-summary, p').first().text().trim();

      if (title && link) {
        const url = link.startsWith('http') ? link : `https://nbe.gov.et${link}`;
        news.push({
          title,
          date: dateText || new Date().toISOString(),
          url,
          excerpt: excerpt.substring(0, 200),
        });
      }
    });

    return news;
  } catch (error) {
    console.error('Error fetching NBE news:', error);
    return [];
  }
}

export async function GET() {
  try {
    const [ratesData, news] = await Promise.all([
      fetchNBERates(),
      fetchNBENews(),
    ]);

    return NextResponse.json({
      success: true,
      source: 'National Bank of Ethiopia',
      lastUpdated: new Date().toISOString(),
      rates: ratesData,
      news: news.slice(0, 5), // Return top 5 news items
    });
  } catch (error) {
    console.error('Error in NBE API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch NBE data',
      },
      { status: 500 }
    );
  }
}
