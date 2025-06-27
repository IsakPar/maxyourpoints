import { supabaseAdmin } from '@/lib/supabase/server'

async function setupSupabaseAuth() {
  try {
    console.log('🔧 Setting up Supabase Auth...')

    // Check if the admin user already exists
    const adminEmail = 'isak@maxyourpoints.com'
    const adminPassword = 'admin123'

    // First, check if user exists in auth.users
    const { data: existingAuthUser, error: authUserError } = await supabaseAdmin.auth.admin.listUsers()
    
    const existingUser = existingAuthUser?.users?.find(user => user.email === adminEmail)
    
    if (existingUser) {
      console.log('✅ Admin user already exists in auth.users:', existingUser.id)
      
      // Check if user exists in our users table
      const { data: customUser, error: customUserError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', existingUser.id)
        .single()

      if (customUserError && customUserError.code === 'PGRST116') {
        // User doesn't exist in custom table, create it
        console.log('📝 Creating user record in users table...')
        
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: existingUser.id,
            email: existingUser.email,
            name: 'Isak Parild',
            full_name: 'Isak Parild',
            role: 'SUPER_ADMIN',
            verified: true,
            created_at: existingUser.created_at,
            updated_at: new Date().toISOString()
          })

        if (insertError) {
          console.error('❌ Error creating user record:', insertError)
        } else {
          console.log('✅ User record created successfully')
        }
      } else if (!customUserError) {
        console.log('✅ User record already exists in users table')
      }
      
      return
    }

    // Create new auth user
    console.log('👤 Creating admin user in Supabase Auth...')
    
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: 'Isak Parild',
        role: 'SUPER_ADMIN'
      }
    })

    if (createError) {
      console.error('❌ Error creating auth user:', createError)
      return
    }

    console.log('✅ Auth user created successfully:', newUser.user?.id)

    // Create corresponding record in users table
    if (newUser.user) {
      console.log('📝 Creating user record in users table...')
      
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: newUser.user.id,
          email: newUser.user.email!,
          name: 'Isak Parild',
          full_name: 'Isak Parild',
          role: 'SUPER_ADMIN',
          verified: true,
          created_at: newUser.user.created_at,
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('❌ Error creating user record:', insertError)
      } else {
        console.log('✅ User record created successfully')
      }
    }

    console.log('🎉 Supabase Auth setup complete!')
    console.log(`📧 Admin email: ${adminEmail}`)
    console.log(`🔑 Admin password: ${adminPassword}`)

  } catch (error) {
    console.error('💥 Setup failed:', error)
  }
}

if (require.main === module) {
  setupSupabaseAuth()
}

export { setupSupabaseAuth } 