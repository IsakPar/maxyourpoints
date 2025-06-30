import { createClient } from '@supabase/supabase-js'

// Create Supabase client for direct database access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Simple cache for better performance
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Helper function to get from cache or execute query
async function withCache<T>(key: string, queryFn: () => Promise<T>): Promise<T> {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }

  try {
    const data = await queryFn()
    cache.set(key, { data, timestamp: Date.now() })
    return data
  } catch (error) {
    console.error(`Query failed for cache key ${key}:`, error)
    // Return empty result on error to prevent app crashes
    return (cached?.data || { articles: [], total: 0, hasMore: false }) as T
  }
}

// Helper function to calculate read time
function calculateReadTime(content: string | any): string {
  const wordsPerMinute = 200
  let words = 0
  
  if (typeof content === 'string' && content.length > 0) {
    words = content.split(/\s+/).filter(word => word.length > 0).length
  } else if (content && typeof content === 'object') {
    // Handle rich text content (JSON)
    const text = extractTextFromContent(content)
    if (text && typeof text === 'string') {
      words = text.split(/\s+/).filter(word => word.length > 0).length
    }
  }
  
  // Default fallback if no content or very short content
  if (words < 50) {
    words = 200
  }
  
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} min read`
}

// Helper function to extract text from rich content object
function extractTextFromContent(content: any): string {
  if (typeof content === 'string') return content
  if (!content) return ''
  
  if (content.type === 'doc' && content.content) {
    return content.content.map((block: any) => extractTextFromBlock(block)).join(' ')
  }
  
  return JSON.stringify(content).slice(0, 500) // Fallback
}

function extractTextFromBlock(block: any): string {
  if (!block) return ''
  
  if (block.type === 'paragraph' && block.content) {
    return block.content.map((inline: any) => 
      inline.type === 'text' ? inline.text : ''
    ).join('')
  }
  
  if (block.content) {
    return block.content.map(extractTextFromBlock).join(' ')
  }
  
  return block.text || ''
}

// Transform database article to frontend format (compatible with existing BlogPost interface)
function transformToFrontendFormat(dbArticle: any) {
  // Extract category information
  const categoryInfo = dbArticle.categories || dbArticle.category || null
  
  return {
    id: dbArticle.id,
    title: dbArticle.title,
    summary: dbArticle.summary || dbArticle.excerpt,
    category: categoryInfo ? {
      id: categoryInfo.id || 'default',
      name: categoryInfo.name || 'Uncategorized',
      slug: categoryInfo.slug || 'uncategorized'
    } : {
      id: 'default',
      name: 'Uncategorized', 
      slug: 'uncategorized'
    },
    tag: getTagPriority(dbArticle.tags || []),
    author: 'Max Your Points Team',
    date: formatDate(dbArticle.published_at || dbArticle.publishedAt || dbArticle.created_at || dbArticle.createdAt),
    readTime: dbArticle.reading_time || calculateReadTime(dbArticle.content || ''),
    image: dbArticle.hero_image_url || dbArticle.featuredImage || '/placeholder.svg',
    slug: dbArticle.slug,
    // Add raw database fields for components that might need them
    ...dbArticle
  }
}

// Helper function to get primary tag (matching existing interface)
function getTagPriority(tags: string[]): "Reviews" | "News" | "Guides" | "Trip Reports" {
  if (!tags || tags.length === 0) return "Guides"
  
  const tagPriority = ["Reviews", "News", "Guides", "Trip Reports"]
  for (const priority of tagPriority) {
    if (tags.includes(priority)) {
      return priority as "Reviews" | "News" | "Guides" | "Trip Reports"
    }
  }
  return "Guides" // Default
}

// Helper function to format date
function formatDate(dateString: string): string {
  if (!dateString) return new Date().toLocaleDateString()
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get all published articles (compatible with existing BlogPost interface)
 */
export async function getPublishedArticles(limit: number = 10, offset: number = 0) {
  const cacheKey = `published_articles_${limit}_${offset}`

  return withCache(cacheKey, async () => {
    try {
      console.log('📄 Fetching published articles from database...')
      const { data, error, count } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      const articles = (data || []).map(transformToFrontendFormat)
      const total = count || 0

      console.log(`✅ Found ${articles.length} published articles`)
      return {
        articles,
        total,
        hasMore: offset + limit < total
      }
    } catch (error) {
      console.error('No published articles found:', error)
      return {
        articles: [],
        total: 0,
        hasMore: false
      }
    }
  })
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string) {
  const cacheKey = `article_${slug}`

  return withCache(cacheKey, async () => {
    try {
      console.log(`📄 Fetching article: ${slug}`)
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error || !data) {
        console.error(`❌ Article not found: ${slug}`, error)
        return null
      }

      // Return full article data (not just preview)
      return {
        ...transformToFrontendFormat(data),
        content: data.content,
        metaDescription: data.meta_description,
        imageAlt: data.hero_image_alt || (data.hero_image_url ? data.title + ' featured image' : ''),
        featuredMain: data.featured_main || false,
        featuredCategory: data.featured_category || false
      }
    } catch (error) {
      console.error(`❌ Article not found: ${slug}`, error)
      return null
    }
  })
}

/**
 * Get articles by category slug
 */
export async function getArticlesByCategory(categorySlug: string, limit: number = 10, offset: number = 0) {
  const cacheKey = `articles_category_${categorySlug}_${limit}_${offset}`
  console.log(`🔍 Fetching articles for category: ${categorySlug}`)

  return withCache(cacheKey, async () => {
    try {
      // First get the category ID by slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (categoryError || !categoryData) {
        console.error('❌ Category not found:', categorySlug)
        return {
          articles: [],
          total: 0,
          hasMore: false
        }
      }

      const { data, error, count } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `, { count: 'exact' })
        .eq('category_id', categoryData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      const articles = (data || []).map(transformToFrontendFormat)
      const total = count || 0

      console.log(`📄 Found ${articles.length} articles for category ${categorySlug}`)
      return {
        articles,
        total,
        hasMore: offset + limit < total
      }
    } catch (error) {
      console.error('❌ Error fetching articles by category:', error)
      return {
        articles: [],
        total: 0,
        hasMore: false
      }
    }
  })
}

