"use client"

import * as React from "react"
import { BlogPost } from "@/lib/posts"
import BlogGrid from "@/components/BlogGrid/BlogGrid"

interface FilteredBlogGridProps {
  posts: BlogPost[]
}

export default function FilteredBlogGrid({ posts }: FilteredBlogGridProps) {
  return (
    <section className="py-24 bg-teal-50">
      <div className="max-w-screen-xl mx-auto">
        <div className="text-center mb-12 px-6 md:px-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-950">
            More Aviation Insights
          </h2>
        </div>
        <div className="px-6 md:px-16">
          <BlogGrid posts={posts} />
        </div>
      </div>
    </section>
  )
} 