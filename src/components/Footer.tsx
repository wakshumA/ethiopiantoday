'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [scrollToTop] = useState(() => {
    if (typeof window !== 'undefined') {
      return () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    return () => {}
  })

  return (
    <footer className="relative border-t border-blue-200/30 dark:border-blue-800/30 mt-20 bg-gradient-to-b from-white via-blue-50/30 to-cyan-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-40 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center group"
        aria-label="Back to top"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12">
        {/* Newsletter Signup */}
        <div className="mb-8 sm:mb-12 p-4 sm:p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl sm:rounded-2xl border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm">
          <h4 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span>Stay Updated</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
            Get daily exchange rate updates and economic insights delivered to your inbox.
          </p>
          <div className="flex flex-col gap-2 sm:gap-3">
            <input
              type="email"
              placeholder="Your email"
              className="w-full sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            />
            <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-xs sm:text-sm text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95">
              Subscribe
            </button>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* About */}
          <div className="space-y-4 group">
            <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:text-blue-600 transition-all duration-300">
              Ethiopian Today
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-4">
              Your trusted source for Ethiopian Birr exchange rates, economic news, and financial insights.
            </p>
            <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 group">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '#rates', label: 'Exchange Rates' },
                { href: '#calculator', label: 'Calculator' },
                { href: '#news', label: 'Economic News' },
                { href: '#top-news', label: 'Top News' },
              ].map((link) => (
                <li key={link.href} className="group/link">
                  <Link 
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative inline-flex items-center gap-1 group-hover/link:translate-x-1"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover/link:w-1.5 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4 group">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Resources</h3>
            <ul className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map((link) => (
                <li key={link.href} className="group/link">
                  <Link 
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative inline-flex items-center gap-1 group-hover/link:translate-x-1"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover/link:w-1.5 transition-all duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Connect With Us</h3>
            <div className="space-y-1.5 sm:space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4">
              <p className="flex items-center gap-2 truncate">
                <span className="text-blue-500 flex-shrink-0">✉</span>
                <span className="truncate text-xs">info@ethioexchangerate.com</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-blue-500 flex-shrink-0">📍</span>
                <span>Addis Ababa, Ethiopia</span>
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 pt-2">
              {[
                { href: 'https://facebook.com/ethiopiantoday', label: 'Facebook', icon: 'facebook' },
                { href: 'https://twitter.com/ethiopiantoday', label: 'Twitter', icon: 'twitter' },
                { href: 'https://instagram.com/ethiopiantoday', label: 'Instagram', icon: 'instagram' },
              ].map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow us on ${social.label}`}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95 hover:from-blue-500 hover:to-cyan-500 hover:text-white group flex-shrink-0"
                  title={social.label}
                >
                  {social.icon === 'facebook' && (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce-subtle" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {social.icon === 'twitter' && (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce-subtle" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  )}
                  {social.icon === 'instagram' && (
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce-subtle" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-blue-200/30 dark:border-blue-800/30">
          <div className="flex flex-col gap-3 sm:gap-4">
            <p className="text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} <span className="font-semibold text-slate-900 dark:text-white">Ethiopian Today</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-slate-500 dark:text-slate-500">
              <a href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 truncate">Privacy</a>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <a href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 truncate">Terms</a>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
              <span className="text-slate-500 w-full sm:w-auto text-center sm:text-left">Made with <span className="text-blue-500">💙</span> in Ethiopia</span>
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-slate-500 sm:hidden">
              Exchange rates updated daily.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