/**
 * Get featured articles (main page or category)
 */
export async function getFeaturedArticles(type: 'main' | 'category' = 'main', limit: number = 6, categoryId?: string) {
  const cacheKey = `featured_articles_${type}_${limit}_${categoryId || 'all'}`

  return withCache(cacheKey, async () => {
    try {
      console.log(`🌟 Fetching featured articles (${type})`)
      
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)

      // If categoryId is provided, filter by category
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data, error } = await query

      if (error) throw error

      const articles = (data || []).map(transformToFrontendFormat)
      console.log(`✅ Found ${articles.length} featured articles`)
      return articles
    } catch (error) {
      console.error('No featured articles found:', error)
      return []
    }
  })
}

/**
 * Get articles by subcategory with smart distribution
 */
export async function getArticlesBySubcategoriesSmartDistribution(categoryId: string, subcategoryIds: string[]) {
  const cacheKey = `smart_subcategory_articles_${categoryId}_${subcategoryIds.join('-')}`

  return withCache(cacheKey, async () => {
    try {
      // For now, return articles for the main category
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('category_id', categoryId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(24)

      if (error) throw error

      const articles = (data || []).map(transformToFrontendFormat)
      
      // Group by first subcategory for compatibility
      const subcategoryArticles: { [key: string]: any[] } = {}
      if (subcategoryIds.length > 0) {
        subcategoryArticles[subcategoryIds[0]] = articles
      }

      return subcategoryArticles
    } catch (error) {
      console.error('❌ Error fetching subcategory articles:', error)
      return {}
    }
  })
}

/**
 * Get featured articles by category
 */
export async function getFeaturedArticlesByCategory(categorySlug: string) {
  const cacheKey = `featured_category_${categorySlug}`

  return withCache(cacheKey, async () => {
    try {
      // First get the category ID by slug
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single()

      if (categoryError || !categoryData) {
        console.error('❌ Category not found:', categorySlug)
        return []
      }

      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('category_id', categoryData.id)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6)

      if (error) throw error

      return (data || []).map(transformToFrontendFormat)
    } catch (error) {
      console.error('❌ Error fetching featured category articles:', error)
      return []
    }
  })
}

/**
 * Get all categories
 */
export async function getCategories() {
  const cacheKey = 'categories'

  return withCache(cacheKey, async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('❌ Error fetching categories:', error)
      return []
    }
  })
}

/**
 * Search articles
 */
export async function searchArticles(query: string, limit: number = 10, offset: number = 0) {
  const cacheKey = `search_${query}_${limit}_${offset}`

  return withCache(cacheKey, async () => {
    try {
      // Get ALL published articles for comprehensive search
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (error) throw error

      const allArticles = (data || []).map(transformToFrontendFormat)
      
      // Enhanced client-side search - search in title, summary, content, tags, and headers
      const searchQuery = query.toLowerCase()
      const filteredArticles = allArticles.filter(article => {
        // Search in title and summary
        const titleMatch = article.title.toLowerCase().includes(searchQuery)
        const summaryMatch = article.summary?.toLowerCase().includes(searchQuery)
        
        // Search in tags
        const tags = article.tags || []
        const tagMatch = Array.isArray(tags) ? 
          tags.some(tag => tag.toLowerCase().includes(searchQuery)) : false
        
        // Search in content (including headers)
        let contentMatch = false
        if (article.content) {
          const content = typeof article.content === 'string' ? article.content : JSON.stringify(article.content)
          contentMatch = content.toLowerCase().includes(searchQuery)
          
          // Also check for header patterns (# ## ### in markdown)
          const headerMatches = content.match(/^#{1,6}\s+(.+)$/gm) || []
          const headerMatch = headerMatches.some(header => 
            header.toLowerCase().includes(searchQuery)
          )
          contentMatch = contentMatch || headerMatch
        }
        
        // Search in category
        const categoryMatch = typeof article.category === 'object' ? 
          article.category.name?.toLowerCase().includes(searchQuery) :
          article.category?.toLowerCase().includes(searchQuery)
        
        return titleMatch || summaryMatch || tagMatch || contentMatch || categoryMatch
      })

      const start = offset
      const end = offset + limit
      const paginatedArticles = filteredArticles.slice(start, end)

      return {
        articles: paginatedArticles,
        total: filteredArticles.length,
        hasMore: end < filteredArticles.length
      }
    } catch (error) {
      console.error('❌ Error searching articles:', error)
      return {
        articles: [],
        total: 0,
        hasMore: false
      }
    }
  })
}

/**
 * Clear article cache
 */
export function clearArticleCache(): void {
  cache.clear()
  console.log('🧹 Article cache cleared')
}

// Clear cache immediately to refresh data
clearArticleCache() 