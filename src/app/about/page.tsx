import Section from '@/components/Section'

export const metadata = {
  title: 'About Us - Ethiopian Today',
  description: 'Learn about Ethiopian Today, your trusted source for Ethiopian Birr exchange rates and economic news.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">About Ethiopian Today</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Your trusted source for Ethiopian Birr exchange rates and economic insights
        </p>
      </div>

      <Section title="Our Mission">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            Ethiopian Today is dedicated to providing accurate, real-time information about Ethiopian Birr exchange rates 
            and economic developments. We believe that access to reliable financial information empowers individuals and 
            businesses to make informed decisions in an ever-changing economic landscape.
          </p>
          <p className="text-lg leading-relaxed mt-4">
            Our mission is to bridge the information gap by delivering timely exchange rate updates, economic analysis, 
            and market insights that matter to Ethiopians and international stakeholders alike.
          </p>
        </div>
      </Section>

      <Section title="What We Offer">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <svg className="h-6 w-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Real-Time Exchange Rates
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Get live updates on official and parallel market exchange rates for major currencies including USD, EUR, GBP, and more.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <svg className="h-6 w-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Historical Data
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Access 24-hour exchange rate trends and historical data to track market movements and identify patterns.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <svg className="h-6 w-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Currency Calculator
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Quick and easy currency conversion tool to calculate exchange amounts between Ethiopian Birr and major currencies.
            </p>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <svg className="h-6 w-6 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Economic News
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              AI-powered daily economic analysis covering exchange rate movements and broader Ethiopian economic developments.
            </p>
          </div>
        </div>
      </Section>

      <Section title="Exchange Rate Reform Context">
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            We closely monitor Ethiopia's historic foreign exchange market reform initiated in July 2024. This transition 
            to a market-based exchange rate system represents a significant shift in Ethiopia's economic policy, aimed at:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Attracting foreign direct investment</li>
            <li>Boosting export competitiveness</li>
            <li>Improving foreign currency availability</li>
            <li>Reducing the parallel market premium</li>
            <li>Stabilizing the overall economy</li>
          </ul>
          <p className="text-lg leading-relaxed mt-4">
            Our platform helps you stay informed about these changes and their impact on daily exchange rates and the broader economy.
          </p>
        </div>
      </Section>

      <Section title="Why Choose Ethiopian Today?">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast & Reliable</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time updates ensure you always have the latest exchange rate information
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Accurate Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sourced from official banks and trusted market sources for maximum accuracy
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">User-Friendly</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clean, intuitive interface makes it easy to find the information you need
            </p>
          </div>
        </div>
      </Section>

      <Section title="Our Commitment">
        <div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-lg text-center leading-relaxed text-gray-800 dark:text-gray-200">
            We are committed to transparency, accuracy, and continuous improvement. As Ethiopia's economic landscape 
            evolves, we evolve with it—ensuring you always have access to the most relevant and reliable financial information.
          </p>
        </div>
      </Section>


    </div>
  )
}
