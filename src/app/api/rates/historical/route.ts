import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ETHIO_HISTORICAL_API = 'https://ethioblackmarket.com/api/historical-prices';

export async function GET() {
  try {
    // Fetch last 200 data points (covers ~24+ hours with 5-10 min intervals)
    const now = Math.floor(Date.now() / 1000);
    const url = `${ETHIO_HISTORICAL_API}?before=${now}&count=200`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    // The API returns {historicalPrices: [...]}
    const historicalData = data.historicalPrices || [];
    
    // Get the last 24 hours
    const nowMs = Date.now();
    const last24Hours = historicalData.filter((item: any) => {
      const timestamp = item.time * 1000; // Convert to milliseconds
      return nowMs - timestamp <= 24 * 60 * 60 * 1000;
    });

    // Format data for the chart and sample to hourly intervals
    const chartData = last24Hours
      .map((item: any) => ({
        timestamp: item.time * 1000,
        USD: item.value?.USD || 0,
        EUR: item.value?.EUR || 0,
        GBP: item.value?.GBP || 0,
      }))
      .filter((item: any, index: number, arr: any[]) => {
        // Sample every ~12 data points to get roughly hourly data
        return index % 12 === 0 || index === arr.length - 1;
      })
      .reverse(); // Oldest to newest

    console.log(`[Historical API] Fetched ${chartData.length} data points for last 24h`);

    return NextResponse.json({
      success: true,
      data: chartData,
      count: chartData.length,
    });

  } catch (error: any) {
    console.error('[Historical Rates API Error]:', error.message);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch historical rates',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
