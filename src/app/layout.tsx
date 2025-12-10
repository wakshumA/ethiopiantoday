import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Background from '@/components/Background'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ethiopian Today - Exchange Rates & Economic News',
  description: 'Get the latest Ethiopian Birr exchange rates, currency conversion, and economic news. Real-time updates on USD, EUR, GBP and more.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', sizes: 'any' }
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  other: {
    'google-adsense-account': 'ca-pub-9561015604678968',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9561015604678968"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
          id="adsense-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.adsbygoogle = window.adsbygoogle || [];
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Background />
          <Navbar />
          <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 min-h-screen max-w-[1920px] mx-auto">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
