'use client'

import { useState, useEffect } from 'react'

interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string
  category: 'exchange-rate' | 'economy'
  publishedAt: string
}

interface AIGeneratedNewsProps {
  rates?: {
    code: string
    rate: number
  }[]
}

export default function AIGeneratedNews({ rates }: AIGeneratedNewsProps) {
  const [exchangeArticle, setExchangeArticle] = useState<NewsArticle | null>(null)
  const [economyArticle, setEconomyArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shouldGenerateToday = (category: 'exchange-rate' | 'economy'): boolean => {
    const lastGenerated = localStorage.getItem(`ai-news-last-generated-${category}`)
    if (!lastGenerated) return true
    
    const lastDate = new Date(lastGenerated).toDateString()
    const today = new Date().toDateString()
    
    return lastDate !== today
  }

  const saveArticleToCache = (article: NewsArticle) => {
    localStorage.setItem(`ai-news-article-${article.category}`, JSON.stringify(article))
    localStorage.setItem(`ai-news-last-generated-${article.category}`, new Date().toISOString())
  }

  const loadArticleFromCache = (category: 'exchange-rate' | 'economy'): NewsArticle | null => {
    const cached = localStorage.getItem(`ai-news-article-${category}`)
    if (!cached) return null
    
    try {
      return JSON.parse(cached)
    } catch {
      return null
    }
  }

  const generateArticle = async (category: 'exchange-rate' | 'economy', topic: string) => {
    try {
      const response = await fetch('/api/news/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rates: rates || [
            { code: 'USD', rate: 180.31 },
            { code: 'EUR', rate: 209.35 },
            { code: 'GBP', rate: 238.28 }
          ],
          topic,
          category
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate article')
      }

      const data = await response.json()
      saveArticleToCache(data.article)
      
      if (category === 'exchange-rate') {
        setExchangeArticle(data.article)
      } else {
        setEconomyArticle(data.article)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate article')
    }
  }

  useEffect(() => {
    const initArticles = async () => {
      setLoading(true)
      
      // Check exchange rate article
      const cachedExchange = loadArticleFromCache('exchange-rate')
      if (cachedExchange && !shouldGenerateToday('exchange-rate')) {
        setExchangeArticle(cachedExchange)
      } else {
        await generateArticle('exchange-rate', 'Current Ethiopian Birr exchange rates and market analysis')
      }
      
      // Check economy article
      const cachedEconomy = loadArticleFromCache('economy')
      if (cachedEconomy && !shouldGenerateToday('economy')) {
        setEconomyArticle(cachedEconomy)
      } else {
        await generateArticle('economy', 'Ethiopian economic outlook and development trends')
      }
      
      setLoading(false)
    }
    
    initArticles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderArticle = (article: NewsArticle | null) => {
    if (!article) return null
    
    const isExchangeRate = article.category === 'exchange-rate'
    const gradientClass = isExchangeRate 
      ? 'bg-gradient-to-br from-purple-50 via-white to-pink-50/30 dark:from-purple-900/20 dark:via-slate-800 dark:to-pink-900/10'
      : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50/30 dark:from-indigo-900/20 dark:via-slate-800 dark:to-blue-900/10'
    
    const borderHoverClass = isExchangeRate
      ? 'hover:border-purple-400 dark:hover:border-purple-500'
      : 'hover:border-indigo-400 dark:hover:border-indigo-500'
    
    const badgeClass = isExchangeRate
      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
    
    return (
      <div className={`border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden h-full transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 ${gradientClass} ${borderHoverClass}`}>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(article.publishedAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${badgeClass} whitespace-nowrap`}>
              {article.category === 'exchange-rate' ? 'Exchange Rate' : 'Economy'}
            </span>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            article.category === 'exchange-rate'
              ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200/50 dark:border-purple-800/30'
              : 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200/50 dark:border-indigo-800/30'
          }`}>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Summary</p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{article.summary}</p>
          </div>
          
          <div className="space-y-4 text-slate-700 dark:text-slate-300">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 dark:ring-slate-700/60">

      {error && (
        <div className="p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-950">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {loading && !exchangeArticle && !economyArticle && (
        <div className="p-12 border border-gray-200 dark:border-gray-800 rounded-lg">
          <div className="text-center space-y-2">
            <svg className="animate-spin h-8 w-8 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-gray-500 dark:text-gray-400">Generating articles with AI...</p>
          </div>
        </div>
      )}

      {(exchangeArticle || economyArticle) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {renderArticle(exchangeArticle)}
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {renderArticle(economyArticle)}
          </div>
        </div>
      )}
    </div>
  )
}
