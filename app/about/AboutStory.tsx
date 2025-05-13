"use client"

import * as React from "react"

export default function AboutStory() {
  return (
    <section className="w-full max-w-screen-xl mx-auto px-6 md:px-16 py-24 bg-emerald-50">
      <div className="flex flex-col-reverse md:flex-row items-center gap-12">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-950 mb-4">
            Discover the story behind MaxYourPoints.com and our passion for travel.
          </h2>
          <p className="text-base text-stone-800 leading-relaxed">
            Founded by travel enthusiasts, MaxYourPoints.com is dedicated to helping you maximize your travel rewards. Our expert team combines years of experience in aviation and finance to provide you with valuable insights and tips.
          </p>
        </div>
        <div className="flex-1">
          {/* Replace with real image later */}
          <div className="w-full aspect-square bg-stone-300 rounded-md flex items-center justify-center text-stone-500">
            Image placeholder
          </div>
        </div>
      </div>
    </section>
  )
} 