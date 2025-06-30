import React from "react"
import CTASection from "@/components/CTASection/CTASection"
import Header from "@/components/Header"
import BlogShowcase from "@/components/BlogShowcase"
import BlogCarousel from "@/components/BlogCarousel/BlogCarousel"
import { getFeaturedArticles } from "@/lib/articles-simple"
import { ConfirmationBanner } from "@/components/blog/ConfirmationBanner"

// Transform database articles to component format
function transformToShowcaseFormat(articles: any[]) {
  return articles.map(article => ({
    id: parseInt(article.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
    title: article.title,
    summary: article.summary,
    category: typeof article.category === 'object' ? article.category.name : article.category,
    readTime: article.readTime,
    image: article.image || "/placeholder.svg",
    slug: `/blog/${article.slug}`
  }))
}

function transformToCarouselFormat(articles: any[]) {
  return articles.map(article => ({
    id: parseInt(article.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number
    title: article.title,
    excerpt: article.summary,
    category: typeof article.category === 'object' ? article.category.name : article.category,
    readTime: article.readTime,
    image: article.image || "/placeholder.svg",
    slug: `/blog/${article.slug}`,
    date: article.date
  }))
}

export default async function Home() {
  // Optimized: Single API call for all featured articles
  const featuredArticlesResult = await getFeaturedArticles('main', 12).catch((error) => {
    console.log('No featured articles found:', error.message)
    return []
  })

  // Transform data for components - reuse the same data
  const showcasePosts = featuredArticlesResult.length > 0 
    ? transformToShowcaseFormat(featuredArticlesResult.slice(0, 3)) // Top 3 for showcase
    : []
  
  const carouselPosts = featuredArticlesResult.length > 0
    ? transformToCarouselFormat(featuredArticlesResult) // All 12 for carousel
    : []

  console.log('🏠 Home page data:')
  console.log('Total featured articles loaded:', featuredArticlesResult.length)
  console.log('Showcase articles:', showcasePosts.length)
  console.log('Carousel articles:', carouselPosts.length)

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <ConfirmationBanner />
      <Header />
      <BlogShowcase posts={showcasePosts} />
      <div className="bg-gradient-to-r from-teal-50 to-emerald-100">
        <CTASection />
      </div>
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
        <BlogCarousel 
          title="Featured Articles"
          subtitle="Our handpicked travel insights and expert guides"
          theme="teal"
          autoplay={true}
          posts={carouselPosts}
        />
      </div>
    </main>
  )
}
