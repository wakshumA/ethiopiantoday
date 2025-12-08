import { NextResponse } from 'next/server';
import { postExchangeRateUpdate } from '@/lib/twitter';
import { fetchOfficialRates, Rate } from '@/lib/rates';
import { validateBearerToken } from '@/lib/security';
import { securityLogger } from '@/lib/security-logger';

// This endpoint can be called by a cron job (e.g., Vercel Cron, GitHub Actions)
export async function GET(request: Request) {
  try {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (!validateBearerToken(authHeader, cronSecret)) {
      securityLogger.log({
        type: 'auth_failure',
        ip: clientIp,
        path: '/api/cron/twitter-update',
        details: 'Invalid cron secret'
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

    // Find main currency rates
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

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Exchange rates posted to Twitter successfully',
      data: result.data 
    });
  } catch (error) {
    console.error('Error in Twitter cron job:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
