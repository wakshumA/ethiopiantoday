"use client"
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import clsx from 'clsx'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

export default function ExchangeCalculator() {
  const [amountUSD, setAmountUSD] = useState<string>('100')
  const [amountETB, setAmountETB] = useState<string>('')
  const [customRate, setCustomRate] = useState<string>('')
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false)
  const [marketType, setMarketType] = useState<'official' | 'parallel'>('official')
  
  const { data: official } = useSWR('/api/rates/official', fetcher, { refreshInterval: 60_000 })
  const { data: parallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 60_000 })

  const rates = marketType === 'official' ? official?.rates : parallel?.rates
  
  // Get current USD rate from API - use buying price for consistency with hero section
  const apiRate = rates?.find((r: any) => r.code === 'USD')?.buying || 
                  rates?.find((r: any) => r.code === 'USD')?.rate || 0
  
  // Use custom rate if enabled, otherwise use API rate
  const currentRate = useCustomRate && customRate ? parseFloat(customRate) : apiRate
  
  // Update ETB amount when USD amount or rate changes
  useEffect(() => {
    if (amountUSD && currentRate) {
      const usd = parseFloat(amountUSD)
      if (!isNaN(usd)) {
        const etb = usd * currentRate
        setAmountETB(etb.toFixed(2))
      }
    }
  }, [amountUSD, currentRate])
  
  // Update USD amount when ETB amount changes
  const handleETBChange = (value: string) => {
    setAmountETB(value)
    if (value && currentRate) {
      const etb = parseFloat(value)
      if (!isNaN(etb) && currentRate > 0) {
        const usd = etb / currentRate
        setAmountUSD(usd.toFixed(2))
      }
    }
  }
  
  // Set custom rate from API rate
  useEffect(() => {
    if (apiRate && !customRate) {
      setCustomRate(apiRate.toFixed(4))
    }
  }, [apiRate, customRate])

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:bg-slate-800 transition-all duration-500 hover:-translate-y-0.5">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700 transition-all duration-300">
        <h3 className="text-base font-semibold tracking-tight">
          Currency Converter
        </h3>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Market Type Selection */}
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Market Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setMarketType('official')}
                className={clsx(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  marketType === 'official'
                    ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                )}
              >
                Official
              </button>
              <button
                onClick={() => setMarketType('parallel')}
                className={clsx(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200',
                  marketType === 'parallel'
                    ? 'bg-amber-600 text-white dark:bg-amber-500 shadow-md scale-105'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105'
                )}
              >
                Parallel
              </button>
            </div>
          </div>

          {/* Exchange Rate Input */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Exchange Rate (1 USD = ? ETB)</label>
              <button
                onClick={() => {
                  setUseCustomRate(!useCustomRate)
                  if (useCustomRate) {
                    setCustomRate(apiRate.toFixed(4))
                  }
                }}
                className="text-xs px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
              >
                {useCustomRate ? 'Use API Rate' : 'Custom Rate'}
              </button>
            </div>
            <input
              type="number"
              value={customRate}
              onChange={(e) => {
                setCustomRate(e.target.value)
                setUseCustomRate(true)
              }}
              step="0.0001"
              className="w-full px-3 py-2 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-white dark:bg-gray-900 text-lg font-bold text-emerald-700 dark:text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none tabular-nums transition-all duration-200"
              placeholder="Enter exchange rate"
            />
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {useCustomRate ? 'Using custom rate' : `Current ${marketType} rate: ${apiRate.toFixed(4)}`}
            </div>
          </div>

          {/* USD Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">US Dollar (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-500">$</span>
              <input
                type="number"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tabular-nums transition-all duration-200"
                placeholder="Enter USD amount"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-1">
            <button
              onClick={() => {
                const tempUSD = amountUSD
                setAmountUSD(amountETB)
                setAmountETB(tempUSD)
              }}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 hover:rotate-180 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Swap amounts"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* ETB Input */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Ethiopian Birr (ETB)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-gray-500">Br</span>
              <input
                type="number"
                value={amountETB}
                onChange={(e) => handleETBChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none tabular-nums transition-all duration-200"
                placeholder="Enter ETB amount"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Quick Amounts (USD)</div>
            <div className="grid grid-cols-4 gap-1.5">
              {['100', '500', '1000', '5000'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountUSD(preset)}
                  className="px-2 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Info */}
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-700 dark:text-blue-300 text-center">
              <span className="font-semibold">1 USD</span> = <span className="font-semibold">{currentRate.toFixed(4)} ETB</span>
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-[10px]">
                {useCustomRate ? 'Custom' : marketType === 'official' ? 'Official' : 'Parallel'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
