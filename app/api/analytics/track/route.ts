import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Types for analytics events
interface AnalyticsEvent {
  type: 'page_view' | 'scroll_progress' | 'reading_completion' | 'newsletter_signup' | 'external_link_click' | 'performance' | 'error'
  articleId?: string
  sessionId: string
  userId?: string
  data?: Record<string, any>
}

interface TrackingData {
  articleId?: string
  sessionId: string
  userId?: string
  timeOnPage?: number
  scrollDepth?: number
  readingProgress?: number
  articleCompleted?: boolean
  newsletterSignup?: boolean
  externalLinksClicked?: number
  socialShares?: number
  referrerUrl?: string
  trafficSource?: string
  deviceType?: string
  countryCode?: string
}

const BLOCKED_IPS = new Set([
  '127.0.0.1',
  'localhost',
  '::1'
]);

const BLOCKED_USER_AGENTS = [
  'bot',
  'crawler',
  'spider',
  'scraper',
  'monitor',
  'ping',
  'curl',
  'wget'
];

function isBlockedRequest(req: Request): boolean {
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || '';
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  
  // Block known bots and crawlers
  if (BLOCKED_USER_AGENTS.some(blocked => userAgent.includes(blocked))) {
    return true;
  }
  
  // Block localhost requests in production
  if (process.env.NODE_ENV === 'production' && BLOCKED_IPS.has(ip)) {
    return true;
  }
  
  return false;
}

function getClientInfo(req: Request) {
  const userAgent = req.headers.get('user-agent') || '';
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown';
  
  return {
    ip_address: ip,
    user_agent: userAgent,
    country: req.headers.get('cf-ipcountry') || req.headers.get('x-country') || null,
    city: req.headers.get('cf-ipcity') || req.headers.get('x-city') || null
  };
}

function getDeviceType(userAgent: string): string {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    return 'tablet'
  }
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
    return 'mobile'
  }
  return 'desktop'
}

function getTrafficSource(referrer: string): string {
  if (!referrer || referrer.includes(process.env.NEXT_PUBLIC_SITE_URL || 'maxyourpoints.vercel.app')) {
    return 'direct'
  }
  if (referrer.includes('google.') || referrer.includes('bing.') || referrer.includes('yahoo.') || referrer.includes('duckduckgo.')) {
    return 'organic'
  }
  if (referrer.includes('facebook.') || referrer.includes('twitter.') || referrer.includes('instagram.') || referrer.includes('linkedin.')) {
    return 'social'
  }
  return 'referral'
}

