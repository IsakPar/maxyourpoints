import { Suspense } from 'react'
import { api } from '@/lib/api'
import BlogPageClient from './BlogPageClient'

export default async function BlogPage() {
  try {
    // Fetch published articles and categories from backend API
    const [articlesResponse, categoriesResponse] = await Promise.all([
      api.getArticles({ published: true, limit: 50 }),
      api.getCategories()
    ])

    const articles = articlesResponse.articles || []
    const categories = categoriesResponse.categories || []

    // Debug logging
    console.log('📄 Blog page server-side data:')
    console.log('- Articles found:', articles.length)
    console.log('- Categories found:', categories.length)
    if (articles.length > 0) {
      console.log('- First article:', {
        id: articles[0].id,
        title: articles[0].title,
        category: articles[0].categories || articles[0].category,
        slug: articles[0].slug
      })
    }

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPageClient articles={articles} categories={categories} />
      </Suspense>
    )
  } catch (error) {
    console.error('Error fetching blog data:', error)
    
    // Fallback to empty data with error message
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <BlogPageClient articles={[]} categories={[]} />
      </Suspense>
    )
  }
}
