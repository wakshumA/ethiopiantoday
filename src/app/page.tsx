import dynamic from 'next/dynamic'
import Section from '@/components/Section'
import ExchangeWidget from '@/components/ExchangeWidget'
import ExchangeCalculator from '@/components/ExchangeCalculator'
import RemittanceBonusWidget from '@/components/RemittanceBonusWidget'
import TopNews from '@/components/TopNews'
import AdBanner from '@/components/AdBanner'
import HeroSection from '@/components/HeroSection'
import NewsletterSignup from '@/components/NewsletterSignup'

// Lazy load chart component to improve initial page load
const ExchangeRateChart = dynamic(
  () => import('@/components/ExchangeRateChart'),
  { 
    loading: () => (
      <div className="h-64 bg-gradient-to-br from-gray-200/50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/50 rounded-lg animate-pulse" />
    ),
    ssr: true,
  }
)

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12">
      {/* Hero Section with Stats */}
      <div className="animate-fade-in-up">
        <HeroSection />
      </div>

      {/* Exchange Rate Chart and Remittance Bonus - Connected Cards Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-teal-50/40 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-amber-200/20 dark:ring-slate-700/50">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="xl:col-span-8 space-y-2 sm:space-y-3 lg:space-y-4">
            {/* Chart & Exchange Rates - Sub-container for visual connection */}
            <div className="p-4 sm:p-5 lg:p-6 rounded-2xl bg-gradient-to-br from-white via-cyan-50/30 to-teal-50/30 dark:from-slate-800/50 dark:via-slate-700/40 dark:to-slate-700/30 border border-cyan-200/20 dark:border-slate-700/30 shadow-sm">
              <div className="space-y-3 sm:space-y-4">
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Section title="Live Exchange Rate (Parallel) Trends (24h)">
                    <ExchangeRateChart />
                  </Section>
                </div>
                
                <div id="rates" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Section title="Ethiopian Exchange Rates">
                    <ExchangeWidget />
                  </Section>
                </div>
              </div>
            </div>
          </div>
          <div className="xl:col-span-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <Section title="">
              <RemittanceBonusWidget />
            </Section>
          </div>
        </div>
      </div>

      {/* Exchange Rate Reform and Calculator - Connected Cards Container */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-white via-amber-50/40 to-orange-50/40 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-amber-200/20 dark:ring-slate-700/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Section title="Exchange Rate Reform">
              <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white via-amber-50/50 to-orange-50/50 dark:from-slate-800 dark:via-slate-700/70 dark:to-slate-700/50 rounded-2xl border border-amber-200/40 dark:border-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.10)] ring-1 ring-amber-200/30 dark:ring-slate-700/30 transition-all duration-500 hover:-translate-y-1">
                <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Ethiopia implemented a significant foreign exchange market reform in July 2024, transitioning to a market-based exchange rate system. This reform aims to attract foreign investment, boost exports, and stabilize the economy.
                </p>
                <p className="text-xs sm:text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The National Bank of Ethiopia (NBE) now allows commercial banks to set their own exchange rates based on market forces, marking a shift from the previous fixed exchange rate regime. This liberalization is expected to improve foreign currency availability and reduce the parallel market premium.
                </p>
              </div>
            </Section>
          </div>
          
          <div id="calculator" className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
            <Section title="Currency Calculator">
              <ExchangeCalculator />
            </Section>
          </div>
        </div>
      </div>

      {/* Top Ethiopian News - Full Width */}
      <div id="top-news" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Section title="Latest News">
          <TopNews />
        </Section>
      </div>

      {/* Newsletter Signup */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
        <NewsletterSignup />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <AdBanner position="bottom" />
      </div>
    </div>
  )
}
