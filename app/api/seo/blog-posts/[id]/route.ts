import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const blogPost = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        seo_data: true
      }
    })

    if (!blogPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ blogPost })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      keywords,
      category,
      tags,
      featured_image,
      status,
      published_at
    } = body

    const updateData: any = {
      title,
      content,
      excerpt,
      meta_title,
      meta_description,
      keywords,
      category,
      tags,
      featured_image,
      status,
      updated_at: new Date()
    }

    // Update word count and reading time if content changed
    if (content) {
      updateData.word_count = content.trim().split(/\s+/).length
      updateData.reading_time = Math.ceil(updateData.word_count / 200)
    }

    // Set published_at if publishing
    if (status === 'PUBLISHED' && !published_at) {
      updateData.published_at = new Date()
    }

    const blogPost = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            full_name: true,
            email: true
          }
        },
        seo_data: true
      }
    })

    return NextResponse.json({
      success: true,
      blogPost,
      message: 'Blog post updated successfully'
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    await prisma.blogPost.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}