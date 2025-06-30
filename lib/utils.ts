import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the proper site URL for the current environment
 * This ensures consistent URL resolution across all parts of the application
 */
export function getSiteUrl(): string {
  // For Vercel deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Use NEXT_PUBLIC_SITE_URL if set, but override incorrect domains
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (siteUrl && !siteUrl.includes('maxyourpoints.com')) {
    return siteUrl
  }
  
  // Production fallback - use the actual production URL
  return 'https://maxyourpoints-43is.vercel.app'
}

/**
 * Get base URL for API requests (client vs server side)
 */
export function getApiBaseUrl(): string {
  // Client-side: always use relative URLs (same origin)
  if (typeof window !== 'undefined') {
    return ''
  }
  
  // Server-side: use relative URLs for development, absolute for production
  if (process.env.NODE_ENV !== 'production') {
    return ''
  }
  
  return getSiteUrl()
}
