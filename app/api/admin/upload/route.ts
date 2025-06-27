import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import sharp from 'sharp'
import heicConvert from 'heic-convert'
import tinify from 'tinify'

const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif']

// Initialize TinyPNG
const TINYPNG_API_KEY = process.env.TINYPNG_API_KEY
if (TINYPNG_API_KEY) {
  tinify.key = TINYPNG_API_KEY
} else {
  console.warn('⚠️ TinyPNG API key not found. Images will be compressed with Sharp only.')
}

// TODO: Replace with proper file upload system
// This is a placeholder until we implement proper file upload with backend

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    console.log('📤 File upload requested by user:', user.email)

    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string || ''
    const caption = formData.get('caption') as string || ''
    const title = formData.get('title') as string || ''
    const category = formData.get('category') as string || 'general'

    if (!file) {
      return NextResponse.json({
        error: 'No file provided',
        message: 'Please select a file to upload'
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        error: 'File too large',
        message: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }, { status: 400 })
    }

    // Check if it's HEIC format
    const isHEIC = file.type === 'image/heic' || file.type === 'image/heif' || 
                   file.name.toLowerCase().endsWith('.heic') || 
                   file.name.toLowerCase().endsWith('.heif')

    // Validate file type
    if (!isHEIC && !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type',
        message: 'Supported formats: JPEG, PNG, WebP, GIF, HEIC/HEIF'
      }, { status: 400 })
    }

    console.log('📁 Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      isHEIC
    })

    let processedBuffer: Buffer
    let finalMimeType = file.type
    let wasHEIC = false
    let originalSize = file.size
    let compressionSteps: string[] = []

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    let fileBuffer = Buffer.from(arrayBuffer)

    // Handle HEIC conversion
    if (isHEIC) {
      console.log('🔄 Converting HEIC to JPEG...')
      try {
        const jpegBuffer = await heicConvert({
          buffer: fileBuffer,
          format: 'JPEG',
          quality: 0.9
        })
        fileBuffer = Buffer.from(jpegBuffer)
        finalMimeType = 'image/jpeg'
        wasHEIC = true
        compressionSteps.push('HEIC → JPEG conversion')
        console.log('✅ HEIC converted to JPEG')
      } catch (heicError) {
        console.error('❌ HEIC conversion failed:', heicError)
        return NextResponse.json({
          error: 'HEIC conversion failed',
          message: 'Could not convert HEIC file to JPEG'
        }, { status: 500 })
      }
    }

    // Process and optimize image with Sharp first - Convert all to JPEG for optimal compression
    console.log('🖼️ Converting and optimizing image to JPEG with Sharp...')
    let sharpInstance = sharp(fileBuffer)
    
    // Get image metadata
    const metadata = await sharpInstance.metadata()
    const { width, height, format } = metadata

    // Convert all images to JPEG for optimal compression
    fileBuffer = Buffer.from(await sharpInstance
      .jpeg({ 
        quality: 90,
        progressive: true,
        mozjpeg: true
      })
      .toBuffer())
    
    // Update mime type to JPEG for all images
    finalMimeType = 'image/jpeg'
    
    if (wasHEIC) {
      compressionSteps.push('HEIC → JPEG conversion', 'Sharp JPEG optimization')
    } else {
      compressionSteps.push(`${format?.toUpperCase() || 'Original'} → JPEG conversion`, 'Sharp JPEG optimization')
    }

    const sharpCompressedSize = fileBuffer.length

    // TinyPNG compression (if API key is available) - JPEG format is always supported
    if (TINYPNG_API_KEY) {
      console.log('🗜️ Compressing JPEG with TinyPNG...')
      try {
        const compressedBuffer = await tinify.fromBuffer(fileBuffer).toBuffer()
         
        // Only use TinyPNG result if it's actually smaller
        if (compressedBuffer.length < fileBuffer.length) {
          fileBuffer = Buffer.from(compressedBuffer)
          compressionSteps.push('TinyPNG JPEG compression')
          console.log('✅ TinyPNG compression applied')
        } else {
          console.log('ℹ️ TinyPNG didn\'t improve compression, using Sharp result')
        }
      } catch (tinifyError) {
        console.warn('⚠️ TinyPNG compression failed, using Sharp result:', tinifyError)
        compressionSteps.push('TinyPNG failed, used Sharp only')
      }
    } else {
      compressionSteps.push('TinyPNG API key not configured')
    }

    processedBuffer = fileBuffer
    const compressedSize = processedBuffer.length
    const compressionRatio = Math.round(((originalSize - compressedSize) / originalSize) * 100)

    console.log('📊 Image processing stats:', {
      originalSize,
      sharpCompressedSize,
      finalCompressedSize: compressedSize,
      compressionRatio,
      width,
      height,
      wasHEIC,
      compressionSteps
    })

    // Generate unique filename - all images are now JPEG
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(7)
    const fileName = `${timestamp}-${randomString}.jpg`
    const filePath = `uploads/${fileName}`

    // Upload to Supabase Storage
    console.log('☁️ Uploading to Supabase Storage...')
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('media')
      .upload(filePath, processedBuffer, {
        contentType: finalMimeType,
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Supabase upload error:', uploadError)
      return NextResponse.json({
        error: 'Upload failed',
        message: 'Could not upload file to storage'
      }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('media')
      .getPublicUrl(filePath)

    console.log('🔗 File uploaded to:', publicUrl)

    // Save metadata to database
    console.log('💾 Saving metadata to database...')
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('media')
      .insert({
        filename: fileName,
        original_name: file.name,
        mime_type: finalMimeType,
        file_size: compressedSize,
        width: width || null,
        height: height || null,
        url: publicUrl,
        alt_text: altText || file.name,
        caption: caption || null,
        uploaded_by: user.id
      })
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database save error:', dbError)
      // Try to cleanup uploaded file
      await supabaseAdmin.storage.from('media').remove([filePath])
      
      return NextResponse.json({
        error: 'Database save failed',
        message: 'Could not save file metadata'
      }, { status: 500 })
    }

    console.log('✅ File upload completed successfully')

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      originalName: file.name,
      mimeType: finalMimeType,
      fileSize: compressedSize,
      originalSize,
      width,
      height,
      altText: altText || file.name,
      caption,
      title,
      wasHEIC,
      compressionRatio,
      compressionSteps,
      optimized: compressionRatio > 0,
      metadata: dbData
    })

  } catch (error: any) {
    console.error('Upload API error:', error)
    return NextResponse.json({
      error: 'Failed to upload file',
      message: error.message
    }, { status: 500 })
  }
}

