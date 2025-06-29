import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, FolderOpen, Eye, Plus, TrendingUp, Users, Image, Calendar, AlertCircle } from 'lucide-react'
import { requireAdmin } from '@/lib/auth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Get comprehensive stats from database
async function getDashboardStats() {
  try {
    const { supabaseAdmin } = await import('@/lib/supabase/server')
    
    // Parallel fetch of all statistics
    const [
      usersResult,
      articlesResult, 
      categoriesResult,
      mediaResult,
      publishedResult,
      draftResult,
      recentUsersResult
    ] = await Promise.all([
      supabaseAdmin.from('users').select('id', { count: 'exact' }),
      supabaseAdmin.from('articles').select('id', { count: 'exact' }),
      supabaseAdmin.from('categories').select('id', { count: 'exact' }),
      supabaseAdmin.from('media').select('id', { count: 'exact' }),
      supabaseAdmin.from('articles').select('id', { count: 'exact' }).eq('status', 'published'),
      supabaseAdmin.from('articles').select('id', { count: 'exact' }).eq('status', 'draft'),
      supabaseAdmin.from('users').select('id, created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ])

    return {
      totalUsers: usersResult.count || 0,
      totalArticles: articlesResult.count || 0,
      totalCategories: categoriesResult.count || 0,
      totalMedia: mediaResult.count || 0,
      publishedArticles: publishedResult.count || 0,
      draftArticles: draftResult.count || 0,
      recentSignups: recentUsersResult.data?.length || 0,
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    // Fallback to basic data
    return {
      totalUsers: 0,
      totalArticles: 0,
      totalCategories: 0,
      totalMedia: 0,
      publishedArticles: 0,
      draftArticles: 0,
      recentSignups: 0,
      lastUpdated: new Date().toISOString()
    }
  }
}

export default async function AdminDashboard() {
  // PHASE 1: Re-enabled authentication
  let user
  try {
    user = await requireAdmin()
  } catch (error) {
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Using fallback admin user for dashboard')
      user = { id: '988dba94-8c8e-4850-a33f-dc8f96b7a92a', email: 'admin@maxyourpoints.com', role: 'admin' }
    } else {
      throw error // Let the error propagate in production
    }
  }
  
  // Get real statistics from database
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the Max Your Points CMS
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentSignups} new this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedArticles} published, {stats.draftArticles} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              Content categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Media Files</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMedia}</div>
            <p className="text-xs text-muted-foreground">
              Images & files
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Articles
            </CardTitle>
            <CardDescription>
              Create and manage blog content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/articles/editor">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </Link>
            <Link href="/admin/articles">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Manage Articles
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>
              Organize content sections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/categories">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Manage Categories
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Media
            </CardTitle>
            <CardDescription>
              Upload and manage files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/media">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Media Library
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>
              Manage admin access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Coming Soon: Site Analytics
          </CardTitle>
          <CardDescription>
            Advanced tracking and performance insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              Site tracking, visitor analytics, and performance metrics will be available in the next update.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 