import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    console.log('📄 Fetching categories from Supabase...')

    const { data: categories, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, slug, description, created_at')
      .order('name', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    console.log(`✅ Found ${categories?.length || 0} categories`)

    return NextResponse.json({
      categories: categories || []
    })

  } catch (error: any) {
    console.error('Categories API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch categories',
      message: error.message,
      categories: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const categoryData = await request.json()

    console.log('Creating new category:', categoryData)

    // Insert category into Supabase
    const { data: newCategory, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name: categoryData.name,
        slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryData.description || null
      })
      .select()
      .single()

    if (error) {
      console.error('Create category error:', error)
      throw error
    }

    console.log('✅ Category created successfully:', newCategory.id)

    return NextResponse.json({
      success: true,
      category: newCategory
    })

  } catch (error: any) {
    console.error('Create category API error:', error)
    return NextResponse.json({
      error: 'Failed to create category',
      message: error.message
    }, { status: 500 })
  }
} 