import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Testing Supabase connection...')

    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from('articles')
      .select('count')
      .limit(1)

    if (connectionError) {
      throw new Error(`Connection failed: ${connectionError.message}`)
    }

    // Test 2: Check database tables
    const tableTests = []
    const tables = ['articles', 'categories', 'users', 'media']

    for (const table of tables) {
      try {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)

        tableTests.push({
          table,
          status: error ? 'error' : 'success',
          message: error ? error.message : 'Table accessible'
        })
      } catch (err: any) {
        tableTests.push({
          table,
          status: 'error',
          message: err.message
        })
      }
    }

    // Test 3: Environment variables check
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      DATABASE_URL: !!process.env.DATABASE_URL
    }

    // Test 4: Try a simple database operation
    let sampleData = null
    try {
      const { data: articles, error: articlesError } = await supabaseAdmin
        .from('articles')
        .select('id, title, status')
        .limit(3)

      if (!articlesError) {
        sampleData = articles
      }
    } catch (err) {
      // Non-fatal error
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tests: {
        connection: {
          status: 'success',
          message: 'Supabase connection successful'
        },
        tables: tableTests,
        environment: envCheck,
        sampleData: sampleData || 'No articles found (normal for new setup)'
      },
      summary: {
        tablesWorking: tableTests.filter(t => t.status === 'success').length,
        totalTables: tableTests.length,
        allEnvVarsPresent: Object.values(envCheck).every(Boolean)
      }
    })

  } catch (error: any) {
    console.error('❌ Supabase test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      troubleshooting: {
        commonIssues: [
          'Check if SUPABASE_SERVICE_ROLE_KEY is set correctly',
          'Verify NEXT_PUBLIC_SUPABASE_URL is correct',
          'Ensure database tables exist in Supabase',
          'Check if Row Level Security (RLS) is properly configured'
        ]
      }
    }, { status: 500 })
  }
} 