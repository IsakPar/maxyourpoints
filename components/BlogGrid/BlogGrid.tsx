"use client"

import * as React from "react"
import { type BlogPost } from "@/lib/posts"

interface BlogGridProps {
  posts: BlogPost[]
}

type FilterType = "Reviews" | "News" | "Guides" | "Trip Reports" | null

export default function BlogGrid({ posts }: BlogGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>(null)

  const filters: FilterType[] = ["Reviews", "News", "Guides", "Trip Reports"]

  const filteredPosts = React.useMemo(() => {
    if (!activeFilter) return posts
    return posts.filter(post => post.tag === activeFilter)
  }, [posts, activeFilter])

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(current => current === filter ? null : filter)
  }

  return (
    <div className="w-full bg-[#D1F1EB] py-12">
      {/* Toggle Menu */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex rounded-lg border border-stone-200 p-1 bg-white shadow-sm">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                ${activeFilter === filter 
                  ? 'bg-emerald-600 text-white' 
                  : 'text-stone-600 hover:bg-stone-100'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {filteredPosts.map((post) => (
          <article 
            key={post.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Image Placeholder */}
            <div className="aspect-[16/9] bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
              <div className="w-48 h-32 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg transform rotate-3">
                <div className="p-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-6 h-6 rounded-full bg-white/20" />
                    <div className="w-10 h-5 rounded bg-white/20" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-28 h-3 rounded bg-white/20" />
                    <div className="w-20 h-3 rounded bg-white/20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-[#D1F1EB] text-stone-900 rounded-full text-sm font-medium">
                  {post.tag}
                </span>
                <span className="text-gray-500 text-sm">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-emerald-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-500">AV</span>
                  </div>
                  <span className="text-sm text-gray-600">{post.author}</span>
                </div>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 