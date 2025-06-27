import { supabaseAdmin } from '../lib/supabase/server'

async function setupSupabaseStorage() {
  try {
    console.log('🏗️ Setting up Supabase Storage...')

    // Check if media bucket exists
    const { data: buckets, error: bucketListError } = await supabaseAdmin.storage.listBuckets()
    
    if (bucketListError) {
      console.error('❌ Error checking buckets:', bucketListError)
      return
    }

    const mediaBucket = buckets?.find(bucket => bucket.name === 'media')
    
    if (!mediaBucket) {
      console.log('📁 Creating media bucket...')
      
      // Create the media bucket
      const { data: bucket, error: bucketError } = await supabaseAdmin.storage.createBucket('media', {
        public: true,
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg', 
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml'
        ],
        fileSizeLimit: 20971520 // 20MB
      })

      if (bucketError) {
        console.error('❌ Error creating bucket:', bucketError)
        return
      }

      console.log('✅ Media bucket created successfully')
    } else {
      console.log('✅ Media bucket already exists')
    }

    // Set up RLS policy for media bucket
    console.log('🔒 Setting up storage policies...')
    
    // This needs to be done in the Supabase SQL editor:
    console.log(`
    -- Run this in Supabase SQL Editor to set up storage policies:
    
    -- Create policy for authenticated users to upload
    CREATE POLICY "Authenticated users can upload media" ON storage.objects
    FOR INSERT WITH CHECK (
      bucket_id = 'media' AND 
      auth.role() = 'authenticated'
    );

    -- Create policy for public read access
    CREATE POLICY "Public read access for media" ON storage.objects
    FOR SELECT USING (bucket_id = 'media');

    -- Create policy for authenticated users to delete their own files
    CREATE POLICY "Users can delete their own media" ON storage.objects
    FOR DELETE USING (
      bucket_id = 'media' AND 
      auth.uid() = owner
    );
    `)

    console.log('✅ Storage setup completed!')
    console.log('📝 Please run the SQL policies above in your Supabase SQL Editor')

  } catch (error) {
    console.error('❌ Storage setup failed:', error)
  }
}

// Run if called directly
if (require.main === module) {
  setupSupabaseStorage()
}

export { setupSupabaseStorage } 