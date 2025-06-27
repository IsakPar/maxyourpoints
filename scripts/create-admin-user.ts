#!/usr/bin/env tsx

/**
 * Create Admin User in Supabase
 * Run this to create an admin user with a known password
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import bcrypt from 'bcryptjs'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function createAdminUser() {
  console.log('👤 Creating Admin User in Supabase...\n')

  try {
    const { supabaseAdmin } = await import('../lib/supabase/server')

    // Admin user details
    const adminEmail = 'isak@maxyourpoints.com'
    const adminPassword = 'admin123' // You can change this
    const adminName = 'Isak Parild'

    // Check if user already exists
    console.log('1️⃣ Checking if admin user exists...')
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('email', adminEmail)
      .single()

    if (existingUser) {
      console.log(`   ✅ Admin user already exists!`)
      console.log(`   📧 Email: ${existingUser.email}`)
      console.log(`   🎭 Role: ${existingUser.role}`)
      console.log(`   🔑 Password: ${adminPassword}`)
      console.log('\n🎉 You can login with these credentials!')
      return
    }

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      throw checkError
    }

    // Hash the password
    console.log('2️⃣ Hashing password...')
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Create the admin user
    console.log('3️⃣ Creating admin user...')
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('users')
      .insert({
        email: adminEmail,
        name: adminName,
        full_name: adminName,
        password_hash: hashedPassword,
        role: 'admin',
        verified: true
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    console.log('🎉 Admin user created successfully!\n')
    console.log('==========================================')
    console.log('🔐 ADMIN LOGIN CREDENTIALS')
    console.log('==========================================')
    console.log(`📧 Email: ${adminEmail}`)
    console.log(`🔑 Password: ${adminPassword}`)
    console.log(`🎭 Role: admin`)
    console.log(`🆔 User ID: ${newUser.id}`)
    console.log('==========================================')
    console.log('\n🚀 Next steps:')
    console.log('   1. Go to: http://localhost:3000/login')
    console.log('   2. Enter the credentials above')
    console.log('   3. Access your admin panel!')

  } catch (error: any) {
    console.log(`❌ Failed to create admin user: ${error.message}`)
    console.log('\nTroubleshooting:')
    console.log('   - Make sure your Supabase connection is working')
    console.log('   - Check that the users table exists')
    console.log('   - Verify your environment variables')
  }
}

if (require.main === module) {
  createAdminUser().catch(console.error)
} 