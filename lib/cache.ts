// Simple in-memory cache with TTL support
// Can be easily replaced with Redis in production

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
}

class CacheManager {
  private cache = new Map<string, CacheItem<any>>()
  private defaultTTL = 5 * 60 * 1000 // 5 minutes

  /**
   * Set cache with TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    }
    this.cache.set(key, item)
  }

  /**
   * Get cache if not expired
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data as T
  }

  /**
   * Delete specific cache key
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * Delete cache keys matching pattern
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clean expired entries
   */
  cleanExpired(): number {
    const now = Date.now()
    let cleaned = 0
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
        cleaned++
      }
    }
    
    return cleaned
  }
}

// Create singleton instance
export const cache = new CacheManager()

// Cache key generators
export const cacheKeys = {
  articles: {
    all: (limit?: number, published?: boolean) => 
      `articles:all:${limit || 'unlimited'}:${published === undefined ? 'any' : published}`,
    byId: (id: string) => `articles:id:${id}`,
    bySlug: (slug: string) => `articles:slug:${slug}`,
    byCategory: (category: string, limit?: number) => 
      `articles:category:${category}:${limit || 'unlimited'}`,
    featured: (limit?: number) => `articles:featured:${limit || 'unlimited'}`,
    search: (query: string, limit?: number, offset?: number) => 
      `articles:search:${query}:${limit || 20}:${offset || 0}`
  },
  categories: {
    all: () => 'categories:all',
    byId: (id: string) => `categories:id:${id}`,
    withCounts: () => 'categories:with-counts'
  },
  media: {
    all: (limit?: number, offset?: number) => 
      `media:all:${limit || 20}:${offset || 0}`,
    byId: (id: string) => `media:id:${id}`
  },
  newsletter: {
    subscribers: () => 'newsletter:subscribers:all'
  }
}

// Cache TTL configurations (in milliseconds)
export const cacheTTL = {
  articles: 10 * 60 * 1000,    // 10 minutes
  categories: 30 * 60 * 1000,  // 30 minutes  
  media: 60 * 60 * 1000,       // 1 hour
  newsletter: 5 * 60 * 1000,   // 5 minutes
  search: 5 * 60 * 1000,       // 5 minutes
  static: 24 * 60 * 60 * 1000  // 24 hours
}

/**
 * Cache wrapper function with automatic key generation
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = cache.get<T>(key)
  if (cached) {
    console.log(`🎯 Cache hit: ${key}`)
    return cached
  }

  console.log(`🔄 Cache miss: ${key}`)
  
  // Fetch data
  const data = await fetcher()
  
  // Store in cache
  cache.set(key, data, ttl)
  
  return data
}

/**
 * Invalidate cache patterns for article updates
 */
export function invalidateArticleCache(articleId?: string, categoryId?: string): void {
  console.log('🧹 Invalidating article cache...')
  
  // Clear all article-related cache
  cache.deletePattern('articles:*')
  
  // Clear category cache if category changed
  if (categoryId) {
    cache.deletePattern('categories:*')
  }
  
  console.log('✅ Article cache invalidated')
}

/**
 * Invalidate cache patterns for category updates
 */
export function invalidateCategoryCache(): void {
  console.log('🧹 Invalidating category cache...')
  cache.deletePattern('categories:*')
  cache.deletePattern('articles:category:*')
  console.log('✅ Category cache invalidated')
}

/**
 * Invalidate cache patterns for media updates  
 */
export function invalidateMediaCache(): void {
  console.log('🧹 Invalidating media cache...')
  cache.deletePattern('media:*')
  console.log('✅ Media cache invalidated')
}

/**
 * Background cache cleanup
 */
setInterval(() => {
  const cleaned = cache.cleanExpired()
  if (cleaned > 0) {
    console.log(`🧽 Cleaned ${cleaned} expired cache entries`)
  }
}, 60 * 1000) // Clean every minute

/**
 * Cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size(),
    keys: [...cache['cache'].keys()].slice(0, 10), // Show first 10 keys
    totalKeys: cache.size()
  }
} 