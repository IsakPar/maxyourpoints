"use client"

import * as React from "react"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blog Post: {params.slug}</h1>
      <p className="text-lg">Individual blog post content will be displayed here.</p>
    </main>
  )
}
