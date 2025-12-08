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
  const { data: official, isLoading: loadingOfficial, mutate: refreshOfficial } = useSWR('/api/rates/official', fetcher, { refreshInterval: 60_000 })
  const { data: parallel, isLoading: loadingParallel, mutate: refreshParallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 60_000 })
  const { data: nbe, isLoading: loadingNBE, mutate: refreshNBE } = useSWR('/api/rates/nbe', fetcher, { refreshInterval: 60_000 })

  const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)
  const metaOfficial = (official as any)?._updatedAt
  const metaParallel = (parallel as any)?._updatedAt

  return (
    <div className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:bg-slate-800 transition-all duration-500 hover:-translate-y-0.5">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700 transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-semibold tracking-tight flex items-center gap-2">
          <span aria-hidden>💱</span>
          <span>Exchange Rates (ETB)</span>
        </h3>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Official */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-[#0A3D62] dark:text-[#5B9BD5]">
              CBE Cash Rates
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
                  <div className="text-xs font-medium text-[#1BAA64] dark:text-[#28C76F] text-center">Buy</div>
                  <div className="text-xs font-medium text-[#D9534F] dark:text-[#FF6B6B] text-center">Sell</div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {official?.rates?.map((r: any) => (
                    <li key={r.code} className="py-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      {!r.buying && !r.selling ? (
                        <div className="flex items-center justify-between">
                          <span className={clsx('text-sm', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <span className="text-sm tabular-nums text-[#0A3D62] dark:text-[#5B9BD5]">{fmt(r.rate)}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className={clsx('text-sm', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <div className="px-2 py-1 rounded bg-[#E8F5F0] dark:bg-[#1BAA64]/10 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                            <span className="text-xs font-medium tabular-nums text-[#1BAA64] dark:text-[#28C76F]">
                              {r.buying ? fmt(r.buying) : '—'}
                            </span>
                          </div>
                          <div className="px-2 py-1 rounded bg-[#FDECEA] dark:bg-[#D9534F]/10 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                            <span className="text-xs font-medium tabular-nums text-[#D9534F] dark:text-[#FF6B6B]">
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
          <div>
            <h4 className="mb-2 text-sm font-medium text-[#0A3D62] dark:text-[#5B9BD5]">
              NBE Transfer Rates
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
                  <div className="text-xs font-medium text-[#1BAA64] dark:text-[#28C76F] text-center">Buy</div>
                  <div className="text-xs font-medium text-[#D9534F] dark:text-[#FF6B6B] text-center">Sell</div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {nbe?.rates?.map((r: any) => (
                    <li key={r.code} className="py-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      {!r.buying && !r.selling ? (
                        <div className="flex items-center justify-between">
                          <span className={clsx('text-sm', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <span className="text-sm tabular-nums text-[#0A3D62] dark:text-[#5B9BD5]">{fmt(r.rate)}</span>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 items-center">
                          <span className={clsx('text-sm', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                          <div className="px-2 py-1 rounded bg-[#E8F5F0] dark:bg-[#1BAA64]/10 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                            <span className="text-xs font-medium tabular-nums text-[#1BAA64] dark:text-[#28C76F]">
                              {r.buying ? fmt(r.buying) : '—'}
                            </span>
                          </div>
                          <div className="px-2 py-1 rounded bg-[#FDECEA] dark:bg-[#D9534F]/10 text-center transition-all duration-200 hover:shadow-md hover:scale-105">
                            <span className="text-xs font-medium tabular-nums text-[#D9534F] dark:text-[#FF6B6B]">
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
          <div>
            <h4 className="mb-2 text-sm font-medium text-[#0A3D62] dark:text-[#5B9BD5]">Parallel Market</h4>
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
                  <div className="text-xs font-medium text-[#1BAA64] dark:text-[#28C76F] text-center">Buy</div>
                </div>
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {parallel?.rates?.map((r: any) => (
                    <li key={r.code} className="grid grid-cols-2 gap-2 items-center py-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <span className={clsx('text-sm', r.code === 'USD' && 'font-semibold')}>{r.code}</span>
                      <span className="text-sm tabular-nums text-[#0A3D62] dark:text-[#5B9BD5] text-center transition-all duration-200 hover:scale-105">{fmt(r.rate)}</span>
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
