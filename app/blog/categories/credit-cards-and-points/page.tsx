"use client"

import * as React from "react"
import { posts } from "@/lib/posts"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import CreditCardBlogGrid from "@/components/blog/CreditCardBlogGrid"

export default function CreditCardsPage() {
  // Filter posts for this category
  const creditCardPosts = posts.filter(
    (post) => post.category === "Credit Cards & Points"
  )

  // Get featured posts (first 3)
  const featuredPosts = creditCardPosts.slice(0, 3)

  // Get remaining posts for the grid
  const gridPosts = creditCardPosts.slice(3)

  return (
    <main>
      <CategoryHero
        title="Master Your Credit Card Rewards"
        subtitle="Discover how to maximize your credit card rewards and points, from choosing the right cards to strategic spending and redemption strategies."
        imageSrc="/images/cardmapr-nl-EjAkfNQb46k-unsplash.jpg"
        imageAlt="a series of different AMEX cards on a table"
      />
      <FeaturedPosts posts={featuredPosts} />
      <CreditCardBlogGrid posts={gridPosts} />
      <div className="bg-teal-50">
        <CTASection />
      </div>
    </main>
  )
} 