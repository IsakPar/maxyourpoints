"use client"

import * as React from "react"
import { posts } from "@/lib/posts"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import TravelHackBlogGrid from "@/components/blog/TravelHackBlogGrid"
import CTASection from "@/components/CTASection/CTASection"

export default function TravelHacksPage() {
  // Filter posts for this category
  const travelHackPosts = posts.filter(
    (post) => post.category === "Travel Hacks & Deals"
  )

  // Get featured posts (first 3)
  const featuredPosts = travelHackPosts.slice(0, 3)

  // Get remaining posts for the grid
  const gridPosts = travelHackPosts.slice(3)

  return (
    <div className="min-h-screen bg-white">
      <CategoryHero
        title="Travel Hacks & Deals"
        subtitle="Insider tips and deals to maximize your travel experience"
        imageSrc="/images/marius-kriz-DH5eyHWPT50-unsplash.jpg"
        imageAlt="Palm tree and beach at Koh Samui"
      />
      <FeaturedPosts posts={featuredPosts} />
      <TravelHackBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </div>
  )
} 