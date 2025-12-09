# Exchange Rates Update API

## Endpoint: POST /api/rates/update

This API allows you to update official, parallel, and NBE exchange rates in a single request. All rate types are optional - you can update one, two, or all three at once.

### Authentication

Requires `RATES_ADMIN_KEY` in the `Authorization` header:

```
Authorization: Bearer <your-rates-admin-key>
```

### Request Format

**URL:** `https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update`

**Method:** `POST`

**Headers:**
```
Authorization: Bearer <your-rates-admin-key>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "official": {
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
    }
  },
  "parallel": {
    "USD": {
      "rate": 180.31
    },
    "EUR": {
      "rate": 209.35
    },
    "GBP": {
      "rate": 238.28
    }
  },
  "nbe": {
    "USD": {
      "buying": 152.00,
      "selling": 155.00
    },
    "EUR": {
      "buying": 177.00,
      "selling": 181.00
    }
  }
}
```

**Rate Types:**
- `official` - Commercial Bank of Ethiopia (CBE) official rates (buying/selling)
- `parallel` - Black market/parallel rates (single rate value)
- `nbe` - National Bank of Ethiopia transfer rates (buying/selling)

You can include any combination:
- Just `official`
- Just `parallel`
- Just `nbe`
- `official` + `parallel`
- `official` + `nbe`
- `parallel` + `nbe`
- All three together

Supported currencies: USD, EUR, GBP, AED, SAR, KWD, CAD

### Example Usage

#### Update All Three Rate Types:

```bash
curl -X POST https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update \
  -H "Authorization: Bearer d9d3dbc2b34b5502583131aa5e8973c93124f11308f9b865ffe41d38b657074d" \
  -H "Content-Type: application/json" \
  -d '{
    "official": {
      "USD": {"buying": 151.60, "selling": 154.64},
      "EUR": {"buying": 176.50, "selling": 180.03},
      "GBP": {"buying": 198.38, "selling": 202.35}
    },
    "parallel": {
      "USD": {"rate": 180.31},
      "EUR": {"rate": 209.35},
      "GBP": {"rate": 238.28}
    },
    "nbe": {
      "USD": {"buying": 152.00, "selling": 155.00},
      "EUR": {"buying": 177.00, "selling": 181.00}
    }
  }'
```

#### Update Only Official Rates:

```bash
curl -X POST https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update \
  -H "Authorization: Bearer d9d3dbc2b34b5502583131aa5e8973c93124f11308f9b865ffe41d38b657074d" \
  -H "Content-Type: application/json" \
  -d '{
    "official": {
      "USD": {"buying": 151.60, "selling": 154.64},
      "EUR": {"buying": 176.50, "selling": 180.03}
    }
  }'
```

#### Update Only Parallel Rates:

```bash
curl -X POST https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update \
  -H "Authorization: Bearer d9d3dbc2b34b5502583131aa5e8973c93124f11308f9b865ffe41d38b657074d" \
  -H "Content-Type: application/json" \
  -d '{
    "parallel": {
      "USD": {"rate": 180.31},
      "EUR": {"rate": 209.35}
    }
  }'
```

#### Using Python:

```python
import requests

url = "https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update"
headers = {
    "Authorization": "Bearer d9d3dbc2b34b5502583131aa5e8973c93124f11308f9b865ffe41d38b657074d",
    "Content-Type": "application/json"
}

data = {
    "official": {
        "USD": {"buying": 151.60, "selling": 154.64},
        "EUR": {"buying": 176.50, "selling": 180.03},
        "GBP": {"buying": 198.38, "selling": 202.35}
    },
    "parallel": {
        "USD": {"rate": 180.31},
        "EUR": {"rate": 209.35},
        "GBP": {"rate": 238.28}
    },
    "nbe": {
        "USD": {"buying": 152.00, "selling": 155.00},
        "EUR": {"buying": 177.00, "selling": 181.00}
    }
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

#### Using Node.js:

```javascript
const fetch = require('node-fetch');

const url = 'https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update';
const apiKey = 'd9d3dbc2b34b5502583131aa5e8973c93124f11308f9b865ffe41d38b657074d';

