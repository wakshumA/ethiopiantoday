"use client"
import useSWR from 'swr'
import clsx from 'clsx'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  return json
}

// CBE Remittance Bonus - typically +10 Birr on selling rate
const REMITTANCE_BONUS = 10

export default function RemittanceBonusWidget() {
  const { data: official, isLoading } = useSWR('/api/rates/official', fetcher, { refreshInterval: 60_000 })

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(n)

  const calculateBonusRate = (r: any) => {
    // Use selling rate if available, otherwise use average rate
    const baseRate = r.selling || r.rate
    return baseRate + REMITTANCE_BONUS
  }

  const getDisplayRate = (r: any) => {
    return r.selling || r.rate
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] ring-1 ring-purple-200/30 dark:ring-slate-700/50 bg-gradient-to-br from-white via-purple-50/50 to-pink-50/50 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-700/50 transition-all duration-500 hover:-translate-y-1">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700 transition-all duration-300">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <h3 className="text-base sm:text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2 text-[#FFD700]">
            <span aria-hidden className="text-xl sm:text-2xl">🎁</span>
            <span className="line-clamp-1">CBE Remittance Bonus</span>
          </h3>
          <div className="text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-white/20 text-white dark:bg-gray-900/40 whitespace-nowrap">
            +{REMITTANCE_BONUS} ETB
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        <div className="space-y-3">
          {/* Info Banner */}
          <div className="p-3 sm:p-4 bg-[#FFF9E6] dark:bg-[#F2C94C]/10 rounded-lg border border-[#F2C94C]/30 dark:border-[#F2C94C]/20">
            <p className="text-xs sm:text-sm text-[#B8860B] dark:text-[#F2C94C] leading-relaxed font-semibold">
              <span className="font-extrabold text-[#B8860B] dark:text-[#FFD700]">Special Bonus:</span> Commercial Bank of Ethiopia offers an extra +{REMITTANCE_BONUS} Birr per USD for transfers through EthioDirect, CashGo, FastPay, and other remittance partners.
            </p>
          </div>

          {/* Rates with Bonus */}
          <div>
            <h4 className="mb-2 sm:mb-3 text-sm sm:text-base font-bold text-[#D4AF37] dark:text-[#FFD700] tracking-wide">
              Official Rate + Bonus
            </h4>
            {isLoading ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200/70 dark:bg-gray-700/50 rounded" />
                ))}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                {official?.rates?.map((r: any) => (
                  <li key={r.code} className="flex items-center justify-between py-2 sm:py-3">
                    <div className="flex items-center gap-2">
                      <span className={clsx('text-sm sm:text-base font-semibold', r.code === 'USD' && 'font-bold text-base sm:text-lg')}>{r.code}</span>
                      {r.code === 'USD' && (
                        <span className="text-xs px-2 py-1 rounded bg-[#FFF9E6] dark:bg-[#F2C94C]/20 text-[#D4AF37] dark:text-[#FFD700] font-bold">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-through font-medium">
                          {fmt(getDisplayRate(r))}
                        </div>
                        <div className="text-sm sm:text-base font-extrabold tabular-nums text-[#D4AF37] dark:text-[#FFD700]">
                          {fmt(calculateBonusRate(r))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Partners */}
          <div className="pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Available through:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {['EthioDirect', 'CashGo', 'FastPay', 'Western Union'].map((partner) => (
                <span
                  key={partner}
                  className="text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          {!isLoading && (
            <div className="pt-2 sm:pt-3 space-y-2">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                💡 Bonus calculated as: Official Selling Rate + {REMITTANCE_BONUS} ETB per USD
              </p>
              <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 sm:p-3 rounded-md border border-amber-200 dark:border-amber-800">
                ⚠️ Note: Most parallel market transfer fees range between 5-6%
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
