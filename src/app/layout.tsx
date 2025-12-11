import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Background from '@/components/Background'
import StructuredData from '@/components/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ethiopian Today - Live Exchange Rates & Economic News',
  description: 'Get real-time Ethiopian Birr exchange rates, currency conversion, and daily economic news. Track USD, EUR, GBP, AED, SAR, KWD rates and market analysis.',
  keywords: ['Ethiopian Birr', 'exchange rates', 'ETB', 'currency', 'USD to ETB', 'economic news', 'Ethiopia'],
  authors: [{ name: 'Ethiopian Today' }],
  creator: 'Ethiopian Today',
  publisher: 'Ethiopian Today',
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethiopiantoday.com',
    siteName: 'Ethiopian Today',
    title: 'Ethiopian Today - Live Exchange Rates & Economic News',
    description: 'Real-time Ethiopian Birr exchange rates, currency conversion, and daily economic news from Ethiopia.',
    images: [
      {
        url: 'https://ethiopiantoday.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ethiopian Today - Exchange Rates Platform',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ethiopian Today - Live Exchange Rates & Economic News',
    description: 'Real-time Ethiopian Birr exchange rates and economic news.',
    images: ['https://ethiopiantoday.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://ethiopiantoday.com',
  },
  other: {
    'google-adsense-account': 'ca-pub-9561015604678968',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
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
