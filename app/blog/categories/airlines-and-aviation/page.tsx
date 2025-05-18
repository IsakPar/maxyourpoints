"use client"

import * as React from "react"
import { posts } from "@/lib/posts"
import CTASection from "@/components/CTASection/CTASection"
import CategoryHero from "@/components/blog/CategoryHero"
import FeaturedPosts from "@/components/blog/FeaturedPosts"
import AirlineBlogGrid from "@/components/blog/AirlineBlogGrid"
import AirlineSubcategoryToggle from "@/components/blog/AirlineSubcategoryToggle"

export default function AirlinesPage() {
  const [activeSubcategory, setActiveSubcategory] = React.useState<string | null>(null)

  // Filter posts for this category
  const airlinePosts = posts.filter(
    (post) => post.category === "Airlines & Aviation"
  )

  // Filter by subcategory if one is selected
  const filteredPosts = React.useMemo(() => {
    if (!activeSubcategory) return airlinePosts
    return airlinePosts.filter(post => post.tag.toLowerCase() === activeSubcategory)
  }, [airlinePosts, activeSubcategory])

  // Get featured posts (first 3)
  const featuredPosts = filteredPosts.slice(0, 3)

  // Get remaining posts for the grid
  const gridPosts = filteredPosts.slice(3)

  return (
    <main>
      <div className="bg-[#D1F1EB]">
        <CategoryHero
          title="Explore Airlines & Aviation"
          subtitle="Discover loyalty programs, elite strategies, and the future of flight with our in-depth aviation coverage."
        />
      </div>
      <div className="bg-[#D1F1EB] py-12">
        {/* <AirlineSubcategoryToggle 
          activeSubcategory={activeSubcategory}
          onSubcategoryChange={setActiveSubcategory}
        /> */}
        <FeaturedPosts posts={featuredPosts} />
        <div className="my-8 rounded-2xl">
          <CTASection />
        </div>
        <AirlineBlogGrid posts={gridPosts} />
      </div>
    </main>
  )
} 