// app/airline-aviation/page.tsx

"use client"

import React, { useState } from 'react'

export default function AirlinesAviationPage() {
  const [activeSection, setActiveSection] = useState('reviews')

  const sections = {
    reviews: {
      title: "Airline Reviews",
      content: "Comprehensive reviews of major airlines, their services, and what to expect when flying with them."
    },
    news: {
      title: "Aviation News",
      content: "Latest updates, announcements, and developments in the aviation industry."
    },
    deals: {
      title: "Flight Deals",
      content: "Find the best flight deals, promotions, and special offers from airlines around the world."
    },
    guides: {
      title: "Aviation Guides",
      content: "Expert guides on airline loyalty programs, booking strategies, and maximizing your travel experience."
    }
  }

  return (
    <main className="min-h-screen pt-20 px-4 md:px-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-950 mb-8">Airlines & Aviation</h1>
        
        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {Object.keys(sections).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === section
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-stone-950 hover:bg-orange-50'
              }`}
            >
              {sections[section].title}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-stone-950 mb-4">
            {sections[activeSection].title}
          </h2>
          <p className="text-stone-600">
            {sections[activeSection].content}
          </p>
          
          {/* Placeholder Content */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-stone-50 rounded-lg p-6">
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-stone-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-stone-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}