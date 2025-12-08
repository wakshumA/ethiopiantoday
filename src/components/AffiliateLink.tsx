'use client'

/**
 * Affiliate Link Component
 * Tracks clicks and adds proper attributes
 */

interface AffiliateLinkProps {
  href: string
  provider: 'western-union' | 'remitly' | 'wise' | 'worldremit' | 'other'
  children: React.ReactNode
  className?: string
}

const providerInfo = {
  'western-union': {
    name: 'Western Union',
    icon: '💸',
    description: 'Global leader in money transfers'
  },
  'remitly': {
    name: 'Remitly',
    icon: '🚀',
    description: 'Fast international money transfers'
  },
  'wise': {
    name: 'Wise',
    icon: '💳',
    description: 'Low-fee international transfers'
  },
  'worldremit': {
    name: 'WorldRemit',
    icon: '🌍',
    description: 'Send money to 130+ countries'
  },
  'other': {
    name: 'Partner',
    icon: '🔗',
    description: 'Our trusted partner'
  }
}

export default function AffiliateLink({ 
  href, 
  provider, 
  children,
  className = ''
}: AffiliateLinkProps) {
  const handleClick = () => {
    // Track affiliate click (can integrate with analytics)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'affiliate_click', {
        provider,
        url: href
      })
    }
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}

/**
 * Affiliate Card Component
 * Prominent display for affiliate promotions
 */

interface AffiliateCardProps {
  provider: keyof typeof providerInfo
  href: string
  title: string
  description: string
  ctaText?: string
  bonus?: string
}

export function AffiliateCard({
  provider,
  href,
  title,
  description,
  ctaText = 'Get Started',
  bonus
}: AffiliateCardProps) {
  const info = providerInfo[provider]

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
      <div className="flex items-start gap-4">
        <div className="text-4xl">{info.icon}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {description}
          </p>
          
          {bonus && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 mb-3">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                🎁 {bonus}
              </p>
            </div>
          )}

          <AffiliateLink
            href={href}
            provider={provider}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors text-sm"
          >
            {ctaText}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </AffiliateLink>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            * Affiliate disclosure: We may earn a commission
          </p>
        </div>
      </div>
    </div>
  )
}
