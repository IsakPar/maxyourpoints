import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar/Navbar"
import Footer from "@/app/components/Footer/Footer"
import { CookieConsentBanner } from "@/components/CookieConsentBanner"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Max Your Points",
  description: "Your guide to maximizing travel rewards and points",
  generator: 'v0.dev'
}

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
  "name": "MaxYourPoints",
  "url": "https://maxyourpoints.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://maxyourpoints.com/images/logo.png"
  },
  "sameAs": [
    "https://twitter.com/yourhandle",
    "https://linkedin.com/company/maxyourpoints"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
      </body>
    </html>
  )
}
