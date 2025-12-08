# Exchange Rate Sources

## Current Setup

The application currently uses a **local JSON file** (`/public/official-rates.json`) for official exchange rates. This file must be **manually updated** with the latest rates from Commercial Bank of Ethiopia (CBE).

## Rate Sources

### 1. Commercial Bank of Ethiopia (CBE) - Primary Source
**Website:** https://combanketh.et/exchange-rates?srcPage=home

**Current Rates (as of Dec 2, 2025):**
- **USD Cash Buying:** 151.3086 Birr
- **USD Cash Selling:** 154.3348 Birr

**Note:** CBE website is a Next.js application that loads rates dynamically via JavaScript. The rates shown are for **cash transactions**.

### 2. National Bank of Ethiopia (NBE) - Alternative Source
**API Endpoint:** https://api.nbe.gov.et/api/filter-exchange-rates

**Example:**
```bash
curl "https://api.nbe.gov.et/api/filter-exchange-rates?date=2025-12-02"
```

**Current NBE Rates (Dec 2, 2025):**
- **USD Buying:** 154.3112 Birr
- **USD Selling:** 155.8543 Birr

**Note:** NBE rates differ from CBE rates. NBE rates may be for wire transfers or interbank rates, while CBE shows cash rates.

## Rate Differences

There are **two types of rates**:
1. **Cash Rates** (CBE) - Lower rates for physical cash transactions
2. **Transfer/Wire Rates** (NBE) - Higher rates for electronic transfers

**Example for USD:**
- CBE Cash Buying: 151.3086 (lower)
- NBE Transfer Buying: 154.3112 (higher ~2%)
- Difference: ~3 Birr per dollar

## How to Update Rates

### Method 1: Manual Update (Current)
1. Visit https://combanketh.et/exchange-rates?srcPage=home
2. Note the cash buying and selling rates
3. Edit `/public/official-rates.json`:
```json
{
  "USD": {
    "buying": 151.3086,
    "selling": 154.3348
  }
}
```
4. Restart the dev server or wait for auto-reload

### Method 2: Use NBE API (Automated)
To switch to NBE API rates, edit `.env.local`:
```bash
# Comment out the local JSON
# OFFICIAL_RATES_JSON_URL=/official-rates.json

# The system will automatically fall back to NBE website scraping
```

**Pros:**
- Automatic updates
- No manual work

**Cons:**
- Uses NBE rates (not CBE cash rates)
- ~2-3 Birr higher than cash rates

## Future Enhancement

Consider creating an automated scraper for CBE website or finding their API endpoint. Current challenges:
- CBE website loads data via JavaScript (requires headless browser)
- No public API documented
- Next.js dynamic rendering makes simple scraping difficult

## Configuration

Current config in `.env.local`:
```bash
OFFICIAL_RATES_JSON_URL=/official-rates.json
PARALLEL_RATES_JSON_URL=/parallel-rates.json
```

This tells the system to read from local JSON files instead of scraping or using external APIs.
