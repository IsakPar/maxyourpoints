import React from "react"
import CTASection from "@/components/CTASection/CTASection"
import Header from "@/components/Header"
import BlogShowcase from "@/components/BlogShowcase"
import BlogCarousel from "@/components/BlogCarousel/BlogCarousel"

export default function Home() {
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
    </main>
  )
}
