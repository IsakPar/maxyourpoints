import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Max Your Points – Travel Smarter, Earn More",
  description: "Expert strategies on travel points, flight and hotel reviews, and maximizing rewards programs. Learn how to travel better for less.",
  openGraph: {
    title: "Max Your Points – Travel Smarter, Earn More",
    description: "Expert strategies on travel points, flight and hotel reviews, and maximizing rewards programs. Learn how to travel better for less.",
    images: [
      {
        url: '/travel-rewards-cards.png',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.vercel.app',
  },
} 