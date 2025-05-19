"use client"

import * as React from "react"
import { posts, type BlogPost } from "@/lib/posts"
import CTASection from "@/components/CTASection/CTASection"
import Image from "next/image"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import AirlineBlogGrid from "@/components/blog/AirlineBlogGrid"

export default function AirlineAndAviationPage() {
  // Filter posts for airline category
  const airlinePosts = posts.filter((post: BlogPost) => post.category === "Airlines & Aviation")

  // Get featured posts (first 3)
  const featuredPosts = airlinePosts.slice(0, 3)

  // Get remaining posts for the grid
  const gridPosts = airlinePosts.slice(3)

  return (
    <main>
      <CategoryHero
        title="Airlines & Aviation"
        subtitle="Discover loyalty programs, elite strategies, and the future of flight with our in-depth aviation coverage."
        imageSrc="/images/frugal-flyer-37J8TymWXVA-unsplash.jpg"
        imageAlt="Business class seat before takeoff"
      />
      <FeaturedPosts posts={featuredPosts} />
      <AirlineBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 