'use client'

import React, { useState, useEffect } from 'react'

// Force dynamic rendering for admin routes
export const dynamic = 'force-dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Eye, 
  Clock, 
  Mail, 
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Gauge,
  Timer,
  Layout,
  Wifi,
  Bell
} from 'lucide-react'
import { ExportMenu } from '@/components/admin/ExportMenu'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart
} from 'recharts'

interface OverviewData {
  totals: {
    pageViews: number
    uniqueVisitors: number
    newsletterSignups: number
  }
  averages: {
    avgSessionDuration: number
    bounceRate: number
    pagesPerSession: number
  }
  trafficSources: {
    direct: number
    organic: number
    social: number
    referral: number
  }
}

interface ArticleData {
  articles: Array<{
    id: string
    title: string
    slug: string
    totalViews: number
    uniqueViews: number
    avgTimeOnPage: number
    completionRate: number
    conversionRate: number
  }>
}

interface TrafficData {
  trafficSources: Record<string, number>
  deviceTypes: Record<string, number>
}

interface RealTimeData {
  currentVisitors: number
  topCurrentArticles: Array<{
    articleId: string
    title: string
    views: number
  }>
  lastUpdated: string
}

interface AnalyticsData {
  summary: {
    totalPageViews: number
    totalSessions: number
    uniqueVisitors: number
    bounceRate: number
    avgSessionDuration: number
  }
  topPages: Array<{ path: string; views: number }>
  trafficSources: Record<string, number>
  deviceBreakdown: Record<string, number>
  periodStart: string
  periodEnd: string
}

interface PerformanceData {
  coreWebVitals: {
    lcp: { value: number; score: number; goodPercentage: number; rating: string }
    fid: { value: number; score: number; goodPercentage: number; rating: string }
    cls: { value: number; score: number; goodPercentage: number; rating: string }
  }
  trends: Array<{
    date_bucket: string
    avg_lcp: number
    avg_fid: number
    avg_cls: number
    page_load_time: number
    bounce_rate: number
  }>
  totalMeasurements: number
  pagePerformance: Array<{
    path: string
    count: number
    avgLcp: number
    avgFid: number
    avgCls: number
    avgLoadTime: number
  }>
  recommendations: Array<{
    type: 'critical' | 'warning' | 'info'
    metric: string
    title: string
    description: string
    action: string
  }>
  periodStart: string
  periodEnd: string
}

