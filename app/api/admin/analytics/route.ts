import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireCMSAccess } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access - this handles authentication and authorization
    const authUser = await requireCMSAccess()

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const type = searchParams.get('type') || 'overview'

    console.log(`📊 Admin fetching analytics data: ${type}, period: ${period} days for user: ${authUser.email}`)

    const supabase = await createClient()

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))
    const endDate = new Date()

    let analyticsData = {}

    switch (type) {
      case 'overview':
        analyticsData = await getOverviewData(supabase, startDate, endDate)
        break
      case 'articles':
        return await getArticlesAnalytics(parseInt(period))
      
      case 'traffic':
        return await getTrafficAnalytics(parseInt(period))
      
      case 'newsletter':
        return await getNewsletterAnalytics(parseInt(period))
      
      case 'realtime':
        return await getRealTimeAnalytics()
      
      case 'performance':
        analyticsData = await getPerformanceData(supabase, startDate, endDate)
        break
      
      case 'errors':
        analyticsData = await getErrorData(supabase, startDate, endDate)
        break
      
      case 'audience':
        analyticsData = await getAudienceData(supabase, startDate, endDate)
        break
      
      case 'conversions':
        analyticsData = await getConversionData(supabase, startDate, endDate)
        break
      
      case 'behavior':
        analyticsData = await getBehaviorData(supabase, startDate, endDate)
        break
      
      case 'time-based':
        analyticsData = await getTimeBasedData(supabase, startDate, endDate)
        break
      
      case 'alerts':
        analyticsData = await getPerformanceAlerts(supabase)
        break
      
      case 'engagement':
        analyticsData = await getEngagementScores(supabase, startDate, endDate)
        break
      
      case 'page-performance':
        analyticsData = await getPagePerformanceRanking(supabase, startDate, endDate)
        break
      
      case 'page-popularity':
        analyticsData = await getPagePopularityRanking(supabase, startDate, endDate)
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        )
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}

async function getOverviewData(supabase: any, startDate: Date, endDate: Date) {
  // Page views and sessions
  const { data: pageViews } = await supabase
    .from('page_views')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .gte('first_visit', startDate.toISOString())
    .lte('first_visit', endDate.toISOString())

  // Calculate metrics
  const totalPageViews = pageViews?.length || 0
  const totalSessions = sessions?.length || 0
  const uniqueVisitors = new Set(sessions?.map(s => s.session_id)).size
  const bounceRate = sessions?.filter(s => s.is_bounce).length / Math.max(totalSessions, 1) * 100

  // Top pages
  const pageViewCounts = pageViews?.reduce((acc: any, view: any) => {
    acc[view.page_path] = (acc[view.page_path] || 0) + 1
    return acc
  }, {}) || {}

  const topPages = Object.entries(pageViewCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a: any, b: any) => b.views - a.views)
    .slice(0, 10)

  // Traffic sources
  const trafficSources = sessions?.reduce((acc: any, session: any) => {
    const source = getTrafficSource(session.referrer)
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {}) || {}

  // Device breakdown
  const deviceBreakdown = sessions?.reduce((acc: any, session: any) => {
    acc[session.device_type] = (acc[session.device_type] || 0) + 1
    return acc
  }, {}) || {}

  return {
    summary: {
      totalPageViews,
      totalSessions,
      uniqueVisitors,
      bounceRate: Math.round(bounceRate * 100) / 100,
      avgSessionDuration: sessions?.reduce((acc, s) => acc + (s.total_time_spent || 0), 0) / Math.max(totalSessions, 1)
    },
    topPages,
    trafficSources,
    deviceBreakdown,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }
}

async function getArticlesAnalytics(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get top articles by views
  const { data: topArticles } = await supabaseAdmin
    .from('article_analytics')
    .select(`
      article_id,
      articles!inner(title, slug),
      page_view_count,
      unique_view,
      time_on_page,
      scroll_depth,
      reading_progress,
      article_completed,
      newsletter_signup_from_article
    `)
    .gte('created_at', startDate.toISOString())

  // Aggregate article data
  const articleStats = topArticles?.reduce((acc, item) => {
    const articleId = item.article_id
    if (!acc[articleId]) {
      acc[articleId] = {
        id: articleId,
        title: item.articles?.[0]?.title || 'Unknown Article',
        slug: item.articles?.[0]?.slug || 'unknown',
        totalViews: 0,
        uniqueViews: 0,
        avgTimeOnPage: 0,
        avgScrollDepth: 0,
        avgReadingProgress: 0,
        completionRate: 0,
        newsletterConversions: 0,
        viewCount: 0
      }
    }

    acc[articleId].totalViews += item.page_view_count || 1
    acc[articleId].uniqueViews += item.unique_view ? 1 : 0
    acc[articleId].avgTimeOnPage += item.time_on_page || 0
    acc[articleId].avgScrollDepth += item.scroll_depth || 0
    acc[articleId].avgReadingProgress += item.reading_progress || 0
    acc[articleId].completionRate += item.article_completed ? 1 : 0
    acc[articleId].newsletterConversions += item.newsletter_signup_from_article ? 1 : 0
    acc[articleId].viewCount += 1

    return acc
  }, {} as Record<string, any>) || {}

  // Calculate averages and sort by total views
  const articleList = Object.values(articleStats)
    .map((article: any) => ({
      ...article,
      avgTimeOnPage: Math.round(article.avgTimeOnPage / article.viewCount),
      avgScrollDepth: Math.round((article.avgScrollDepth / article.viewCount) * 100) / 100,
      avgReadingProgress: Math.round((article.avgReadingProgress / article.viewCount) * 100) / 100,
      completionRate: Math.round((article.completionRate / article.viewCount) * 100),
      conversionRate: Math.round((article.newsletterConversions / article.viewCount) * 100)
    }))
    .sort((a, b) => b.totalViews - a.totalViews)
    .slice(0, 20) // Top 20 articles

  return NextResponse.json({
    period: `${days} days`,
    articles: articleList
  })
}

