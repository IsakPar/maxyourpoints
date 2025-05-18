"use client"

import * as React from "react"
import Image from "next/image"

interface CategoryHeroProps {
  title: string
  subtitle: string
  imageSrc?: string
  imageAlt?: string
}

export default function CategoryHero({ title, subtitle, imageSrc, imageAlt }: CategoryHeroProps) {
  return (
    <section className="bg-[#D1F1EB]">
      {/* Fullscreen Image */}
      <div className="w-full h-[60vh] relative">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            priority
            className="object-cover object-center w-full h-full"
            style={{ objectPosition: 'center 70%' }}
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
        )}
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