interface ErrorData {
  totalErrors: number
  errorsByType: Record<string, number>
  errorsByPage: Array<{ path: string; count: number }>
  commonErrors: Array<{
    message: string
    count: number
    lastSeen: string
    type: string
  }>
  recentErrors: Array<{
    id: string
    error_type: string
    error_message: string
    page_path: string
    timestamp: string
  }>
  periodStart: string
  periodEnd: string
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f']

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('30')
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null)
  const [articleData, setArticleData] = useState<ArticleData | null>(null)
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null)
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [errorData, setErrorData] = useState<ErrorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [overviewSubTab, setOverviewSubTab] = useState<'traffic' | 'articles' | 'audience' | 'conversions' | 'behavior' | 'time-based'>('traffic')
  const [performanceSubTab, setPerformanceSubTab] = useState<'vitals' | 'alerts' | 'rankings' | 'trends'>('vitals')
  const [errorSubTab, setErrorSubTab] = useState<'overview' | 'severity' | 'pages' | 'timeline'>('overview')
  
  // New state for the additional analytics data
  const [audienceData, setAudienceData] = useState<any>(null)
  const [conversionData, setConversionData] = useState<any>(null)
  const [behaviorData, setBehaviorData] = useState<any>(null)
  const [timeBasedData, setTimeBasedData] = useState<any>(null)
  
  // Phase 1 enhancement state
  const [alertsData, setAlertsData] = useState<any>(null)
  const [engagementData, setEngagementData] = useState<any>(null)
  const [pagePerformanceData, setPagePerformanceData] = useState<any>(null)
  const [pagePopularityData, setPagePopularityData] = useState<any>(null)

  const fetchAnalytics = async (type: string, selectedPeriod: string = period) => {
    try {
      const params = new URLSearchParams({
        type,
        period: selectedPeriod
      })
      
      const response = await fetch(`/api/admin/analytics?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} analytics`)
      }
      
      return response.json()
    } catch (err) {
      console.error(`Analytics fetch error (${type}):`, err)
      throw err
    }
  }

  const loadAllAnalytics = async (selectedPeriod: string = period) => {
    setLoading(true)
    setError(null)
    
    try {
      const [overview, articles, traffic, realtime, performance, errors, audience, conversions, behavior, timeBased, alerts, engagement, pagePerformance, pagePopularity] = await Promise.all([
        fetchAnalytics('overview', selectedPeriod),
        fetchAnalytics('articles', selectedPeriod),
        fetchAnalytics('traffic', selectedPeriod),
        fetchAnalytics('realtime', selectedPeriod),
        fetchAnalytics('performance', selectedPeriod),
        fetchAnalytics('errors', selectedPeriod),
        fetchAnalytics('audience', selectedPeriod),
        fetchAnalytics('conversions', selectedPeriod),
        fetchAnalytics('behavior', selectedPeriod),
        fetchAnalytics('time-based', selectedPeriod),
        fetchAnalytics('alerts', selectedPeriod),
        fetchAnalytics('engagement', selectedPeriod),
        fetchAnalytics('page-performance', selectedPeriod),
        fetchAnalytics('page-popularity', selectedPeriod)
      ])
      
      // Set all the required state variables for the tabs
      setOverviewData(overview)
      setArticleData(articles)
      setTrafficData(traffic)
      setRealTimeData(realtime)
      setAnalyticsData(overview) // Overview tab expects analyticsData
      setPerformanceData(performance) // Performance tab expects performanceData
      setErrorData(errors) // Error tab expects errorData
      
      // Set new analytics data
      setAudienceData(audience)
      setConversionData(conversions)
      setBehaviorData(behavior)
      setTimeBasedData(timeBased)
      
      // Set Phase 1 enhancement data
      setAlertsData(alerts)
      setEngagementData(engagement)
      setPagePerformanceData(pagePerformance)
      setPagePopularityData(pagePopularity)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllAnalytics()
  }, [])

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    loadAllAnalytics(newPeriod)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600'
      case 'needs-improvement': return 'text-yellow-600'
      case 'poor': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getPerformanceBadgeVariant = (rating: string) => {
    switch (rating) {
      case 'good': return 'default'
      case 'needs-improvement': return 'secondary'
      case 'poor': return 'destructive'
      default: return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <AlertDescription>
          {error}
          <Button onClick={() => loadAllAnalytics()} className="ml-4" size="sm">
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your site's performance and user behavior</p>
        </div>
        <div className="flex gap-2">
          <ExportMenu 
            dataType="analytics" 
            period={period}
            onExport={(type, format, filters) => {
              console.log(`📤 Exported ${type} as ${format} with filters:`, filters)
            }}
          />
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Performance Alerts Banner - Phase 1 Enhancement */}
      {alertsData && (alertsData.totalAlerts > 0) && (
        <Alert className={`border-l-4 ${alertsData.criticalCount > 0 ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'}`}>
          <AlertTriangle className={`h-4 w-4 ${alertsData.criticalCount > 0 ? 'text-red-600' : 'text-yellow-600'}`} />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>{alertsData.totalAlerts} Performance Alert{alertsData.totalAlerts > 1 ? 's' : ''}</strong>
                {alertsData.criticalCount > 0 && (
                  <span className="ml-2 text-red-600 font-medium">
                    {alertsData.criticalCount} Critical
                  </span>
                )}
                {alertsData.warningCount > 0 && (
                  <span className="ml-2 text-yellow-600 font-medium">
                    {alertsData.warningCount} Warning{alertsData.warningCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveTab('performance')}
              >
                View Details
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Errors
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab with Beautiful Sub-tabs */}
        <TabsContent value="overview" className="space-y-6">
          {/* Overview Sub-tabs Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">📊 Analytics Overview</CardTitle>
              <CardDescription>Comprehensive insights into your travel blog performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={overviewSubTab} onValueChange={(value: any) => setOverviewSubTab(value)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  <TabsTrigger value="traffic" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Traffic
                  </TabsTrigger>
                  <TabsTrigger value="articles" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Articles
                  </TabsTrigger>
                  <TabsTrigger value="audience" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Audience
                  </TabsTrigger>
                  <TabsTrigger value="conversions" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Conversions
                  </TabsTrigger>
                  <TabsTrigger value="behavior" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Behavior
                  </TabsTrigger>
                  <TabsTrigger value="time-based" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Trends
                  </TabsTrigger>
                </TabsList>

                {/* 1. Traffic Overview */}
                <TabsContent value="traffic" className="space-y-6">
                  {analyticsData && (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                            <Eye className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{formatNumber(analyticsData.summary.totalPageViews)}</div>
                            <p className="text-xs text-muted-foreground">Total page impressions</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
                            <Users className="h-4 w-4 text-green-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">{formatNumber(analyticsData.summary.totalSessions)}</div>
                            <p className="text-xs text-muted-foreground">Unique visits</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{formatNumber(analyticsData.summary.uniqueVisitors)}</div>
                            <p className="text-xs text-muted-foreground">Individual users</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{analyticsData.summary.bounceRate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">Single page visits</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-teal-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
                            <Clock className="h-4 w-4 text-teal-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-teal-600">{formatDuration(analyticsData.summary.avgSessionDuration)}</div>
                            <p className="text-xs text-muted-foreground">Time per visit</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Pages */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Eye className="h-5 w-5 text-blue-600" />
                              Top Pages
                            </CardTitle>
                            <CardDescription>Most visited pages this period</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {analyticsData.topPages.map((page, index) => (
                                <div key={page.path} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                                      {index + 1}
                                    </Badge>
                                    <div>
                                      <span className="text-sm font-medium truncate max-w-[200px] block">{page.path}</span>
                                      <span className="text-xs text-gray-500">Travel Content</span>
                                    </div>
                                  </div>
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {formatNumber(page.views)} views
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Traffic Sources */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5 text-green-600" />
                              Traffic Sources
                            </CardTitle>
                            <CardDescription>Where your travel readers discover you</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                              <PieChart>
                                <Pie
                                  data={Object.entries(analyticsData.trafficSources).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                >
                                  {Object.entries(analyticsData.trafficSources).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [formatNumber(value as number), 'Visitors']} />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* 2. Article Performance */}
                <TabsContent value="articles" className="space-y-6">
                  {articleData && (
                    <>
                      {/* Articles Export Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold">📝 Article Analytics</h3>
                          <p className="text-sm text-gray-600">Performance metrics for your blog content</p>
                        </div>
                        <ExportMenu 
                          dataType="articles" 
                          period={period}
                          onExport={(type, format, filters) => {
                            console.log(`📤 Exported ${type} as ${format} with filters:`, filters)
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Eye className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="text-sm text-blue-700">Total Articles</p>
                                <p className="text-2xl font-bold text-blue-900">{articleData.articles?.length || 0}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-green-50 to-green-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-8 w-8 text-green-600" />
                              <div>
                                <p className="text-sm text-green-700">Avg. Views</p>
                                <p className="text-2xl font-bold text-green-900">
                                  {Math.round(articleData.articles?.reduce((acc, article) => acc + article.totalViews, 0) / Math.max(articleData.articles?.length || 1, 1)) || 0}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Clock className="h-8 w-8 text-purple-600" />
                              <div>
                                <p className="text-sm text-purple-700">Avg. Read Time</p>
                                <p className="text-2xl font-bold text-purple-900">
                                  {Math.round(articleData.articles?.reduce((acc, article) => acc + article.avgTimeOnPage, 0) / Math.max(articleData.articles?.length || 1, 1) / 60) || 0}m
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Mail className="h-8 w-8 text-orange-600" />
                              <div>
                                <p className="text-sm text-orange-700">Avg. Conversion</p>
                                <p className="text-2xl font-bold text-orange-900">
                                  {(articleData.articles?.reduce((acc, article) => acc + article.conversionRate, 0) / Math.max(articleData.articles?.length || 1, 1)).toFixed(1) || 0}%
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Top Performing Travel Articles
                          </CardTitle>
                          <CardDescription>Your most engaging content that converts readers</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {articleData.articles?.slice(0, 10).map((article, index) => (
                              <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                  <Badge variant="outline" className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    index === 0 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                    index === 1 ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                    index === 2 ? 'bg-orange-100 text-orange-700 border-orange-300' :
                                    'bg-blue-50 text-blue-600 border-blue-200'
                                  }`}>
                                    {index + 1}
                                  </Badge>
                                  <div>
                                    <h4 className="font-medium text-sm max-w-[300px] truncate">{article.title}</h4>
                                    <p className="text-xs text-gray-500">/{article.slug}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                  <div className="text-center">
                                    <p className="font-bold text-blue-600">{formatNumber(article.totalViews)}</p>
                                    <p className="text-xs text-gray-500">views</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-bold text-green-600">{Math.round(article.avgTimeOnPage / 60)}m</p>
                                    <p className="text-xs text-gray-500">read time</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-bold text-purple-600">{article.completionRate}%</p>
                                    <p className="text-xs text-gray-500">completion</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="font-bold text-orange-600">{article.conversionRate}%</p>
                                    <p className="text-xs text-gray-500">conversion</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* 3. Audience Insights */}
                <TabsContent value="audience" className="space-y-6">
                  {audienceData && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Demographics */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5 text-blue-600" />
                              Top Countries
                            </CardTitle>
                            <CardDescription>Where your travel readers are from</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {audienceData.demographics?.countries?.map((country: any, index: number) => (
                                <div key={country.country} className="flex items-center justify-between">
                                  <span className="text-sm">{country.country}</span>
                                  <Badge variant="secondary">{country.count}</Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Device Breakdown */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Smartphone className="h-5 w-5 text-green-600" />
                              Device Types
                            </CardTitle>
                            <CardDescription>How people access your content</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={Object.entries(audienceData.technology?.devices || {}).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={60}
                                  fill="#8884d8"
                                  dataKey="value"
                                                                     label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                >
                                  {Object.entries(audienceData.technology?.devices || {}).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Visitor Types */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Users className="h-5 w-5 text-purple-600" />
                              Visitor Types
                            </CardTitle>
                            <CardDescription>New vs returning travel enthusiasts</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={Object.entries(audienceData.visitorTypes || {}).map(([name, value]) => ({ name, value }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* 4. Conversion Tracking */}
                <TabsContent value="conversions" className="space-y-6">
                  {conversionData && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-r from-green-50 to-green-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Mail className="h-8 w-8 text-green-600" />
                              <div>
                                <p className="text-sm text-green-700">Newsletter Signups</p>
                                <p className="text-2xl font-bold text-green-900">{conversionData.overview?.newsletterSignups || 0}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <TrendingUp className="h-8 w-8 text-blue-600" />
                              <div>
                                <p className="text-sm text-blue-700">Conversion Rate</p>
                                <p className="text-2xl font-bold text-blue-900">{conversionData.overview?.conversionRate?.toFixed(1) || 0}%</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                          <CardContent className="p-6">
                            <div className="flex items-center gap-3">
                              <Eye className="h-8 w-8 text-purple-600" />
                              <div>
                                <p className="text-sm text-purple-700">Engaged Readers</p>
                                <p className="text-2xl font-bold text-purple-900">{conversionData.overview?.engagedReaders || 0}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Conversion Funnel */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              Conversion Funnel
                            </CardTitle>
                            <CardDescription>Journey from visitor to subscriber</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {conversionData.conversionFunnel?.map((stage: any, index: number) => (
                                <div key={stage.stage} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                      index === 0 ? 'bg-blue-500' : 
                                      index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                    }`}>
                                      {index + 1}
                                    </div>
                                    <span className="font-medium">{stage.stage}</span>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">{formatNumber(stage.count)}</p>
                                    <p className="text-sm text-gray-600">{stage.rate.toFixed(1)}%</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Conversion by Source */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Globe className="h-5 w-5 text-orange-600" />
                              Conversion by Source
                            </CardTitle>
                            <CardDescription>Which traffic sources convert best</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {conversionData.conversionBySource?.slice(0, 5).map((source: any) => (
                                <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="font-medium">{source.source}</span>
                                  <div className="text-right">
                                    <p className="font-bold text-green-600">{source.conversionRate.toFixed(1)}%</p>
                                    <p className="text-sm text-gray-600">{source.conversions}/{source.visitors}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* 5. User Behavior */}
                <TabsContent value="behavior" className="space-y-6">
                  {behaviorData && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* User Flows */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Activity className="h-5 w-5 text-blue-600" />
                              User Journey
                            </CardTitle>
                            <CardDescription>How users navigate your site</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={Object.entries(behaviorData.userFlows || {}).map(([name, value]) => ({ name: name.replace(' (', '\n('), value }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#3B82F6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Scroll Depth */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              Scroll Depth
                            </CardTitle>
                            <CardDescription>How far readers scroll</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <PieChart>
                                <Pie
                                  data={Object.entries(behaviorData.scrollDepth || {}).map(([name, value]) => ({ name, value }))}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={60}
                                  fill="#8884d8"
                                  dataKey="value"
                                                                     label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                >
                                  {Object.entries(behaviorData.scrollDepth || {}).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Time Distribution */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-purple-600" />
                              Time on Page
                            </CardTitle>
                            <CardDescription>Reading engagement levels</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={Object.entries(behaviorData.timeDistribution || {}).map(([name, value]) => ({ name, value }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8B5CF6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Behavior Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                          <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-blue-700">Avg. Time on Site</p>
                            <p className="text-2xl font-bold text-blue-900">{Math.round(behaviorData.averages?.avgTimeOnSite / 60) || 0}m</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-green-50 to-green-100">
                          <CardContent className="p-6 text-center">
                            <Eye className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-green-700">Pages per Session</p>
                            <p className="text-2xl font-bold text-green-900">{behaviorData.averages?.avgPagesPerSession?.toFixed(1) || 0}</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                          <CardContent className="p-6 text-center">
                            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-purple-700">Avg. Scroll Depth</p>
                            <p className="text-2xl font-bold text-purple-900">{Math.round(behaviorData.averages?.avgScrollDepth) || 0}%</p>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* 6. Time-Based Analytics */}
                <TabsContent value="time-based" className="space-y-6">
                  {timeBasedData && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-r from-orange-50 to-orange-100">
                          <CardContent className="p-6 text-center">
                            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                            <p className="text-sm text-orange-700">Growth Rate</p>
                            <p className="text-2xl font-bold text-orange-900">{timeBasedData.growth?.rate?.toFixed(1) || 0}%</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
                          <CardContent className="p-6 text-center">
                            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-blue-700">Peak Hour</p>
                            <p className="text-2xl font-bold text-blue-900">{timeBasedData.insights?.peakHour || 'N/A'}</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-green-50 to-green-100">
                          <CardContent className="p-6 text-center">
                            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-green-700">Peak Day</p>
                            <p className="text-2xl font-bold text-green-900">{timeBasedData.insights?.peakDay || 'N/A'}</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="bg-gradient-to-r from-purple-50 to-purple-100">
                          <CardContent className="p-6 text-center">
                            <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-purple-700">Daily Avg</p>
                            <p className="text-2xl font-bold text-purple-900">{formatNumber(timeBasedData.insights?.avgDailyViews || 0)}</p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Hourly Distribution */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-blue-600" />
                              Hourly Traffic Pattern
                            </CardTitle>
                            <CardDescription>When your travel content gets the most attention</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                              <AreaChart data={timeBasedData.hourlyDistribution || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="views" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Weekly Pattern */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <TrendingUp className="h-5 w-5 text-green-600" />
                              Weekly Pattern
                            </CardTitle>
                            <CardDescription>Best days for travel content engagement</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                              <BarChart data={Object.entries(timeBasedData.weeklyPattern || {}).map(([name, value]) => ({ name, value }))}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#10B981" />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Daily Trend */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-purple-600" />
                            Daily Traffic Trend
                          </CardTitle>
                          <CardDescription>Your travel blog's growth over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timeBasedData.dailyTrend || []}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">⚡ Performance Analytics</CardTitle>
                  <CardDescription>Core Web Vitals, page speed rankings, and performance alerts</CardDescription>
                </div>
                <ExportMenu 
                  dataType="performance" 
                  period={period}
                  onExport={(type, format, filters) => {
                    console.log(`📤 Exported ${type} as ${format} with filters:`, filters)
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={performanceSubTab} onValueChange={(value: any) => setPerformanceSubTab(value)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="vitals" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Core Web Vitals
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="rankings" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Page Rankings
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Trends
                  </TabsTrigger>
                </TabsList>

                {/* Core Web Vitals Tab */}
                <TabsContent value="vitals" className="space-y-6">
                  {performanceData && (
                    <>
                      {/* Core Web Vitals Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* LCP Card */}
                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Largest Contentful Paint</CardTitle>
                            <Timer className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{Math.round(performanceData.coreWebVitals.lcp.value)}ms</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getPerformanceBadgeVariant(performanceData.coreWebVitals.lcp.rating)}>
                                {performanceData.coreWebVitals.lcp.rating.replace('-', ' ')}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {performanceData.coreWebVitals.lcp.goodPercentage.toFixed(1)}% good
                              </span>
                            </div>
                            <Progress value={performanceData.coreWebVitals.lcp.score} className="mt-2" />
                          </CardContent>
                        </Card>

                        {/* FID Card */}
                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">First Input Delay</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">{Math.round(performanceData.coreWebVitals.fid.value)}ms</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getPerformanceBadgeVariant(performanceData.coreWebVitals.fid.rating)}>
                                {performanceData.coreWebVitals.fid.rating.replace('-', ' ')}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {performanceData.coreWebVitals.fid.goodPercentage.toFixed(1)}% good
                              </span>
                            </div>
                            <Progress value={performanceData.coreWebVitals.fid.score} className="mt-2" />
                          </CardContent>
                        </Card>

                        {/* CLS Card */}
                        <Card className="border-l-4 border-l-purple-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cumulative Layout Shift</CardTitle>
                            <Layout className="h-4 w-4 text-purple-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{performanceData.coreWebVitals.cls.value.toFixed(3)}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={getPerformanceBadgeVariant(performanceData.coreWebVitals.cls.rating)}>
                                {performanceData.coreWebVitals.cls.rating.replace('-', ' ')}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {performanceData.coreWebVitals.cls.goodPercentage.toFixed(1)}% good
                              </span>
                            </div>
                            <Progress value={performanceData.coreWebVitals.cls.score} className="mt-2" />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Performance Recommendations */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Performance Recommendations
                          </CardTitle>
                          <CardDescription>Actions to improve your site performance</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {performanceData.recommendations.map((rec, index) => (
                              <Alert key={index} variant={rec.type === 'critical' ? 'destructive' : 'default'}>
                                <div className="flex items-start gap-3">
                                  {rec.type === 'critical' && <XCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                                  {rec.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                                  {rec.type === 'info' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold">{rec.title}</h4>
                                      <Badge variant="outline" className="text-xs">{rec.metric}</Badge>
                                    </div>
                                    <AlertDescription className="text-sm mb-2">
                                      {rec.description}
                                    </AlertDescription>
                                    <p className="text-sm text-gray-600 italic">{rec.action}</p>
                                  </div>
                                </div>
                              </Alert>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </TabsContent>

                {/* Performance Alerts Tab */}
                <TabsContent value="alerts" className="space-y-6">
                  {alertsData && (
                    <>
                      {/* Alert Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-red-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-red-600">{alertsData.criticalCount || 0}</div>
                            <p className="text-xs text-muted-foreground">Require immediate attention</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Warning Alerts</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{alertsData.warningCount || 0}</div>
                            <p className="text-xs text-muted-foreground">Monitor closely</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                            <Bell className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{alertsData.totalAlerts || 0}</div>
                            <p className="text-xs text-muted-foreground">All active alerts</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Alert Status</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                              {alertsData.totalAlerts === 0 ? 'Good' : 'Action Needed'}
                            </div>
                            <p className="text-xs text-muted-foreground">System health</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Budget Violations */}
                      {alertsData.budgetViolations && alertsData.budgetViolations.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-yellow-600" />
                              Performance Budget Violations
                            </CardTitle>
                            <CardDescription>Pages exceeding performance thresholds</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {alertsData.budgetViolations.map((violation: any, index: number) => (
                                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                                  violation.severity === 'critical' ? 'border-l-red-500 bg-red-50' : 'border-l-yellow-500 bg-yellow-50'
                                }`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">{violation.page_path}</div>
                                      <div className="text-xs text-gray-600 mt-1">
                                        {violation.metric_name.toUpperCase()}: {violation.current_value}
                                        {violation.metric_name === 'cls' ? '' : 'ms'} 
                                        (threshold: {violation.threshold_value}
                                        {violation.metric_name === 'cls' ? '' : 'ms'})
                                      </div>
                                    </div>
                                    <Badge variant={violation.severity === 'critical' ? 'destructive' : 'secondary'}>
                                      {violation.severity}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </TabsContent>

                {/* Page Rankings Tab */}
                <TabsContent value="rankings" className="space-y-6">
                  {pagePerformanceData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Fastest Pages */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-green-600" />
                            🚀 Fastest Pages
                          </CardTitle>
                          <CardDescription>Your best performing pages</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {pagePerformanceData.fastestPages.slice(0, 8).map((page: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                                <div className="flex-1">
                                  <div className="font-medium text-sm truncate max-w-[200px]">{page.page_path}</div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    Score: {page.performance_score}/100 | {page.measurements} measurements
                                  </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                  <div className="text-center">
                                    <div className="font-medium text-green-600">{page.avg_lcp}ms</div>
                                    <div className="text-xs text-gray-500">LCP</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-green-600">{page.avg_load_time}ms</div>
                                    <div className="text-xs text-gray-500">Load</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Slowest Pages */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-600" />
                            🐌 Slowest Pages
                          </CardTitle>
                          <CardDescription>Pages that need optimization</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {pagePerformanceData.slowestPages.slice(0, 8).map((page: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                                <div className="flex-1">
                                  <div className="font-medium text-sm truncate max-w-[200px]">{page.page_path}</div>
                                  <div className="text-xs text-gray-600 mt-1">
                                    Score: {page.performance_score}/100 | {page.measurements} measurements
                                  </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                  <div className="text-center">
                                    <div className="font-medium text-red-600">{page.avg_lcp}ms</div>
                                    <div className="text-xs text-gray-500">LCP</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="font-medium text-red-600">{page.avg_load_time}ms</div>
                                    <div className="text-xs text-gray-500">Load</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Performance Trends Tab */}
                <TabsContent value="trends" className="space-y-6">
                  {performanceData && performanceData.trends.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-purple-600" />
                          Performance Trends Over Time
                        </CardTitle>
                        <CardDescription>Core Web Vitals and load times</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                          <LineChart data={performanceData.trends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date_bucket" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="avg_lcp" stroke="#3B82F6" name="LCP (ms)" strokeWidth={2} />
                            <Line type="monotone" dataKey="avg_fid" stroke="#10B981" name="FID (ms)" strokeWidth={2} />
                            <Line type="monotone" dataKey="page_load_time" stroke="#F59E0B" name="Load Time (ms)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">🚨 Error Analytics</CardTitle>
                  <CardDescription>Error tracking, categorization, and resolution monitoring</CardDescription>
                </div>
                <ExportMenu 
                  dataType="errors" 
                  period={period}
                  onExport={(type, format, filters) => {
                    console.log(`📤 Exported ${type} as ${format} with filters:`, filters)
                  }}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={errorSubTab} onValueChange={(value: any) => setErrorSubTab(value)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="severity" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    By Severity
                  </TabsTrigger>
                  <TabsTrigger value="pages" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    By Pages
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>

                {/* Error Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {errorData && (
                    <>
                      {/* Error Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-red-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-red-600">{formatNumber(errorData.totalErrors)}</div>
                            <p className="text-xs text-muted-foreground">All time errors logged</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Error Types</CardTitle>
                            <XCircle className="h-4 w-4 text-orange-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{Object.keys(errorData.errorsByType).length}</div>
                            <p className="text-xs text-muted-foreground">Unique error categories</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Affected Pages</CardTitle>
                            <Monitor className="h-4 w-4 text-purple-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{errorData.errorsByPage.length}</div>
                            <p className="text-xs text-muted-foreground">Pages with errors</p>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                            <Activity className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                              {errorData.totalErrors > 0 ? ((errorData.totalErrors / 1000) * 100).toFixed(2) : '0.00'}%
                            </div>
                            <p className="text-xs text-muted-foreground">Error to visit ratio</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Error Type Distribution */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <XCircle className="h-5 w-5 text-red-600" />
                              🔥 Most Common Errors
                            </CardTitle>
                            <CardDescription>Top errors by frequency</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {errorData.commonErrors.slice(0, 8).map((error, index) => (
                                <div key={index} className="p-4 bg-red-50 rounded-lg border-l-4 border-l-red-500">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-sm text-red-800 mb-2">
                                        {error.message.substring(0, 60)}...
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                          {error.type}
                                        </Badge>
                                        <span className="text-xs text-red-600">
                                          Last: {new Date(error.lastSeen).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                    <Badge variant="destructive" className="ml-2">{error.count}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Monitor className="h-5 w-5 text-purple-600" />
                              📄 Error-Prone Pages
                            </CardTitle>
                            <CardDescription>Pages with most errors</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {errorData.errorsByPage.slice(0, 10).map((page, index) => (
                                <div key={page.path} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-6 h-6 bg-purple-100 rounded-full">
                                      <span className="text-xs font-medium text-purple-700">#{index + 1}</span>
                                    </div>
                                    <span className="text-sm font-medium truncate max-w-[200px]">{page.path}</span>
                                  </div>
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">{page.count}</Badge>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  )}
                </TabsContent>

                {/* Error Severity Tab */}
                <TabsContent value="severity" className="space-y-6">
                  {errorData && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="border-l-4 border-l-red-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-red-600">
                            <XCircle className="h-5 w-5" />
                            🔴 Critical Errors
                          </CardTitle>
                          <CardDescription>High impact errors requiring immediate attention</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {errorData.commonErrors
                              .filter((error: any) => error.severity === 'critical' || error.type === 'JavaScript Error')
                              .slice(0, 5)
                              .map((error: any, index: number) => (
                                <div key={index} className="p-3 bg-red-100 rounded-lg">
                                  <div className="font-medium text-sm text-red-800 mb-1">
                                    {error.message.substring(0, 50)}...
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="destructive" className="text-xs">Critical</Badge>
                                    <span className="text-xs text-red-600 font-medium">{error.count} occurrences</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-yellow-600">
                            <AlertTriangle className="h-5 w-5" />
                            🟡 Warning Errors
                          </CardTitle>
                          <CardDescription>Moderate impact errors to monitor</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {errorData.commonErrors
                              .filter((error: any) => error.severity === 'warning' || error.type === 'Network Error')
                              .slice(0, 5)
                              .map((error: any, index: number) => (
                                <div key={index} className="p-3 bg-yellow-100 rounded-lg">
                                  <div className="font-medium text-sm text-yellow-800 mb-1">
                                    {error.message.substring(0, 50)}...
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="secondary" className="text-xs bg-yellow-200 text-yellow-800">Warning</Badge>
                                    <span className="text-xs text-yellow-600 font-medium">{error.count} occurrences</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-l-4 border-l-blue-500">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-blue-600">
                            <CheckCircle className="h-5 w-5" />
                            🔵 Info Errors
                          </CardTitle>
                          <CardDescription>Low impact informational errors</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {errorData.commonErrors
                              .filter((error: any) => error.severity === 'info' || !['JavaScript Error', 'Network Error'].includes(error.type))
                              .slice(0, 5)
                              .map((error: any, index: number) => (
                                <div key={index} className="p-3 bg-blue-100 rounded-lg">
                                  <div className="font-medium text-sm text-blue-800 mb-1">
                                    {error.message.substring(0, 50)}...
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">Info</Badge>
                                    <span className="text-xs text-blue-600 font-medium">{error.count} occurrences</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Error Pages Tab */}
                <TabsContent value="pages" className="space-y-6">
                  {errorData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="h-5 w-5 text-red-600" />
                          📊 Error Distribution by Pages
                        </CardTitle>
                        <CardDescription>Detailed breakdown of errors across your website</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {errorData.errorsByPage.slice(0, 16).map((page, index) => (
                            <div key={page.path} className={`p-4 rounded-lg border-l-4 ${
                              page.count > 50 ? 'border-l-red-500 bg-red-50' :
                              page.count > 20 ? 'border-l-yellow-500 bg-yellow-50' :
                              'border-l-blue-500 bg-blue-50'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                                      page.count > 50 ? 'bg-red-100 text-red-700' :
                                      page.count > 20 ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      #{index + 1}
                                    </span>
                                    <span className="text-sm font-medium truncate">{page.path}</span>
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {page.count} errors • Priority: {
                                      page.count > 50 ? 'High' :
                                      page.count > 20 ? 'Medium' : 'Low'
                                    }
                                  </div>
                                </div>
                                <Badge variant={
                                  page.count > 50 ? 'destructive' :
                                  page.count > 20 ? 'secondary' : 'outline'
                                }>
                                  {page.count}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Error Timeline Tab */}
                <TabsContent value="timeline" className="space-y-6">
                  {errorData && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          ⏰ Recent Error Timeline
                        </CardTitle>
                        <CardDescription>Latest errors with timestamps and context</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {errorData.recentErrors.map((error, index) => (
                            <div key={error.id} className="relative pl-8 pb-4">
                              {/* Timeline line */}
                              {index !== errorData.recentErrors.length - 1 && (
                                <div className="absolute left-3 top-6 h-full w-0.5 bg-gray-200"></div>
                              )}
                              
                              {/* Timeline dot */}
                              <div className={`absolute left-0 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                error.error_type === 'JavaScript Error' ? 'bg-red-100 border-red-500' :
                                error.error_type === 'Network Error' ? 'bg-yellow-100 border-yellow-500' :
                                'bg-blue-100 border-blue-500'
                              }`}>
                                {error.error_type === 'JavaScript Error' && <XCircle className="h-3 w-3 text-red-500" />}
                                {error.error_type === 'Network Error' && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                                {!['JavaScript Error', 'Network Error'].includes(error.error_type) && <CheckCircle className="h-3 w-3 text-blue-500" />}
                              </div>

                              {/* Error content */}
                              <div className="bg-gray-50 rounded-lg p-4 ml-2">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Badge variant={
                                      error.error_type === 'JavaScript Error' ? 'destructive' :
                                      error.error_type === 'Network Error' ? 'secondary' : 'outline'
                                    }>
                                      {error.error_type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {new Date(error.timestamp).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm font-medium mb-1">{error.error_message}</div>
                                <div className="text-xs text-gray-600 flex items-center gap-2">
                                  <Monitor className="h-3 w-3" />
                                  {error.page_path}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 