export async function POST(req: Request) {
  try {
    // Check if request should be blocked
    if (isBlockedRequest(req)) {
      return NextResponse.json({ success: false, reason: 'blocked' }, { status: 403 });
    }

    const body = await req.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
    }

    // Block tracking of admin pages
    if (data.page_path && data.page_path.startsWith('/admin')) {
      return NextResponse.json({ success: true, reason: 'admin_page_excluded' });
    }

         const supabase = supabaseAdmin;
     const clientInfo = getClientInfo(req);

     console.log(`📊 Analytics tracking: ${type}`);

    switch (type) {
      case 'page_view':
        await handlePageView(supabase, data, clientInfo);
        break;
      
      case 'scroll_progress':
        await handleScrollProgress(data);
        break;
      
      case 'reading_completion':
        await handleReadingCompletion(data);
        break;
      
      case 'newsletter_signup':
        await handleNewsletterSignup(data);
        break;
      
      case 'external_link_click':
        await handleExternalLinkClick(data);
        break;
      
      case 'performance':
        await handlePerformanceMetrics(supabase, data);
        break;
      
      case 'error':
        await handleErrorLog(supabase, data, clientInfo);
        break;
      
      default:
        return NextResponse.json({ error: 'Unknown tracking type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('❌ Analytics tracking error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error('❌ Error details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePageView(supabase: any, data: any, clientInfo: any) {
  // Validate required fields
  if (!data.session_id || !data.page_path) {
    throw new Error('Missing required fields: session_id and page_path are required');
  }

  // Ensure timestamp is valid
  const timestamp = data.timestamp || new Date().toISOString();

  // Insert page view
  const { error: viewError } = await supabase
    .from('page_views')
    .insert({
      page_path: data.page_path,
      page_title: data.page_title || 'Untitled',
      session_id: data.session_id,
      referrer: data.referrer || null,
      device_type: data.device_type || 'unknown',
      browser: data.browser || 'unknown',
      os: data.os || 'unknown',
      timestamp: timestamp,
      ...clientInfo
    });

  if (viewError) {
    console.error('Failed to insert page view:', JSON.stringify(viewError, null, 2));
    console.error('Data attempted to insert:', JSON.stringify({
      page_path: data.page_path,
      page_title: data.page_title,
      session_id: data.session_id,
      referrer: data.referrer || null,
      device_type: data.device_type,
      browser: data.browser,
      os: data.os,
      timestamp: data.timestamp,
      ...clientInfo
    }, null, 2));
    throw viewError;
  }

  // Update or create user session
  await handleUserSession(supabase, data, clientInfo);
}

async function handleUserSession(supabase: any, data: any, clientInfo: any) {
  // Check if session exists
  const { data: existingSession } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('session_id', data.session_id)
    .single();

  if (existingSession) {
    // Update existing session
    const { error } = await supabase
      .from('user_sessions')
      .update({
        last_activity: data.timestamp,
        page_count: existingSession.page_count + 1,
        is_bounce: false // Multiple pages = not a bounce
      })
      .eq('session_id', data.session_id);

    if (error) {
      console.error('Failed to update user session:', error);
    }
  } else {
    // Create new session
    const { error } = await supabase
      .from('user_sessions')
      .insert({
        session_id: data.session_id,
        first_visit: data.timestamp,
        last_activity: data.timestamp,
        page_count: 1,
        referrer: data.referrer,
        device_type: data.device_type,
        browser: data.browser,
        os: data.os,
        is_bounce: true, // Will be updated if they visit more pages
        ...clientInfo
      });

    if (error) {
      console.error('Failed to insert user session:', error);
    }
  }
}

async function handleScrollProgress(eventData: any) {
  const { articleId, sessionId, scrollDepth, readingProgress } = eventData

  if (!articleId || !sessionId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Get current values first
  const { data: currentData } = await supabaseAdmin
    .from('article_analytics')
    .select('scroll_depth, reading_progress')
    .eq('article_id', articleId)
    .eq('session_id', sessionId)
    .single()

  if (currentData) {
    // Update with maximum values
    await supabaseAdmin
      .from('article_analytics')
      .update({
        scroll_depth: Math.max(scrollDepth || 0, currentData.scroll_depth || 0),
        reading_progress: Math.max(readingProgress || 0, currentData.reading_progress || 0)
      })
      .eq('article_id', articleId)
      .eq('session_id', sessionId)
  }

  await logAnalyticsEvent(eventData, 'scroll_progress', {
    scrollDepth,
    readingProgress
  })

  return NextResponse.json({ success: true })
}

async function handleReadingCompletion(eventData: any) {
  const { articleId, sessionId, timeOnPage } = eventData

  if (!articleId || !sessionId) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Mark article as completed
  await supabaseAdmin
    .from('article_analytics')
    .update({
      article_completed: true,
      time_on_page: timeOnPage,
      reading_progress: 1.0,
      scroll_depth: 1.0
    })
    .eq('article_id', articleId)
    .eq('session_id', sessionId)

  await logAnalyticsEvent(eventData, 'reading_completion', {
    timeOnPage,
    completed: true
  })

  return NextResponse.json({ success: true })
}

async function handleNewsletterSignup(eventData: any) {
  const { articleId, sessionId } = eventData

  if (articleId && sessionId) {
    // Mark newsletter signup from this article
    await supabaseAdmin
      .from('article_analytics')
      .update({
        newsletter_signup_from_article: true
      })
      .eq('article_id', articleId)
      .eq('session_id', sessionId)
  }

  await logAnalyticsEvent(eventData, 'newsletter_signup', {
    source: articleId ? 'article' : 'other'
  })

  return NextResponse.json({ success: true })
}

async function handleExternalLinkClick(eventData: any) {
  const { articleId, sessionId, linkUrl } = eventData

  if (articleId && sessionId) {
    // Get current count and increment
    const { data: currentData } = await supabaseAdmin
      .from('article_analytics')
      .select('external_links_clicked')
      .eq('article_id', articleId)
      .eq('session_id', sessionId)
      .single()

    if (currentData) {
      await supabaseAdmin
        .from('article_analytics')
        .update({
          external_links_clicked: (currentData.external_links_clicked || 0) + 1
        })
        .eq('article_id', articleId)
        .eq('session_id', sessionId)
    }
  }

  await logAnalyticsEvent(eventData, 'external_link_click', {
    linkUrl
  })

  return NextResponse.json({ success: true })
}

async function handlePerformanceMetrics(supabase: any, data: any) {
  // Validate required fields
  if (!data.session_id) {
    throw new Error('Missing required field: session_id is required for performance metrics');
  }

  // Ensure timestamp is valid
  const timestamp = data.timestamp || new Date().toISOString();

  const metricsData = {
    session_id: data.session_id,
    page_path: data.page_path || '/unknown',
    lcp: data.lcp || null,
    fid: data.fid || null,
    cls: data.cls || null,
    fcp: data.fcp || null,
    ttfb: data.ttfb || null,
    dom_load_time: data.domLoadTime || null,
    window_load_time: data.windowLoadTime || null,
    navigation_type: data.navigationType || null,
    connection_type: data.connectionType || null,
    effective_connection_type: data.connectionType || null,
    device_memory: data.deviceMemory || null,
    hardware_concurrency: data.hardwareConcurrency || null,
    viewport_width: data.viewportWidth || null,
    viewport_height: data.viewportHeight || null,
    bounce_rate: data.bounceRate || false,
    time_on_page: data.timeOnPage || null,
    scroll_depth: data.scrollDepth || null,
    timestamp: timestamp
  };

  const { error } = await supabase
    .from('performance_metrics')
    .insert(metricsData);

  if (error) {
    console.error('Failed to insert performance metrics:', JSON.stringify(error, null, 2));
    console.error('Performance data attempted to insert:', JSON.stringify(metricsData, null, 2));
    throw error;
  }

  console.log(`📈 Performance metrics tracked - LCP: ${data.lcp}ms, FID: ${data.fid}ms, CLS: ${data.cls}`);
}

async function handleErrorLog(supabase: any, data: any, clientInfo: any) {
  // Determine error severity
  const severity = determineErrorSeverity(data.errorType, data.errorMessage);
  
  // Create error group for similar errors
  const errorGroup = createErrorGroup(data.errorMessage, data.errorStack);
  
  // Extract browser and OS info
  const browserInfo = extractBrowserInfo(clientInfo.user_agent);

  // Check if this error group already exists
  const { data: existingError } = await supabase
    .from('error_logs')
    .select('id, occurrence_count')
    .eq('error_group', errorGroup)
    .eq('page_path', data.page_path)
    .single();

  if (existingError) {
    // Update existing error with new occurrence
    const { error: updateError } = await supabase
      .from('error_logs')
      .update({
        occurrence_count: existingError.occurrence_count + 1,
        timestamp: data.timestamp || new Date().toISOString()
      })
      .eq('id', existingError.id);

    if (updateError) {
      console.error('Failed to update error log:', updateError);
      throw updateError;
    }
  } else {
    // Insert new error
    const { error } = await supabase
      .from('error_logs')
      .insert({
        session_id: data.session_id,
        page_path: data.page_path,
        error_type: data.errorType,
        error_message: data.errorMessage,
        error_stack: data.errorStack || null,
        user_agent: clientInfo.user_agent,
        severity,
        error_group: errorGroup,
        browser_name: browserInfo.browser,
        os_name: browserInfo.os,
        viewport_width: data.viewportWidth || null,
        viewport_height: data.viewportHeight || null,
        first_occurrence: data.timestamp || new Date().toISOString(),
        occurrence_count: 1,
        timestamp: data.timestamp || new Date().toISOString()
      });

    if (error) {
      console.error('Failed to insert error log:', error);
      throw error;
    }
  }

  console.log(`🚨 Error logged: [${severity.toUpperCase()}] ${data.errorType} - ${data.errorMessage}`);
}

async function logAnalyticsEvent(eventData: any, eventType: string, additionalData: Record<string, any>) {
  await supabaseAdmin
    .from('analytics_events')
    .insert({
      session_id: eventData.sessionId,
      article_id: eventData.articleId || null,
      user_id: eventData.userId || null,
      event_type: eventType,
      event_data: {
        ...eventData,
        ...additionalData
      }
    })
}

// Helper functions for enhanced error tracking
function determineErrorSeverity(errorType: string, errorMessage: string): 'critical' | 'warning' | 'info' {
  const criticalPatterns = [
    'TypeError',
    'ReferenceError', 
    'ChunkLoadError',
    'Network Error',
    'Failed to fetch',
    'Script error',
    'Uncaught',
    'Fatal'
  ];
  
  const warningPatterns = [
    'Warning',
    'Deprecated',
    'Console',
    'Performance'
  ];
  
  const errorText = `${errorType} ${errorMessage}`.toLowerCase();
  
  if (criticalPatterns.some(pattern => errorText.includes(pattern.toLowerCase()))) {
    return 'critical';
  }
  
  if (warningPatterns.some(pattern => errorText.includes(pattern.toLowerCase()))) {
    return 'info';
  }
  
  return 'warning';
}

function createErrorGroup(errorMessage: string, errorStack?: string): string {
  // Remove dynamic parts like line numbers, URLs, and timestamps
  let group = errorMessage
    .replace(/:\d+:\d+/g, '') // Remove line:column numbers
    .replace(/\d+/g, 'N') // Replace numbers with N
    .replace(/https?:\/\/[^\s]+/g, '[URL]') // Replace URLs
    .replace(/id=[\w-]+/g, 'id=[ID]') // Replace dynamic IDs
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // Use first line of stack trace if available for more specificity
  if (errorStack) {
    const firstStackLine = errorStack.split('\n')[1];
    if (firstStackLine) {
      const cleanStackLine = firstStackLine
        .replace(/:\d+:\d+/g, '')
        .replace(/https?:\/\/[^\s]+/g, '[URL]')
        .trim();
      group = `${group} | ${cleanStackLine}`;
    }
  }
  
  return group.substring(0, 255); // Limit length for database
}

function extractBrowserInfo(userAgent: string): { browser: string; os: string } {
  const browser = getBrowserName(userAgent);
  const os = getOSName(userAgent);
  return { browser, os };
}

function getBrowserName(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
}

function getOSName(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({ 
    status: 'Analytics tracking API operational',
    timestamp: new Date().toISOString()
  })
} 