async function getTrafficAnalytics(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get traffic source breakdown
  const { data: trafficData } = await supabaseAdmin
    .from('article_analytics')
    .select('traffic_source, device_type, created_at')
    .gte('created_at', startDate.toISOString())

  // Aggregate traffic data
  const trafficSources = trafficData?.reduce((acc, item) => {
    const source = item.traffic_source || 'unknown'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  const deviceTypes = trafficData?.reduce((acc, item) => {
    const device = item.device_type || 'unknown'
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Get daily traffic for chart
  const dailyTraffic = trafficData?.reduce((acc, item) => {
    const date = item.created_at.split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, views: 0 }
    }
    acc[date].views += 1
    return acc
  }, {} as Record<string, any>) || {}

  return NextResponse.json({
    period: `${days} days`,
    trafficSources,
    deviceTypes,
    dailyTraffic: Object.values(dailyTraffic).sort((a: any, b: any) => a.date.localeCompare(b.date))
  })
}

async function getNewsletterAnalytics(days: number) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get newsletter signup sources
  const { data: signupSources } = await supabaseAdmin
    .from('newsletter_analytics')
    .select('subscription_source, subscribed_at')
    .gte('subscribed_at', startDate.toISOString())

  const sourceBreakdown = signupSources?.reduce((acc, item) => {
    const source = item.subscription_source || 'unknown'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>) || {}

  // Get newsletter performance data
  const { data: campaigns } = await supabaseAdmin
    .from('newsletter_campaigns')
    .select(`
      id,
      subject,
      sent_at,
      recipient_count,
      open_count,
      click_count
    `)
    .gte('sent_at', startDate.toISOString())
    .order('sent_at', { ascending: false })

  return NextResponse.json({
    period: `${days} days`,
    signupSources: sourceBreakdown,
    campaigns: campaigns || [],
    totalSignups: Object.values(sourceBreakdown).reduce((sum, count) => sum + count, 0)
  })
}

async function getRealTimeAnalytics() {
  // Get recent events (last hour)
  const oneHourAgo = new Date()
  oneHourAgo.setHours(oneHourAgo.getHours() - 1)

  const { data: recentEvents } = await supabaseAdmin
    .from('analytics_events')
    .select(`
      event_type,
      created_at,
      article_id,
      articles!inner(title, slug)
    `)
    .gte('created_at', oneHourAgo.toISOString())
    .order('created_at', { ascending: false })
    .limit(50)

  // Count active sessions (last 30 minutes)
  const thirtyMinutesAgo = new Date()
  thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30)

  const { data: activeSessions } = await supabaseAdmin
    .from('analytics_events')
    .select('session_id')
    .gte('created_at', thirtyMinutesAgo.toISOString())

  const uniqueSessions = new Set(activeSessions?.map(item => item.session_id) || []).size

  // Get most viewed articles in last hour
  const articleViews = recentEvents?.reduce((acc, event) => {
    if (event.event_type === 'page_view' && event.article_id) {
      const key = event.article_id
      if (!acc[key]) {
        acc[key] = {
          articleId: event.article_id,
          title: event.articles?.[0]?.title || 'Unknown Article',
          slug: event.articles?.[0]?.slug || 'unknown',
          views: 0
        }
      }
      acc[key].views += 1
    }
    return acc
  }, {} as Record<string, any>) || {}

  const topCurrentArticles = Object.values(articleViews)
    .sort((a: any, b: any) => b.views - a.views)
    .slice(0, 5)

  return NextResponse.json({
    currentVisitors: uniqueSessions,
    recentEvents: recentEvents?.slice(0, 20) || [],
    topCurrentArticles,
    lastUpdated: new Date().toISOString()
  })
}

async function getPerformanceData(supabase: any, startDate: Date, endDate: Date) {
  // Core Web Vitals averages using database function
  const { data: webVitals } = await supabase
    .rpc('get_core_web_vitals_averages', {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    })

  // Performance trends using database function
  const { data: trends } = await supabase
    .rpc('get_performance_trends', {
      days: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    })

  // Get raw performance metrics for analysis
  const { data: rawMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: false })
    .limit(1000)

  // Calculate performance scores and ratings
  const vitalsData = webVitals?.[0] || {}
  
  const performanceScores = {
    lcp: {
      value: vitalsData.avg_lcp || 0,
      score: getLCPScore(vitalsData.avg_lcp || 0),
      goodPercentage: vitalsData.good_lcp_percentage || 0,
      rating: getLCPRating(vitalsData.avg_lcp || 0)
    },
    fid: {
      value: vitalsData.avg_fid || 0,
      score: getFIDScore(vitalsData.avg_fid || 0),
      goodPercentage: vitalsData.good_fid_percentage || 0,
      rating: getFIDRating(vitalsData.avg_fid || 0)
    },
    cls: {
      value: vitalsData.avg_cls || 0,
      score: getCLSScore(vitalsData.avg_cls || 0),
      goodPercentage: vitalsData.good_cls_percentage || 0,
      rating: getCLSRating(vitalsData.avg_cls || 0)
    }
  }

  // Page performance breakdown
  const pagePerformance = rawMetrics?.reduce((acc: any, metric: any) => {
    if (!acc[metric.page_path]) {
      acc[metric.page_path] = {
        path: metric.page_path,
        count: 0,
        avgLcp: 0,
        avgFid: 0,
        avgCls: 0,
        avgLoadTime: 0
      }
    }
    
    const page = acc[metric.page_path]
    page.count++
    page.avgLcp = ((page.avgLcp * (page.count - 1)) + (metric.lcp || 0)) / page.count
    page.avgFid = ((page.avgFid * (page.count - 1)) + (metric.fid || 0)) / page.count
    page.avgCls = ((page.avgCls * (page.count - 1)) + (metric.cls || 0)) / page.count
    page.avgLoadTime = ((page.avgLoadTime * (page.count - 1)) + (metric.window_load_time || 0)) / page.count
    
    return acc
  }, {}) || {}

  const topPerformanceIssues = Object.values(pagePerformance)
    .sort((a: any, b: any) => (b.avgLcp + b.avgFid * 10) - (a.avgLcp + a.avgFid * 10))
    .slice(0, 10)

  return {
    coreWebVitals: performanceScores,
    trends: trends || [],
    totalMeasurements: vitalsData.total_measurements || 0,
    pagePerformance: topPerformanceIssues,
    recommendations: generatePerformanceRecommendations(performanceScores),
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }
}

