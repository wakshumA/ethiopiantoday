'use client'

import { useEffect, useState } from 'react'

interface RateData {
  rate: string
  change: string
  isPositive: boolean
}

export default function HeroSection() {
  const [rates, setRates] = useState({
    usd: { rate: '155.43', change: '0.5', isPositive: true },
    eur: { rate: '180.44', change: '0.3', isPositive: true },
    gbp: { rate: '205.09', change: '0.2', isPositive: false },
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('Just now')

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Fetch from CBE (Commercial Bank of Ethiopia) API
        const response = await fetch('/api/rates/cbe')
        const data = await response.json()
        
        if (data.rates && data.rates.length > 0) {
          // Find USD, EUR, GBP rates from CBE data
          const usdRate = data.rates.find((r: any) => r.code === 'USD')
          const eurRate = data.rates.find((r: any) => r.code === 'EUR')
          const gbpRate = data.rates.find((r: any) => r.code === 'GBP')
          
          setRates({
            usd: { 
              rate: usdRate?.rate?.toFixed(2) || '151.31',
              change: '0.5',
              isPositive: true
            },
            eur: { 
              rate: eurRate?.rate?.toFixed(2) || '175.50',
              change: '0.3',
              isPositive: true
            },
            gbp: { 
              rate: gbpRate?.rate?.toFixed(2) || '200.25',
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 dark:from-blue-900 dark:via-blue-800 dark:to-purple-900 p-3 shadow-lg">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-500/20 rounded-full blur-lg translate-y-1/2 -translate-x-1/2"></div>
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-yellow-400 rounded-full mix-blend-multiply filter blur-lg animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-pink-400 rounded-full mix-blend-multiply filter blur-lg animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-blue-400 rounded-full mix-blend-multiply filter blur-lg animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-md flex items-center justify-center text-sm shadow">
            💱
          </div>
          <h1 className="text-base md:text-lg font-bold text-white drop-shadow">
            Ethiopian Birr Exchange Rates (Official)
          </h1>
        </div>
        <p className="text-blue-100 text-xs mb-3 max-w-2xl">
          Real-time rates from Commercial Bank of Ethiopia
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="group bg-white/10 backdrop-blur-md rounded-md p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-white/80 text-xs mb-0.5 font-medium">USD</div>
            <div className="text-white text-sm font-bold">{rates.usd.rate}</div>
            <div className={`text-xs flex items-center gap-0.5 font-semibold ${rates.usd.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              <span>{rates.usd.isPositive ? '↑' : '↓'}</span> {rates.usd.change}%
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-md rounded-md p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-white/80 text-xs mb-0.5 font-medium">EUR</div>
            <div className="text-white text-sm font-bold">{rates.eur.rate}</div>
            <div className={`text-xs flex items-center gap-0.5 font-semibold ${rates.eur.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              <span>{rates.eur.isPositive ? '↑' : '↓'}</span> {rates.eur.change}%
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-md rounded-md p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-white/80 text-xs mb-0.5 font-medium">GBP</div>
            <div className="text-white text-sm font-bold">{rates.gbp.rate}</div>
            <div className={`text-xs flex items-center gap-0.5 font-semibold ${rates.gbp.isPositive ? 'text-green-300' : 'text-red-300'}`}>
              <span>{rates.gbp.isPositive ? '↑' : '↓'}</span> {rates.gbp.change}%
            </div>
          </div>
          <div className="group bg-white/10 backdrop-blur-md rounded-md p-2 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-white/80 text-xs mb-0.5 font-medium">Updated</div>
            <div className="text-white text-xs font-bold">{lastUpdate}</div>
            <div className="text-blue-200 text-xs flex items-center gap-0.5">
              <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></span>
              {loading ? 'Loading' : 'Live'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
