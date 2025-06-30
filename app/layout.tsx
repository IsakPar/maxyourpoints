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
import { Toaster as SonnerToaster } from 'sonner'
import { PERFORMANCE_HINTS, CRITICAL_CSS } from "@/lib/performance"
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider } from '@/components/ui/toast-provider'
import ArticleTracker from '@/components/ArticleTracker'

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'),
  title: {
    default: "Max Your Points – Travel Smarter, Earn More",
    template: "%s | Max Your Points"
  },
  description: "Expert strategies on travel points, flight and hotel reviews, and maximizing rewards programs. Learn how to travel better for less with our comprehensive guides.",
  keywords: [
    "travel rewards",
    "credit card points",
    "airline miles",
    "hotel loyalty programs", 
    "travel hacking",
    "points and miles",
    "travel deals",
    "reward credit cards",
    "frequent flyer programs",
    "hotel points"
  ],
  authors: [{ name: "Max Your Points Team" }],
  creator: "Max Your Points",
  publisher: "Max Your Points",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com',
    siteName: 'Max Your Points',
    title: "Max Your Points – Travel Smarter, Earn More",
    description: "Expert strategies on travel points, flight and hotel reviews, and maximizing rewards programs. Learn how to travel better for less.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'}/travel-rewards-cards.png`,
        width: 1200,
        height: 630,
        alt: 'Max Your Points - Travel Rewards and Points Optimization',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@maxyourpoints',
    creator: '@maxyourpoints',
    title: "Max Your Points – Travel Smarter, Earn More",
    description: "Expert strategies on travel points, flight and hotel reviews, and maximizing rewards programs.",
    images: [`${process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'}/travel-rewards-cards.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com',
    types: {
      'application/rss+xml': [
        { url: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'}/feed.xml`, title: 'Max Your Points RSS Feed' }
      ]
    }
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      'msvalidate.01': process.env.BING_VERIFICATION || '',
    },
  },
  category: 'Travel',
  classification: 'Travel Rewards and Points Optimization',
  other: {
    'pinterest-rich-pins': 'true',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Max Your Points',
    'application-name': 'Max Your Points',
    'msapplication-TileColor': '#10B981',
    'msapplication-config': '/browserconfig.xml',
    'theme-color': '#10B981',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10B981' },
    { media: '(prefers-color-scheme: dark)', color: '#10B981' }
  ],
}

const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://maxyourpoints.com'

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": siteUrl,
  "name": "Max Your Points",
  "alternateName": "MaxYourPoints",
  "description": "Expert travel rewards and points optimization strategies. Learn how to maximize credit card points, airline miles, and hotel rewards for better travel experiences.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${siteUrl}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Max Your Points",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/max_your_points-logo.png`,
      "width": 400,
      "height": 150
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": siteUrl
  }
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Max Your Points",
  "url": siteUrl,
  "logo": `${siteUrl}/max_your_points-logo.png`,
  "description": "Travel rewards and points optimization expert guidance. Maximize your credit card points, airline miles, and hotel rewards.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "url": `${siteUrl}/contact`
  },
  "sameAs": [
    "https://twitter.com/maxyourpoints",
    "https://facebook.com/maxyourpoints",
    "https://linkedin.com/company/maxyourpoints"
  ],
  "knowsAbout": [
    "Travel Rewards",
    "Credit Card Points",
    "Airline Miles",
    "Hotel Loyalty Programs",
    "Travel Hacking",
    "Points and Miles",
    "Travel Deals"
  ]
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": siteUrl
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Enhanced Content Security Policy
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;
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
    manifest-src 'self';
  `.replace(/\s+/g, ' ').trim()

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
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
        <link rel="icon" href="/max_your_points_favicon.png" sizes="any" />
        <link rel="icon" href="/max_your_points_favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/max_your_points_favicon.png" />
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
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
                 <ThemeProvider
           attribute="class"
           defaultTheme="light"
           enableSystem={false}
           disableTransitionOnChange
         >
           <AuthProvider>
             <ToastProvider>
               <div className="flex flex-col min-h-screen">
                 <Navbar />
                 <main className="flex-1 pt-16">
                   {children}
                 </main>
                 <Footer />
               </div>
               <ArticleTracker />
               <CookieConsentBanner />
               <Toaster position="bottom-right" />
               <SonnerToaster richColors position="top-right" />
             </ToastProvider>
           </AuthProvider>
         </ThemeProvider>
      </body>
    </html>
  )
}