async function getErrorData(supabase: any, startDate: Date, endDate: Date) {
  const { data: errors } = await supabase
    .from('error_logs')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .order('timestamp', { ascending: false })

  // Error breakdown by type
  const errorsByType = errors?.reduce((acc: any, error: any) => {
    acc[error.error_type] = (acc[error.error_type] || 0) + 1
    return acc
  }, {}) || {}

  // Error breakdown by page
  const errorsByPage = errors?.reduce((acc: any, error: any) => {
    acc[error.page_path] = (acc[error.page_path] || 0) + 1
    return acc
  }, {}) || {}

  // Most common errors
  const commonErrors = errors?.reduce((acc: any, error: any) => {
    const key = error.error_message.substring(0, 100) // First 100 chars
    if (!acc[key]) {
      acc[key] = {
        message: error.error_message,
        count: 0,
        lastSeen: error.timestamp,
        type: error.error_type
      }
    }
    acc[key].count++
    if (new Date(error.timestamp) > new Date(acc[key].lastSeen)) {
      acc[key].lastSeen = error.timestamp
    }
    return acc
  }, {}) || {}

  const topErrors = Object.values(commonErrors)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10)

  return {
    totalErrors: errors?.length || 0,
    errorsByType,
    errorsByPage: Object.entries(errorsByPage)
      .map(([path, count]) => ({ path, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10),
    commonErrors: topErrors,
    recentErrors: errors?.slice(0, 20) || [],
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }
}

// Helper functions for performance scoring
function getLCPScore(lcp: number): number {
  if (lcp <= 2500) return 100
  if (lcp <= 4000) return 70
  return 30
}

function getFIDScore(fid: number): number {
  if (fid <= 100) return 100
  if (fid <= 300) return 70
  return 30
}

function getCLSScore(cls: number): number {
  if (cls <= 0.1) return 100
  if (cls <= 0.25) return 70
  return 30
}

function getLCPRating(lcp: number): 'good' | 'needs-improvement' | 'poor' {
  if (lcp <= 2500) return 'good'
  if (lcp <= 4000) return 'needs-improvement'
  return 'poor'
}

function getFIDRating(fid: number): 'good' | 'needs-improvement' | 'poor' {
  if (fid <= 100) return 'good'
  if (fid <= 300) return 'needs-improvement'
  return 'poor'
}

function getCLSRating(cls: number): 'good' | 'needs-improvement' | 'poor' {
  if (cls <= 0.1) return 'good'
  if (cls <= 0.25) return 'needs-improvement'
  return 'poor'
}

function getTrafficSource(referrer: string | null): string {
  if (!referrer) return 'Direct'
  
  const url = new URL(referrer)
  const domain = url.hostname.toLowerCase()
  
  if (domain.includes('google')) return 'Google'
  if (domain.includes('facebook')) return 'Facebook'
  if (domain.includes('twitter') || domain.includes('t.co')) return 'Twitter'
  if (domain.includes('linkedin')) return 'LinkedIn'
  if (domain.includes('instagram')) return 'Instagram'
  if (domain.includes('youtube')) return 'YouTube'
  if (domain.includes('reddit')) return 'Reddit'
  if (domain.includes('pinterest')) return 'Pinterest'
  
  return 'Other'
}

function generatePerformanceRecommendations(scores: any): Array<{
  type: 'critical' | 'warning' | 'info'
  metric: string
  title: string
  description: string
  action: string
}> {
  const recommendations: Array<{
    type: 'critical' | 'warning' | 'info'
    metric: string
    title: string
    description: string
    action: string
  }> = []

  if (scores.lcp.score < 70) {
    recommendations.push({
      type: scores.lcp.score < 30 ? 'critical' : 'warning',
      metric: 'LCP',
      title: 'Improve Largest Contentful Paint',
      description: `Your LCP is ${Math.round(scores.lcp.value)}ms, which is ${scores.lcp.rating}`,
      action: 'Optimize images, improve server response times, and eliminate render-blocking resources'
    })
  }

  if (scores.fid.score < 70) {
    recommendations.push({
      type: scores.fid.score < 30 ? 'critical' : 'warning',
      metric: 'FID',
      title: 'Reduce First Input Delay',
      description: `Your FID is ${Math.round(scores.fid.value)}ms, which is ${scores.fid.rating}`,
      action: 'Reduce JavaScript execution time, break up long tasks, and optimize third-party code'
    })
  }

  if (scores.cls.score < 70) {
    recommendations.push({
      type: scores.cls.score < 30 ? 'critical' : 'warning',
      metric: 'CLS',
      title: 'Minimize Cumulative Layout Shift',
      description: `Your CLS is ${scores.cls.value.toFixed(3)}, which is ${scores.cls.rating}`,
      action: 'Add size attributes to images and videos, avoid inserting content above existing content'
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      type: 'info',
      metric: 'Overall',
      title: 'Great Performance!',
      description: 'Your Core Web Vitals are performing well',
      action: 'Continue monitoring and maintain current optimization practices'
    })
  }

  return recommendations
}

// 👥 Audience Insights
async function getAudienceData(supabase: any, startDate: Date, endDate: Date) {
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .gte('first_visit', startDate.toISOString())
    .lte('first_visit', endDate.toISOString())

  const { data: pageViews } = await supabase
    .from('page_views')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  // Demographics
  const countryBreakdown = sessions?.reduce((acc: any, session: any) => {
    const country = session.country || 'Unknown'
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {}) || {}

  const cityBreakdown = sessions?.reduce((acc: any, session: any) => {
    const city = session.city || 'Unknown'
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {}) || {}

  // Device & Browser Analytics
  const deviceBreakdown = sessions?.reduce((acc: any, session: any) => {
    acc[session.device_type] = (acc[session.device_type] || 0) + 1
    return acc
  }, {}) || {}

  const browserBreakdown = sessions?.reduce((acc: any, session: any) => {
    acc[session.browser] = (acc[session.browser] || 0) + 1
    return acc
  }, {}) || {}

  const osBreakdown = sessions?.reduce((acc: any, session: any) => {
    acc[session.os] = (acc[session.os] || 0) + 1
    return acc
  }, {}) || {}

  // Visitor Types
  const newVsReturning = sessions?.reduce((acc: any, session: any) => {
    const type = session.is_new_visitor ? 'New' : 'Returning'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {}) || {}

  // User Engagement
  const engagementSegments = sessions?.reduce((acc: any, session: any) => {
    const timeSpent = session.total_time_spent || 0
    let segment = 'Low (0-30s)'
    if (timeSpent > 300) segment = 'High (5min+)'
    else if (timeSpent > 120) segment = 'Medium (2-5min)'
    else if (timeSpent > 30) segment = 'Normal (30s-2min)'
    
    acc[segment] = (acc[segment] || 0) + 1
    return acc
  }, {}) || {}

  return {
    demographics: {
      countries: Object.entries(countryBreakdown)
        .map(([country, count]) => ({ country, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10),
      cities: Object.entries(cityBreakdown)
        .map(([city, count]) => ({ city, count }))
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, 10)
    },
    technology: {
      devices: deviceBreakdown,
      browsers: browserBreakdown,
      operatingSystems: osBreakdown
    },
    visitorTypes: newVsReturning,
    engagement: engagementSegments,
    totalVisitors: sessions?.length || 0
  }
}

// 📈 Conversion Tracking
async function getConversionData(supabase: any, startDate: Date, endDate: Date) {
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .gte('first_visit', startDate.toISOString())
    .lte('first_visit', endDate.toISOString())

  const { data: pageViews } = await supabase
    .from('page_views')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  // Newsletter Signups
  const { data: newsletterSignups } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .gte('confirmed_at', startDate.toISOString())
    .lte('confirmed_at', endDate.toISOString())

  // Conversion Funnel
  const totalVisitors = sessions?.length || 0
  const newsletterSignupCount = newsletterSignups?.length || 0
  const uniqueArticleReaders = new Set(sessions?.filter(s => (s.total_time_spent || 0) > 60).map(s => s.session_id)).size

  // Conversion by Traffic Source
  const conversionBySource = sessions?.reduce((acc: any, session: any) => {
    const source = getTrafficSource(session.referrer)
    if (!acc[source]) {
      acc[source] = { visitors: 0, conversions: 0 }
    }
    acc[source].visitors += 1
    
    // Check if this session led to a newsletter signup
    const sessionSignup = newsletterSignups?.find(signup => 
      Math.abs(new Date(signup.confirmed_at).getTime() - new Date(session.first_visit).getTime()) < 3600000 // Within 1 hour
    )
    if (sessionSignup) {
      acc[source].conversions += 1
    }
    
    return acc
  }, {}) || {}

  // Top Converting Pages
  const pageConversions = pageViews?.reduce((acc: any, view: any) => {
    const page = view.page_path
    if (!acc[page]) {
      acc[page] = { views: 0, conversions: 0 }
    }
    acc[page].views += 1
    return acc
  }, {}) || {}

  // Calculate conversion rates
  Object.keys(conversionBySource).forEach(source => {
    const data = conversionBySource[source]
    data.conversionRate = data.visitors > 0 ? (data.conversions / data.visitors * 100) : 0
  })

  return {
    overview: {
      totalVisitors,
      newsletterSignups: newsletterSignupCount,
      conversionRate: totalVisitors > 0 ? (newsletterSignupCount / totalVisitors * 100) : 0,
      engagedReaders: uniqueArticleReaders,
      engagementRate: totalVisitors > 0 ? (uniqueArticleReaders / totalVisitors * 100) : 0
    },
    conversionFunnel: [
      { stage: 'Visitors', count: totalVisitors, rate: 100 },
      { stage: 'Engaged Readers', count: uniqueArticleReaders, rate: totalVisitors > 0 ? (uniqueArticleReaders / totalVisitors * 100) : 0 },
      { stage: 'Newsletter Signups', count: newsletterSignupCount, rate: totalVisitors > 0 ? (newsletterSignupCount / totalVisitors * 100) : 0 }
    ],
    conversionBySource: Object.entries(conversionBySource)
      .map(([source, data]: [string, any]) => ({ source, ...data }))
      .sort((a: any, b: any) => b.conversionRate - a.conversionRate),
    topConvertingPages: Object.entries(pageConversions)
      .map(([page, data]: [string, any]) => ({ page, ...data }))
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, 10)
  }
}

// 🎯 User Behavior
async function getBehaviorData(supabase: any, startDate: Date, endDate: Date) {
  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .gte('first_visit', startDate.toISOString())
    .lte('first_visit', endDate.toISOString())

  const { data: pageViews } = await supabase
    .from('page_views')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  const { data: performanceMetrics } = await supabase
    .from('performance_metrics')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  // User Flow Analysis
  const userFlows = sessions?.reduce((acc: any, session: any) => {
    const pages = session.pages_visited || 1
    let category = 'Single Page'
    if (pages > 5) category = 'Deep Explorer (5+ pages)'
    else if (pages > 3) category = 'Multi-Page (3-5 pages)'
    else if (pages > 1) category = 'Browse (2-3 pages)'
    
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {}) || {}

  // Scroll Depth Analysis
  const scrollDepthRanges = performanceMetrics?.reduce((acc: any, metric: any) => {
    const depth = metric.scroll_depth || 0
    let range = '0-25%'
    if (depth > 0.75) range = '75-100%'
    else if (depth > 0.5) range = '50-75%'
    else if (depth > 0.25) range = '25-50%'
    
    acc[range] = (acc[range] || 0) + 1
    return acc
  }, {}) || {}

  // Time on Page Distribution
  const timeDistribution = sessions?.reduce((acc: any, session: any) => {
    const time = session.total_time_spent || 0
    let range = '0-10s'
    if (time > 300) range = '5min+'
    else if (time > 180) range = '3-5min'
    else if (time > 120) range = '2-3min'
    else if (time > 60) range = '1-2min'
    else if (time > 30) range = '30s-1min'
    else if (time > 10) range = '10-30s'
    
    acc[range] = (acc[range] || 0) + 1
    return acc
  }, {}) || {}

  // Bounce Rate by Entry Page
  const entryPageBounces = sessions?.reduce((acc: any, session: any) => {
    const entryPage = session.entry_page || 'Unknown'
    if (!acc[entryPage]) {
      acc[entryPage] = { total: 0, bounces: 0 }
    }
    acc[entryPage].total += 1
    if (session.is_bounce) {
      acc[entryPage].bounces += 1
    }
    return acc
  }, {}) || {}

  // Calculate bounce rates
  Object.keys(entryPageBounces).forEach(page => {
    const data = entryPageBounces[page]
    data.bounceRate = data.total > 0 ? (data.bounces / data.total * 100) : 0
  })

  return {
    userFlows,
    scrollDepth: scrollDepthRanges,
    timeDistribution,
    bounceRates: Object.entries(entryPageBounces)
      .map(([page, data]: [string, any]) => ({ page, ...data }))
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 10),
    averages: {
      avgTimeOnSite: sessions?.reduce((acc, s) => acc + (s.total_time_spent || 0), 0) / Math.max(sessions?.length || 1, 1),
      avgPagesPerSession: sessions?.reduce((acc, s) => acc + (s.pages_visited || 1), 0) / Math.max(sessions?.length || 1, 1),
      avgScrollDepth: performanceMetrics?.reduce((acc, m) => acc + (m.scroll_depth || 0), 0) / Math.max(performanceMetrics?.length || 1, 1) * 100
    }
  }
}

// ⏱️ Time-Based Analytics
async function getTimeBasedData(supabase: any, startDate: Date, endDate: Date) {
  const { data: pageViews } = await supabase
    .from('page_views')
    .select('*')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())

  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('*')
    .gte('first_visit', startDate.toISOString())
    .lte('first_visit', endDate.toISOString())

  // Hourly distribution
  const hourlyData = pageViews?.reduce((acc: any, view: any) => {
    const hour = new Date(view.timestamp).getHours()
    acc[hour] = (acc[hour] || 0) + 1
    return acc
  }, {}) || {}

  // Daily distribution
  const dailyData = pageViews?.reduce((acc: any, view: any) => {
    const day = new Date(view.timestamp).toLocaleDateString()
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {}) || {}

  // Weekly patterns
  const weeklyData = pageViews?.reduce((acc: any, view: any) => {
    const dayOfWeek = new Date(view.timestamp).toLocaleDateString('en-US', { weekday: 'long' })
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
    return acc
  }, {}) || {}

  // Growth trends (compare periods)
  const midPoint = new Date((startDate.getTime() + endDate.getTime()) / 2)
  const firstHalf = pageViews?.filter(view => new Date(view.timestamp) < midPoint).length || 0
  const secondHalf = pageViews?.filter(view => new Date(view.timestamp) >= midPoint).length || 0
  const growthRate = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf * 100) : 0

  // Peak hours analysis
  const peakHour = Object.entries(hourlyData)
    .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || '0'

  const peakDay = Object.entries(weeklyData)
    .sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'Monday'

  return {
    hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
      hour: `${hour}:00`,
      views: hourlyData[hour] || 0
    })),
    dailyTrend: Object.entries(dailyData)
      .map(([date, views]) => ({ date, views }))
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    weeklyPattern: weeklyData,
    growth: {
      rate: Math.round(growthRate * 100) / 100,
      trend: growthRate > 0 ? 'increasing' : growthRate < 0 ? 'decreasing' : 'stable',
      firstHalfViews: firstHalf,
      secondHalfViews: secondHalf
    },
    insights: {
      peakHour: `${peakHour}:00`,
      peakDay,
      totalSessions: sessions?.length || 0,
      avgDailyViews: Math.round((pageViews?.length || 0) / Math.max(Object.keys(dailyData).length, 1))
    }
  }
}

