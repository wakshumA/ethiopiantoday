# How EthioBlackMarket.com Works

## Data Architecture

### Backend: Firebase (Google)
- **Project ID**: `blackprice-33d4d`
- **Domain**: `blackprice-33d4d.firebaseapp.com`
- **API Key**: `AIzaSyBIEW3zZzSWffP2nEuartHq5DuSvgXHc9U`

### Chart Library
- **TradingView Lightweight Charts** v4.2.3
- Used for displaying live price action

### API Endpoints

The site exposes several REST APIs:

1. **Latest Prices** (Main Exchange Rates)
   ```
   GET https://ethioblackmarket.com/api/latest-prices
   ```
   Returns current parallel market rates for all currencies

2. **Historical Prices**
   ```
   GET https://ethioblackmarket.com/api/historical-prices?before={timestamp}&count=500
   ```
   Returns historical rate data for charts

3. **Latest Bank Rates** (Official Rates)
   ```
   GET https://ethioblackmarket.com/api/latest-bank-rates
   ```
   Returns official bank exchange rates

4. **Currencies List**
   ```
   GET https://ethioblackmarket.com/api/currencies
   ```
   Returns list of supported currencies

5. **Market Actions**
   ```
   GET {ACTIONS_URL}
   ```
   Recent market activity/trades

6. **Supply & Demand**
   ```
   GET {SUPPLY_DEMAND_URL}
   ```
   Market supply/demand indicators

## How to Fetch Data

### Option 1: Use Their Public API (Recommended)

```javascript
// Fetch latest parallel rates
const response = await fetch('https://ethioblackmarket.com/api/latest-prices');
const prices = await response.json();

// Example response structure (estimated):
// {
//   "USD": { "rate": 179, "timestamp": "2025-12-01T..." },
//   "EUR": { "rate": 188.5, "timestamp": "2025-12-01T..." },
//   ...
// }
```

### Option 2: Direct Firebase Access (Advanced)

You could theoretically access their Firebase Firestore database directly if the security rules allow public read access, but this is not recommended and may be blocked.

## Integration Suggestions

### For Your Ethiopian Today Website:

1. **Create a scheduled task** to fetch from their API:
   ```bash
   # Add to crontab for daily 8 AM updates
   0 8 * * * node /path/to/fetch-ethioblackmarket.js
   ```

2. **Use the `/api/latest-prices` endpoint** - It's public and designed for consumption

3. **Cache the results** - Don't hit their API too frequently (respect rate limits)

4. **Fallback mechanism** - Keep manual update option in case API is down

## Sample Fetcher Script

```javascript
async function fetchBlackMarketRates() {
  try {
    const response = await fetch('https://ethioblackmarket.com/api/latest-prices');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse and extract rates
    const rates = {
      USD: data.USD?.rate || data.USD,
      EUR: data.EUR?.rate || data.EUR,
      GBP: data.GBP?.rate || data.GBP,
      AED: data.AED?.rate || data.AED,
      SAR: data.SAR?.rate || data.SAR,
      KWD: data.KWD?.rate || data.KWD,
      CAD: data.CAD?.rate || data.CAD
    };
    
    return rates;
  } catch (error) {
    console.error('Failed to fetch from ethioblackmarket.com:', error);
    return null;
  }
}
```

## Important Notes

1. **Rate Limits**: Be respectful - don't spam their API
2. **Caching**: Update once per day is sufficient
3. **Error Handling**: Always have a fallback (manual update)
4. **Terms of Service**: Check if they have any API usage restrictions
5. **Attribution**: Consider adding a note crediting ethioblackmarket.com for parallel rates

## Next Steps

1. Test the `/api/latest-prices` endpoint
2. Create automated fetcher script
3. Schedule daily updates
4. Add error notifications if fetch fails
5. Keep manual update option as backup
