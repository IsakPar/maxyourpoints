"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { type BlogPost } from "@/lib/posts"

interface Subcategory {
  id: string
  name: string
  category_id: string
  slug: string
}

interface HotelBlogGridProps {
  posts: BlogPost[]
  initialFilter?: string | null
}

type FilterType = string | null

export default function HotelBlogGrid({ posts, initialFilter }: HotelBlogGridProps) {
  const [activeFilter, setActiveFilter] = React.useState<FilterType>(null)
  const [subcategories, setSubcategories] = React.useState<Subcategory[]>([])
  const [loading, setLoading] = React.useState(true)
  
  // Fetch subcategories for Hotels & Trip Reports category
  React.useEffect(() => {
    async function fetchSubcategories() {
      try {
        const response = await fetch('/api/admin/subcategories')
        const data = await response.json()
        
        // Filter subcategories for Hotels & Trip Reports category
        const hotelSubcategories = data.subcategories.filter(
          (sub: Subcategory) => sub.category_id === 'f4874537-f296-4b1f-a8c1-464a23909f62'
        )
        setSubcategories(hotelSubcategories)
      } catch (error) {
        console.error('Failed to fetch subcategories:', error)
        // Fallback to hardcoded subcategories if API fails
        setSubcategories([
          { id: 'fallback-1', name: 'Reviews', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'reviews' },
          { id: 'fallback-2', name: 'News', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'news' },
          { id: 'fallback-3', name: 'Deals', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'deals' },
          { id: 'fallback-4', name: 'Trip Reports', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'trip-reports' },
          { id: 'fallback-5', name: 'Guides', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'guides' }
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchSubcategories()
  }, [])
  
  // Set initial filter when component mounts or initialFilter changes
  React.useEffect(() => {
    if (initialFilter && subcategories.length > 0) {
      const matchingSubcategory = subcategories.find(sub => 
        sub.slug === initialFilter.toLowerCase() || 
        sub.name.toLowerCase() === initialFilter.toLowerCase()
      )
      if (matchingSubcategory) {
        setActiveFilter(matchingSubcategory.name)
      }
    }
  }, [initialFilter, subcategories])

  const filters = subcategories.map(sub => sub.name)

  const filteredPosts = React.useMemo(() => {
    if (!activeFilter) return posts
    return posts.filter(post => post.tag === activeFilter)
  }, [posts, activeFilter])

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(current => current === filter ? null : filter)
  }

  return (
    <div className="w-full py-12 bg-teal-50">
      {/* Toggle Menu */}
      <div id="toggle" className="flex justify-center mb-12">
        <div className="relative inline-flex rounded-2xl border border-stone-200 p-1.5 bg-white shadow-sm">
          {/* Sliding highlight for active button */}
          <div 
            className="absolute inset-0 pointer-events-none flex"
            style={{
              background: "linear-gradient(to right, #2DD4BF, #0EA5E9, #0284C7)",
              opacity: 0.1,
              borderRadius: "1rem"
            }}
          />
          {loading ? (
            <div className="px-6 py-2 text-sm text-stone-600">Loading subcategories...</div>
          ) : (
            filters.map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`relative px-6 py-2 mx-0.5 text-sm font-medium rounded-xl transition-all duration-200
                  ${activeFilter === filter 
                    ? 'bg-gradient-to-r from-teal-500 to-sky-500 text-white shadow-md' 
                    : 'text-stone-600 hover:text-sky-600 hover:bg-sky-100/90 hover:scale-105 hover:shadow-sm'
                  }`}
                style={{ zIndex: 1 }}
              >
                {filter}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {filteredPosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <article
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border hover:border-sky-100"
            >
            {/* Hero Image */}
            {(() => {
                             // Check all possible image field variations
               const imageUrl = post.image || 
                                (post as any).hero_image_url || 
                                (post as any).featuredImage
              
              return imageUrl && imageUrl !== '/placeholder.svg' ? (
                <div className="aspect-[16/9] bg-gray-200 relative">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                    quality={75}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={() => {
                      console.warn('Hotel grid image failed to load:', imageUrl)
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-teal-500 to-sky-500 flex items-center justify-center relative overflow-hidden">
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
              )
            })()}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-teal-50 text-stone-900 rounded-full text-sm font-medium">
                  {post.tag}
                </span>
                <span className="text-gray-500 text-sm">
                  {post.readTime}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-sky-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-stone-600 text-sm mb-4 line-clamp-2">
                {post.summary}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{post.author}</span>
                <span className="text-sm text-gray-500">{post.date}</span>
              </div>
            </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
} 