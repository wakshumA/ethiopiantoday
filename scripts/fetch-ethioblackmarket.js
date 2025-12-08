#!/usr/bin/env node

/**
 * Automated Parallel Exchange Rate Fetcher from ethioblackmarket.com
 * 
 * This script fetches the latest parallel market exchange rates from
 * ethioblackmarket.com's public API and updates the local rate files.
 * 
 * Usage:
 *   node scripts/fetch-ethioblackmarket.js
 * 
 * Schedule daily:
 *   0 8 * * * cd /path/to/project && node scripts/fetch-ethioblackmarket.js >> logs/rate-updates.log 2>&1
 */

const fs = require('fs/promises');
const path = require('path');

// API endpoint
const API_URL = 'https://ethioblackmarket.com/api/latest-prices';

// Currencies we support
const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'KWD', 'CAD'];

// File paths
const PROJECT_ROOT = path.join(__dirname, '..');
const PARALLEL_RATES_FILE = path.join(PROJECT_ROOT, 'public', 'parallel-rates.json');
const OFFICIAL_RATES_FILE = path.join(PROJECT_ROOT, 'public', 'official-rates.json');

/**
 * Fetch latest rates from ethioblackmarket.com API
 */
async function fetchLatestRates() {
  try {
    console.log(`[${new Date().toISOString()}] Fetching rates from ${API_URL}...`);
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.allLastprice) {
      throw new Error('Invalid API response: missing allLastprice field');
    }
    
    console.log(`[${new Date().toISOString()}] Successfully fetched rates from API`);
    console.log(`  USD: ${data.allLastprice.USD}`);
    console.log(`  Daily change: ${data.dailyPercentage?.toFixed(2)}%`);
    console.log(`  Range: ${data.range?.min} - ${data.range?.max}`);
    
    return data.allLastprice;
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error fetching rates:`, error.message);
    throw error;
  }
}

/**
 * Read current official rates (for ratio calculation)
 */
async function readOfficialRates() {
  try {
    const content = await fs.readFile(OFFICIAL_RATES_FILE, 'utf-8');
    const rates = JSON.parse(content);
    console.log(`[${new Date().toISOString()}] Read official rates from file`);
    return rates;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error reading official rates:`, error.message);
    throw error;
  }
}

/**
 * Update parallel rates file
 */
async function updateParallelRates(rates) {
  try {
    // Filter to only supported currencies
    const filteredRates = {};
    for (const currency of SUPPORTED_CURRENCIES) {
      if (rates[currency]) {
        // Round to 2 decimal places
        filteredRates[currency] = Math.round(rates[currency] * 100) / 100;
      }
    }
    
    // Format JSON with proper indentation
    const json = JSON.stringify(filteredRates, null, 2);
    
    // Write to file
    await fs.writeFile(PARALLEL_RATES_FILE, json + '\n', 'utf-8');
    
    console.log(`[${new Date().toISOString()}] Updated parallel rates file:`);
    console.log(json);
    
    return filteredRates;
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error updating parallel rates:`, error.message);
    throw error;
  }
}

/**
 * Calculate and display rate differences
 */
async function displayRateDifferences(parallelRates) {
  try {
    const officialRates = await readOfficialRates();
    
    console.log('\n' + '='.repeat(60));
    console.log('RATE COMPARISON (Parallel vs Official)');
    console.log('='.repeat(60));
    
    for (const currency of SUPPORTED_CURRENCIES) {
      const parallel = parallelRates[currency];
      const official = officialRates[currency];
      
      if (parallel && official) {
        const diff = parallel - official;
        const pct = ((diff / official) * 100).toFixed(2);
        
        console.log(`${currency}: ${parallel} (parallel) vs ${official} (official) | +${diff.toFixed(2)} (+${pct}%)`);
      }
    }
    
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error calculating differences:`, error.message);
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('ETHIOPIAN PARALLEL RATE UPDATER');
    console.log('Source: ethioblackmarket.com');
    console.log('='.repeat(60) + '\n');
    
    // Fetch latest rates from API
    const allRates = await fetchLatestRates();
    
    // Update parallel rates file
    const updatedRates = await updateParallelRates(allRates);
    
    // Show comparison with official rates
    await displayRateDifferences(updatedRates);
    
    console.log(`[${new Date().toISOString()}] ✅ Update completed successfully\n`);
    
    process.exit(0);
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Update failed:`, error.message);
    console.error('\nFalling back to manual update script...');
    console.error('Run: npm run rates:update\n');
    
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { fetchLatestRates, updateParallelRates };
