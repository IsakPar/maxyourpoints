"use client"

import * as React from "react"
import { posts } from "@/lib/posts"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import FilteredBlogGrid from "@/components/blog/FilteredBlogGrid"

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
    <main>
      <CategoryHero
        title="Travel Hacks & Deals"
        subtitle="Get the most out of your trips with insider tips, tricks, and timely deals you don't want to miss."
        imageSrc="/images/marius-kriz-DH5eyHWPT50-unsplash.jpg"
        imageAlt="Tropical island with sign here is koh samui"
      />
      <FeaturedPosts posts={featuredPosts} />
      <FilteredBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 