// ================================================
// PHASE 1 ENHANCEMENT FUNCTIONS
// ================================================

async function getPerformanceAlerts(supabase: any) {
  // Get unacknowledged performance alerts
  const { data: alerts } = await supabase
    .from('performance_alerts')
    .select('*')
    .eq('is_acknowledged', false)
    .order('created_at', { ascending: false })
    .limit(50)

  // Get performance budget violations from recent data
  const { data: recentMetrics } = await supabase
    .from('performance_metrics')
    .select('page_path, lcp, fid, cls, ttfb, timestamp')
    .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
    .order('timestamp', { ascending: false })

  // Check for budget violations
  const budgetViolations: any[] = []
  const budgetThresholds = {
    lcp: { good: 2500, poor: 4000 },
    fid: { good: 100, poor: 300 },
    cls: { good: 0.1, poor: 0.25 },
    ttfb: { good: 600, poor: 1000 }
  }

  for (const metric of recentMetrics || []) {
    // Check specific metrics with proper type casting
    const metricsToCheck = ['lcp', 'fid', 'cls', 'ttfb']
    
    for (const metricName of metricsToCheck) {
      const value = metric[metricName as keyof typeof metric]
      if (value != null && typeof value === 'number' && metricName in budgetThresholds) {
        const thresholds = budgetThresholds[metricName as keyof typeof budgetThresholds]
        if (value > thresholds.poor) {
          budgetViolations.push({
            id: `violation-${Date.now()}-${Math.random()}`,
            metric_name: metricName,
            page_path: metric.page_path,
            alert_type: 'budget_exceeded',
            current_value: value,
            threshold_value: thresholds.poor,
            severity: 'critical',
            created_at: metric.timestamp
          })
        } else if (value > thresholds.good) {
          budgetViolations.push({
            id: `violation-${Date.now()}-${Math.random()}`,
            metric_name: metricName,
            page_path: metric.page_path,
            alert_type: 'budget_exceeded',
            current_value: value,
            threshold_value: thresholds.good,
            severity: 'warning',
            created_at: metric.timestamp
          })
        }
      }
    }
  }

  return {
    activeAlerts: alerts || [],
    budgetViolations: budgetViolations.slice(0, 20), // Latest 20 violations
    totalAlerts: (alerts?.length || 0) + budgetViolations.length,
    criticalCount: [...(alerts || []), ...budgetViolations].filter(a => a.severity === 'critical').length,
    warningCount: [...(alerts || []), ...budgetViolations].filter(a => a.severity === 'warning').length
  }
}

