#!/usr/bin/env tsx

/**
 * Database Connection Test Script
 * Tests both frontend and backend Supabase connections
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

async function testFrontendConnection() {
  console.log('🌐 Testing Frontend Supabase Connection...\n')

  try {
    // Import the frontend client
    const { supabase } = await import('../lib/supabase/client')

    // Test 1: Basic connection
    console.log('1️⃣ Testing basic connection...')
    const { data, error } = await supabase.from('articles').select('count').limit(1)
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`)
      return false
    } else {
      console.log('   ✅ Frontend connection successful!')
    }

    // Test 2: Auth status
    console.log('2️⃣ Testing auth status...')
    const { data: { session } } = await supabase.auth.getSession()
    console.log(`   ℹ️ Auth session: ${session ? 'Active' : 'None (normal for test)'}`)

    return true
  } catch (error: any) {
    console.log(`   ❌ Frontend connection failed: ${error.message}`)
    return false
  }
}

async function testBackendConnection() {
  console.log('\n🔧 Testing Backend Supabase Connection...\n')

  try {
    // Import the server client
    const { supabaseAdmin } = await import('../lib/supabase/server')

    // Test 1: Service role connection
    console.log('1️⃣ Testing service role connection...')
    const { data, error } = await supabaseAdmin.from('articles').select('count').limit(1)
    
    if (error) {
      console.log(`   ❌ Error: ${error.message}`)
      return false
    } else {
      console.log('   ✅ Backend service role connection successful!')
    }

    // Test 2: Admin operations
    console.log('2️⃣ Testing admin operations access...')
    try {
      // Try to access user management (admin only)
      const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (usersError) {
        console.log(`   ⚠️ Admin access limited: ${usersError.message}`)
      } else {
        console.log(`   ✅ Admin operations working! Found ${users.users.length} users`)
      }
    } catch (adminError: any) {
      console.log(`   ⚠️ Admin operations issue: ${adminError.message}`)
    }

    return true
  } catch (error: any) {
    console.log(`   ❌ Backend connection failed: ${error.message}`)
    return false
  }
}

async function testDatabaseSchema() {
  console.log('\n🗄️ Testing Database Schema...\n')

  try {
    const { supabaseAdmin } = await import('../lib/supabase/server')

    // Check if required tables exist
    const tables = ['articles', 'categories', 'users', 'media']
    
    for (const table of tables) {
      console.log(`🔍 Checking table: ${table}`)
      try {
        const { data, error } = await supabaseAdmin.from(table).select('*').limit(1)
        
        if (error) {
          console.log(`   ❌ Table '${table}' error: ${error.message}`)
        } else {
          console.log(`   ✅ Table '${table}' exists and accessible`)
        }
      } catch (tableError: any) {
        console.log(`   ❌ Table '${table}' failed: ${tableError.message}`)
      }
    }

    return true
  } catch (error: any) {
    console.log(`   ❌ Schema test failed: ${error.message}`)
    return false
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔑 Testing Environment Variables...\n')

  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'DATABASE_URL'
  ]

  let allPresent = true

  for (const varName of requiredVars) {
    const value = process.env[varName]
    if (value) {
      const maskedValue = varName.includes('KEY') ? 
        `${value.substring(0, 10)}...${value.substring(value.length - 10)}` :
        value
      console.log(`✅ ${varName}: ${maskedValue}`)
    } else {
      console.log(`❌ ${varName}: Missing!`)
      allPresent = false
    }
  }

  return allPresent
}

async function main() {
  console.log('🧪 Supabase Database Connection Test\n')
  console.log('=====================================\n')

  const results = {
    env: false,
    frontend: false,
    backend: false,
    schema: false
  }

  // Test environment variables
  results.env = await testEnvironmentVariables()

  if (!results.env) {
    console.log('\n❌ Environment variables missing. Please check your .env.local file.')
    console.log('📋 Required variables:')
    console.log('   - NEXT_PUBLIC_SUPABASE_URL')
    console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.log('   - SUPABASE_SERVICE_ROLE_KEY')
    console.log('   - DATABASE_URL')
    process.exit(1)
  }

  // Test connections
  results.frontend = await testFrontendConnection()
  results.backend = await testBackendConnection()
  results.schema = await testDatabaseSchema()

  // Summary
  console.log('\n📊 Test Results Summary')
  console.log('=======================\n')
  console.log(`Environment Variables: ${results.env ? '✅' : '❌'}`)
  console.log(`Frontend Connection:   ${results.frontend ? '✅' : '❌'}`)
  console.log(`Backend Connection:    ${results.backend ? '✅' : '❌'}`)
  console.log(`Database Schema:       ${results.schema ? '✅' : '❌'}`)

  const allPassed = Object.values(results).every(result => result === true)
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.')
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above and fix the issues.')
  }

  console.log('\n🚀 Next steps:')
  if (allPassed) {
    console.log('   - Your database is ready to use!')
    console.log('   - You can start your development servers')
    console.log('   - Run: pnpm run dev')
  } else {
    console.log('   - Fix the failing tests above')
    console.log('   - Double-check your environment variables')
    console.log('   - Ensure your Supabase project is set up correctly')
  }
}

if (require.main === module) {
  main().catch(console.error)
} 