import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    // Bearer CRON_SECRET auth — same pattern as publish/route.ts
    const authToken = (request.headers.get('Authorization') || '').split('Bearer ').at(1)
    if (!authToken || authToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { keepSlugs } = body

    if (!Array.isArray(keepSlugs)) {
      return NextResponse.json(
        { error: 'keepSlugs must be an array of slug strings' },
        { status: 400 }
      )
    }

    // Validate all slugs are strings
    if (keepSlugs.some((s: unknown) => typeof s !== 'string')) {
      return NextResponse.json(
        { error: 'keepSlugs must contain only string values' },
        { status: 400 }
      )
    }

    // Count posts that will be deleted (for reporting before actually deleting)
    const toDeleteCount = await prisma.blogPost.count({
      where: {
        slug: { notIn: keepSlugs }
      }
    })

    if (toDeleteCount === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: 'No posts to delete'
      })
    }

    // Delete all BlogPost records whose slug is NOT in keepSlugs.
    // SeoData and BlogMetrics have onDelete: Cascade on their relations,
    // so they are automatically deleted when the parent BlogPost is deleted.
    const deleteResult = await prisma.blogPost.deleteMany({
      where: {
        slug: { notIn: keepSlugs }
      }
    })

    // Purge ISR caches so sitemap and blog pages reflect the deletions
    try {
      revalidatePath('/sitemap.xml')
      revalidatePath('/blog')
    } catch (revalErr) {
      // Non-fatal — caches will eventually refresh via revalidate interval
      logger.warn('Revalidation failed after bulk delete', revalErr as Error)
    }

    logger.info('Bulk delete completed', {
      deletedCount: deleteResult.count,
      keptSlugs: keepSlugs.length
    })

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.count,
      keptCount: keepSlugs.length
    })
  } catch (error) {
    logger.error('Bulk delete endpoint error', error as Error)
    return NextResponse.json({ error: 'Bulk delete failed' }, { status: 500 })
  }
}
