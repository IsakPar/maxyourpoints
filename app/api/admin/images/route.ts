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

    console.log('📁 Fetching media images from database...')

    // Get search parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search') || ''

    // Build query
    let query = supabaseAdmin
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add search filter if provided
    if (search) {
      query = query.or(`original_name.ilike.%${search}%,alt_text.ilike.%${search}%,caption.ilike.%${search}%`)
    }

    const { data: images, error } = await query

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({
        error: 'Database error',
        message: 'Failed to fetch images'
      }, { status: 500 })
    }

    console.log(`✅ Found ${images?.length || 0} images`)

    // Map database fields to frontend expected format
    const mappedImages = (images || []).map(image => ({
      id: image.id,
      file_path: image.url,
      file_name: image.filename,
      public_url: image.url,
      url: image.url, // Add this for the media library dialog
      alt_text: image.alt_text || '',
      alt: image.alt_text || image.filename, // Add this for the media library dialog
      caption: image.caption || '',
      title: image.filename,
      file_size: image.file_size,
      original_size: image.file_size, // We don't store original size separately
      mime_type: image.mime_type,
      format: image.mime_type.split('/')[1] || 'unknown',
      width: image.width || 0,
      height: image.height || 0,
      compression_ratio: 0, // We don't store this separately
      was_heic: false, // We don't store this in the current schema
      was_optimized: true, // Assume optimized since we process all images
      usage_count: 0, // We don't track usage yet
      last_used_at: image.created_at,
      tags: [], // We don't store tags yet
      category: 'general', // Default category
      created_at: image.created_at,
      updated_at: image.updated_at || image.created_at
    }))

    return NextResponse.json({
      success: true,
      images: mappedImages,
      total: mappedImages.length
    })

  } catch (error: any) {
    console.error('Images API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch images',
      message: error.message
    }, { status: 500 })
  }
} 