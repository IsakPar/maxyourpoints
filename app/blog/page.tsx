"use client"

import * as React from "react"
import { posts, type BlogPost } from "@/lib/posts"
import CTASection from "../components/CTASection/CTASection"
import Footer from "@/components/Footer/Footer"

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState("View All")

  const categories = ["View All", "Airline Tips", "Credit Card", "Hotel Reviews", "Travel Hacks"]

  const filteredPosts = activeCategory === "View All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory)

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#D1F1EB] py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left Column - H1 Heading */}
            <div className="flex-1 w-full">
              <h1 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
                Unlock Your Travel Potential with Expert Insights
              </h1>
            </div>
            {/* Right Column - Text Content */}
            <div className="flex-1 space-y-6">
              <p className="text-lg text-stone-700">
                Welcome to our blog, where we empower travelers with valuable tips and insights across various categories. Discover the latest in airline news, credit card rewards, hotel reviews, and travel hacks to maximize your adventures.
              </p>
            </div>
          </div>
          {/* Full-width image below columns */}
          <div className="w-full mt-12">
            <div className="aspect-[16/5] bg-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src="/world-flight-paths.png"
                alt="World flight paths illustration"
                className="object-cover w-full h-full" style={{ objectPosition: 'center 60%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Section with Filters */}
      <section className="bg-white py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
              Explore Our Travel Insights
            </h2>
            <p className="text-lg text-stone-700">
              Discover tips, tricks, and stories from our adventures.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#D1F1EB] text-stone-900"
                    : "bg-gray-50 text-stone-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post: BlogPost) => (
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

      {/* Additional Blog Posts Section */}
      <section className="bg-white py-24">
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: BlogPost) => (
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
                  <p className="text-gray-600 mb-4">
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
      </section>

      {/* Footer */}
      <Footer />
    </main>
  )
}
