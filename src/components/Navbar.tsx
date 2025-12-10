"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-white via-blue-50 to-white dark:bg-gradient-to-r dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 border-blue-200/30 dark:border-blue-800/30 transition-all duration-300">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between py-4 gap-4">
        <Link className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 hover:scale-105 transition-transform duration-300" href="/">
          Ethiopian Exchange Rate Today
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <a href="#rates" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer relative group" onClick={(e) => { e.preventDefault(); document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Exchange Rates
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#calculator" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer relative group" onClick={(e) => { e.preventDefault(); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Calculator
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </a>
          <Link href="/blog" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative group">
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <a href="#news" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 cursor-pointer relative group" onClick={(e) => { e.preventDefault(); document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }); }}>
            News
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-200 transition-all duration-300 transform hover:scale-110"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-blue-200/30 dark:border-blue-800/30 bg-gradient-to-br from-white via-blue-50 to-cyan-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 animate-slide-in-right">
          <nav className="container max-w-7xl py-4 flex flex-col space-y-3">
            <Link href="/" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4 py-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/20" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <a href="#rates" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer pl-4 py-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/20" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Exchange Rates
            </a>
            <a href="#calculator" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer pl-4 py-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/20" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Calculator
            </a>
            <Link href="/blog" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pl-4 py-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/20" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <a href="#news" className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer pl-4 py-2 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/20" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }); }}>
              News
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
