"use client"
import useSWR from 'swr'
import clsx from 'clsx'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const json = await res.json()
  const updatedAt = res.headers.get('date') || undefined
  return { ...json, _updatedAt: updatedAt }
}

export default function ExchangeWidget() {
  // Refresh every 5 minutes (300 seconds) instead of 1 minute to reduce API calls and improve performance
  const { data: official, isLoading: loadingOfficial, mutate: refreshOfficial } = useSWR('/api/rates/official', fetcher, { refreshInterval: 300_000 })
  const { data: parallel, isLoading: loadingParallel, mutate: refreshParallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 300_000 })
  const { data: nbe, isLoading: loadingNBE, mutate: refreshNBE } = useSWR('/api/rates/nbe', fetcher, { refreshInterval: 300_000 })

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)
  const metaOfficial = (official as any)?._updatedAt
  const metaParallel = (parallel as any)?._updatedAt

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] ring-1 ring-amber-200/30 dark:ring-slate-700/50 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/50 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-700/50 transition-all duration-500 hover:-translate-y-1">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700 transition-all duration-300">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold tracking-tight flex items-center gap-2">
          <span>Exchange Rates (ETB)</span>
        </h3>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Official */}
          <div className="transition-all duration-300 hover:scale-105">
            <h4 className="mb-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="inline-flex w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span>CBE Cash Rates</span>
            </h4>
            {loadingOfficial ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200/70 dark:bg-gray-700/50 rounded" />
                ))}
              </div>
            ) : (
              <div>
                {/* Column Headers */}
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400"></div>
                  <div className="text-xs font-medium text-green-700 dark:text-green-400 text-center">Buy</div>
                  <div className="text-xs font-medium text-red-700 dark:text-red-400 text-center">Sell</div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {official?.rates?.map((r: any) => (
                    <li key={r.code} className="py-2 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 rounded px-1 sm:px-2">
                      {!r.buying && !r.selling ? (
                        <div className="flex items-center justify-between">
                          <span className={clsx('text-xs sm:text-sm text-slate-900 dark:text-slate-100', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <span className="text-xs sm:text-sm tabular-nums text-slate-700 dark:text-slate-300 animate-counter-up">{fmt(r.rate)}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className={clsx('text-xs sm:text-sm text-slate-900 dark:text-slate-100', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <div className="px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-center transition-all duration-200 hover:shadow-md hover:scale-110 cursor-pointer transform border border-green-200 dark:border-green-800">
                            <span className="text-xs font-medium tabular-nums text-green-700 dark:text-green-400 block animate-counter-up">
                              {r.buying ? fmt(r.buying) : '—'}
                            </span>
                          </div>
                          <div className="px-2 py-1 rounded bg-red-50 dark:bg-red-900/20 text-center transition-all duration-200 hover:shadow-md hover:scale-110 cursor-pointer transform border border-red-200 dark:border-red-800">
                            <span className="text-xs font-medium tabular-nums text-red-700 dark:text-red-400 block animate-counter-up">
                              {r.selling ? fmt(r.selling) : '—'}
                            </span>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* NBE Rates */}
          <div className="transition-all duration-300 hover:scale-105">
            <h4 className="mb-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="inline-flex w-2 h-2 bg-cyan-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
              <span>NBE Transfer Rates</span>
            </h4>
            {loadingNBE ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200/70 dark:bg-gray-700/50 rounded" />
                ))}
              </div>
            ) : (
              <div>
                {/* Column Headers */}
                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400"></div>
                  <div className="text-xs font-medium text-green-700 dark:text-green-400 text-center">Buy</div>
                  <div className="text-xs font-medium text-red-700 dark:text-red-400 text-center">Sell</div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {nbe?.rates?.map((r: any) => (
                    <li key={r.code} className="py-2 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 rounded px-1 sm:px-2">
                      {!r.buying && !r.selling ? (
                        <div className="flex items-center justify-between">
                          <span className={clsx('text-xs sm:text-sm text-slate-900 dark:text-slate-100', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <span className="text-xs sm:text-sm tabular-nums text-slate-700 dark:text-slate-300 animate-counter-up">{fmt(r.rate)}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className={clsx('text-xs sm:text-sm text-slate-900 dark:text-slate-100', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <div className="px-2 py-1 rounded bg-green-50 dark:bg-green-900/20 text-center transition-all duration-200 hover:shadow-md hover:scale-110 cursor-pointer transform border border-green-200 dark:border-green-800">
                            <span className="text-xs font-medium tabular-nums text-green-700 dark:text-green-400 block animate-counter-up">
                              {r.buying ? fmt(r.buying) : '—'}
                            </span>
                          </div>
                          <div className="px-2 py-1 rounded bg-red-50 dark:bg-red-900/20 text-center transition-all duration-200 hover:shadow-md hover:scale-110 cursor-pointer transform border border-red-200 dark:border-red-800">
                            <span className="text-xs font-medium tabular-nums text-red-700 dark:text-red-400 block animate-counter-up">
                              {r.selling ? fmt(r.selling) : '—'}
                            </span>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Parallel */}
          <div className="transition-all duration-300 hover:scale-105">
            <h4 className="mb-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="inline-flex w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
              <span>Parallel Market</span>
            </h4>
            {loadingParallel ? (
              <div className="space-y-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-200/70 dark:bg-gray-700/50 rounded" />
                ))}
              </div>
            ) : (
              <div>
                {/* Column Header */}
                <div className="grid grid-cols-2 gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400"></div>
                  <div className="text-xs font-medium text-green-700 dark:text-green-400 text-center">Buy</div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {parallel?.rates?.map((r: any) => (
                    <li key={r.code} className="grid grid-cols-2 gap-2 items-center py-2 transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 rounded px-1 sm:px-2">
                      <span className={clsx('text-xs sm:text-sm text-slate-900 dark:text-slate-100', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                      <span className="text-xs sm:text-sm tabular-nums text-slate-700 dark:text-slate-300 text-center transition-all duration-200 hover:scale-110 inline-block animate-counter-up">{fmt(r.rate)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
