"use client"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ExchangeBadge() {
  const { data: official } = useSWR('/api/rates/official', fetcher, { refreshInterval: 120_000 })
  const { data: parallel } = useSWR('/api/rates/parallel', fetcher, { refreshInterval: 120_000 })

  const usdOff = official?.rates?.find((r: any) => r.code === 'USD')?.rate
  const usdPar = parallel?.rates?.find((r: any) => r.code === 'USD')?.rate
  if (!usdOff && !usdPar) return null
  const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)

  return (
    <div className="whitespace-nowrap rounded-full px-2 py-1 text-[11px] bg-white/80 dark:bg-black/40 ring-1 ring-gray-200 dark:ring-gray-700 shadow-sm">
      <span className="font-medium">ETB</span>
      {typeof usdOff === 'number' && (
        <span className="ml-2">Off: {fmt(usdOff)}</span>
      )}
      {typeof usdPar === 'number' && (
        <span className="ml-2">Par: {fmt(usdPar)}</span>
      )}
    </div>
  )
}
