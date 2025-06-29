import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'

interface WordPressPost {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  slug: string
  status: string
  categories: number[]
  tags: number[]
  featured_media?: number
  author: number
  link: string
}

interface WordPressImportRequest {
  source: 'json' | 'url' | 'rss'
  data?: WordPressPost[]
  url?: string
  rssUrl?: string
}

// Clean HTML content and convert to markdown-like format
function cleanWordPressContent(html: string): string {
  return html
    // Remove WordPress-specific shortcodes
    .replace(/\[.*?\]/g, '')
    // Convert basic HTML to markdown-like syntax
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![${2}]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![]($1)')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')
    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Clean up entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8230;/g, '...')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Fetch WordPress posts from REST API
async function fetchWordPressPosts(url: string): Promise<WordPressPost[]> {
  try {
    const apiUrl = url.endsWith('/') ? `${url}wp-json/wp/v2/posts` : `${url}/wp-json/wp/v2/posts`
    const response = await fetch(`${apiUrl}?per_page=100&status=publish`)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch WordPress posts: ${response.statusText}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching WordPress posts:', error)
    throw new Error('Could not fetch WordPress posts from the provided URL')
  }
}

// Parse RSS feed
async function parseRSSFeed(rssUrl: string): Promise<WordPressPost[]> {
  try {
    const response = await fetch(rssUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`)
    }
    
    const rssText = await response.text()
    
    // Simple RSS parsing (you might want to use a proper XML parser)
    const posts: WordPressPost[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match
    let id = 1
    
    while ((match = itemRegex.exec(rssText)) !== null) {
      const itemContent = match[1]
      
      const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/)
      const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[(.*?)\]\]><\/content:encoded>/) || 
                           itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                           itemContent.match(/<description>(.*?)<\/description>/)
      const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)
      const linkMatch = itemContent.match(/<link>(.*?)<\/link>/)
      
      if (titleMatch && contentMatch) {
        posts.push({
          id: id++,
          title: { rendered: titleMatch[1] },
          content: { rendered: contentMatch[1] },
          excerpt: { rendered: contentMatch[1].substring(0, 200) + '...' },
          date: dateMatch ? new Date(dateMatch[1]).toISOString() : new Date().toISOString(),
          slug: generateSlug(titleMatch[1]),
          status: 'publish',
          categories: [],
          tags: [],
          author: 1,
          link: linkMatch ? linkMatch[1] : ''
        })
      }
    }
    
    return posts
  } catch (error) {
    console.error('Error parsing RSS feed:', error)
    throw new Error('Could not parse RSS feed')
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth()
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body: WordPressImportRequest = await request.json()
    const { source, data, url, rssUrl } = body

    let posts: WordPressPost[] = []

    // Get posts based on source
    switch (source) {
      case 'json':
        if (!data) {
          return NextResponse.json({ error: 'Posts data required for JSON import' }, { status: 400 })
        }
        posts = data
        break
        
      case 'url':
        if (!url) {
          return NextResponse.json({ error: 'WordPress URL required' }, { status: 400 })
        }
        posts = await fetchWordPressPosts(url)
        break
        
      case 'rss':
        if (!rssUrl) {
          return NextResponse.json({ error: 'RSS URL required' }, { status: 400 })
        }
        posts = await parseRSSFeed(rssUrl)
        break
        
      default:
        return NextResponse.json({ error: 'Invalid source type' }, { status: 400 })
    }

    if (posts.length === 0) {
      return NextResponse.json({ error: 'No posts found to import' }, { status: 400 })
    }

    const supabase = await createClient()
    const importResults: Array<{
      title: string
      status: 'success' | 'error'
      id?: string
      error?: string
    }> = []

    // Get default category (create if doesn't exist)
    let { data: categories } = await supabase
      .from('categories')
      .select('id, name')
      .eq('name', 'Travel Hacks & Deals')
      .single()

    if (!categories) {
      const { data: newCategory } = await supabase
        .from('categories')
        .insert({ 
          name: 'Travel Hacks & Deals', 
          slug: 'travel-hacks-deals',
          description: 'Imported WordPress content'
        })
        .select()
        .single()
      categories = newCategory
    }

    if (!categories) {
      return NextResponse.json({ error: 'Failed to create or find default category' }, { status: 500 })
    }

    // Import each post
    for (const post of posts) {
      try {
        const cleanContent = cleanWordPressContent(post.content.rendered)
        const cleanExcerpt = cleanWordPressContent(post.excerpt.rendered).substring(0, 200)
        
        // Create article as draft
        const { data: article, error } = await supabase
          .from('articles')
          .insert({
            title: post.title.rendered,
            slug: generateSlug(post.title.rendered),
            content: cleanContent,
            summary: cleanExcerpt, // Use 'summary' instead of 'excerpt'
            status: 'draft', // Use 'status' with 'draft' value instead of 'published: false'
            category_id: categories.id,
            author_id: user.id,
            meta_description: cleanExcerpt
            // Removed non-existent fields: wordpress_id, wordpress_url, original_date, created_at, updated_at
          })
          .select()
          .single()

        if (error) {
          console.error(`Error importing post "${post.title.rendered}":`, error)
          importResults.push({
            title: post.title.rendered,
            status: 'error',
            error: error.message
          })
        } else {
          importResults.push({
            title: post.title.rendered,
            status: 'success',
            id: article.id
          })
        }
      } catch (error) {
        console.error(`Error processing post "${post.title.rendered}":`, error)
        importResults.push({
          title: post.title.rendered,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    const successCount = importResults.filter(r => r.status === 'success').length
    const errorCount = importResults.filter(r => r.status === 'error').length

    return NextResponse.json({
      message: `Import completed: ${successCount} successful, ${errorCount} errors`,
      results: importResults,
      stats: {
        total: posts.length,
        successful: successCount,
        errors: errorCount
      }
    })

  } catch (error) {
    console.error('WordPress migration error:', error)
    return NextResponse.json({
      error: 'Migration failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
} 