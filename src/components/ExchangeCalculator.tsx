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
  
  const { data: official } = useSWR('/api/rates/official', fetcher, { refreshInterval: 60_000 })
  const { data: parallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 60_000 })

  const rates = marketType === 'official' ? official?.rates : parallel?.rates
  
  const apiRate = rates?.find((r: any) => r.code === 'USD')?.buying || 
                  rates?.find((r: any) => r.code === 'USD')?.rate || 0
  
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

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:bg-slate-800 transition-all duration-500 hover:-translate-y-0.5">
      {/* Header */}
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white dark:from-blue-600 dark:via-blue-700 dark:to-blue-800">
        <h3 className="text-sm sm:text-base font-bold tracking-tight flex items-center gap-2">
          <span>💱</span>
          Quick Converter
        </h3>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        <div className="space-y-2.5">
          {/* Market Type Selection - Compact */}
          <div className="flex gap-1.5">
            {(['official', 'parallel'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMarketType(type)}
                className={`flex-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  marketType === type
                    ? type === 'official'
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white dark:from-indigo-600 dark:to-indigo-700 shadow-md'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white dark:from-amber-600 dark:to-amber-700 shadow-md'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {type === 'official' ? 'Official' : 'Parallel'}
              </button>
            ))}
          </div>

          {/* Conversion Display - Clean */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-xl p-2.5 border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Current Rate</div>
              <div className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                1 USD = <span className="text-blue-700 dark:text-blue-300">{apiRate.toFixed(4)}</span> ETB
              </div>
            </div>
          </div>

          {/* USD Input - Simplified */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">USD Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-blue-600">$</span>
              <input
                type="number"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-base sm:text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tabular-nums transition-all duration-200 placeholder:text-gray-400"
                placeholder="100"
              />
            </div>
          </div>

          {/* Swap Button - Compact */}
          <div className="flex justify-center -my-0.5">
            <button
              onClick={() => {
                const tempUSD = amountUSD
                setAmountUSD(amountETB)
                setAmountETB(tempUSD)
              }}
              className="p-1 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-500 hover:to-blue-600 hover:text-white dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-300 hover:rotate-180 hover:scale-110 active:scale-95"
              aria-label="Swap"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* ETB Input - Simplified */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">ETB Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-amber-600">Br</span>
              <input
                type="number"
                value={amountETB}
                onChange={(e) => handleETBChange(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-base sm:text-lg font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tabular-nums transition-all duration-200 placeholder:text-gray-400"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Quick Amounts - Compact Grid */}
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Quick Select</div>
            <div className="grid grid-cols-4 gap-1">
              {['50', '100', '500', '1000'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountUSD(preset)}
                  className="px-2 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-500"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
