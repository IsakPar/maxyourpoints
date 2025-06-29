/**
 * Performance optimization utilities for Lighthouse scores
 */

// Critical resource hints for faster loading
export const PERFORMANCE_HINTS = {
  // DNS prefetch for external domains
  DNS_PREFETCH: [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com',
    '//vercel.live',
    '//vitals.vercel-insights.com'
  ],
  
  // Preconnect for critical resources
  PRECONNECT: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ],
  
  // Preload critical assets
  PRELOAD: {
    fonts: [
      {
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        as: 'style'
      }
    ],
    images: [
      '/aircraft-landing.jpg',
      '/max_your_points-logo.svg'
    ]
  }
}

// Image optimization settings
export const IMAGE_OPTIMIZATION = {
  QUALITY: {
    hero: 85,
    thumbnail: 75,
    content: 80,
    background: 70
  },
  
  FORMATS: ['image/avif', 'image/webp', 'image/jpeg'],
  
  SIZES: {
    mobile: '(max-width: 768px) 100vw',
    tablet: '(max-width: 1024px) 80vw',
    desktop: '60vw'
  },
  
  DEVICE_SIZES: [640, 750, 828, 1080, 1200, 1920],
  IMAGE_SIZES: [16, 32, 48, 64, 96, 128, 256, 384]
}

// Core Web Vitals thresholds
export const CORE_WEB_VITALS = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100,  // First Input Delay (ms)
  CLS: 0.1,  // Cumulative Layout Shift
  FCP: 1800  // First Contentful Paint (ms)
}

// Performance monitoring
export function measurePerformance() {
  if (typeof window === 'undefined') return

  // Measure Core Web Vitals
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('🎯 LCP:', entry.startTime, 'ms')
      }
      if (entry.entryType === 'first-input') {
        const fid = (entry as any).processingStart - entry.startTime
        console.log('🎯 FID:', fid, 'ms')
      }
      if (entry.entryType === 'layout-shift') {
        if (!(entry as any).hadRecentInput) {
          console.log('🎯 CLS shift:', (entry as any).value)
        }
      }
    }
  })

  try {
    observer.observe({ 
      entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
    })
  } catch (e) {
    console.log('Performance Observer not supported')
  }
}

// Lazy loading intersection observer
export function createLazyLoadObserver(callback: (entries: IntersectionObserverEntry[]) => void) {
  if (typeof window === 'undefined') return null

  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1
  })
}

// Resource prioritization
export function prioritizeResources() {
  if (typeof window === 'undefined') return

  // Prioritize critical resources
  const criticalImages = document.querySelectorAll('img[data-priority="high"]')
  criticalImages.forEach((img) => {
    img.setAttribute('loading', 'eager')
    img.setAttribute('fetchpriority', 'high')
  })

  // Defer non-critical resources
  const nonCriticalImages = document.querySelectorAll('img:not([data-priority="high"])')
  nonCriticalImages.forEach((img) => {
    img.setAttribute('loading', 'lazy')
    img.setAttribute('decoding', 'async')
  })
}

// Bundle optimization hints
export const BUNDLE_OPTIMIZATION = {
  // Code splitting points for dynamic imports
  SPLIT_POINTS: [
    'admin',
    'editor', 
    'analytics'
  ],
  
  // Performance recommendations
  RECOMMENDATIONS: {
    // Use dynamic imports for large components
    dynamicImports: true,
    // Preload critical resources
    preloadCritical: true,
    // Lazy load images
    lazyLoadImages: true
  }
}

// Critical CSS extraction
export const CRITICAL_CSS = `
  /* Critical above-the-fold styles */
  html, body { margin: 0; padding: 0; font-family: Inter, sans-serif; }
  .hero-section { background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%); }
  .navbar { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  .container { max-width: 1280px; margin: 0 auto; padding: 0 1rem; }
`

// Service Worker for caching
export const SW_CONFIG = {
  strategies: {
    images: 'CacheFirst',
    api: 'NetworkFirst',
    static: 'StaleWhileRevalidate'
  },
  
  cacheNames: {
    static: 'max-your-points-static-v1',
    images: 'max-your-points-images-v1',
    api: 'max-your-points-api-v1'
  }
}

// Performance budget
export const PERFORMANCE_BUDGET = {
  javascript: 250, // KB
  css: 100,        // KB
  images: 1000,    // KB
  fonts: 100,      // KB
  total: 1500      // KB
} 