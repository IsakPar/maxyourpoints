import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Parser } from 'json2csv'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, format, period = '30', filters = {} } = body

    console.log(`📤 Exporting ${type} data in ${format} format for user: ${user.email}`)

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    let data: any[] = []
    let filename = ''

    switch (type) {
      case 'errors':
        data = await exportErrorData(supabase, startDate, endDate, filters)
        filename = `error-analytics-${period}days`
        break
      case 'performance':
        data = await exportPerformanceData(supabase, startDate, endDate, filters)
        filename = `performance-analytics-${period}days`
        break
      case 'analytics':
        data = await exportAnalyticsData(supabase, startDate, endDate, filters)
        filename = `website-analytics-${period}days`
        break
      case 'articles':
        data = await exportArticleData(supabase, startDate, endDate, filters)
        filename = `article-analytics-${period}days`
        break
      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
    }

    // Format data based on requested format
    switch (format) {
      case 'csv':
        const csv = await generateCSV(data)
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="${filename}.csv"`
          }
        })
      
      case 'json':
        const json = JSON.stringify({
          exportDate: new Date().toISOString(),
          period: `${period} days`,
          type,
          filters,
          data
        }, null, 2)
        return new NextResponse(json, {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}.json"`
          }
        })
      
      case 'pdf':
        // For PDF, we'll return structured data that the frontend can use to generate PDF
        return NextResponse.json({
          success: true,
          data,
          metadata: {
            exportDate: new Date().toISOString(),
            period: `${period} days`,
            type,
            filters,
            filename: `${filename}.pdf`
          }
        })
      
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}

async function exportErrorData(supabase: any, startDate: Date, endDate: Date, filters: any) {
  const query = supabase
    .from('error_logs')
    .select(`
      id,
      error_type,
      error_message,
      stack_trace,
      page_path,
      user_agent,
      timestamp,
      resolved,
      severity,
      occurrence_count,
      browser_name,
      browser_version,
      os_name,
      resolution_notes
    `)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: false })

  // Apply filters
  if (filters.severity) {
    query.eq('severity', filters.severity)
  }
  if (filters.errorType) {
    query.eq('error_type', filters.errorType)
  }
  if (filters.resolved !== undefined) {
    query.eq('resolved', filters.resolved)
  }
  if (filters.pagePath) {
    query.ilike('page_path', `%${filters.pagePath}%`)
  }

  const { data, error } = await query

  if (error) throw error

  return data.map(error => ({
    'Error ID': error.id,
    'Type': error.error_type,
    'Severity': error.severity || 'Unknown',
    'Message': error.error_message,
    'Page': error.page_path,
    'Browser': `${error.browser_name || 'Unknown'} ${error.browser_version || ''}`.trim(),
    'OS': error.os_name || 'Unknown',
    'Occurrences': error.occurrence_count || 1,
    'Resolved': error.resolved ? 'Yes' : 'No',
    'Timestamp': new Date(error.timestamp).toLocaleString(),
    'Resolution Notes': error.resolution_notes || '',
    'Stack Trace': error.stack_trace || ''
  }))
}

async function exportPerformanceData(supabase: any, startDate: Date, endDate: Date, filters: any) {
  const { data, error } = await supabase
    .from('page_views')
    .select(`
      page_path,
      lcp,
      fid,
      cls,
      page_load_time,
      timestamp,
      device_type,
      country,
      referrer_domain
    `)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .not('lcp', 'is', null)
    .order('timestamp', { ascending: false })

  if (error) throw error

  return data.map(record => ({
    'Page': record.page_path,
    'LCP (ms)': record.lcp,
    'FID (ms)': record.fid,
    'CLS': record.cls,
    'Load Time (ms)': record.page_load_time,
    'Device': record.device_type || 'Unknown',
    'Country': record.country || 'Unknown',
    'Referrer': record.referrer_domain || 'Direct',
    'Timestamp': new Date(record.timestamp).toLocaleString()
  }))
}

async function exportAnalyticsData(supabase: any, startDate: Date, endDate: Date, filters: any) {
  const { data, error } = await supabase
    .from('page_views')
    .select(`
      page_path,
      session_id,
      device_type,
      browser_name,
      browser_version,
      os_name,
      country,
      referrer_domain,
      timestamp,
      time_on_page,
      scroll_depth,
      is_bounce
    `)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: false })

  if (error) throw error

  return data.map(view => ({
    'Page': view.page_path,
    'Session ID': view.session_id,
    'Device': view.device_type || 'Unknown',
    'Browser': `${view.browser_name || 'Unknown'} ${view.browser_version || ''}`.trim(),
    'OS': view.os_name || 'Unknown',
    'Country': view.country || 'Unknown',
    'Referrer': view.referrer_domain || 'Direct',
    'Time on Page (s)': view.time_on_page || 0,
    'Scroll Depth (%)': view.scroll_depth || 0,
    'Bounce': view.is_bounce ? 'Yes' : 'No',
    'Timestamp': new Date(view.timestamp).toLocaleString()
  }))
}

async function exportArticleData(supabase: any, startDate: Date, endDate: Date, filters: any) {
  // First get article performance data
  const { data: views, error } = await supabase
    .from('page_views')
    .select(`
      page_path,
      time_on_page,
      scroll_depth,
      is_bounce,
      timestamp
    `)
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .like('page_path', '/blog/%')
    .order('timestamp', { ascending: false })

  if (error) throw error

  // Group by article and calculate metrics
  const articleMetrics: { [key: string]: any } = {}
  
  views.forEach(view => {
    const path = view.page_path
    if (!articleMetrics[path]) {
      articleMetrics[path] = {
        path,
        totalViews: 0,
        totalTimeOnPage: 0,
        totalScrollDepth: 0,
        bounces: 0,
        engagementScore: 0
      }
    }
    
    articleMetrics[path].totalViews++
    articleMetrics[path].totalTimeOnPage += view.time_on_page || 0
    articleMetrics[path].totalScrollDepth += view.scroll_depth || 0
    if (view.is_bounce) articleMetrics[path].bounces++
  })

  return Object.values(articleMetrics).map((article: any) => ({
    'Article Path': article.path,
    'Total Views': article.totalViews,
    'Avg Time on Page (s)': Math.round(article.totalTimeOnPage / article.totalViews),
    'Avg Scroll Depth (%)': Math.round(article.totalScrollDepth / article.totalViews),
    'Bounce Rate (%)': Math.round((article.bounces / article.totalViews) * 100),
    'Engagement Score': Math.round((
      (article.totalTimeOnPage / article.totalViews) * 0.4 +
      (article.totalScrollDepth / article.totalViews) * 0.3 +
      ((1 - article.bounces / article.totalViews) * 100) * 0.3
    ))
  }))
}

async function generateCSV(data: any[]): Promise<string> {
  if (data.length === 0) {
    return 'No data available for export'
  }

  try {
    const parser = new Parser()
    return parser.parse(data)
  } catch (error) {
    console.error('CSV generation error:', error)
    throw new Error('Failed to generate CSV')
  }
} 