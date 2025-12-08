'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt: string;
  thumbnail?: string;
  description?: string;
}

export default function TopNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/news/top');
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      
      // API returns { items: [...], cached: true }
      if (data.items && Array.isArray(data.items)) {
        setNews(data.items.slice(0, 6)); // Show top 6 news items
      } else {
        setError('No news data available');
      }
    } catch (err) {
      setError('Failed to load news');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
            <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-6 space-y-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={fetchNews}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No news available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 dark:ring-slate-700/60">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-500 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:-translate-y-1 bg-white dark:bg-slate-800 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item.thumbnail && (
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 dark:bg-gray-900/90 rounded-md text-xs font-medium">
                  {item.source}
                </div>
              </div>
            )}
            <div className="p-6 space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {item.title}
              </h3>
              
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {truncateText(item.description, 120)}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
                {!item.thumbnail && <span className="font-medium">{item.source}</span>}
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDate(item.publishedAt)}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
