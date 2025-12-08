#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('═══════════════════════════════════════');
  console.log('   Ethiopian Exchange Rate Updater');
  console.log('═══════════════════════════════════════\n');
  
  const publicDir = path.join(process.cwd(), 'public');
  const officialPath = path.join(publicDir, 'official-rates.json');
  const parallelPath = path.join(publicDir, 'parallel-rates.json');
  
  // Read current rates
  const officialData = JSON.parse(await fs.readFile(officialPath, 'utf8'));
  const parallelData = JSON.parse(await fs.readFile(parallelPath, 'utf8'));
  
  console.log('Current Rates:');
  console.log('─────────────────────────────────────');
  console.log(`Official USD:  ${officialData.USD} ETB`);
  console.log(`Parallel USD:  ${parallelData.USD} ETB`);
  console.log(`Difference:    +${(parallelData.USD - officialData.USD).toFixed(2)} ETB\n`);
  
  console.log('📍 Please check: https://ethioblackmarket.com/\n');
  
  const newParallelUSD = await question('Enter new parallel USD rate (or press Enter to skip): ');
  
  if (!newParallelUSD || isNaN(parseFloat(newParallelUSD))) {
    console.log('\n❌ Update cancelled.');
    rl.close();
    return;
  }
  
  const rate = parseFloat(newParallelUSD);
  const officialUSD = officialData.USD;
  const ratio = rate / officialUSD;
  
  console.log('\n─────────────────────────────────────');
  console.log('Calculated Parallel Rates:');
  console.log('─────────────────────────────────────');
  
  const newParallelRates = {};
  for (const [currency, officialRate] of Object.entries(officialData)) {
    newParallelRates[currency] = parseFloat((officialRate * ratio).toFixed(2));
    console.log(`${currency}: ${newParallelRates[currency]} ETB (${((ratio - 1) * 100).toFixed(1)}% premium)`);
  }
  
  const confirm = await question('\n✓ Update these rates? (y/n): ');
  
  if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
    await fs.writeFile(
      parallelPath,
      JSON.stringify(newParallelRates, null, 2) + '\n',
      'utf8'
    );
    
    console.log('\n✅ Parallel rates updated successfully!');
    console.log(`📁 File: ${parallelPath}`);
    console.log('\n💡 Refresh your browser to see the changes.');
  } else {
    console.log('\n❌ Update cancelled.');
  }
  
  rl.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
