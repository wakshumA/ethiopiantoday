'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  category: string
  readTime: string
  tags: string[]
  featured: boolean
}

const categories = ['All', 'Exchange Rates', 'Finance Tips']

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredPosts(blogPosts)
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === selectedCategory))
    }
  }, [selectedCategory, blogPosts])

  const fetchPosts = async (loadMore = false) => {
    try {
      setLoading(true)
      const currentOffset = loadMore ? offset : 0
      const response = await fetch(`/api/blog/posts?limit=10&offset=${currentOffset}`)
      const data = await response.json()
      
      if (loadMore) {
        setBlogPosts(prev => [...prev, ...data.posts])
      } else {
        setBlogPosts(data.posts)
      }
      
      setHasMore(data.hasMore)
      setOffset(currentOffset + data.posts.length)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    fetchPosts(true)
  }
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const featuredPost = filteredPosts.find(post => post.featured) || filteredPosts[0]
  const regularPosts = filteredPosts.filter(post => !post.featured || post !== featuredPost)

  if (loading && blogPosts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (!loading && blogPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Blog</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          No blog posts yet. Generate your first post!
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          Run: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">curl -X POST http://localhost:3000/api/blog/generate -H "Authorization: Bearer your_secret_token"</code>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
          Stay informed with the latest insights on Ethiopian exchange rates, economic trends, and financial tips.
        </p>
      </div>

      {/* Category Filter */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/60 dark:ring-slate-700/60">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                category === selectedCategory
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Tips Section - Only show when Finance Tips is selected */}
      {selectedCategory === 'Finance Tips' && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="bg-gradient-to-br from-yellow-50 via-amber-50/50 to-orange-50/30 dark:from-yellow-900/10 dark:via-amber-900/10 dark:to-orange-900/10 rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-yellow-200/60 dark:ring-yellow-700/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">💡</div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Quick Financial Tips
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tip 1 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-2xl shadow-md">
                    💰
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      Compare Rates Daily
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Check NBE vs parallel market rates every day before exchanging currency to get the best deal.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 2 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center text-2xl shadow-md">
                    📊
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      Use CBE Bonus
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Send remittances through CBE to get +10 ETB per USD bonus - adds up over time!
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 3 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-2xl shadow-md">
                    ⏰
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      Best Time: Mid-Week
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Exchange rates tend to be more favorable Tuesday-Thursday. Avoid Mondays and Fridays.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 4 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-2xl shadow-md">
                    🔒
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      Avoid Black Market
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Use official channels to avoid fraud, counterfeit bills, and legal issues. Safety first!
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 5 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center text-2xl shadow-md">
                    📱
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      Track Historical Trends
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Monitor past rates to identify patterns and make informed decisions on timing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tip 6 */}
              <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center text-2xl shadow-md">
                    💳
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                      Plan for Fees
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Factor in transaction fees and service charges when calculating exchange costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Link 
            href={`/blog/${featuredPost.id}`}
            className="block group"
          >
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50/30 dark:from-blue-900/20 dark:via-slate-800 dark:to-purple-900/10 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 transition-all duration-500 hover:-translate-y-1">
              <div className="grid md:grid-cols-2 gap-6 p-8">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      Featured
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <span>{formatDate(featuredPost.date)}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                    <span>•</span>
                    <span>{featuredPost.author}</span>
                  </div>
                </div>
                <div className="relative h-64 md:h-auto bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-xl flex items-center justify-center">
                  <div className="text-6xl">📈</div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="group animate-fade-in-up"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <article className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-slate-200/60 dark:ring-slate-700/60 transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
              {/* Image placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/40 dark:to-blue-900/40 flex items-center justify-center">
                <div className="text-5xl">
                  {post.category === 'Exchange Rates' && '💱'}
                  {post.category === 'Finance Tips' && '💡'}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    {post.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <span>{formatDate(post.date)}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <button 
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More Articles'}
          </button>
        </div>
      )}
    </div>
  )
}
