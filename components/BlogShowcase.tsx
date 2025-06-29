"use client"

import React from 'react'
import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

interface CategoryTagProps {
  children: React.ReactNode
}

const CategoryTag = ({ children }: CategoryTagProps) => {
  return <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium group-hover:bg-teal-600 group-hover:text-white transition-colors duration-300">{children}</span>
}

interface BlogPostProps {
  post: {
    id: number
    title: string
    summary: string
    category: string
    readTime: string
    image: string
    slug: string
  }
}

const BlogPost = ({ post }: BlogPostProps) => {
  const { title, summary, category, readTime, image, slug } = post

  return (
    <Link href={slug} className="flex-1 flex flex-col md:flex-row justify-start items-start md:items-start gap-4 md:gap-8 p-4 rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 hover:scale-[1.02] hover:bg-[#D1F1EB] cursor-pointer bg-transparent group border border-transparent hover:border-teal-200">
      <div className="w-full md:w-2/5 h-48 md:h-64 flex-shrink-0 overflow-hidden rounded-xl relative">
        <Image 
          src={image || "/placeholder.svg"} 
          alt={title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
        />
      </div>
      <div className="w-full md:w-3/5 flex flex-col justify-start items-start gap-4 md:gap-6">
        <div className="w-full flex flex-col justify-start items-start gap-4">
          <div className="flex justify-start items-center gap-4">
            <CategoryTag>{category}</CategoryTag>
            <div className="text-stone-800 text-sm font-bold font-['Inter'] leading-tight group-hover:text-stone-900 transition-colors duration-300">{readTime}</div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <h3 className="w-full text-stone-950 text-xl md:text-2xl font-bold leading-relaxed md:leading-loose group-hover:text-stone-900 transition-colors duration-300">
              {title}
            </h3>
            <p className="w-full text-stone-950 text-base font-bold font-['Inter'] leading-normal line-clamp-3 group-hover:text-stone-800 transition-colors duration-300">
              {summary}
            </p>
          </div>
        </div>
        <div className="rounded-xl inline-flex justify-center items-center gap-2 text-stone-950 group-hover:text-stone-800 transition-colors duration-300 min-h-[44px] min-w-[44px] p-2">
          <div className="inline-flex items-center gap-2 group/link">
            <span className="text-base font-bold font-['Inter'] leading-normal">
              Read more<span className="sr-only"> about {title}</span>
            </span>
            <ChevronRight size={24} className="transition-transform duration-300 group-hover/link:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}

interface OutlinedGradientButtonProps {
  href?: string
  children: React.ReactNode
}

const OutlinedGradientButton = ({ href, children }: OutlinedGradientButtonProps) => {
  const style = {
    background: "white",
    border: "2px solid transparent",
    backgroundImage: "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    transition: "all 0.5s ease",
  }

  const buttonContent = (
    <button
      className="px-5 py-2.5 text-base font-medium font-['Inter'] rounded-xl text-stone-950 hover:text-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
      style={style}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #EA580C, #EAB308, #2DD4BF)"
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundImage = "linear-gradient(white, white), linear-gradient(to right, #2DD4BF, #EAB308, #EA580C)"
      }}
    >
      {children}
    </button>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}

interface BlogShowcaseProps {
  title?: string
  subtitle?: string
  posts?: Array<{
    id: number
    title: string
    summary: string
    category: string
    readTime: string
    image: string
    slug: string
  }>
  className?: string
}

const BlogShowcase: React.FC<BlogShowcaseProps> = ({
  title = "Explore Our Latest Insights",
  subtitle = "Discover tips and tricks for savvy travelers.",
  posts = [],
  className = "",
}) => {
  // If no posts are provided, show empty state
  if (!posts || posts.length === 0) {
    return (
      <section className={`py-16 md:py-24 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-950 mb-4">
              {title}
            </h2>
            <p className="text-xl text-stone-700 max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Articles Yet</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                We're working on bringing you amazing travel content. Check back soon for the latest insights and tips!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild>
                <Link href="/admin">
                  <span>Add Your First Article</span>
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <span>Explore Blog Categories</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-950 mb-4">
            {title}
          </h2>
          <p className="text-xl text-stone-700 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="flex flex-col gap-8 mb-16">
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
        
        <div className="text-center">
          <OutlinedGradientButton href="/blog">
            View All Articles
          </OutlinedGradientButton>
        </div>
      </div>
    </section>
  )
}

export default BlogShowcase 