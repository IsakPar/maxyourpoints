"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import CTASection from "@/components/CTASection/CTASection"
import { Search, X } from "lucide-react"
import { Article, Category } from "@/lib/types"
import { searchArticles } from "@/lib/articles-simple"

interface BlogPageClientProps {
  articles: Article[]
  categories: Category[]
}

interface SearchResult {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  readTime: string
  image?: string | null
  date: string
  author: string
}

// Safe date formatting to prevent hydration issues
function formatDateSafely(dateString: string | undefined): string {
  if (!dateString) return new Date().toISOString().split('T')[0]
  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0] // Returns YYYY-MM-DD format consistently
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

export default function BlogPageClient({ articles, categories }: BlogPageClientProps) {
  const [mounted, setMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState("View All")
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const categoryLabels = ["View All", ...categories.map(cat => cat.name)]

  const filteredArticles = activeCategory === "View All" 
    ? articles 
    : articles.filter(article => {
        // Handle both legacy and new category format
        let categoryName = ''
        
        // Check for joined categories (new format)
        if ((article as any).categories?.name) {
          categoryName = (article as any).categories.name
        }
        // Check for legacy category format
        else if (typeof article.category === 'object' && article.category?.name) {
          categoryName = article.category.name
        }
        // Check for string category format
        else if (typeof article.category === 'string') {
          categoryName = article.category
        }
        
        return categoryName === activeCategory
      })

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setSearchResults([])
        setShowSearchResults(false)
        return
      }

      setIsSearching(true)
      setShowSearchResults(true)
      
      try {
        console.log('🔍 Searching for:', term)
        // Use backend search function for comprehensive search
        const result = await searchArticles(term, 20, 0)
        console.log('📄 Raw search results:', result)
        
        // Transform results to match our interface
        const transformedResults = result.articles.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          summary: article.summary || article.excerpt,
          category: typeof article.category === 'object' ? article.category.name : article.category || 'Uncategorized',
          readTime: article.readTime || article.reading_time || '5 min read',
          image: article.image || article.hero_image_url || null,
          date: article.date || formatDateSafely(article.published_at || article.publishedAt || article.created_at || article.createdAt),
          author: article.author || 'Max Your Points Team'
        }))
        
        console.log('✅ Transformed search results:', transformedResults)
        setSearchResults(transformedResults)
      } catch (error) {
        console.error("Search error:", error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300),
    []
  )

  useEffect(() => {
    if (mounted) {
      debouncedSearch(searchTerm)
    }
  }, [searchTerm, debouncedSearch, mounted])

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults([])
    setShowSearchResults(false)
  }

  // Show loading state during hydration to prevent mismatches
  if (!mounted) {
    return (
      <main>
        {/* Hero Section */}
        <section className="bg-teal-50 py-24">
          <div className="max-w-screen-xl mx-auto px-6 md:px-16">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 w-full">
                <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                  Unlock Your Travel Potential with Expert Insights
                </h1>
              </div>
              <div className="flex-1 space-y-6">
                <p className="text-lg text-stone-700">
                  Smart tips, expert reviews, and hidden travel hacks — all in one place.
                </p>
              </div>
            </div>
            <div className="w-full mt-12">
              <div className="aspect-[16/5] bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src="/world-flight-paths.png"
                  alt="World flight paths illustration"
                  className="object-cover w-full h-full" style={{ objectPosition: 'center 60%' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Loading state for blog posts */}
        <section className="bg-teal-50 py-16">
          <div className="max-w-screen-xl mx-auto px-6 md:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
                Loading Articles...
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-[16/9] bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="bg-teal-50">
          <CTASection />
        </div>

        <section className="bg-teal-50 py-16 border-b border-gray-100">
          <div className="max-w-screen-xl mx-auto px-6 md:px-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">
                Find Your Perfect Travel Guide
              </h2>
              <p className="text-lg text-stone-700">
                Search our comprehensive library of travel articles, tips, and guides.
              </p>
            </div>
            <div className="max-w-3xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  disabled
                  placeholder="Loading search..."
                  className="w-full px-6 py-4 pl-14 pr-12 text-lg border-2 border-gray-200 rounded-2xl bg-gray-100"
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-teal-50 py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Column - H1 Heading */}
            <div className="flex-1 w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Unlock Your Travel Potential with Expert Insights
              </h1>
            </div>
            {/* Right Column - Text Content */}
            <div className="flex-1 space-y-6">
              <p className="text-lg text-stone-700">
                Smart tips, expert reviews, and hidden travel hacks — all in one place.
              </p>
            </div>
          </div>
          {/* Full-width image below columns */}
          <div className="w-full mt-12">
            <div className="aspect-[16/5] bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src="/world-flight-paths.png"
                alt="World flight paths illustration"
                className="object-cover w-full h-full" style={{ objectPosition: 'center 60%' }}
              />
            </div>
          </div>
        </div>
      </section>



      {/* Content Section - Always shows blog posts with filters (independent of search) */}
      <section className="bg-teal-50 py-16">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Explore Our Travel Insights
            </h2>
            <p className="text-lg text-stone-700">
              Smart tips, expert reviews, and hidden travel hacks — all in one place.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categoryLabels.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 ${
                  activeCategory === category
                    ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                    : "bg-white text-stone-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 hover:text-teal-700 border border-gray-200 hover:border-teal-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article: Article) => (
              <Link 
                key={article.id}
                href={`/blog/${article.slug}`}
                className="block bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Image */}
                {(() => {
                  // Check all possible image field variations
                  const imageUrl = article.image || 
                                   (article as any).hero_image_url || 
                                   (article.heroImage && typeof article.heroImage === 'object' ? article.heroImage.url : null) ||
                                   (article as any).featuredImage
                  const imageAlt = (article as any).hero_image_alt || 
                                   (article.heroImage && typeof article.heroImage === 'object' ? article.heroImage.alt : null) ||
                                   article.title
                  
                  return imageUrl && imageUrl !== '/placeholder.svg' ? (
                    <div className="aspect-[16/9] bg-gray-200 relative">
                      <Image
                        src={imageUrl}
                        alt={imageAlt || article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        onError={() => {
                          console.warn('Image failed to load:', imageUrl)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 font-medium">Image Placeholder</span>
                    </div>
                  )
                })()}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                      {(() => {
                        // Handle different category data structures
                        if ((article as any).categories?.name) {
                          return (article as any).categories.name
                        } else if (typeof article.category === 'object' && article.category?.name) {
                          return article.category.name
                        } else if (typeof article.category === 'string') {
                          return article.category
                        }
                        return 'Uncategorized'
                      })()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date((article as any).published_at || article.publishedAt || article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-600">MaxYourPoints Team</span>
                    {((article as any).featured_main || (article as any).featured_category || article.featured) && (
                      <span className="text-xs text-emerald-600 font-medium">Featured</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Always show */}
      <div className="bg-teal-50">
        <CTASection />
      </div>

      {/* Enhanced Search Section - Always visible */}
      <section className="bg-teal-50 py-16 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">
              Find Your Perfect Travel Guide
            </h2>
            <p className="text-lg text-stone-700">
              Search our comprehensive library of travel articles, tips, and guides.
            </p>
          </div>

          {/* Enhanced Search Input */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => mounted && setSearchTerm(e.target.value)}
                placeholder="Search articles by title, content, or topic..."
                className="w-full px-6 py-4 pl-14 pr-12 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md"
                disabled={!mounted}
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              {mounted && searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* Search Results - Only appear within search section */}
          {showSearchResults && mounted && (
            <div className="max-w-6xl mx-auto mt-8">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-3 text-gray-600">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
                    <span className="text-lg">Searching...</span>
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="text-center mb-8">
                    <p className="text-lg text-stone-700">
                      Found <span className="font-semibold text-emerald-600">{searchResults.length}</span> article{searchResults.length !== 1 ? 's' : ''} matching "{searchTerm}"
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/blog/${result.slug}`}
                        className="block bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      >
                        {/* Image */}
                        {result.image ? (
                          <div className="aspect-[16/9] bg-gray-200">
                            <img
                              src={result.image}
                              alt={result.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">Image Placeholder</span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                              {result.category}
                            </span>
                            <span className="text-gray-500 text-sm">{result.readTime}</span>
                          </div>
                          <h2 className="text-xl font-semibold mb-3 hover:text-emerald-600 transition-colors">
                            {result.title}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {result.summary}
                          </p>
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-gray-600">{result.author}</span>
                            <span className="text-xs text-emerald-600 font-medium">{result.date}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              ) : searchTerm ? (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Search className="mx-auto h-12 w-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-500 mb-6">
                    We couldn't find any articles matching "{searchTerm}". Try different keywords or browse our categories above.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Clear search
                  </button>
                </div>
              ) : null}
            </div>
          )}

        </div>
      </section>


    </main>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
} 