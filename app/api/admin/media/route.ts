import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { verifyAuthUser } from '@/lib/auth'

// TODO: Replace with proper media management system
// This is a placeholder until we implement proper file upload with backend

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    console.log('📁 Fetching media files from database...')

    try {
      // Get media from Supabase media table
      const { data: media, error } = await supabaseAdmin
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error:', error)
        // Fall back to empty array if table doesn't exist yet
        return NextResponse.json({
          success: true,
          media: [],
          message: 'No media files found'
        })
      }

      console.log(`✅ Found ${media?.length || 0} media files`)

      return NextResponse.json({
        success: true,
        media: media || [],
        total: media?.length || 0
      })

    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        success: true,
        media: [],
        message: 'Database unavailable - no media files'
      })
    }

  } catch (error: any) {
    console.error('Media API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch media',
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    console.log('📤 Media upload requested')

    // Redirect to the proper upload endpoint
    return NextResponse.json({
      success: false,
      error: 'Use /api/admin/upload endpoint',
      message: 'Please use /api/admin/upload for file uploads'
    }, { status: 400 })

  } catch (error: any) {
    console.error('Media upload error:', error)
    return NextResponse.json({
      error: 'Failed to upload media',
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user || !['editor', 'admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'Editor access required'
      }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const mediaId = searchParams.get('id')

    if (!mediaId) {
      return NextResponse.json({
        error: 'Media ID required',
        message: 'Media ID is required for deletion'
      }, { status: 400 })
    }

    console.log(`🗑️ Media deletion requested: ${mediaId}`)

    try {
      // Get the media record first
      const { data: mediaRecord, error: fetchError } = await supabaseAdmin
        .from('media')
        .select('*')
        .eq('id', mediaId)
        .single()

      if (fetchError || !mediaRecord) {
        return NextResponse.json({
          error: 'Media not found',
          message: 'Media file not found'
        }, { status: 404 })
      }

      // Delete from storage first
      if (mediaRecord.filename) {
        const { error: storageError } = await supabaseAdmin.storage
          .from('media')
          .remove([`uploads/${mediaRecord.filename}`])
        
        if (storageError) {
          console.error('Storage deletion error:', storageError)
          // Continue with database deletion even if storage fails
        }
      }

      // Delete from database
      const { error: deleteError } = await supabaseAdmin
        .from('media')
        .delete()
        .eq('id', mediaId)

      if (deleteError) {
        console.error('❌ Database deletion error:', deleteError)
        return NextResponse.json({
          error: 'Database deletion failed',
          message: 'Could not delete media record'
        }, { status: 500 })
      }

      console.log('✅ Media deleted successfully')

      return NextResponse.json({
        success: true,
        message: 'Media deleted successfully'
      })

    } catch (deleteError) {
      console.error('❌ Deletion error:', deleteError)
      return NextResponse.json({
        error: 'Deletion failed',
        message: 'Could not delete media file'
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('Media deletion error:', error)
    return NextResponse.json({
      error: 'Failed to delete media',
      message: error.message
    }, { status: 500 })
  }
} 