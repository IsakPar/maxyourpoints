import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/components/Footer/Footer"
import { CookieConsentBanner } from "@/components/CookieConsentBanner"
import { AuthProvider } from "@/app/providers/auth-provider"
import Script from "next/script"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'react-hot-toast'
import { PERFORMANCE_HINTS, CRITICAL_CSS } from "@/lib/performance"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'),
  title: "Max Your Points - Travel Rewards & Points Optimization",
  description: "Discover how to maximize your travel rewards points and credit card benefits. Expert tips on flights, hotels, and travel hacking for savvy travelers.",
  keywords: "travel rewards, credit card points, airline miles, hotel points, travel hacking",
  authors: [{ name: "Max Your Points" }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#D1F1EB',
}

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://maxyourpoints.com",
  "name": "MaxYourPoints",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://maxyourpoints.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Max Your Points",
  "url": siteUrl,
  "logo": `${siteUrl}/max_your_points-logo.png`,
  "description": "Travel rewards and points optimization expert guidance.",
  "sameAs": [
    "https://twitter.com/maxyourpoints",
    "https://facebook.com/maxyourpoints"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Content Security Policy optimized for Safari compatibility
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:;
    style-src 'self' 'unsafe-inline' https: data:;
    img-src 'self' data: https: blob:;
    font-src 'self' https: data:;
    connect-src 'self' https: wss: data:;
    media-src 'self' https: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    worker-src 'self' blob:;
    child-src 'self' blob:;
  `.replace(/\s+/g, ' ').trim()

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/max_your_points_favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/max_your_points_favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/max_your_points_favicon.png" />
        <link rel="shortcut icon" href="/max_your_points_favicon.png" />
        
        {/* Inline critical CSS for instant render */}
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        
        {/* Preconnect for critical resources */}
        {PERFORMANCE_HINTS.PRECONNECT.map((url) => (
          <link key={url} rel="preconnect" href={url} crossOrigin="" />
        ))}
        
        {/* DNS prefetch for external domains */}
        {PERFORMANCE_HINTS.DNS_PREFETCH.map((url) => (
          <link key={url} rel="dns-prefetch" href={url} />
        ))}
        
        {/* Preload critical resources */}
        {PERFORMANCE_HINTS.PRELOAD.images.map((src) => (
          <link key={src} rel="preload" href={src} as="image" />
        ))}
        
        {/* Optimized font loading */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
          media="print" 
        />
        <Script
          id="font-loader"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var link = document.querySelector('link[media="print"]');
                if(link) link.media = 'all';
              })();
            `
          }}
        />
        
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
        <CookieConsentBanner />
        <SpeedInsights />
        <Analytics />
        <Toaster position="bottom-right" />
        
        
        {/* Minimal performance monitoring */}
        <Script
          id="performance-monitor"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Resource prioritization only
              const prioritizeResources = () => {
                document.querySelectorAll('img[data-priority="high"]').forEach(img => {
                  img.loading = 'eager';
                  img.fetchpriority = 'high';
                });
                document.querySelectorAll('img:not([data-priority="high"])').forEach(img => {
                  img.loading = 'lazy';
                  img.decoding = 'async';
                });
              };
              
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', prioritizeResources);
              } else {
                prioritizeResources();
              }
            `
          }}
        />
      </body>
    </html>
  )
}