async function getEngagementScores(supabase: any, startDate: Date, endDate: Date) {
  // Get page views excluding admin pages
  const { data: pageViews } = await supabase
    .from('page_views')
    .select('page_path, session_id')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .not('page_path', 'like', '/admin%')

  const { data: sessions } = await supabase
    .from('user_sessions')
    .select('session_id, total_time_spent, is_bounce')
    .gte('first_visit', startDate.toISOString())
    .lte('first_visit', endDate.toISOString())

  const { data: performanceMetrics } = await supabase
    .from('performance_metrics')
    .select('page_path, scroll_depth')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .not('page_path', 'like', '/admin%')

  // Group metrics by page
  const pageMetrics = (pageViews || []).reduce((acc: any, view: any) => {
    if (!acc[view.page_path]) {
      acc[view.page_path] = {
        page_path: view.page_path,
        views: 0,
        totalTime: 0,
        scrollDepth: 0,
        bounces: 0,
        conversions: 0,
        sessions: new Set()
      }
    }
    acc[view.page_path].views += 1
    acc[view.page_path].sessions.add(view.session_id)
    return acc
  }, {})

  // Add session data
  ;(sessions || []).forEach((session: any) => {
    Object.values(pageMetrics).forEach((page: any) => {
      if (page.sessions.has(session.session_id)) {
        page.totalTime += session.total_time_spent || 0
        if (session.is_bounce) page.bounces += 1
      }
    })
  })

  // Add scroll depth data
  ;(performanceMetrics || []).forEach((metric: any) => {
    if (pageMetrics[metric.page_path]) {
      pageMetrics[metric.page_path].scrollDepth += metric.scroll_depth || 0
    }
  })

  // Calculate engagement scores
  const engagementScores = Object.values(pageMetrics).map((page: any) => {
    const sessionCount = page.sessions.size
    const avgTimeOnPage = sessionCount > 0 ? page.totalTime / sessionCount : 0
    const avgScrollDepth = page.views > 0 ? (page.scrollDepth / page.views) * 100 : 0
    const bounceRate = sessionCount > 0 ? (page.bounces / sessionCount) * 100 : 0
    const conversionRate = 0 // TODO: Add conversion tracking

    // Calculate engagement score (0-100)
    const timeScore = Math.min(25, Math.round(avgTimeOnPage / 12))
    const scrollScore = Math.min(25, Math.round(avgScrollDepth / 4))
    const interactionScore = Math.min(25, Math.round((100 - bounceRate) / 4))
    const conversionScore = Math.min(25, Math.round(conversionRate))

    const totalScore = timeScore + scrollScore + interactionScore + conversionScore

    return {
      page_path: page.page_path,
      total_engagement_score: totalScore,
      avg_time_on_page: Math.round(avgTimeOnPage),
      avg_scroll_depth: Math.round(avgScrollDepth * 10) / 10,
      bounce_rate: Math.round(bounceRate * 10) / 10,
      conversion_rate: conversionRate,
      total_views: page.views,
      unique_sessions: sessionCount
    }
  }).sort((a, b) => b.total_engagement_score - a.total_engagement_score)

  return {
    topPerformingPages: engagementScores.slice(0, 10),
    averageEngagement: Math.round(engagementScores.reduce((sum, page) => sum + page.total_engagement_score, 0) / Math.max(engagementScores.length, 1)),
    totalPages: engagementScores.length,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }
}

