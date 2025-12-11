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
  title: 'Ethiopian Exchange Rates - Live Parallel & Official Rates | Ethiopian Today',
  description: 'Real-time Ethiopian Birr exchange rates - Official CBE rates & Black Market (Parallel) rates. Compare USD, EUR, GBP to ETB with live charts, currency converter, and economic news.',
  keywords: ['Ethiopian Birr', 'exchange rates', 'ETB', 'black market exchange rate', 'parallel market rate', 'USD to ETB', 'currency converter', 'CBE official rate', 'Ethiopian economic news', 'birr exchange', 'Ethiopia currency'],
  authors: [{ name: 'Ethiopian Today' }],
  creator: 'Ethiopian Today',
  publisher: 'Ethiopian Today',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ethiopiantoday.com',
    title: 'Live Ethiopian Exchange Rates - Official & Black Market Rates',
    description: 'Track real-time Birr exchange rates, parallel market rates, and economic news. Free currency converter and rate charts.',
    images: [
      {
        url: 'https://ethiopiantoday.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ethiopian Exchange Rates'
      }
    ]
  },
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
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WMEW6BLS5Y"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WMEW6BLS5Y');
            `,
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9561015604678968"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
