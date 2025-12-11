"use client"
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('/')

  useEffect(() => {
    // Set active section based on pathname
    if (pathname === '/blog') {
      setActiveSection('blog')
    } else {
      setActiveSection('/')
    }
  }, [pathname])

  const handleSectionNavigation = (sectionId: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Always navigate to home with hash
    router.push(`/#${sectionId}`)
    
    // Scroll to section after a short delay
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const getNavLinkClass = (sectionName: string) => {
    const isActive = activeSection === sectionName
    const baseClass = "text-base font-semibold transition-all duration-300 cursor-pointer relative group"
    const colorClass = isActive 
      ? "text-blue-600 dark:text-blue-400" 
      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
    return `${baseClass} ${colorClass}`
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-gray-900 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 border-gray-200/30 dark:border-gray-700/30 transition-all duration-300 shadow-sm">
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex items-center justify-between py-4 gap-4">
        <Link className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 hover:scale-105 transition-transform duration-300" href="/">
          Ethiopian Exchange Rate Today
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={`${getNavLinkClass('/')} ${activeSection === '/' ? '' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>
            Home
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ${activeSection === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <a href="#rates" className={getNavLinkClass('rates')} onClick={(e) => { e.preventDefault(); document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' }); setActiveSection('rates'); }}>
            Exchange Rates
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ${activeSection === 'rates' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </a>
          <a href="#calculator" className={getNavLinkClass('calculator')} onClick={(e) => handleSectionNavigation('calculator', e)}>
            Calculator
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ${activeSection === 'calculator' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </a>
          <Link href="/blog" className={`${getNavLinkClass('blog')} ${activeSection === 'blog' ? '' : 'hover:text-blue-600 dark:hover:text-blue-400'}`}>
            Blog
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ${activeSection === 'blog' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <a href="#top-news" className={getNavLinkClass('top-news')} onClick={(e) => handleSectionNavigation('top-news', e)}>
            News
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-300 ${activeSection === 'top-news' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
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
        <div className="md:hidden border-t border-gray-200/30 dark:border-gray-700/30 bg-white dark:bg-gray-900 animate-slide-in-right">
          <nav className="container max-w-7xl py-4 flex flex-col space-y-3">
            <Link href="/" className={`text-base font-semibold transition-colors pl-4 py-2 rounded-lg ${activeSection === '/' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`} onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <a href="#rates" className={`text-base font-semibold transition-colors cursor-pointer pl-4 py-2 rounded-lg ${activeSection === 'rates' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`} onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); document.getElementById('rates')?.scrollIntoView({ behavior: 'smooth' }); setActiveSection('rates'); }}>
              Exchange Rates
            </a>
            <a href="#calculator" className={`text-base font-semibold transition-colors cursor-pointer pl-4 py-2 rounded-lg ${activeSection === 'calculator' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`} onClick={(e) => { handleSectionNavigation('calculator', e); setMobileMenuOpen(false); }}>
              Calculator
            </a>
            <Link href="/blog" className={`text-base font-semibold transition-colors pl-4 py-2 rounded-lg ${activeSection === 'blog' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`} onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            <a href="#top-news" className={`text-base font-semibold transition-colors cursor-pointer pl-4 py-2 rounded-lg ${activeSection === 'top-news' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-100/50 dark:hover:bg-blue-900/20'}`} onClick={(e) => { handleSectionNavigation('top-news', e); setMobileMenuOpen(false); }}>
              News
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
