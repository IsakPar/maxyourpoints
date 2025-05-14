"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { BlogPost } from "@/lib/posts"

interface FeaturedPostsProps {
  posts: BlogPost[]
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <section className="py-24 bg-teal-50">
      <div className="max-w-screen-xl mx-auto px-6 md:px-16">
        {posts.map((post, index) => (
          <div key={post.id} className="mb-24 last:mb-0">
            <div className="bg-teal-50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-teal-200">
              <div className={`flex flex-col lg:flex-row ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}>
                {/* Image Column */}
                <div className="flex-1">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                {/* Content Column */}
                <div className="flex-1 p-8">
                  <div className="space-y-6">
                    <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-stone-800">
                      {post.tag}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-stone-950">
                      {post.title}
                    </h2>
                    <p className="text-base text-stone-800 leading-relaxed">
                      {post.summary}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm" />
                        <div>
                          <div className="text-sm font-medium text-stone-900">
                            {post.author}
                          </div>
                          <div className="text-sm text-stone-600">
                            {post.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-stone-600">
                        {post.readTime} min read
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-stone-900 font-medium hover:text-stone-700 transition-colors"
                    >
                      Read More
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 