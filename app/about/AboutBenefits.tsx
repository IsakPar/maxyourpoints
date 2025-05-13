"use client"

import * as React from "react"

export function AboutBenefits() {
  return (
    <section className="py-24 bg-emerald-50">
      <div className="container mx-auto px-6 md:px-16">
        {/* Top Section - Two Columns */}
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Left Column - Heading */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Unlock Your Travel Potential with MaxYourPoints.com: Your Ultimate Resource
            </h2>
          </div>

          {/* Right Column - Paragraph */}
          <div className="lg:w-1/2">
            <p className="text-lg text-gray-600 leading-relaxed">
              At MaxYourPoints.com, we empower travelers with unique insights and comprehensive guides tailored to maximize your rewards. Stay informed with our up-to-date information on airline points, credit cards, hotels, and travel deals. Join our community and transform the way you travel, ensuring every journey is rewarding.
            </p>
          </div>
        </div>

        {/* Bottom Section - Full Width Image */}
        <div className="w-full">
          <div className="aspect-[16/9] bg-gray-200 rounded-2xl flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
            <span className="text-gray-500 font-medium">Image Placeholder</span>
          </div>
        </div>
      </div>
    </section>
  )
} 