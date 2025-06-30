"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { 
  Mail, Users, UserX, Search, Download, Trash2, Send, 
  Calendar, Clock, Eye, TrendingUp, Plus, Edit, Copy,
  Zap, Target, BarChart3, FileText, CheckSquare, 
  Calendar as CalendarIcon, Sparkles, PlusCircle, Settings,
  Monitor, Smartphone, Upload, Code, X
} from "lucide-react"
import { toast } from "sonner"

interface Subscriber {
  id: string
  email: string
  status: 'pending' | 'confirmed' | 'unsubscribed'
  subscribed_at: string
  unsubscribed_at?: string
  source: string
  created_at: string
}

interface Campaign {
  id: string
  name: string
  subject: string
  content: string
  html_content: string
  status: 'draft' | 'scheduled' | 'sent' | 'sending'
  scheduled_at?: string
  sent_at?: string
  recipient_count: number
  open_rate?: number
  click_rate?: number
  created_at: string
  template_type: 'weekly' | 'monthly' | 'custom'
  campaign_type: 'weekly' | 'airfare_daily' | 'custom'
  target_date?: string
  description?: string
}

interface EmailTemplate {
  id: string
  name: string
  type: string
  subject?: string
  html_content: string
  created_at: string
  updated_at: string
}

interface SubscriberList {
  id: string
  name: string
  description: string
  list_type: string
  is_active: boolean
  subscriber_count: number
  created_at: string
  updated_at: string
}

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  published: boolean
  featured: boolean
  created_at: string
  updated_at: string
  category: string
  subcategory?: string
  author_name?: string
  featured_image?: string
  status?: string // Keep for transformation compatibility
  categories?: { slug: string } // Keep for transformation compatibility
}

