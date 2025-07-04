"use client"

import React from "react"
import CTASection from "@/components/CTASection/CTASection"
import Footer from "@/components/Footer/Footer"
import Header from "@/components/Header"
import BlogShowcase from "@/components/BlogShowcase"
import BlogCarousel from "@/components/BlogCarousel/BlogCarousel"

export default function HomePage() {
  return (
    <main>
      <Header />
      <BlogShowcase />
      <div className="bg-teal-50">
        <CTASection />
      </div>
      <div className="bg-teal-50">
        <BlogCarousel 
          title="Latest from Our Blog"
          subtitle="Discover our most recent insights and travel tips"
          theme="teal"
          autoplay={true}
        />
      </div>
      <div className="bg-[#D1F1EB]">
        <Footer />
      </div>
    </main>
  )
} 