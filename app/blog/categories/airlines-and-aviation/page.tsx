"use client"

import * as React from "react"
import { posts } from "@/lib/posts"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import FilteredBlogGrid from "@/components/blog/FilteredBlogGrid"

export default function AirlinesPage() {
  // Filter posts for this category
  const airlinePosts = posts.filter(
    (post) => post.category === "Airlines & Aviation"
  )

  // Get featured posts (first 3)
  const featuredPosts = airlinePosts.slice(0, 3)

  // Get remaining posts for the grid
  const gridPosts = airlinePosts.slice(3)

  return (
    <main>
      <CategoryHero
        title="Explore Airlines & Aviation"
        subtitle="Discover loyalty programs, elite strategies, and the future of flight with our in-depth aviation coverage."
      />
      <FeaturedPosts posts={featuredPosts} />
      <FilteredBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 