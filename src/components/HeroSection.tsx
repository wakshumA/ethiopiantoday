'use client'

import { useEffect, useState } from 'react'
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber'

interface RateData {
  rate: string
  change: string
  isPositive: boolean
}

export default function HeroSection() {
  const [rates, setRates] = useState({
    usd: { rate: '151.61', change: '0.5', isPositive: true },
    eur: { rate: '176.50', change: '0.3', isPositive: true },
    gbp: { rate: '198.38', change: '0.2', isPositive: false },
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('Just now')

  const usdValue = useAnimatedNumber({ value: parseFloat(rates.usd.rate), duration: 800, decimals: 2 })
  const eurValue = useAnimatedNumber({ value: parseFloat(rates.eur.rate), duration: 800, decimals: 2 })
  const gbpValue = useAnimatedNumber({ value: parseFloat(rates.gbp.rate), duration: 800, decimals: 2 })

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Fetch from official rates (same source as Currency Converter and CBE Cash Rates)
        const response = await fetch('/api/rates/official')
        const data = await response.json()
        
        if (data.rates && data.rates.length > 0) {
          // Find USD, EUR, GBP rates - use buying price for hero section
          const usdRate = data.rates.find((r: any) => r.code === 'USD')
          const eurRate = data.rates.find((r: any) => r.code === 'EUR')
          const gbpRate = data.rates.find((r: any) => r.code === 'GBP')
          
          setRates({
            usd: { 
              rate: usdRate?.buying?.toFixed(2) || '151.61',
              change: '0.5',
              isPositive: true
            },
            eur: { 
              rate: eurRate?.buying?.toFixed(2) || '176.50',
              change: '0.3',
              isPositive: true
            },
            gbp: { 
              rate: gbpRate?.buying?.toFixed(2) || '198.38',
              change: '0.2',
              isPositive: false
            },
          })
          
          // Update last update time from API
          if (data.lastUpdated) {
            const updateTime = new Date(data.lastUpdated)
            const now = new Date()
            const diffMinutes = Math.floor((now.getTime() - updateTime.getTime()) / 60000)
            
            if (diffMinutes < 1) {
              setLastUpdate('Just now')
            } else if (diffMinutes < 60) {
              setLastUpdate(`${diffMinutes}m ago`)
            } else {
              setLastUpdate(`${Math.floor(diffMinutes / 60)}h ago`)
            }
          } else {
            setLastUpdate('Just now')
          }
        }
      } catch (error) {
        console.error('Error fetching CBE rates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRates()
    // Refresh every 30 minutes
    const interval = setInterval(fetchRates, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-900 dark:via-blue-800 dark:to-purple-900 p-2 sm:p-2.5 shadow-lg">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-purple-500/20 rounded-full blur-lg translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-yellow-400 rounded-full mix-blend-multiply filter blur-lg animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-pink-400 rounded-full mix-blend-multiply filter blur-lg animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-6 h-6 bg-blue-400 rounded-full mix-blend-multiply filter blur-lg animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-1 mb-1.5">
          <h1 className="text-xs sm:text-sm md:text-base font-bold text-white drop-shadow truncate">
            Ethiopian Birr Exchange Rates (Official)
          </h1>
        </div>
        <p className="text-blue-100 text-xs mb-2 max-w-2xl line-clamp-1">
          Real-time rates from Commercial Bank of Ethiopia
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          <div className="group bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping-slow opacity-75"></div>
            <div className="text-white/80 text-xs mb-0.5 font-medium">USD</div>
            <div className={`text-white text-xs sm:text-sm font-bold value-transition ${usdValue.isAnimating ? 'animate-number-update' : ''}`}>
              {usdValue.displayValue.toFixed(2)}
            </div>
            <div className={`text-xs flex items-center gap-0.5 font-semibold ${rates.usd.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              <span>{rates.usd.isPositive ? '↑' : '↓'}</span> {rates.usd.change}%
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping-slow opacity-75" style={{ animationDelay: '0.4s' }}></div>
            <div className="text-white/80 text-xs mb-0.5 font-medium">EUR</div>
            <div className={`text-white text-xs sm:text-sm font-bold value-transition ${eurValue.isAnimating ? 'animate-number-update' : ''}`}>
              {eurValue.displayValue.toFixed(2)}
            </div>
            <div className={`text-xs flex items-center gap-0.5 font-semibold ${rates.eur.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              <span>{rates.eur.isPositive ? '↑' : '↓'}</span> {rates.eur.change}%
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer relative">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-ping-slow opacity-75" style={{ animationDelay: '0.8s' }}></div>
            <div className="text-white/80 text-xs mb-0.5 font-medium">GBP</div>
            <div className={`text-white text-xs sm:text-sm font-bold value-transition ${gbpValue.isAnimating ? 'animate-number-update' : ''}`}>
              {gbpValue.displayValue.toFixed(2)}
            </div>
            <div className={`text-xs flex items-center gap-0.5 font-semibold ${rates.gbp.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              <span>{rates.gbp.isPositive ? '↑' : '↓'}</span> {rates.gbp.change}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
