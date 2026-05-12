import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/blog-service'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

const SITE_URL = 'https://search.venym.io'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(date: Date | string): string {
  return new Date(date).toUTCString()
}

export async function GET() {
  try {
    const posts = await getBlogPosts({
      status: 'PUBLISHED' as any,
      limit: 50,
      orderBy: 'published_at',
      orderDirection: 'desc',
    })

    const items = posts
      .map((post) => {
        const link = `${SITE_URL}/blog/${post.slug}`
        return [
          '<item>',
          `<title>${escapeXml(post.title)}</title>`,
          `<link>${escapeXml(link)}</link>`,
          `<description>${escapeXml(post.excerpt || '')}</description>`,
          `<pubDate>${toRfc822(post.published_at as string)}</pubDate>`,
          ...(post.category ? [`<category>${escapeXml(post.category)}</category>`] : []),
          `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
          '</item>',
        ].join('\n')
      })
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Venym Search Blog</title>
    <description>Real-time insights on web scraping, APIs, and AI data extraction — powered by Venym Search</description>
    <link>https://search.venym.io/blog</link>
    <language>en-us</language>
    <lastBuildDate>${toRfc822(new Date())}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Error</title>
    <description>Failed to generate RSS feed. Please try again later.</description>
  </channel>
</rss>`
    return new NextResponse(errorXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/rss+xml',
      },
    })
  }
}
