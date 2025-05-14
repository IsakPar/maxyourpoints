"use client"

import * as React from "react"
import Head from "next/head"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // TODO: Replace with actual post data from Sanity
  const post = {
    title: "Sample Blog Post",
    summary: "This is a sample blog post summary",
    coverImage: "https://maxyourpoints.com/images/sample-cover.jpg",
    author: "John Doe",
    date: "2024-03-15",
    category: "Credit Cards & Points",
    categorySlug: "credit-cards-and-points",
    slug: params.slug
  }

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.summary,
    "image": post.coverImage,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "datePublished": post.date,
    "publisher": {
      "@type": "Organization",
      "name": "MaxYourPoints",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maxyourpoints.com/images/logo.png"
      }
    }
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Blog",
        "item": "https://maxyourpoints.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": post.category,
        "item": `https://maxyourpoints.com/blog/categories/${post.categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://maxyourpoints.com/blog/post/${post.slug}`
      }
    ]
  }

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </Head>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Blog Post: {params.slug}</h1>
        <p className="text-lg">Individual blog post content will be displayed here.</p>
      </main>
    </>
  )
}
