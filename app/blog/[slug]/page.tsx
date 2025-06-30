import React from "react"
import { notFound } from "next/navigation"
import { createClient } from '@supabase/supabase-js'
import { convertMarkdownToHtml } from "@/lib/markdown"
import Image from "next/image"
import Link from "next/link"
import { Clock, User, ArrowLeft, Calendar } from "lucide-react"
import CTASection from "@/components/CTASection/CTASection"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface ArticlePageProps {
  params: {
    slug: string
  }
}

interface Article {
  id: string
  slug: string
  title: string
  content?: string
  summary?: string
  author: string
  date: string
  readTime: string
  image?: string
  published: boolean
  category: {
    id: string
    name: string
    slug: string
  } | string
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  
  // Fetch the article directly from Supabase
  const { data: article, error } = await supabase
    .from('articles')
    .select(`
      *,
      category:categories(
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article || error) {
    console.error('Article not found or error:', error)
    return notFound()
  }

  // Fetch latest articles for sidebar (excluding current article)
  const { data: latestArticles } = await supabase
    .from('articles')
    .select(`
      slug,
      title,
      image,
      readTime,
      category:categories(
        name
      )
    `)
    .eq('status', 'published')
    .neq('slug', slug)
    .order('created_at', { ascending: false })
    .limit(4)

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Article Content - Left Side */}
          <article className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              
              {/* Featured Image */}
              {article.image && (
                <div className="aspect-video relative">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Article Header */}
              <header className="p-6 sm:p-8">
                {/* Back Button */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back to Blog
                </Link>

                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 text-sm font-medium text-emerald-700 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full border border-emerald-200">
                    {typeof article.category === 'object' ? article.category.name : article.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 mb-4 leading-tight">
                  {article.title}
                </h1>

                {/* Summary */}
                {article.summary && (
                  <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                    {article.summary}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
                  <span className="flex items-center gap-2">
                    <User size={16} />
                    {article.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {article.readTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(article.date || article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </header>

              {/* Article Content */}
              <div className="px-6 sm:px-8 pb-8">
                {article.content ? (
                  <div 
                    className="article-content prose prose-lg max-w-none prose-headings:text-stone-950 prose-p:text-gray-700 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-stone-900"
                    dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(article.content) }}
                  />
                ) : (
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-8 rounded-2xl border border-emerald-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Article Preview
                    </h3>
                    <p className="text-gray-600 mb-4">
                      This is a test article: <strong>{article.title}</strong>
                    </p>
                    <p className="text-gray-600 mb-6">
                      {article.summary}
                    </p>
                    <div className="p-4 bg-emerald-100 rounded-xl border border-emerald-200">
                      <p className="text-sm text-emerald-700">
                        🎉 <strong>Database Integration Success!</strong> This article is being loaded dynamically from your backend database.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar - Right Side */}
          <aside className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="sticky top-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100 p-6">
                <h2 className="text-xl font-bold text-stone-950 mb-6">Latest Articles</h2>
                
                {latestArticles && latestArticles.length > 0 ? (
                  <div className="space-y-6">
                    {latestArticles.map((latestArticle) => (
                      <Link
                        key={latestArticle.slug}
                        href={`/blog/${latestArticle.slug}`}
                        className="block group"
                      >
                        <article className="flex gap-4">
                          {/* Thumbnail */}
                          {latestArticle.image && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                              <Image
                                src={latestArticle.image}
                                alt={latestArticle.title}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-stone-950 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1">
                              {latestArticle.title}
                            </h3>
                                                         <div className="flex items-center gap-2 text-xs text-gray-500">
                               <span>{latestArticle.category && typeof latestArticle.category === 'object' ? (latestArticle.category as any)?.name || 'Category' : latestArticle.category || 'Category'}</span>
                               <span>•</span>
                               <span>{latestArticle.readTime}</span>
                             </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No related articles found.</p>
                )}

                {/* View All Articles Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href="/blog"
                    className="block text-center py-3 px-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    View All Articles
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <CTASection
          title="Want More Travel Tips?"
          description="Subscribe to our newsletter for exclusive travel hacks, credit card strategies, and insider tips to maximize your points and miles."
          buttonText="Subscribe Now"
          design="gradient-teal"
          className="mt-8"
        />
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  
  // Fetch the article directly from Supabase for metadata
  const { data: article } = await supabase
    .from('articles')
    .select(`
      title,
      summary,
      image,
      category:categories(name)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    }
  }

  return {
    title: `${article.title} | Max Your Points`,
    description: article.summary || `Read about ${article.title} and discover tips to maximize your travel rewards.`,
    openGraph: {
      title: article.title,
      description: article.summary || `Read about ${article.title} and discover tips to maximize your travel rewards.`,
      images: article.image ? [article.image] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary || `Read about ${article.title} and discover tips to maximize your travel rewards.`,
      images: article.image ? [article.image] : [],
    },
  }
}