async function getPagePerformanceRanking(supabase: any, startDate: Date, endDate: Date) {
  // Get performance metrics for all pages (excluding admin)
  const { data: performanceData } = await supabase
    .from('performance_metrics')
    .select('page_path, lcp, fid, cls, ttfb, window_load_time')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .not('page_path', 'like', '/admin%')

  // Group by page and calculate averages
  const pagePerformance = (performanceData || []).reduce((acc: any, metric: any) => {
    if (!acc[metric.page_path]) {
      acc[metric.page_path] = {
        page_path: metric.page_path,
        measurements: 0,
        totalLcp: 0,
        totalFid: 0,
        totalCls: 0,
        totalTtfb: 0,
        totalLoadTime: 0
      }
    }
    
    const page = acc[metric.page_path]
    page.measurements += 1
    if (metric.lcp) page.totalLcp += metric.lcp
    if (metric.fid) page.totalFid += metric.fid
    if (metric.cls) page.totalCls += metric.cls
    if (metric.ttfb) page.totalTtfb += metric.ttfb
    if (metric.window_load_time) page.totalLoadTime += metric.window_load_time

    return acc
  }, {})

  // Calculate averages and performance scores
  const pageRankings = Object.values(pagePerformance).map((page: any) => {
    const avgLcp = page.measurements > 0 ? page.totalLcp / page.measurements : 0
    const avgFid = page.measurements > 0 ? page.totalFid / page.measurements : 0
    const avgCls = page.measurements > 0 ? page.totalCls / page.measurements : 0
    const avgTtfb = page.measurements > 0 ? page.totalTtfb / page.measurements : 0
    const avgLoadTime = page.measurements > 0 ? page.totalLoadTime / page.measurements : 0

    // Calculate performance score (0-100, higher is better)
    let performanceScore = 0
    if (avgLcp <= 2500) performanceScore += 40
    else if (avgLcp <= 4000) performanceScore += 20
    
    if (avgFid <= 100) performanceScore += 30
    else if (avgFid <= 300) performanceScore += 15
    
    if (avgCls <= 0.1) performanceScore += 30
    else if (avgCls <= 0.25) performanceScore += 15

    return {
      page_path: page.page_path,
      avg_lcp: Math.round(avgLcp),
      avg_fid: Math.round(avgFid),
      avg_cls: Math.round(avgCls * 1000) / 1000,
      avg_ttfb: Math.round(avgTtfb),
      avg_load_time: Math.round(avgLoadTime),
      performance_score: performanceScore,
      measurements: page.measurements
    }
  }).filter(page => page.measurements > 0) // Only include pages with data
    .sort((a, b) => b.performance_score - a.performance_score)

  return {
    fastestPages: pageRankings.slice(0, 10), // Top 10 fastest
    slowestPages: pageRankings.slice(-10).reverse(), // Bottom 10 (slowest)
    averagePerformanceScore: Math.round(pageRankings.reduce((sum, page) => sum + page.performance_score, 0) / Math.max(pageRankings.length, 1)),
    totalPages: pageRankings.length,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }
}

