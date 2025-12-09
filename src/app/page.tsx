import Section from '@/components/Section'
import ExchangeWidget from '@/components/ExchangeWidget'
import ExchangeCalculator from '@/components/ExchangeCalculator'
import ExchangeRateChart from '@/components/ExchangeRateChart'
import RemittanceBonusWidget from '@/components/RemittanceBonusWidget'
import AIGeneratedNews from '@/components/AIGeneratedNews'
import TopNews from '@/components/TopNews'
import AdBanner from '@/components/AdBanner'
import HeroSection from '@/components/HeroSection'
import NewsletterSignup from '@/components/NewsletterSignup'

export default function HomePage() {
  return (
    <div className="space-y-8 lg:space-y-12">
      {/* Hero Section with Stats */}
      <div className="animate-fade-in-up">
        <HeroSection />
      </div>

      {/* Exchange Rate Chart and Remittance Bonus - Full Width Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
        <div className="xl:col-span-8 space-y-6 lg:space-y-8">
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
        <div className="xl:col-span-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Section title="">
            <RemittanceBonusWidget />
          </Section>
        </div>
      </div>

      {/* Exchange Rate Reform and Calculator - Improved Spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Section title="Exchange Rate Reform">
            <div className="p-6 lg:p-8 bg-gradient-to-br from-cyan-50 via-white to-sky-50/30 dark:from-cyan-900/20 dark:via-slate-800 dark:to-sky-900/10 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 transition-all duration-500 hover:-translate-y-0.5">
              <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Ethiopia implemented a significant foreign exchange market reform in July 2024, transitioning to a market-based exchange rate system. This reform aims to attract foreign investment, boost exports, and stabilize the economy.
              </p>
              <p className="text-sm lg:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
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

      {/* AI-Generated News Section - Full Width */}
      <div id="news" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <Section title="Economic Insights">
          <AIGeneratedNews />
        </Section>
      </div>

      {/* Top Ethiopian News - Full Width */}
      <div id="top-news" className="animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
        <Section title="Latest Ethiopian Economic News">
          <TopNews />
        </Section>
      </div>

      {/* Newsletter Signup */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <NewsletterSignup />
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: '0.55s' }}>
        <AdBanner position="bottom" />
      </div>
    </div>
  )
}
