import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.vercel.app';

  // Static pages to include in sitemap
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog', priority: '0.9', changefreq: 'daily' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
    { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
  ];

  try {
    // Fetch published articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .order('name');

    // Build URLs array
    const urls: Array<{url: string, lastmod?: string, priority: string, changefreq: string}> = [];

    // Add static pages
    urls.push(...staticPages.map(page => ({
      url: page.url,
      priority: page.priority,
      changefreq: page.changefreq
    })));

    // Add categories
    if (categories) {
      categories.forEach(category => {
        urls.push({
          url: `/blog/categories/${category.slug}`,
          lastmod: category.updated_at,
          priority: '0.8',
          changefreq: 'weekly'
        });
      });
    }

    // Add blog posts
    if (articles) {
      articles.forEach(article => {
        urls.push({
          url: `/blog/${article.slug}`,
          lastmod: article.updated_at || article.published_at,
          priority: '0.7',
          changefreq: 'monthly'
        });
      });
    }

    // Generate XML content
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (item) => `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    ${item.lastmod ? `<lastmod>${new Date(item.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    // Return XML response with correct content type
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback to static pages only if there's an error
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
} 