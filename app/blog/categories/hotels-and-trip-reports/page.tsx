"use client"

import * as React from "react"
import { posts } from "@/lib/posts"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import FilteredBlogGrid from "@/components/blog/FilteredBlogGrid"

export default function HotelsPage() {
  // Filter posts for this category
  const hotelPosts = posts.filter(
    (post) => post.category === "Hotels & Trip Reports"
  )

  // Get featured posts (first 3)
  const featuredPosts = hotelPosts.slice(0, 3)

  // Get remaining posts for the grid
  const gridPosts = hotelPosts.slice(3)

  return (
    <main>
      <CategoryHero
        title="Hotels & Trip Reports"
        subtitle="Luxury, boutique, and budget — plus firsthand travel stories from around the world."
        imageSrc="/images/iberostar-Coral-Beach.jpeg"
        imageAlt="IberoStar Coral Beach"
      />
      <FeaturedPosts posts={featuredPosts} />
      <FilteredBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 