export default function NewsletterAdminPage() {
  const [activeTab, setActiveTab] = useState('subscribers')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [subscriberLists, setSubscriberLists] = useState<SubscriberList[]>([])
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    pending: 0,
    unsubscribed: 0
  })
  
  // Subscriber management
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'unsubscribed'>('all')

  // Enhanced campaign creation and editing
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [selectedArticles, setSelectedArticles] = useState<string[]>([])
  const [selectedTargetDate, setSelectedTargetDate] = useState<Date | undefined>()
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    subject: '',
    content: '',
    description: '',
    campaign_type: 'custom' as 'weekly' | 'airfare_daily' | 'custom',
    template_type: 'custom' as 'weekly' | 'monthly' | 'custom',
    scheduled_at: '',
    target_date: '',
    send_immediately: false,
    template_id: '',
    target_list_id: '',
    target_all_subscribers: true
  })

  // Email Preview State
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [previewContent, setPreviewContent] = useState('')
  const [previewSubject, setPreviewSubject] = useState('')
  const [previewType, setPreviewType] = useState<'campaign' | 'template' | 'custom'>('custom')

  // Template Import State
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importForm, setImportForm] = useState({
    name: '',
    subject: '',
    html_content: '',
    type: 'custom' as 'weekly' | 'monthly' | 'welcome' | 'custom'
  })

  // Template states
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)
  const [templateForm, setTemplateForm] = useState({
    name: '',
    type: '',
    subject: '',
    html_content: ''
  })

  // Date helpers for smart suggestions
  const getDateHelpers = () => {
    const today = new Date()
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
    
    return {
      thisWeek: oneWeekAgo.toISOString().split('T')[0],
      lastWeek: twoWeeksAgo.toISOString().split('T')[0],
      today: today.toISOString().split('T')[0],
      weekNumber: getWeekNumber(today),
      weeklyEditionDate: formatWeeklyDate(today)
    }
  }

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7)
  }

  const formatWeeklyDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      await Promise.all([
        fetchSubscribers(),
        fetchCampaigns(),
        fetchTemplates(),
        fetchArticles(),
        fetchSubscriberLists()
      ])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load newsletter data')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-subscribers')
      if (!response.ok) throw new Error('Failed to fetch subscribers')
      
      const data = await response.json()
      setSubscribers(data.subscribers || [])
      
      // Calculate stats
      const total = data.subscribers?.length || 0
      const confirmed = data.subscribers?.filter((s: Subscriber) => s.status === 'confirmed').length || 0
      const pending = data.subscribers?.filter((s: Subscriber) => s.status === 'pending').length || 0
      const unsubscribed = data.subscribers?.filter((s: Subscriber) => s.status === 'unsubscribed').length || 0
      
      setStats({ total, confirmed, pending, unsubscribed })
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      toast.error('Failed to fetch subscribers')
    }
  }

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    }
  }

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      if (response.ok) {
        const data = await response.json()
        console.log('📧 Newsletter - Fetched articles data:', data)
        console.log('📧 Newsletter - Articles array:', data.articles)
        console.log('📧 Newsletter - Sample article:', data.articles?.[0])
        // Transform the data to match our interface by mapping status to published
        const transformedArticles = (data.articles || []).map((article: any) => ({
          ...article,
          published: article.status === 'published',
          featured: article.featured_main || article.featured_category,
          excerpt: article.summary,
          category: article.categories?.slug || '',
          featured_image: article.hero_image_url
        }))
        console.log('📧 Newsletter - Transformed articles:', transformedArticles.length)
        setArticles(transformedArticles)
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
    }
  }

  const fetchSubscriberLists = async () => {
    try {
      const response = await fetch('/api/admin/newsletter-subscriber-lists')
      if (response.ok) {
        const data = await response.json()
        setSubscriberLists(data.lists || [])
      }
    } catch (error) {
      console.error('Error fetching subscriber lists:', error)
    }
  }

  const getSmartArticleSuggestions = () => {
    const helpers = getDateHelpers()
    
    if (campaignForm.campaign_type === 'weekly') {
      // For weekly campaigns, suggest recent articles (fallback to all published if none from past week)
      let weeklyArticles = articles.filter(article => {
        const articleDate = new Date(article.created_at)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return articleDate >= weekAgo && article.published
      }).slice(0, 5)
      
      // Fallback: if no articles from past week, show recent published articles
      if (weeklyArticles.length === 0) {
        weeklyArticles = articles.filter(article => article.published)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      }
      
      return {
        title: `📅 This Week's Articles (Week ${helpers.weekNumber})`,
        articles: weeklyArticles,
        description: weeklyArticles.length > 0 ? 'Recent articles perfect for your weekly newsletter' : 'No recent articles found, showing latest published articles'
      }
    } else if (campaignForm.campaign_type === 'airfare_daily') {
      // For daily airfare, suggest travel deals and airline content (with fallback)
      let dealArticles = articles.filter(article => 
        (article.category === 'travel-hacks-and-deals' || 
         article.category === 'airlines-and-aviation') && 
        article.published
      ).slice(0, 3)
      
      // Fallback: if no travel/airline articles, show any published articles
      if (dealArticles.length === 0) {
        dealArticles = articles.filter(article => article.published)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3)
      }
      
      return {
        title: '✈️ Latest Airfare & Travel Deals',
        articles: dealArticles,
        description: 'Perfect for daily deal alerts'
      }
    } else {
      // For custom campaigns, suggest featured articles (with fallback)
      let featuredArticles = articles.filter(article => 
        article.featured && article.published
      ).slice(0, 4)
      
      // Fallback: if no featured articles, show recent published articles
      if (featuredArticles.length === 0) {
        featuredArticles = articles.filter(article => article.published)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4)
      }
      
      return {
        title: '⭐ Featured Articles',
        articles: featuredArticles,
        description: featuredArticles.some(a => a.featured) ? 'Our most popular content' : 'Recent published articles'
      }
    }
  }

  const smartSuggestions = getSmartArticleSuggestions()

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      
      // Set default target date based on template type
      const defaultDate = template.type === 'weekly' ? 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : // Next week for weekly newsletters
        new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow for other campaigns
      
      setSelectedTargetDate(defaultDate)
      
      setCampaignForm(prev => ({
        ...prev,
        name: template.type === 'weekly' ? 
          `Weekly Newsletter - ${getDateHelpers().weeklyEditionDate}` : 
          template.type === 'monthly' ? 
            `Monthly Update - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` :
            template.name,
        subject: template.subject || '',
        content: template.html_content,
        template_type: template.type as 'weekly' | 'monthly' | 'custom',
        campaign_type: template.type === 'weekly' ? 'weekly' : 
                      template.type === 'monthly' ? 'custom' : 'custom',
        description: template.type === 'weekly' ? 
          `Weekly newsletter featuring this week's best travel content` :
          template.type === 'monthly' ?
            `Monthly roundup of travel insights and deals` :
            'Custom email campaign',
        template_id: templateId,
        target_date: defaultDate.toISOString().split('T')[0]
      }))
    }
  }

  const toggleArticleSelection = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    )
  }

  // Email Preview Functions
  const openPreview = (content: string, subject: string, type: 'campaign' | 'template' | 'custom') => {
    setPreviewContent(content)
    setPreviewSubject(subject)
    setPreviewType(type)
    setShowPreviewDialog(true)
  }

  const generatePreviewHTML = (content: string) => {
    // Add mobile-responsive styles and replace placeholders
    const responsiveHTML = content.replace(
      /<head>/gi,
      `<head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; padding: 10px !important; }
            .content { padding: 15px !important; }
            .header { padding: 20px !important; }
            table { width: 100% !important; }
            td { display: block !important; width: 100% !important; }
          }
        </style>`
    )
    
    // Replace common placeholders
    return responsiveHTML
      .replace(/{{unsubscribe_url}}/g, '#unsubscribe')
      .replace(/{{subscriber_email}}/g, 'preview@example.com')
      .replace(/{{subscriber_name}}/g, 'Preview User')
  }

  const generateCampaignHTML = () => {
    if (!selectedTemplate) return ''
    
    let html = selectedTemplate.html_content
    
    // Insert selected articles into template
    if (selectedArticles.length > 0) {
      const articleElements = selectedArticles.map(articleId => {
        const article = articles.find(a => a.id === articleId)
        if (!article) return ''
        
        return `
          <div style="margin: 20px 0; padding: 0; background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${article.featured_image ? `
              <img src="${article.featured_image}" 
                   alt="${article.title}" 
                   style="width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #e5e7eb;">
            ` : ''}
            <div style="padding: 20px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                <span style="background: #0f766e; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
                  ${article.category.replace('-', ' ')}
                </span>
                ${article.featured ? '<span style="background: #fbbf24; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">⭐ Featured</span>' : ''}
              </div>
              <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px; font-weight: bold; line-height: 1.3;">
                <a href="https://maxyourpoints.com/blog/${article.slug}" style="text-decoration: none; color: #1f2937;">
                  ${article.title}
                </a>
              </h3>
              <p style="margin: 0 0 16px 0; color: #6b7280; line-height: 1.6; font-size: 14px;">
                ${article.excerpt || article.content.substring(0, 150) + '...'}
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <a href="https://maxyourpoints.com/blog/${article.slug}" 
                   style="display: inline-block; background: linear-gradient(135deg, #0f766e 0%, #059669 100%); 
                          color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; 
                          font-weight: bold; font-size: 14px; transition: transform 0.2s;">
                  Read Full Article →
                </a>
                <span style="color: #9ca3af; font-size: 12px;">
                  ${new Date(article.created_at).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        `
      }).join('')
      
      // Replace article placeholder in template
      html = html.replace(/{{articles}}/g, articleElements)
    }
    
    return html
  }

  // Template Import Functions
  const handleImportTemplate = async () => {
    try {
      if (!importForm.name || !importForm.html_content) {
        toast.error('Please provide template name and HTML content')
        return
      }

      const response = await fetch('/api/admin/newsletter-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: importForm.name,
          subject: importForm.subject || 'Newsletter Update',
          content: importForm.html_content.substring(0, 500) + '...', // Extract text preview
          html_content: importForm.html_content,
          type: importForm.type
        }),
      })

      if (response.ok) {
        toast.success('Template imported successfully!')
        setShowImportDialog(false)
        setImportForm({
          name: '',
          subject: '',
          html_content: '',
          type: 'custom'
        })
        fetchTemplates()
      } else {
        throw new Error('Failed to import template')
      }
    } catch (error) {
      console.error('Error importing template:', error)
      toast.error('Failed to import template')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'text/html') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setImportForm(prev => ({
          ...prev,
          html_content: content,
          name: prev.name || file.name.replace('.html', '')
        }))
      }
      reader.readAsText(file)
    } else {
      toast.error('Please select an HTML file')
    }
  }

  const handleCreateCampaign = async () => {
    try {
      if (!campaignForm.name || !campaignForm.subject) {
        toast.error('Please fill in campaign name and subject')
        return
      }

      if (selectedArticles.length === 0) {
        toast.error('Please select at least one article for the campaign')
        return
      }

      const htmlContent = generateCampaignHTML()

      // Convert selected date to string format
      const targetDate = selectedTargetDate ? selectedTargetDate.toISOString().split('T')[0] : ''

      const url = editingCampaign 
        ? `/api/admin/newsletter-campaigns/${editingCampaign.id}` 
        : '/api/admin/newsletter-campaigns'
      
      const method = editingCampaign ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...campaignForm,
          target_date: targetDate,
          html_content: htmlContent,
          selected_articles: selectedArticles,
          target_list_id: campaignForm.target_all_subscribers ? null : campaignForm.target_list_id,
          target_all_subscribers: campaignForm.target_all_subscribers
        })
      })

      if (!response.ok) throw new Error(`Failed to ${editingCampaign ? 'update' : 'create'} campaign`)

      toast.success(`Campaign ${editingCampaign ? 'updated' : 'created'} successfully with selected articles!`)
      resetCampaignForm()
      fetchCampaigns()
    } catch (error) {
      console.error(`Error ${editingCampaign ? 'updating' : 'creating'} campaign:`, error)
      toast.error(`Failed to ${editingCampaign ? 'update' : 'create'} campaign`)
    }
  }

  const openCampaignEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign)
    setCampaignForm({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content || '',
      description: campaign.description || '',
      campaign_type: campaign.campaign_type,
      template_type: campaign.template_type,
      scheduled_at: campaign.scheduled_at || '',
      target_date: campaign.target_date || '',
      send_immediately: false,
      template_id: '',
      target_list_id: (campaign as any).target_list_id || '',
      target_all_subscribers: (campaign as any).target_all_subscribers !== false
    })
    
    // Parse selected articles from campaign if available
    // This would require storing article IDs in the campaign
    setSelectedArticles([])
    
    if (campaign.target_date) {
      setSelectedTargetDate(new Date(campaign.target_date))
    }
    
    setShowCampaignDialog(true)
  }

  const resetCampaignForm = () => {
    setShowCampaignDialog(false)
    setEditingCampaign(null)
    setSelectedTemplate(null)
    setSelectedArticles([])
    setSelectedTargetDate(undefined)
    setCampaignForm({
      name: '',
      subject: '',
      content: '',
      description: '',
      campaign_type: 'custom',
      template_type: 'custom',
      scheduled_at: '',
      target_date: '',
      send_immediately: false,
      template_id: '',
      target_list_id: '',
      target_all_subscribers: true
    })
  }

  const handleSendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/admin/newsletter-campaigns/${campaignId}/send`, {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Failed to send campaign')

      toast.success('Campaign sent successfully!')
      fetchCampaigns()
    } catch (error) {
      console.error('Error sending campaign:', error)
      toast.error('Failed to send campaign')
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      unsubscribed: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCampaignStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      sending: 'bg-orange-100 text-orange-800',
      sent: 'bg-green-100 text-green-800'
    }
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getCampaignTypeBadge = (type: string) => {
    const variants = {
      weekly: { className: 'bg-blue-100 text-blue-800', icon: '📅', label: 'Weekly' },
      airfare_daily: { className: 'bg-orange-100 text-orange-800', icon: '✈️', label: 'Daily Deal' },
      custom: { className: 'bg-purple-100 text-purple-800', icon: '⚡', label: 'Custom' }
    }
    const variant = variants[type as keyof typeof variants] || variants.custom
    return (
      <Badge className={variant.className}>
        {variant.icon} {variant.label}
      </Badge>
    )
  }

  const exportSubscribers = () => {
    const csv = [
      'Email,Status,Subscribed At,Source',
      ...subscribers.map(s => `${s.email},${s.status},${s.subscribed_at},${s.source}`)
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Import existing email templates
  const importExistingTemplates = async () => {
    try {
      setLoading(true)
      
      // Import subscription confirmation template
      const subscriptionTemplate = {
        name: 'Subscription Confirmation (You Have Landed)',
        type: 'subscription_confirmation',
        subject: '🛬 YOU HAVE LANDED! Welcome to Max Your Points (This is going to be fun!) ✈️',
        description: 'Super funny welcome email with airplane landing theme',
        html_content: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🛬 You Have Landed at Max Your Points!</title>
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 100% !important; padding: 10px !important; }
              .header { padding: 20px !important; font-size: 24px !important; }
              .content { padding: 20px !important; }
              .benefit-item { margin-bottom: 15px !important; }
            }
          </style>
        </head>
        <body style="font-family: 'Comic Sans MS', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f0f9ff;">
          <div class="container" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header with Landing Animation Feel -->
            <div class="header" style="background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0; position: relative; overflow: hidden;">
              <div style="position: absolute; top: -50px; left: -50px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; animation: float 3s ease-in-out infinite;"></div>
              <div style="position: absolute; bottom: -30px; right: -30px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
              
              <h1 class="header" style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                🛬 YOU HAVE LANDED! ✈️
              </h1>
              <p style="color: #e0f2fe; margin: 10px 0 0 0; font-size: 18px; font-weight: bold;">
                Welcome aboard Max Your Points!
              </p>
            </div>
            
            <!-- Main Content -->
            <div class="content" style="background: white; padding: 30px; border-radius: 0 0 15px 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);">
              
              <!-- Funny Welcome Message -->
              <div style="text-align: center; margin-bottom: 25px; padding: 20px; background: linear-gradient(45deg, #fef3c7, #fde68a); border-radius: 12px; border: 2px dashed #f59e0b;">
                <h2 style="color: #92400e; margin: 0 0 10px 0; font-size: 24px;">
                  🎉 CONGRATS, YOU MAGNIFICENT HUMAN! 🎉
                </h2>
                <p style="margin: 0; color: #78350f; font-size: 16px; font-weight: bold;">
                  You've successfully infiltrated our exclusive club of travel ninjas!
                </p>
              </div>

              <p style="font-size: 16px; margin-bottom: 20px;">
                Holy guacamole! 🥑 You just made the smartest decision since someone invented airplane WiFi (okay, maybe smarter). 
                Welcome to the Max Your Points family - where we turn ordinary humans into points-collecting, mile-hoarding, 
                first-class-flying legends! 
              </p>

              <p style="font-size: 16px; margin-bottom: 25px; color: #1f2937;">
                Here's what's about to happen to your inbox (spoiler alert: it's going to be AWESOME):
              </p>

              <!-- Benefits with Funny Icons -->
              <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">🎯</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Epic Travel Hacking Secrets</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">We'll teach you to hack the system so hard, airlines will start paying YOU to fly!</span>
                  </div>
                </div>
                
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">🕵️</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Airline Industry Insider Tea ☕</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">All the gossip, drama, and secrets that make airline executives nervous!</span>
                  </div>
                </div>
                
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">🏨</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Hotel Reviews That Don't Lie</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">Brutally honest reviews - because someone needs to tell you about that "charming vintage elevator"!</span>
                  </div>
                </div>
                
                <div class="benefit-item" style="display: flex; align-items: flex-start; margin-bottom: 0; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <div style="font-size: 24px; margin-right: 15px; min-width: 40px;">💳</div>
                  <div>
                    <strong style="color: #0f766e; font-size: 16px;">Credit Card Wizardry</strong><br>
                    <span style="color: #4a5568; font-size: 14px;">Turn plastic into plane tickets faster than you can say "annual fee waived"!</span>
                  </div>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px;">
                <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px;">
                  🚀 READY FOR TAKEOFF?
                </h3>
                <p style="color: #d1fae5; margin: 0 0 20px 0; font-size: 16px;">
                  Your first mission: Check out our latest travel hacks that could save you THOUSANDS!
                </p>
                <a href="https://maxyourpoints.com/blog" style="display: inline-block; background: white; color: #059669; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  Let's Go! 🎯
                </a>
              </div>

              <!-- Funny Sign-off -->
              <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                <p style="margin: 0; font-style: italic; color: #7f1d1d; font-size: 14px;">
                  P.S. - We promise our emails are more entertaining than airline safety videos and more useful than airport WiFi! 📶
                </p>
              </div>

              <p style="margin-top: 25px; text-align: center; color: #4b5563;">
                Ready to become a travel legend?<br>
                <strong style="color: #0f766e;">The Max Your Points Crew</strong> 🛩️
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; padding: 15px;">
              <p style="margin: 0 0 5px 0;">You're receiving this because you just joined the coolest travel community on Earth! 🌍</p>
              <p style="margin: 0;">
                <a href="{{unsubscribe_url}}" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> | 
                <a href="https://maxyourpoints.com" style="color: #6b7280; text-decoration: underline;">Visit Website</a> | 
                <a href="https://x.com/max_your_points" style="color: #6b7280; text-decoration: underline;">Follow on X</a>
              </p>
            </div>
          </div>
        </body>
      </html>`
      }
      
      // Import unsubscribe confirmation template
      const unsubscribeTemplate = {
        name: 'Unsubscribe Confirmation',
        type: 'unsubscribe_confirmation',
        subject: 'Unsubscribed from Max Your Points',
        description: 'Polite goodbye email with feedback options',
        html_content: `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Unsubscribed from Max Your Points</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f1f5f9; padding: 30px; text-align: center; border-radius: 10px; border: 1px solid #e2e8f0;">
            <h1 style="color: #475569; margin: 0 0 20px 0; font-size: 24px;">You've been unsubscribed</h1>
            
            <p>We're sorry to see you go! You have been successfully unsubscribed from the Max Your Points newsletter.</p>
            
            <p>If you change your mind, you can always <a href="https://maxyourpoints.com" style="color: #0f766e; text-decoration: none; font-weight: bold;">visit our website</a> to subscribe again.</p>
            
            <div style="margin: 30px 0; padding: 20px; background: white; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                If this was a mistake or you have any questions, please contact us at isak@maxyourpoints.com
              </p>
            </div>
            
            <p style="color: #64748b;">Safe travels,<br>
            <strong>The Max Your Points Team</strong></p>
          </div>
        </body>
      </html>`
      }

      // Import templates to database
      const response = await fetch('/api/admin/newsletter-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionTemplate)
      })
      
      if (response.ok) {
        const response2 = await fetch('/api/admin/newsletter-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unsubscribeTemplate)
        })
        
        if (response2.ok) {
          toast.success('Existing email templates imported successfully!')
          fetchTemplates()
        }
      }
      
    } catch (error) {
      console.error('Error importing templates:', error)
      toast.error('Failed to import templates')
    } finally {
      setLoading(false)
    }
  }

  // Open template dialog for editing
  const openTemplateEdit = (template: any) => {
    setEditingTemplate(template)
    setTemplateForm({
      name: template.name,
      type: template.type,
      subject: template.subject || '',
      html_content: template.html_content
    })
    setShowTemplateDialog(true)
  }

  // Save template changes
  const saveTemplate = async () => {
    try {
      setLoading(true)
      
      const method = editingTemplate ? 'PUT' : 'POST'
      const url = '/api/admin/newsletter-templates'
      
      const payload = editingTemplate 
        ? { ...templateForm, id: editingTemplate.id }
        : templateForm

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(editingTemplate ? 'Template updated successfully!' : 'Template created successfully!')
        setShowTemplateDialog(false)
        setEditingTemplate(null)
        setTemplateForm({ name: '', type: '', subject: '', html_content: '' })
        fetchTemplates()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Template save error:', errorData)
        toast.error(`Failed to save template: ${errorData.error || 'Unknown error'}`)
      }
      
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  // Handle template HTML file import
  const handleTemplateImport = async (event: React.ChangeEvent<HTMLInputElement>, templateId?: string) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const html = await file.text()
      
      if (templateId) {
        // Update existing template with imported HTML
        const template = templates.find(t => t.id === templateId)
        if (template) {
          const response = await fetch('/api/admin/newsletter-templates', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: templateId,
              html_content: html
            })
          })
          
          if (response.ok) {
            toast.success('Template HTML imported successfully!')
            fetchTemplates()
          } else {
            toast.error('Failed to import HTML')
          }
        }
      } else {
        // Create new template with imported HTML
        setTemplateForm(prev => ({ ...prev, html_content: html }))
      }
    } catch (error) {
      console.error('Error importing HTML:', error)
      toast.error('Failed to read HTML file')
    }
    
    // Reset file input
    event.target.value = ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Subscribers</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
      </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Subscribers</p>
                <p className="text-3xl font-bold text-green-900">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Campaigns Sent</p>
                <p className="text-3xl font-bold text-purple-900">{campaigns.filter(c => c.status === 'sent').length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg. Open Rate</p>
                <p className="text-3xl font-bold text-orange-900">
                  {campaigns.length > 0 
                    ? Math.round(campaigns.reduce((acc, c) => acc + (c.open_rate || 0), 0) / campaigns.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-lg shadow-sm border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 p-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscribers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Newsletter Subscribers
                </span>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      fetchData()
                      toast.success('Subscriber data refreshed!')
                    }} 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Refresh
                  </Button>
                  <Button onClick={exportSubscribers} variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export CSV
                  </Button>
                </div>
              </CardTitle>
          </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search subscribers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-4 gap-4 p-4 font-medium bg-gray-50">
                  <span>Email</span>
                  <span>Status</span>
                  <span>Subscribed</span>
                  <span>Source</span>
                </div>
                <div className="divide-y">
                  {filteredSubscribers.map((subscriber) => (
                    <div key={subscriber.id} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50">
                      <span className="font-medium">{subscriber.email}</span>
                      <span>{getStatusBadge(subscriber.status)}</span>
                      <span className="text-sm text-gray-600">
                        {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">{subscriber.source}</span>
                    </div>
                  ))}
                </div>
              </div>
          </CardContent>
        </Card>
        </TabsContent>
        
        {/* Enhanced Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Email Campaigns
                </span>
                <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="w-4 h-4" />
                      Create Campaign
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6 py-4">
                      {/* Template Selection */}
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Choose Template
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {templates.map((template) => (
                            <Card 
                              key={template.id} 
                              className={`cursor-pointer transition-all hover:shadow-md ${
                                selectedTemplate?.id === template.id 
                                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleTemplateSelect(template.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-sm">{template.name}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {template.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">
                                  {template.subject}
                                </p>
          </CardContent>
        </Card>
                          ))}
                        </div>
      </div>

                      <Separator />

                      {/* Campaign Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="campaign-name">Campaign Name *</Label>
              <Input
                            id="campaign-name"
                            value={campaignForm.name}
                            onChange={(e) => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Weekly Newsletter - Week 47"
              />
            </div>
                        <div className="space-y-2">
                          <Label htmlFor="campaign-type">Campaign Type</Label>
                          <Select 
                            value={campaignForm.campaign_type} 
                            onValueChange={(value: any) => setCampaignForm(prev => ({ ...prev, campaign_type: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">📅 Weekly Newsletter</SelectItem>
                              <SelectItem value="airfare_daily">✈️ Daily Airfare Alert</SelectItem>
                              <SelectItem value="custom">⚡ Custom Campaign</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaign-subject">Email Subject *</Label>
                        <Input
                          id="campaign-subject"
                          value={campaignForm.subject}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Your amazing email subject line"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="campaign-description">Description</Label>
                        <Textarea
                          id="campaign-description"
                          value={campaignForm.description}
                          onChange={(e) => setCampaignForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of this campaign"
                          rows={2}
                        />
                      </div>

                      <Separator />

                      {/* Smart Article Selection */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold flex items-center gap-2">
                            <CheckSquare className="w-4 h-4" />
                            Select Articles for Campaign
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {selectedArticles.length} of {articles.filter(article => article.published).length} selected
                          </Badge>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            All Published Articles
                          </h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Select articles to include in your campaign. Articles are sorted by publish date (newest first).
                            {campaignForm.campaign_type === 'weekly' && " For weekly newsletters, consider selecting recent articles from the past week."}
                            {campaignForm.campaign_type === 'airfare_daily' && " For daily alerts, focus on travel deals and airline content."}
                          </p>
                        </div>

                        <ScrollArea className="h-64 border rounded-lg p-4">
                          <div className="space-y-3">
                            {articles
                              .filter(article => article.published)
                              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                              .map((article) => (
                              <div key={article.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 border">
                                <Checkbox
                                  id={article.id}
                                  checked={selectedArticles.includes(article.id)}
                                  onCheckedChange={() => toggleArticleSelection(article.id)}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <label 
                                      htmlFor={article.id} 
                                      className="font-medium text-sm cursor-pointer line-clamp-1"
                                    >
                                      {article.title}
                                    </label>
                                    {article.featured && (
                                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                                        ⭐ Featured
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                                    {article.excerpt || article.content.substring(0, 120) + '...'}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Badge variant="outline" className="text-xs">
                                      {article.category.replace('-', ' ')}
                                    </Badge>
                                    <span>•</span>
                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {articles.filter(article => article.published).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>No published articles available</p>
                            </div>
                          )}
                        </ScrollArea>
                      </div>

                      <Separator />

                      {/* Recipient Selection */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Select Recipients
                          </Label>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="all-subscribers"
                              checked={campaignForm.target_all_subscribers}
                              onChange={() => setCampaignForm(prev => ({ ...prev, target_all_subscribers: true, target_list_id: '' }))}
                              className="w-4 h-4"
                            />
                            <label htmlFor="all-subscribers" className="text-sm font-medium">
                              All confirmed subscribers ({stats.confirmed})
                            </label>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                id="specific-list"
                                checked={!campaignForm.target_all_subscribers}
                                onChange={() => setCampaignForm(prev => ({ ...prev, target_all_subscribers: false }))}
                                className="w-4 h-4"
                              />
                              <label htmlFor="specific-list" className="text-sm font-medium">
                                Specific subscriber list
                              </label>
                            </div>
                            
                            {!campaignForm.target_all_subscribers && (
                              <div className="ml-6">
                                <Select
                                  value={campaignForm.target_list_id}
                                  onValueChange={(value) => setCampaignForm(prev => ({ ...prev, target_list_id: value }))}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose a subscriber list" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subscriberLists.map((list) => (
                                      <SelectItem key={list.id} value={list.id}>
                                        <div className="flex items-center justify-between w-full">
                                          <span>{list.name}</span>
                                          <Badge variant="outline" className="ml-2">
                                            {list.subscriber_count} subscribers
                                          </Badge>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                
                                {subscriberLists.length === 0 && (
                                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-sm text-amber-800">
                                      No subscriber lists found. <button 
                                        onClick={async () => {
                                          try {
                                            const response = await fetch('/api/admin/setup-subscriber-lists', { method: 'POST' })
                                            if (response.ok) {
                                              await fetchSubscriberLists()
                                              toast.success('Subscriber lists setup complete!')
                                            }
                                          } catch (error) {
                                            toast.error('Failed to setup lists')
                                          }
                                        }}
                                        className="text-amber-800 underline hover:text-amber-900"
                                      >
                                        Click here to set them up
                                      </button>
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Scheduling */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Target Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal ${!selectedTargetDate && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedTargetDate ? (
                                  selectedTargetDate.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                ) : (
                                  <span>Pick a target date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div className="border rounded-md p-3 bg-gray-50">
                                <CalendarComponent
                                  mode="single"
                                  selected={selectedTargetDate}
                                  onSelect={setSelectedTargetDate}
                                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                  className="w-full"
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="scheduled-at">Schedule For (Optional)</Label>
                          <Input
                            id="scheduled-at"
                            type="datetime-local"
                            value={campaignForm.scheduled_at}
                            onChange={(e) => setCampaignForm(prev => ({ ...prev, scheduled_at: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={resetCampaignForm}>
                          Cancel
                        </Button>
                                        <Button
                          onClick={handleCreateCampaign}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          disabled={!campaignForm.name || !campaignForm.subject || selectedArticles.length === 0}
                        >
                          <PlusCircle className="w-4 h-4 mr-2" />
                          {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No campaigns created yet</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {campaigns.map((campaign) => (
                      <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              {getCampaignTypeBadge(campaign.campaign_type)}
                              {getCampaignStatusBadge(campaign.status)}
                            </div>
                            <div className="flex items-center gap-2">
                              {campaign.status === 'draft' && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => openCampaignEdit(campaign)}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSendCampaign(campaign.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Send className="w-4 h-4 mr-1" />
                                    Send Now
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => openPreview(campaign.html_content, campaign.subject, 'campaign')}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Preview
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Subject:</span> {campaign.subject}
                            </div>
                            <div>
                              <span className="font-medium">Recipients:</span> {campaign.recipient_count}
                            </div>
                            <div>
                              <span className="font-medium">Created:</span> {new Date(campaign.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {campaign.description && (
                            <p className="text-sm text-gray-600 mt-3">{campaign.description}</p>
                          )}

                          {(campaign.open_rate || campaign.click_rate) && (
                            <div className="flex gap-4 mt-4 text-sm">
                              {campaign.open_rate && (
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4 text-blue-500" />
                                  <span>Open Rate: {campaign.open_rate}%</span>
                                </div>
                              )}
                              {campaign.click_rate && (
                                <div className="flex items-center gap-1">
                                  <Target className="w-4 h-4 text-green-500" />
                                  <span>Click Rate: {campaign.click_rate}%</span>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
              ))}
            </div>
                )}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
      <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Email Templates
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={importExistingTemplates}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Import Existing Templates
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditingTemplate(null)
                      setTemplateForm({ name: '', type: '', subject: '', html_content: '' })
                      setShowTemplateDialog(true)
                    }}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Template
                  </Button>
            </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">Email template for {template.type} campaigns</p>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openPreview(template.html_content, template.subject || template.name, 'template')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => openTemplateEdit(template)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <input
                          type="file"
                          accept=".html,.htm"
                          onChange={(e) => handleTemplateImport(e, template.id)}
                          className="hidden"
                          id={`import-${template.id}`}
                        />
                        <Button size="sm" variant="outline" asChild>
                          <label htmlFor={`import-${template.id}`} className="cursor-pointer flex items-center">
                            <Upload className="w-4 h-4 mr-1" />
                            Import HTML
                          </label>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {templates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                  <p className="text-gray-500 mb-4">Create your first email template or import existing ones</p>
                  <div className="flex justify-center gap-2">
                    <Button onClick={importExistingTemplates} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Import Existing Templates
                    </Button>
                    <Button onClick={() => {
                      setEditingTemplate(null)
                      setTemplateForm({ name: '', type: '', subject: '', html_content: '' })
                      setShowTemplateDialog(true)
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Template
                    </Button>
                  </div>
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
          </Tabs>
        </div>

      {/* Email Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Email Preview: {previewSubject}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                  className="flex items-center gap-1"
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                  className="flex items-center gap-1"
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div 
              className={`bg-gray-100 p-4 h-[calc(95vh-120px)] overflow-auto transition-all duration-300 ${
                previewMode === 'mobile' ? 'flex justify-center' : ''
              }`}
            >
              <div 
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                  previewMode === 'mobile' ? 'w-[375px] max-w-[375px]' : 'w-full'
                }`}
              >
                <iframe
                  srcDoc={previewContent}
                  className={`w-full border-0 transition-all duration-300 ${
                    previewMode === 'mobile' ? 'h-[600px]' : 'h-[calc(95vh-200px)]'
                  }`}
                  style={{ minHeight: '400px' }}
                  title="Email Preview"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Edit Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Weekly Newsletter"
                  />
                </div>
                <div>
                  <Label htmlFor="template-type">Template Type</Label>
                  <Select 
                    value={templateForm.type} 
                    onValueChange={(value) => setTemplateForm(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select template type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly Newsletter</SelectItem>
                      <SelectItem value="daily_deal">Daily Airfare Alert</SelectItem>
                      <SelectItem value="subscription_confirmation">Subscription Confirmation</SelectItem>
                      <SelectItem value="unsubscribe_confirmation">Unsubscribe Confirmation</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="template-subject">Email Subject</Label>
                <Input
                  id="template-subject"
                  value={templateForm.subject}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="e.g., Your Weekly Travel Update ✈️"
                />
              </div>
              

              
              <div>
                <Label htmlFor="template-html">HTML Content</Label>
                <Textarea
                  id="template-html"
                  value={templateForm.html_content}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, html_content: e.target.value }))}
                  placeholder="HTML content for the email template..."
                  className="h-64 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use placeholders like: {'{{articles}}'}, {'{{unsubscribe_url}}'}, {'{{subscriber_name}}'}, etc.
                </p>
              </div>
            </div>
          </ScrollArea>
          <div className="flex items-center gap-2 pt-4">
            <Button onClick={saveTemplate} disabled={loading}>
              {loading ? 'Saving...' : (editingTemplate ? 'Update Template' : 'Create Template')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => openPreview(templateForm.html_content, templateForm.subject || 'Template Preview', 'template')}
              disabled={!templateForm.html_content}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                      setShowTemplateDialog(false)
      setEditingTemplate(null)
      setTemplateForm({ name: '', type: '', subject: '', html_content: '' })
              }}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  )
} 