async function getPagePopularityRanking(supabase: any, startDate: Date, endDate: Date) {
  // Get page views excluding admin pages
  const { data: pageViews } = await supabase
    .from('page_views')
    .select('page_path, page_title, session_id')
    .gte('timestamp', startDate.toISOString())
    .lte('timestamp', endDate.toISOString())
    .not('page_path', 'like', '/admin%')

  // Count views per page
  const pageStats = (pageViews || []).reduce((acc: any, view: any) => {
    if (!acc[view.page_path]) {
      acc[view.page_path] = {
        page_path: view.page_path,
        page_title: view.page_title || view.page_path,
        total_views: 0,
        unique_sessions: new Set()
      }
    }
    acc[view.page_path].total_views += 1
    acc[view.page_path].unique_sessions.add(view.session_id)
    return acc
  }, {})

  // Convert to array and sort
  const popularityRankings = Object.values(pageStats).map((page: any) => ({
    page_path: page.page_path,
    page_title: page.page_title,
    total_views: page.total_views,
    unique_visitors: page.unique_sessions.size
  })).sort((a, b) => b.total_views - a.total_views)

  return {
    mostVisited: popularityRankings.slice(0, 10), // Top 10 most visited
    leastVisited: popularityRankings.slice(-10).reverse(), // Bottom 10 least visited
    totalViews: popularityRankings.reduce((sum, page) => sum + page.total_views, 0),
    totalPages: popularityRankings.length,
    periodStart: startDate.toISOString(),
    periodEnd: endDate.toISOString()
  }
} 