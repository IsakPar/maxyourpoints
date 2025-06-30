'use client'

import { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

interface ArticleTrackerProps {
  articleSlug?: string
  pageTitle?: string
  category?: string
}

// Performance metrics interface
interface PerformanceMetrics {
  lcp?: number
  fid?: number
  cls?: number
  fcp?: number
  ttfb?: number
  domLoadTime?: number
  windowLoadTime?: number
  navigationType?: string
  connectionType?: string
  deviceMemory?: number
  hardwareConcurrency?: number
  viewportWidth?: number
  viewportHeight?: number
  timeOnPage?: number
  scrollDepth?: number
  bounceRate?: boolean
}

// Error tracking interface
interface ErrorLog {
  errorType: string
  errorMessage: string
  errorStack?: string
}

export default function ArticleTracker({ 
  articleSlug, 
  pageTitle = '',
  category = ''
}: ArticleTrackerProps) {
  const sessionIdRef = useRef<string>('')
  const startTimeRef = useRef<number>(Date.now())
  const maxScrollRef = useRef<number>(0)
  const hasInteractedRef = useRef<boolean>(false)
  const performanceDataSentRef = useRef<boolean>(false)

  // Generate or retrieve session ID
  useEffect(() => {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      const newSessionId = uuidv4()
      sessionStorage.setItem('analytics_session_id', newSessionId)
      sessionIdRef.current = newSessionId
    } else {
      sessionIdRef.current = sessionId
    }
  }, [])

  // Track page view
  useEffect(() => {
    const trackPageView = async () => {
      const currentPath = window.location.pathname
      
      try {
        // Collect device and browser info
        const userAgent = navigator.userAgent
        const deviceInfo = {
          device_type: /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'desktop',
          browser: getBrowserName(userAgent),
          os: getOSName(userAgent)
        }

        // Track page view
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'page_view',
            data: {
              page_path: currentPath,
              page_title: pageTitle || document.title,
              session_id: sessionIdRef.current,
              referrer: document.referrer,
              article_slug: articleSlug,
              category,
              timestamp: new Date().toISOString(),
              ...deviceInfo
            }
          })
        })
      } catch (error) {
        console.error('Failed to track page view:', error)
      }
    }

    trackPageView()
  }, [articleSlug, pageTitle, category])

  // Track Core Web Vitals and performance metrics
  useEffect(() => {
    const trackPerformanceMetrics = () => {
      // Wait for page load to get accurate metrics
      const collectMetrics = () => {
        if (performanceDataSentRef.current) return

        const metrics: PerformanceMetrics = {
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          timeOnPage: (Date.now() - startTimeRef.current) / 1000,
          scrollDepth: maxScrollRef.current,
          bounceRate: !hasInteractedRef.current
        }

                 // Collect navigation timing
         if ('performance' in window && 'getEntriesByType' in performance) {
           const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
           if (navigation) {
             metrics.domLoadTime = navigation.domContentLoadedEventEnd - navigation.fetchStart
             metrics.windowLoadTime = navigation.loadEventEnd - navigation.fetchStart
             metrics.ttfb = navigation.responseStart - navigation.requestStart
             metrics.navigationType = (navigation as any).type || 'unknown'
           }
         }

        // Collect device info
        if ('deviceMemory' in navigator) {
          metrics.deviceMemory = (navigator as any).deviceMemory
        }
        if ('hardwareConcurrency' in navigator) {
          metrics.hardwareConcurrency = navigator.hardwareConcurrency
        }

        // Collect connection info
        if ('connection' in navigator) {
          const connection = (navigator as any).connection
          metrics.connectionType = connection?.effectiveType || 'unknown'
        }

        // Track Core Web Vitals using the web-vitals library approach
        trackCoreWebVitals(metrics)
        
        performanceDataSentRef.current = true
      }

      // Collect metrics after page load or after 5 seconds (whichever comes first)
      if (document.readyState === 'complete') {
        setTimeout(collectMetrics, 1000) // Small delay to ensure everything is loaded
      } else {
        window.addEventListener('load', () => {
          setTimeout(collectMetrics, 1000)
        })
      }

      // Also collect metrics before page unload
      const handleUnload = () => {
        if (!performanceDataSentRef.current) {
          collectMetrics()
        }
      }

      window.addEventListener('beforeunload', handleUnload)
      return () => window.removeEventListener('beforeunload', handleUnload)
    }

    trackPerformanceMetrics()
  }, [])

  // Track Core Web Vitals
  const trackCoreWebVitals = async (baseMetrics: PerformanceMetrics) => {
    const metrics = { ...baseMetrics }

    try {
      // Track LCP (Largest Contentful Paint)
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          if (lastEntry) {
            metrics.lcp = lastEntry.startTime
          }
        })
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })

        // Track FID (First Input Delay)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.name === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime
            }
          })
        })
        fidObserver.observe({ type: 'first-input', buffered: true })

        // Track CLS (Cumulative Layout Shift)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          metrics.cls = clsValue
        })
        clsObserver.observe({ type: 'layout-shift', buffered: true })

        // Track FCP (First Contentful Paint)
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime
            }
          })
        })
        fcpObserver.observe({ type: 'paint', buffered: true })

        // Send metrics after a delay to collect all data
        setTimeout(async () => {
          await sendPerformanceData(metrics)
          
          // Cleanup observers
          lcpObserver.disconnect()
          fidObserver.disconnect()
          clsObserver.disconnect()
          fcpObserver.disconnect()
        }, 3000)
      } else {
        // Fallback for browsers without PerformanceObserver
        setTimeout(async () => {
          await sendPerformanceData(metrics)
        }, 2000)
      }
    } catch (error) {
      console.error('Failed to track Core Web Vitals:', error)
      // Still send basic metrics even if Core Web Vitals fail
      await sendPerformanceData(metrics)
    }
  }

  // Send performance data to API
  const sendPerformanceData = async (metrics: PerformanceMetrics) => {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'performance',
          data: {
            session_id: sessionIdRef.current,
            page_path: window.location.pathname,
            ...metrics,
            timestamp: new Date().toISOString()
          }
        })
      })
    } catch (error) {
      console.error('Failed to send performance data:', error)
    }
  }

  // Track scroll depth
  useEffect(() => {
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
      
      const scrollPercent = Math.round(((scrollTop + windowHeight) / docHeight) * 100)
      maxScrollRef.current = Math.max(maxScrollRef.current, Math.min(scrollPercent, 100))
    }

    const handleScroll = () => {
      trackScrollDepth()
      hasInteractedRef.current = true
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track user interactions
  useEffect(() => {
    const trackInteraction = () => {
      hasInteractedRef.current = true
    }

    const events = ['click', 'keydown', 'touchstart', 'mousemove']
    events.forEach(event => {
      document.addEventListener(event, trackInteraction, { once: true, passive: true })
    })

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, trackInteraction)
      })
    }
  }, [])

  // Track JavaScript errors
  useEffect(() => {
    const trackError = async (errorLog: ErrorLog) => {
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'error',
            data: {
              session_id: sessionIdRef.current,
              page_path: window.location.pathname,
              ...errorLog,
              timestamp: new Date().toISOString()
            }
          })
        })
      } catch (error) {
        console.error('Failed to track error:', error)
      }
    }

    const handleError = (event: ErrorEvent) => {
      trackError({
        errorType: 'javascript',
        errorMessage: event.message,
        errorStack: event.error?.stack
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError({
        errorType: 'promise',
        errorMessage: event.reason?.toString() || 'Unhandled promise rejection'
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null // This component doesn't render anything
}

// Utility functions
function getBrowserName(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Unknown'
}

function getOSName(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
} 