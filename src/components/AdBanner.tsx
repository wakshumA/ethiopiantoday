'use client'

import AdSense from '@/components/AdSense'

export default function AdBanner({ position }: { position: 'top' | 'sidebar' | 'bottom' | string }) {
  // Ad slot IDs for different positions
  // Replace these with your actual Google AdSense slot IDs from your AdSense account
  const slots: Record<string, string> = {
    top: '1234567890',      // Top banner ad slot
    sidebar: '1234567891',  // Sidebar ad slot
    bottom: '1234567892',   // Bottom banner ad slot
  }

  const slotId = slots[position] || slots.bottom

  return (
    <div className="w-full">
      <AdSense 
        slot={slotId}
        format="auto"
        responsive={true}
        className="my-4"
      />
    </div>
  )
}
