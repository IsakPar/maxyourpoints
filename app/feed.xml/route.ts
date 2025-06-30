import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maxyourpoints.com';

  try {
    // Fetch recent published articles
    const { data: articles } = await supabase
      .from('articles')
      .select(`
        title,
        slug,
        summary,
        published_at,
        updated_at,
        content,
        categories!inner(name, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20);

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Max Your Points</title>
    <description>Expert travel rewards and points optimization strategies. Learn how to maximize credit card points, airline miles, and hotel rewards.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Max Your Points CMS</generator>
    <image>
      <url>${baseUrl}/max_your_points-logo.png</url>
      <title>Max Your Points</title>
      <link>${baseUrl}</link>
      <width>400</width>
      <height>150</height>
    </image>
    ${articles?.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.summary || ''}]]></description>
      <link>${baseUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
      <category><![CDATA[${Array.isArray(article.categories) ? article.categories[0]?.name : 'Travel'}]]></category>
      <content:encoded><![CDATA[${stripHtml(article.content || '')}]]></content:encoded>
    </item>`).join('') || ''}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Fallback RSS without articles
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Max Your Points</title>
    <description>Expert travel rewards and points optimization strategies</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
  </channel>
</rss>`;

    return new NextResponse(fallbackRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
    .substring(0, 500) + '...';
} 