// GET endpoint to check storage status
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuthUser(request)
    if (!user) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Authentication required'
      }, { status: 401 })
    }

    console.log('📊 Checking storage status...')

    // Check Supabase Storage bucket
    const { data: buckets, error: bucketError } = await supabaseAdmin.storage.listBuckets()
    
    const mediaBucket = buckets?.find(bucket => bucket.name === 'media')
    const bucketExists = !!mediaBucket && !bucketError

    // Check TinyPNG API status
    let tinypngStatus = 'Not configured'
    if (TINYPNG_API_KEY) {
      try {
        await tinify.validate()
        const compressionCount = tinify.compressionCount || 0
        tinypngStatus = `Active (${compressionCount} compressions used this month)`
      } catch (err) {
        tinypngStatus = 'Invalid API key'
      }
    }

    return NextResponse.json({
      success: true,
      status: {
        supabaseStorage: bucketExists,
        databaseConnection: true,
        tinypngStatus,
        maxFileSize: `${MAX_FILE_SIZE / 1024 / 1024}MB`,
        allowedTypes: ['JPEG', 'PNG', 'WebP', 'GIF', 'HEIC'],
        outputFormat: 'JPEG (all images converted to JPEG for optimal compression)',
        heicConversion: true,
        imageOptimization: true,
        storage: bucketExists ? 'Supabase Storage connected' : 'Storage bucket not found'
      }
    })

  } catch (error: any) {
    console.error('Storage check error:', error)
    return NextResponse.json({
      error: 'Failed to check storage status',
      message: error.message
    }, { status: 500 })
  }
} 