# Official Exchange Rates Update Guide

## Single Source of Truth

All official exchange rates across the application come from **one file**:

📍 **`public/official-rates.json`**

## What Uses This File?

1. **Hero Section** - "Ethiopian Birr Exchange Rates (Official)" 
   - Shows USD, EUR, GBP selling prices

2. **CBE Cash Rates** - Exchange Widget
   - Shows buying/selling prices for all currencies

3. **Currency Converter**
   - Uses selling price as the default exchange rate

## How to Update Rates

### Step 1: Get Official Rates
Visit: https://combanketh.et/exchange-rates

### Step 2: Update the JSON File
Edit `public/official-rates.json` with the new rates:

```json
{
  "USD": {
    "buying": 151.6086,
    "selling": 154.6408
  },
  "EUR": {
    "buying": 176.5027,
    "selling": 180.0328
  },
  "GBP": {
    "buying": 198.3835,
    "selling": 202.3512
  },
  "AED": {
    "buying": 41.2821,
    "selling": 41.1078
  },
  "SAR": {
    "buying": 40.402,
    "selling": 41.2101
  },
  "KWD": {
    "buying": 484.6014,
    "selling": 494.2935
  }
}
```

### Step 3: Verify Update
After updating the file, all three components will automatically show the new rates:
- No code changes needed
- No multiple file updates needed
- Just update `official-rates.json` and you're done!

## Technical Details

**API Endpoint:** `/api/rates/official`

**Data Flow:**
1. API reads from `public/official-rates.json`
2. Caches data for 30 minutes
3. All components fetch from this same API endpoint
4. Components display:
   - Hero Section: `selling` price
   - CBE Cash Rates: both `buying` and `selling`
   - Currency Converter: `selling` price (default)

**Fallback Behavior:**
If scraping ethioxchange.com fails, the API falls back to reading from `official-rates.json`.

## Current Values (as of Dec 9, 2025)

| Currency | Buying   | Selling  |
|----------|----------|----------|
| USD      | 151.6086 | 154.6408 |
| EUR      | 176.5027 | 180.0328 |
| GBP      | 198.3835 | 202.3512 |
| AED      | 41.2821  | 41.1078  |
| SAR      | 40.402   | 41.2101  |
| KWD      | 484.6014 | 494.2935 |

---

**Remember:** Update ONLY `public/official-rates.json` - all components will sync automatically!