const data = {
  official: {
    USD: { buying: 151.60, selling: 154.64 },
    EUR: { buying: 176.50, selling: 180.03 },
    GBP: { buying: 198.38, selling: 202.35 }
  },
  parallel: {
    USD: { rate: 180.31 },
    EUR: { rate: 209.35 },
    GBP: { rate: 238.28 }
  },
  nbe: {
    USD: { buying: 152.00, selling: 155.00 },
    EUR: { buying: 177.00, selling: 181.00 }
  }
};

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(json => console.log(json))
.catch(err => console.error(err));
```

### Response Format

**Success (200):**
```json
{
  "success": true,
  "message": "Exchange rates updated successfully",
  "updated": ["official", "parallel", "nbe"],
  "timestamp": "2025-12-09T10:30:00.000Z",
  "rates": {
    "official": {
      "USD": { "buying": 151.60, "selling": 154.64 },
      "EUR": { "buying": 176.50, "selling": 180.03 },
      "GBP": { "buying": 198.38, "selling": 202.35 },
      "AED": { "buying": 41.28, "selling": 41.11 },
      "SAR": { "buying": 40.40, "selling": 41.21 },
      "KWD": { "buying": 484.60, "selling": 494.29 }
    },
    "parallel": {
      "USD": { "rate": 180.31 },
      "EUR": { "rate": 209.35 },
      "GBP": { "rate": 238.28 },
      "AED": { "rate": 49.10 },
      "SAR": { "rate": 48.04 },
      "KWD": { "rate": 587.33 },
      "CAD": { "rate": 128.79 }
    },
    "nbe": {
      "USD": { "buying": 152.00, "selling": 155.00 },
      "EUR": { "buying": 177.00, "selling": 181.00 }
    }
  }
}
```

**Error Responses:**

401 Unauthorized:
```json
{
  "success": false,
  "error": "Missing or invalid authorization header"
}
```

403 Forbidden:
```json
{
  "success": false,
  "error": "Invalid API key"
}
```

400 Bad Request:
```json
{
  "success": false,
  "error": "Official USD must have buying and selling as numbers"
}
```

```json
{
  "success": false,
  "error": "Request must include at least one of: official, parallel, nbe"
}
```

### Testing the API

View current rates (no auth required):
```bash
curl https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update
```

### How It Works

1. **POST Request** → Updates one or more rate files:
   - `public/official-rates.json` (CBE official rates)
   - `public/parallel-rates.json` (black market rates)
   - `public/nbe-rates.json` (NBE transfer rates)

2. **Cache Cleared** → API caches expire automatically (30 min TTL)

3. **UI Updates** → All components automatically fetch new rates:
   - Hero Section → uses official buying rates
   - CBE Cash Rates widget → uses official buying/selling
   - Currency Converter → uses official buying + parallel rates
   - NBE Transfer Rates → uses nbe rates

### File Structure

**official-rates.json:**
```json
{
  "USD": { "buying": 151.6086, "selling": 154.6408 },
  "EUR": { "buying": 176.5027, "selling": 180.0328 }
}
```

**parallel-rates.json:**
```json
{
  "USD": { "rate": 180.31 },
  "EUR": { "rate": 209.35 }
}
```

**nbe-rates.json:**
```json
{
  "USD": { "buying": 152.00, "selling": 155.00 },
  "EUR": { "buying": 177.00, "selling": 181.00 }
}
```

### Automation Examples

#### Daily Cron Job (Linux/Mac):

Create a script `update-rates.sh`:
```bash
#!/bin/bash
curl -X POST https://thioexchangerate-d6frf6emebdpb7bw.canadacentral-01.azurewebsites.net/api/rates/update \
  -H "Authorization: Bearer $RATES_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d @rates.json
```

Add to crontab (daily at 9 AM):
```
0 9 * * * /path/to/update-rates.sh
```

#### GitHub Actions Workflow:

```yaml
name: Update Exchange Rates

on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:

jobs:
  update-rates:
    runs-on: ubuntu-latest
    steps:
      - name: Update All Rates
        run: |
          curl -X POST ${{ secrets.APP_URL }}/api/rates/update \
            -H "Authorization: Bearer ${{ secrets.RATES_ADMIN_KEY }}" \
            -H "Content-Type: application/json" \
            -d '{
              "official": {
                "USD": {"buying": 151.60, "selling": 154.64},
                "EUR": {"buying": 176.50, "selling": 180.03}
              },
              "parallel": {
                "USD": {"rate": 180.31},
                "EUR": {"rate": 209.35}
              },
              "nbe": {
                "USD": {"buying": 152.00, "selling": 155.00}
              }
            }'
```

### Security Notes

- ✅ API key stored in Azure App Service Configuration
- ✅ Never commit `RATES_ADMIN_KEY` to git
- ✅ Use environment variables for automation scripts
- ✅ Rate limiting recommended for production use
- ✅ HTTPS only (enforced by Azure)

### Integration with External Systems

You can integrate this API with:
- **Commercial Bank of Ethiopia** scraper
- **Third-party exchange rate APIs**
- **Manual update dashboard**
- **Automated data pipeline**
- **Mobile app for rate updates**
