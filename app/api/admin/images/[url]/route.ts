import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/permissions'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    // Check authentication and permissions
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    if (!hasPermission(user, 'media:delete')) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'You do not have permission to delete media'
      }, { status: 403 })
    }

    const imageUrl = decodeURIComponent(params.url)
    console.log(`🗑️ Image deletion requested: ${imageUrl}`)

    // Get the media record first
    const { data: mediaRecord, error: fetchError } = await supabaseAdmin
      .from('media')
      .select('*')
      .eq('url', imageUrl)
      .single()

    if (fetchError || !mediaRecord) {
      console.log('❌ Media not found in database:', fetchError)
      return NextResponse.json({
        error: 'Media not found',
        message: 'Media file not found in database'
      }, { status: 404 })
    }

    // Delete from storage first
    if (mediaRecord.filename) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('media')
        .remove([`uploads/${mediaRecord.filename}`])
      
      if (storageError) {
        console.error('❌ Storage deletion error:', storageError)
        // Continue with database deletion even if storage fails
      } else {
        console.log('✅ File deleted from storage')
      }
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('media')
      .delete()
      .eq('url', imageUrl)

    if (deleteError) {
      console.error('❌ Database deletion error:', deleteError)
      return NextResponse.json({
        error: 'Database deletion failed',
        message: 'Could not delete media record from database'
      }, { status: 500 })
    }

    console.log('✅ Media deleted successfully from database')

    return NextResponse.json({
      success: true,
      message: 'Media deleted successfully'
    })

  } catch (error: any) {
    console.error('❌ Media deletion error:', error)
    return NextResponse.json({
      error: 'Failed to delete media',
      message: error.message
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    // Check authentication and permissions
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    if (!hasPermission(user, 'media:edit')) {
      return NextResponse.json({
        error: 'Forbidden',
        message: 'You do not have permission to edit media'
      }, { status: 403 })
    }

    const imageUrl = decodeURIComponent(params.url)
    const body = await request.json()
    const { alt_text, caption, title } = body

    console.log(`📝 Image metadata update requested: ${imageUrl}`)

    // Update the media record
    const { data: updatedRecord, error: updateError } = await supabaseAdmin
      .from('media')
      .update({
        alt_text: alt_text || null,
        caption: caption || null,
        updated_at: new Date().toISOString()
      })
      .eq('url', imageUrl)
      .select()
      .single()

    if (updateError) {
      console.error('❌ Database update error:', updateError)
      return NextResponse.json({
        error: 'Database update failed',
        message: 'Could not update media metadata'
      }, { status: 500 })
    }

    console.log('✅ Media metadata updated successfully')

    return NextResponse.json({
      success: true,
      message: 'Media metadata updated successfully',
      data: updatedRecord
    })

  } catch (error: any) {
    console.error('❌ Media update error:', error)
    return NextResponse.json({
      error: 'Failed to update media',
      message: error.message
    }, { status: 500 })
  }
} 