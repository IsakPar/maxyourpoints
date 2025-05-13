"use client"

import * as React from "react"
import { posts, type BlogPost } from "@/lib/posts"
import CTASection from "../../components/CTASection/CTASection"
import Footer from "../../components/Footer/Footer"

export default function AirlineAndAviationPage() {
  // Filter posts for airline category
  const airlinePosts = posts.filter((post: BlogPost) => post.category === "Airline")

  // Get featured posts (first 2)
  const featuredPosts = airlinePosts.slice(0, 2)

  // Get remaining posts for the grid
  const gridPosts = airlinePosts.slice(2, 5)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#D1F1EB] py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-stone-950">
                Unlock the World of Airline Rewards
              </h1>
            </div>
            <div className="flex-1">
              <p className="text-base text-stone-800 leading-relaxed">
                Discover how to maximize your travel experiences with our comprehensive guides on airline rewards. From tips on earning points to navigating loyalty programs, we've got you covered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Unlock the World of Airline Rewards
              </h1>
            </div>
            <div className="flex-1">
              <p className="text-lg text-stone-700">
                Discover insider tips and strategies for maximizing your airline rewards. From earning and redeeming miles to navigating loyalty programs, we'll help you make the most of your travel points and elevate your flying experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="bg-white py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          {featuredPosts.map((post: BlogPost, index: number) => (
            <div 
              key={post.id}
              className={`flex flex-col ${index === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center mb-24 last:mb-0`}
            >
              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <span className="px-3 py-1 bg-[#D1F1EB] text-stone-900 rounded-full text-sm font-medium inline-block">
                  {post.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                  {post.title}
                </h2>
                <p className="text-lg text-stone-700">
                  {post.summary}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm text-gray-500">AV</span>
                    </div>
                    <span className="text-stone-700">{post.author}</span>
                  </div>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-500">{post.date}</span>
                  <span className="text-stone-500">•</span>
                  <span className="text-stone-500">{post.readTime}</span>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Featured Image</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Blog Card Grid */}
      <section className="py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              More Airline Insights
            </h2>
            <p className="text-lg text-stone-700">
              Explore our latest articles on airline rewards and travel tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post: BlogPost) => (
              <article 
                key={post.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Image Placeholder */}
                <div className="aspect-[16/9] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Image Placeholder</span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-[#D1F1EB] text-stone-900 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h2>
                  <div className="flex items-center justify-between mt-4">
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
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
} 