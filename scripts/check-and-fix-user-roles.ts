#!/usr/bin/env bun

import { supabaseAdmin } from '../lib/supabase/server'

async function checkAndFixUserRoles() {
  console.log('🔍 Checking current user roles...')
  
  try {
    // Get all users
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('*')
    
    if (error) {
      console.error('❌ Error fetching users:', error)
      return
    }
    
    console.log('\n📋 Current Users:')
    console.log('================')
    
    if (!users || users.length === 0) {
      console.log('No users found in database')
      return
    }
    
    for (const user of users) {
      console.log(`👤 ${user.email}`)
      console.log(`   - Role: ${user.role}`)
      console.log(`   - ID: ${user.id}`)
      console.log(`   - Created: ${user.created_at}`)
      console.log(`   - Verified: ${user.verified}`)
      console.log('')
    }
    
    // Check for admin emails that should have admin role
    const adminEmails = ['isak.parild@gmail.com', 'isak@maxyourpoints.com']
    const usersToUpdate = users.filter(user => 
      adminEmails.includes(user.email) && user.role !== 'admin'
    )
    
    if (usersToUpdate.length > 0) {
      console.log('🔧 Found users that need admin role update:')
      for (const user of usersToUpdate) {
        console.log(`   - ${user.email} (currently: ${user.role})`)
      }
      
      console.log('\n🔄 Updating user roles...')
      
      for (const user of usersToUpdate) {
        const { error: updateError } = await supabaseAdmin
          .from('users')
          .update({ role: 'admin' })
          .eq('id', user.id)
        
        if (updateError) {
          console.error(`❌ Failed to update ${user.email}:`, updateError)
        } else {
          console.log(`✅ Updated ${user.email} to admin role`)
        }
      }
    } else {
      console.log('✅ All admin users have correct roles')
    }
    
  } catch (error) {
    console.error('❌ Script error:', error)
  }
}

checkAndFixUserRoles().then(() => {
  console.log('\n🎉 User role check complete!')
  process.exit(0)
}) 