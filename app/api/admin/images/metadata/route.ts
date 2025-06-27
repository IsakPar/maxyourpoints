import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json({
        error: 'Missing URL parameter',
        message: 'Image URL is required'
      }, { status: 400 })
    }

    console.log('🔍 Fetching metadata for image:', imageUrl)

    const { data: image, error } = await supabaseAdmin
      .from('media')
      .select('id, filename, alt_text, caption, title, width, height, file_size')
      .eq('url', imageUrl)
      .single()

    if (error || !image) {
      return NextResponse.json({
        error: 'Image not found',
        message: 'No metadata found for this image'
      }, { status: 404 })
    }

    console.log('✅ Found metadata for image:', image.filename)

    return NextResponse.json({
      id: image.id,
      filename: image.filename,
      altText: image.alt_text,
      caption: image.caption,
      title: image.title,
      width: image.width,
      height: image.height,
      fileSize: image.file_size
    })

  } catch (error: any) {
    console.error('Image metadata API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch image metadata',
      message: error.message
    }, { status: 500 })
  }
} 