"use client"
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import clsx from 'clsx'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  return res.json()
}

export default function ExchangeCalculator() {
  const [amount, setAmount] = useState<string>('100')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('ETB')
  const [marketType, setMarketType] = useState<'official' | 'parallel'>('official')
  
  const { data: official } = useSWR('/api/rates/official', fetcher, { refreshInterval: 60_000 })
  const { data: parallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 60_000 })

  const rates = marketType === 'official' ? official?.rates : parallel?.rates

  // Add ETB as a base currency option
  const allCurrencies = [
    { code: 'ETB', rate: 1 },
    ...(rates || [])
  ]

  const calculateConversion = () => {
    if (!amount || !rates) return '0.00'
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return '0.00'

    // Get rates for from and to currencies
    const fromRate = fromCurrency === 'ETB' ? 1 : rates.find((r: any) => r.code === fromCurrency)?.rate || 1
    const toRate = toCurrency === 'ETB' ? 1 : rates.find((r: any) => r.code === toCurrency)?.rate || 1

    let result: number
    if (fromCurrency === 'ETB') {
      // Converting from ETB to foreign currency
      result = numAmount / toRate
    } else if (toCurrency === 'ETB') {
      // Converting from foreign currency to ETB
      result = numAmount * fromRate
    } else {
      // Converting between two foreign currencies
      const etbAmount = numAmount * fromRate
      result = etbAmount / toRate
    }

    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    }).format(result)
  }

  const getExchangeRateText = () => {
    if (!rates) return ''
    
    const fromRate = fromCurrency === 'ETB' ? 1 : rates.find((r: any) => r.code === fromCurrency)?.rate || 1
    const toRate = toCurrency === 'ETB' ? 1 : rates.find((r: any) => r.code === toCurrency)?.rate || 1

    if (fromCurrency === 'ETB') {
      return `1 ${fromCurrency} = ${(1 / toRate).toFixed(4)} ${toCurrency}`
    } else if (toCurrency === 'ETB') {
      return `1 ${fromCurrency} = ${fromRate.toFixed(2)} ${toCurrency}`
    } else {
      const crossRate = fromRate / toRate
      return `1 ${fromCurrency} = ${crossRate.toFixed(4)} ${toCurrency}`
    }
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:bg-slate-800 transition-all duration-500 hover:-translate-y-0.5">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700 transition-all duration-300">
        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <span aria-hidden>🔄</span>
          <span>Currency Converter</span>
        </h3>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Inputs */}
          <div className="space-y-4">
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

            {/* From Section */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-emerald-400"
              >
                {allCurrencies.map((curr: any) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-lg font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none tabular-nums transition-all duration-200 hover:border-emerald-400"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  setFromCurrency(toCurrency)
                  setToCurrency(fromCurrency)
                }}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all duration-300 hover:rotate-180 hover:scale-110 active:scale-95"
                aria-label="Swap currencies"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* To Section */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all duration-200 hover:border-emerald-400"
              >
                {allCurrencies.map((curr: any) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column - Result */}
          <div className="flex flex-col justify-center">
            <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Result</div>
              <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums break-all">
                {calculateConversion()}
              </div>
              <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">
                {toCurrency}
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-800">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {getExchangeRateText()}
                </div>
                <div className="mt-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300">
                    {marketType === 'official' ? 'Official Rate' : 'Parallel Rate'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Amounts */}
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Quick Amounts</div>
              <div className="grid grid-cols-4 gap-2">
                {['100', '500', '1000', '5000'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className="px-2 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
