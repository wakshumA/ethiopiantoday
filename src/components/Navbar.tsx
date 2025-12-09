"use client"
import Link from 'next/link'
import { useState } from 'react'
import ThemeToggle from '@/components/ThemeToggle'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-[#FFFEF9] via-[#FFF9E6] to-[#FFFEF9] dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 border-[#F2C94C]/20 dark:border-gray-800">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between py-4 gap-4">
        <Link className="text-2xl font-bold text-black dark:text-white" href="/">
          Ethiopian Exchange Rate Today
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors">
            Home
          </Link>
          <a href="#rates" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Exchange Rates
          </a>
          <a href="#calculator" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}>
            Calculator
          </a>
          <Link href="/blog" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors">
            Blog
          </Link>
          <a href="#news" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }); }}>
            News
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-[#F2C94C]/20 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
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
        <div className="md:hidden border-t border-[#F2C94C]/20 dark:border-gray-800 bg-gradient-to-br from-[#FFF9E6] to-[#FFFEF9] dark:bg-gray-950">
          <nav className="container max-w-7xl py-4 flex flex-col space-y-3">
            <Link href="/" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <a href="#rates" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Exchange Rates
            </a>
            <a href="#calculator" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Calculator
            </a>
            <Link href="/blog" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <a href="#news" className="text-base font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] dark:hover:text-[#FFD700] transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' }); }}>
              News
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
