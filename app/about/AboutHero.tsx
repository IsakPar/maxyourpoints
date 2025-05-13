"use client"

import * as React from "react"

export default function AboutHero() {
  return (
    <section className="w-full max-w-screen-xl mx-auto bg-[#D1F1EB] px-6 md:px-16 pt-36 pb-28">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-950">
            Maximize Your Points
          </h1>
        </div>
        <div className="flex-1">
          <p className="text-lg text-stone-800 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          </p>
        </div>
      </div>
    </section>
  )
}