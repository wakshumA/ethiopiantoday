import { NextResponse } from 'next/server';
import { postExchangeRateUpdate } from '@/lib/twitter';
import { fetchOfficialRates, Rate } from '@/lib/rates';
import { validateBearerToken } from '@/lib/security';
import { securityLogger } from '@/lib/security-logger';

export async function POST(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.TWITTER_BOT_SECRET;
    
    if (!validateBearerToken(authHeader, expectedToken)) {
      securityLogger.log({
        type: 'auth_failure',
        ip: clientIp,
        path: '/api/twitter/post-rates',
        details: 'Invalid bearer token'
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get latest exchange rates
    const rates = await fetchOfficialRates();
    
    if (!rates || rates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch exchange rates' },
        { status: 500 }
      );
    }

    // Find USD, EUR, GBP rates
    const usdRate = rates.find((r: Rate) => r.code === 'USD');
    const eurRate = rates.find((r: Rate) => r.code === 'EUR');
    const gbpRate = rates.find((r: Rate) => r.code === 'GBP');

    if (!usdRate || !eurRate || !gbpRate) {
      return NextResponse.json(
        { success: false, error: 'Required exchange rates not found' },
        { status: 500 }
      );
    }

    // Post to Twitter
    const result = await postExchangeRateUpdate({
      usd: usdRate.rate,
      eur: eurRate.rate,
      gbp: gbpRate.rate,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in Twitter post rates API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
