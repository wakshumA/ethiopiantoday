'use client'

import { useEffect } from 'react'

/**
 * Google AdSense Component
 * 
 * Usage:
 * <AdSense 
 *   slot="1234567890"
 *   format="auto"
 *   responsive={true}
 * />
 */

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  className?: string
}

export default function AdSense({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  // Don't show ads in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center ${className}`}>
        <p className="text-sm text-gray-500">Ad Placeholder (Production Only)</p>
        <p className="text-xs text-gray-400 mt-1">Slot: {slot}</p>
      </div>
    )
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  )
}
