"use client"
import { useState, useEffect } from 'react'
import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

export default function ExchangeCalculator() {
  const [amountUSD, setAmountUSD] = useState<string>('100')
  const [amountETB, setAmountETB] = useState<string>('')
  const [marketType, setMarketType] = useState<'official' | 'parallel'>('official')
  const [swapped, setSwapped] = useState(false)
  
  const { data: official } = useSWR('/api/rates/official', fetcher, { refreshInterval: 300_000 })
  const { data: parallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 300_000 })

  const rates = marketType === 'official' ? official?.rates : parallel?.rates
  
  const apiRate = rates?.find((r: any) => r.code === 'USD')?.buying || 
                  rates?.find((r: any) => r.code === 'USD')?.rate || 0
  
  const officialRate = official?.rates?.find((r: any) => r.code === 'USD')?.buying || 
                       official?.rates?.find((r: any) => r.code === 'USD')?.rate || 0
  const parallelRate = parallel?.rates?.find((r: any) => r.code === 'USD')?.rate || 0
  
  useEffect(() => {
    if (amountUSD && apiRate) {
      const usd = parseFloat(amountUSD)
      if (!isNaN(usd)) {
        const etb = usd * apiRate
        setAmountETB(etb.toFixed(2))
      }
    }
  }, [amountUSD, apiRate])
  
  const handleETBChange = (value: string) => {
    setAmountETB(value)
    if (value && apiRate) {
      const etb = parseFloat(value)
      if (!isNaN(etb) && apiRate > 0) {
        const usd = etb / apiRate
        setAmountUSD(usd.toFixed(2))
      }
    }
  }

  const toggleSwap = () => {
    setSwapped(!swapped)
    const tempUSD = amountUSD
    setAmountUSD(amountETB)
    setAmountETB(tempUSD)
  }

  return (
    <div className="rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-cyan-200/30 dark:ring-slate-700/50 bg-gradient-to-br from-white via-cyan-50/60 to-teal-50/60 dark:from-slate-800 dark:via-slate-700/80 dark:to-slate-700/60 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.16)] hover:-translate-y-1">
      {/* Header with Gradient */}
      <div className="px-6 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-600 text-white dark:from-cyan-600 dark:via-blue-600 dark:to-teal-700">
        <h3 className="text-lg font-bold tracking-tight flex items-center gap-3">
          <span className="text-2xl">💱</span>
          Currency Calculator
        </h3>
        <p className="text-cyan-100 text-sm mt-1">Convert USD ↔ ETB instantly</p>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="space-y-5">
          {/* Market Type Selection with Enhanced Styling */}
          <div className="flex gap-2 bg-gray-100/50 dark:bg-gray-900/50 rounded-xl p-1.5">
            {(['official', 'parallel'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMarketType(type)}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 transform ${
                  marketType === type
                    ? type === 'official'
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white dark:from-indigo-600 dark:to-indigo-700 shadow-lg scale-105'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white dark:from-amber-600 dark:to-amber-700 shadow-lg scale-105'
                    : 'bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800'
                }`}
              >
                {type === 'official' ? '🏦 Official Rate' : '📊 Parallel Rate'}
              </button>
            ))}
          </div>

          {/* Rate Display - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/50 dark:via-cyan-950/50 dark:to-teal-950/50 rounded-2xl p-4 border-2 border-cyan-300/40 dark:border-cyan-700/40 shadow-inner">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Current Exchange Rate</div>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 tabular-nums">
                1 USD = {apiRate.toFixed(2)} ETB
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-cyan-200/30 dark:border-cyan-700/30">
                <span>Official: {officialRate.toFixed(2)} ETB</span>
                <span>Parallel: {parallelRate.toFixed(2)} ETB</span>
              </div>
            </div>
          </div>

          {/* Input Section with Better Layout */}
          <div className="space-y-4">
            {/* USD Input */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-lg">🇺🇸</span>
                  US Dollar (USD)
                </label>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded">Buy</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-blue-600 dark:text-blue-400">$</span>
                <input
                  type="number"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900 text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tabular-nums transition-all duration-200 placeholder:text-gray-400 hover:border-blue-300 dark:hover:border-blue-700"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Swap Button - Animated */}
            <div className="flex justify-center -my-2 relative z-10">
              <button
                onClick={toggleSwap}
                className={`p-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 dark:from-cyan-600 dark:to-teal-600 hover:from-cyan-600 hover:to-teal-600 dark:hover:from-cyan-700 dark:hover:to-teal-700 text-white transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95 border-4 border-white dark:border-slate-800 ${swapped ? 'rotate-180' : ''}`}
                aria-label="Swap currencies"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* ETB Input */}
            <div className="group">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-lg">🇪🇹</span>
                  Ethiopian Birr (ETB)
                </label>
                <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">Sell</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-amber-600 dark:text-amber-400">Br</span>
                <input
                  type="number"
                  value={amountETB}
                  onChange={(e) => handleETBChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-white dark:bg-gray-900 text-lg font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none tabular-nums transition-all duration-200 placeholder:text-gray-400 hover:border-amber-300 dark:hover:border-amber-700"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Quick Amount Presets - Enhanced */}
          <div>
            <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2.5 uppercase tracking-wider">⚡ Quick Amounts</div>
            <div className="grid grid-cols-4 gap-2">
              {['50', '100', '500', '1000'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountUSD(preset)}
                  className="px-3 py-2.5 text-sm font-bold rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 hover:from-blue-500 hover:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 hover:text-white transition-all duration-200 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105 active:scale-95"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Info Footer */}
          <div className="text-xs text-gray-600 dark:text-gray-400 text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <p>Rates update every 5 minutes. {marketType === 'parallel' && '📊 Parallel rates may vary by location'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
