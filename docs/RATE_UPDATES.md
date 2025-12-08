# Exchange Rate Update Guide

## Quick Start

### ⚡ Automated Update (Recommended)

Fetch the latest parallel rates directly from ethioblackmarket.com:

```bash
npm run rates:fetch
```

This automatically:
- ✅ Fetches real-time parallel market rates from ethioblackmarket.com API
- ✅ Updates `public/parallel-rates.json` with the latest values
- ✅ Shows comparison with official rates (spread %)
- ✅ Logs all changes with timestamps

### 🔧 Manual Update (Fallback)

If the automated fetch fails or you need custom rates:

```bash
npm run rates:update
```

## Automated Daily Updates

### Schedule with Cron (Linux/macOS)

Edit your crontab:
```bash
crontab -e
```

Add this line to update at 8 AM daily:
```cron
0 8 * * * cd /path/to/ethiopiantoday && npm run rates:fetch >> logs/rate-updates.log 2>&1
```

### Schedule with Task Scheduler (Windows)

1. Open Task Scheduler
2. Create Basic Task → "Update Exchange Rates"
3. Trigger: Daily at 8:00 AM
4. Action: Start a program
   - Program: `npm`
   - Arguments: `run rates:fetch`
   - Start in: `C:\path\to\ethiopiantoday`

## Data Sources

### Parallel Market Rates

**Source**: ethioblackmarket.com API  
**Endpoint**: `https://ethioblackmarket.com/api/latest-prices`  
**Features**:
- Real-time updates (every few minutes)
- All 7 currencies (USD, EUR, GBP, AED, SAR, KWD, CAD)
- Daily price range and volatility data
- Price change percentage

See `docs/ETHIOBLACKMARKET_API.md` for complete API documentation.

### Official Bank Rates

**Source**: Awash Bank or Commercial Bank of Ethiopia  
**URL**: https://awashbank.com/exchange-historical/  
**File**: `public/official-rates.json` (manual update)

## Typical Rate Spreads (Dec 2024)

| Currency | Official | Parallel | Difference | Spread % |
|----------|----------|----------|------------|----------|
| USD      | 150.93   | 180.31   | +29.38     | +19.5%   |
| EUR      | 159.2    | 209.35   | +50.15     | +31.5%   |
| GBP      | 191.5    | 238.28   | +46.78     | +24.4%   |
| AED      | 41.09    | 49.1     | +8.01      | +19.5%   |

## Troubleshooting

### API Fails

```bash
# Fallback to manual update
npm run rates:update
```

### Rates Not Showing in UI

```bash
# Verify file updated
cat public/parallel-rates.json

# Restart server to clear cache
pkill node && npm run dev
```

### Check Cron Logs

**macOS:**
```bash
log show --predicate 'process == "cron"' --last 1h
```

**Linux:**
```bash
grep CRON /var/log/syslog
```

## Best Practices

✅ Schedule automated fetch at 8 AM daily  
✅ Keep manual script as fallback  
✅ Monitor logs for unusual spikes  
✅ Document manual changes in git commits  
✅ Backup rates before major updates
