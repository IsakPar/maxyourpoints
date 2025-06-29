import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // TEMPORARILY DISABLED FOR TESTING
    // const user = await verifyAuthUser(request)
    // if (!user) {
    //   return NextResponse.json({
    //     error: 'Unauthorized',
    //     message: 'Authentication required'
    //   }, { status: 401 })
    // }

    console.log('📁 Fetching subcategories from database...')

    // Simplified subcategories that work across all categories
    // TODO: Replace with actual database query once subcategories table is created
    const mockSubcategories = [
      // Airlines & Aviation subcategories (a55ae40e-8f31-43cb-a363-b9126a90c540)
      { id: 'sub-1', name: 'Reviews', category_id: 'a55ae40e-8f31-43cb-a363-b9126a90c540', slug: 'reviews' },
      { id: 'sub-2', name: 'News', category_id: 'a55ae40e-8f31-43cb-a363-b9126a90c540', slug: 'news' },
      { id: 'sub-3', name: 'Deals', category_id: 'a55ae40e-8f31-43cb-a363-b9126a90c540', slug: 'deals' },
      { id: 'sub-4', name: 'Guides', category_id: 'a55ae40e-8f31-43cb-a363-b9126a90c540', slug: 'guides' },
      
      // Credit Cards & Points subcategories (87b5aa6e-4a5b-495a-8489-e350717c3a39)
      { id: 'sub-5', name: 'Reviews', category_id: '87b5aa6e-4a5b-495a-8489-e350717c3a39', slug: 'reviews' },
      { id: 'sub-6', name: 'News', category_id: '87b5aa6e-4a5b-495a-8489-e350717c3a39', slug: 'news' },
      { id: 'sub-7', name: 'Deals', category_id: '87b5aa6e-4a5b-495a-8489-e350717c3a39', slug: 'deals' },
      { id: 'sub-8', name: 'Guides', category_id: '87b5aa6e-4a5b-495a-8489-e350717c3a39', slug: 'guides' },
      
      // Hotels & Trip Reports subcategories (f4874537-f296-4b1f-a8c1-464a23909f62)
      { id: 'sub-9', name: 'Reviews', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'reviews' },
      { id: 'sub-10', name: 'News', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'news' },
      { id: 'sub-11', name: 'Deals', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'deals' },
      { id: 'sub-12', name: 'Trip Reports', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'trip-reports' },
      { id: 'sub-17', name: 'Guides', category_id: 'f4874537-f296-4b1f-a8c1-464a23909f62', slug: 'guides' },
      
      // Travel Hacks & Deals subcategories (3fae5aa7-97ae-4c95-904e-79f5a11aea7a)
      { id: 'sub-13', name: 'Reviews', category_id: '3fae5aa7-97ae-4c95-904e-79f5a11aea7a', slug: 'reviews' },
      { id: 'sub-14', name: 'News', category_id: '3fae5aa7-97ae-4c95-904e-79f5a11aea7a', slug: 'news' },
      { id: 'sub-15', name: 'Deals', category_id: '3fae5aa7-97ae-4c95-904e-79f5a11aea7a', slug: 'deals' },
      { id: 'sub-16', name: 'Guides', category_id: '3fae5aa7-97ae-4c95-904e-79f5a11aea7a', slug: 'guides' }
    ]

    console.log(`✅ Found ${mockSubcategories.length} subcategories`)

    return NextResponse.json({
      success: true,
      subcategories: mockSubcategories,
      message: 'Mock data - subcategories table integration pending'
    })

  } catch (error: any) {
    console.error('Subcategories API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch subcategories',
      message: error.message
    }, { status: 500 })
  }
} 