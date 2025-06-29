#!/usr/bin/env tsx

/**
 * Fix Admin User Permissions
 * Diagnoses and fixes admin user permissions issues
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function fixAdminPermissions() {
  console.log('🔧 Diagnosing Admin Permissions Issues...\n')

  try {
    const { supabaseAdmin } = await import('../lib/supabase/server')

    // Step 1: Check if isak.parild@gmail.com exists in users table
    console.log('1️⃣ Checking user record in database...')
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', 'isak.parild@gmail.com')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Database error:', checkError)
      return
    }

    if (existingUser) {
      console.log(`   ✅ User found in database`)
      console.log(`   📧 Email: ${existingUser.email}`)
      console.log(`   🎭 Role: ${existingUser.role}`)
      console.log(`   🆔 ID: ${existingUser.id}`)
      console.log(`   ✅ Verified: ${existingUser.verified}`)
      
      // Check if role is correct
      if (existingUser.role !== 'admin' && existingUser.role !== 'super_admin') {
        console.log('   ⚠️  Role needs updating...')
        
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ 
            role: 'admin',
            verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('email', 'isak.parild@gmail.com')

        if (updateError) {
          console.error('❌ Failed to update role:', updateError)
        } else {
          console.log('   ✅ Role updated to admin')
        }
      } else {
        console.log('   ✅ Role is correct')
      }
    } else {
      console.log('   ❌ User not found in database - this is the problem!')
      
      // Step 2: Check Supabase Auth
      console.log('\n2️⃣ Checking Supabase Auth...')
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (authError) {
        console.error('❌ Failed to get auth users:', authError)
        return
      }

      const authUser = authUsers.users.find(u => u.email === 'isak.parild@gmail.com')
      
      if (authUser) {
        console.log(`   ✅ Found in Supabase Auth`)
        console.log(`   🆔 Auth ID: ${authUser.id}`)
        console.log(`   📧 Email: ${authUser.email}`)
        
        // Step 3: Create missing user record
        console.log('\n3️⃣ Creating missing user record...')
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || 'Isak Parild',
            full_name: authUser.user_metadata?.full_name || 'Isak Parild',
            role: 'admin',
            verified: true,
            created_at: authUser.created_at,
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) {
          console.error('❌ Failed to create user record:', createError)
        } else {
          console.log('   ✅ User record created successfully!')
          console.log(`   🆔 Database ID: ${newUser.id}`)
          console.log(`   🎭 Role: ${newUser.role}`)
        }
      } else {
        console.log('   ❌ User not found in Supabase Auth either!')
        console.log('   💡 You may need to sign up/login first')
      }
    }

    // Step 4: Check all users and their roles
    console.log('\n4️⃣ Current user overview...')
    const { data: allUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, email, name, role, verified, created_at')
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('❌ Failed to get users:', usersError)
    } else {
      console.log(`   Found ${allUsers.length} users in database:`)
      allUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} - ${user.role} ${user.verified ? '✅' : '❌'}`)
      })
    }

    // Step 5: Test permissions
    console.log('\n5️⃣ Testing permissions system...')
    const { hasPermission } = await import('../lib/permissions')
    
    // Get the current user for testing
    const { data: currentUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', 'isak.parild@gmail.com')
      .single()
    
    if (currentUser) {
      const testUser = currentUser
      const permissions = [
        'articles:create',
        'articles:delete', 
        'users:delete',
        'users:create'
      ]

      permissions.forEach(permission => {
        const hasAccess = hasPermission(testUser, permission as any)
        console.log(`   ${permission}: ${hasAccess ? '✅' : '❌'}`)
      })
    }

    console.log('\n🎉 Diagnosis complete!')
    console.log('\n📋 Next steps:')
    console.log('   1. Restart your development server')
    console.log('   2. Clear your browser cookies/cache')
    console.log('   3. Log out and log back in')
    console.log('   4. You should now have full admin access!')

  } catch (error: any) {
    console.error(`❌ Script failed: ${error.message}`)
    console.log('\nTroubleshooting:')
    console.log('   - Make sure your Supabase connection is working')
    console.log('   - Check your environment variables in .env.local')
    console.log('   - Verify you have the correct service role key')
  }
}

if (require.main === module) {
  fixAdminPermissions().catch(console.error)
} 