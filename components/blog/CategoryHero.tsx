"use client"

import * as React from "react"

interface CategoryHeroProps {
  title: string
  subtitle: string
}

export default function CategoryHero({ title, subtitle }: CategoryHeroProps) {
  return (
    <section className="bg-teal-50">
      {/* Fullscreen Image */}
      <div className="w-full h-[60vh] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-56 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl transform rotate-3">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-white/20" />
                <div className="w-16 h-8 rounded bg-white/20" />
              </div>
              <div className="space-y-4">
                <div className="w-48 h-6 rounded bg-white/20" />
                <div className="w-32 h-6 rounded bg-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Columns */}
      <div className="max-w-screen-xl mx-auto px-6 md:px-16 py-24">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <h1 className="text-4xl sm:text-5xl font-bold text-stone-950">
              {title}
            </h1>
          </div>
          <div className="flex-1">
            <p className="text-base text-stone-800 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 