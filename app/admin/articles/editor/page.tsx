'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthUser } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import SimpleModal from '../../components/SimpleModal'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Calendar, 
  Send,
  Bold, 
  Italic, 
  Underline,
  List,
  ListOrdered,
  Image,
  Link as LinkIcon,
  Quote,
  Minus,
  Hash,
  BarChart3,
  FileText,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Loader2,
  Search,
  Upload,
  Clock
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'
import { ModernSEOAnalyzer } from '@/app/admin/components/ModernSEOAnalyzer'

// MediaPicker interface 
interface MediaItem {
  id: string
  url: string
  alt_text: string
  caption: string
  file_name: string
  width?: number
  height?: number
  created_at: string
}

interface Category {
  id: string
  name: string
  description?: string
  slug: string
}

interface Subcategory {
  id: string
  name: string
  category_id: string
  slug: string
}

export default function ArticleEditorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const articleId = searchParams?.get('id') || null
  const isEditing = !!articleId
  const { toast } = useToast()
  
  // Form state
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [featuredMain, setFeaturedMain] = useState(false)
  const [featuredCategory, setFeaturedCategory] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [publishedAt, setPublishedAt] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [subcategory, setSubcategory] = useState('')
  const [showSchedulePopup, setShowSchedulePopup] = useState(false)

  
  // Media library state
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [showHeroMediaLibrary, setShowHeroMediaLibrary] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [isLoadingMedia, setIsLoadingMedia] = useState(false)
  const [mediaSearchQuery, setMediaSearchQuery] = useState('')
  const [showLivePreview, setShowLivePreview] = useState(false)
  
  // Data and UI state
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([])
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [originalSlug, setOriginalSlug] = useState('')

  // Load media items
  const loadMediaItems = async () => {
    setIsLoadingMedia(true)
    try {
      console.log('🖼️ Loading media items...')
      const result = await api.getMedia()
      console.log('📸 Media API response:', result)
      
      if (result.success) {
        const images = result.images || result.media || []
        console.log(`✅ Loaded ${images.length} media items`)
        
        // Transform the data to match MediaItem interface
        const transformedImages = images.map((img: any) => ({
          id: img.id,
          url: img.url || img.public_url,
          alt_text: img.alt_text || img.alt || '',
          caption: img.caption || '',
          file_name: img.file_name || img.filename || 'Untitled',
          width: img.width,
          height: img.height,
          created_at: img.created_at
        }))
        
        setMediaItems(transformedImages)
      } else {
        console.error('❌ Failed to load media:', result.error)
        toast({
          title: 'Media Load Error',
          description: 'Failed to load media library. Please try again.',
          variant: 'destructive'
        })
      }
    } catch (error: any) {
      console.error('❌ Media load error:', error)
      toast({
        title: 'Media Load Error',
        description: 'Failed to load media library. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoadingMedia(false)
    }
  }

  // Get current user
  const getCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const userData = await response.json()
        console.log('✅ Current user loaded:', userData.user)
        setCurrentUser(userData.user)
      } else {
        console.log('❌ Failed to get current user - not authenticated')
        // For admin pages, we should have user from server-side auth
        // This is a fallback if client-side auth fails
        setCurrentUser(null)
      }
    } catch (error) {
      console.error('Failed to get current user:', error)
      setCurrentUser(null)
    }
  }

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [categoriesData, subcategoriesData] = await Promise.all([
          api.getCategories(),
          fetch('/api/admin/subcategories').then(res => res.json()),
          getCurrentUser()
        ])
        
        setCategories(categoriesData.categories || [])
        setSubcategories(subcategoriesData.subcategories || [])

        // If editing, load the article
        if (isEditing && articleId) {
          const article = await api.getArticle(articleId)
          
          // Populate form with article data
          setTitle(article.title || '')
          setAuthor(article.author || '')
          setContent(article.content || '')
          setSummary(article.summary || '')
          setSlug(article.slug || '')
          setOriginalSlug(article.slug || '')
          setCategoryId(article.category_id || article.categoryId || '')
          setHeroImageUrl(article.hero_image_url || '')
          setHeroImageAlt(article.hero_image_alt || '')
          setMetaDescription(article.meta_description || '')
          setFocusKeyword(article.focus_keyword || '')
          setFeaturedMain(article.featured_main || false)
          setFeaturedCategory(article.featured_category || false)
          setStatus(article.status || 'draft')
          setPublishedAt(article.published_at || '')
          setTags(article.tags || [])
          setSubcategory(article.subcategory || '')
          
          // Parse existing scheduled date if it exists
          if (article.status === 'scheduled' && article.scheduled_date) {
            setScheduledDate(article.scheduled_date)
            const date = new Date(article.scheduled_date)
            setSelectedDate(date)
            setSelectedTime(`${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`)
          }

          if (article.published_at) {
            setScheduledDate(new Date(article.published_at).toISOString().slice(0, 16))
          }
        }
      } catch (err) {
        console.error('Error loading data:', err)
        toast({
          title: 'Loading Error',
          description: isEditing ? 'Failed to load article. Please try again.' : 'Failed to load categories. Please refresh the page.',
          variant: 'destructive'
        })
        setError(isEditing ? 'Failed to load article' : 'Failed to load categories')
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [articleId, isEditing, toast])

  // Update available subcategories when category changes
  useEffect(() => {
    if (categoryId && subcategories.length > 0) {
      const filtered = subcategories.filter(sub => sub.category_id === categoryId)
      setAvailableSubcategories(filtered)
      
      // Reset subcategory if it's not available for the new category
      if (subcategory && !filtered.find(sub => sub.slug === subcategory)) {
        setSubcategory('')
      }
    } else {
      setAvailableSubcategories([])
      setSubcategory('')
    }
  }, [categoryId, subcategories, subcategory])

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!isEditing || slug === value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setSlug(autoSlug)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
  }

  const handleTagsChange = (value: string) => {
    const tagArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setTags(tagArray)
  }

  // Convert markdown to HTML for live preview
  const renderMarkdownToHtml = (markdown: string) => {
    return markdown
      // Handle images with captions
      .replace(/!\[([^\]]*)\]\(([^)]+)\)\s*\n?(<div[^>]*>.*?<\/div>)?/g, (match, alt, src, caption) => {
        const imageHtml = `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 1rem auto; border-radius: 0.5rem; display: block;" />`
        if (caption) {
          const captionText = caption.replace(/<[^>]*>/g, '').trim()
          return `<div style="text-align: center; margin: 1rem 0;">${imageHtml}<div style="text-align: center; font-style: italic; margin-top: 8px; color: #666; font-size: 14px;">${captionText}</div></div>`
        }
        return `<div style="text-align: center; margin: 1rem 0;">${imageHtml}</div>`
      })
      // Headers
      .replace(/^### (.*$)/gm, '<h3 style="font-size: 1.125rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem;">$1</h1>')
      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>')
      // Lists
      .replace(/^- (.*$)/gm, '<li style="margin-left: 1rem;">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li style="margin-left: 1rem;">$1</li>')
      // Blockquotes
      .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 1rem; font-style: italic; color: #4b5563; margin: 0.5rem 0;">$1</blockquote>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr style="border-top: 1px solid #d1d5db; margin: 1rem 0;">')
      // Paragraphs
      .replace(/\n\n/g, '</p><p style="margin-bottom: 0.5rem;">')
      .replace(/^(?!<[h1-6]|<img|<div|<blockquote|<hr|<ul|<ol|<li)(.+)/gm, '<p style="margin-bottom: 0.5rem;">$1</p>')
      // Clean up
      .replace(/<p style="margin-bottom: 0.5rem;"><\/p>/g, '')
  }

  // Text formatting functions
  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)
    
    const newContent = beforeText + before + selectedText + after + afterText
    setContent(newContent)
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + before.length + selectedText.length + after.length
      textarea.focus()
    }, 0)
  }

  const insertHeader = (level: number) => insertAtCursor(`${'#'.repeat(level)} `, '\n')
  const insertBold = () => insertAtCursor('**', '**')
  const insertItalic = () => insertAtCursor('*', '*')
  const insertUnderline = () => insertAtCursor('<u>', '</u>')
  const insertList = () => insertAtCursor('- ', '\n')
  const insertOrderedList = () => insertAtCursor('1. ', '\n')
  const insertQuote = () => insertAtCursor('> ', '\n')
  const insertLink = () => insertAtCursor('[Link text](', ')')
  const insertHorizontalRule = () => insertAtCursor('\n---\n', '')

  // Enhanced image insertion with media library
  const insertImageFromLibrary = () => {
    setShowMediaLibrary(true)
    if (mediaItems.length === 0) {
      loadMediaItems()
    }
  }

  const handleImageSelection = (selectedImage: MediaItem) => {
    const imageMarkdown = `![${selectedImage.alt_text || selectedImage.file_name}](${selectedImage.url})`
    
    let insertText = `\n\n${imageMarkdown}`
    
    // Add caption if it exists
    if (selectedImage.caption) {
      insertText += `\n\n<div style="text-align: center; font-style: italic; margin-top: 8px; color: #666; font-size: 14px;">${selectedImage.caption}</div>`
    }
    
    insertText += '\n\n'
    
    insertAtCursor(insertText, '')
    setShowMediaLibrary(false)
    
    toast({
      title: 'Image Added',
      description: `Added "${selectedImage.file_name}" to your article.`,
    })
  }

  const handleHeroImageSelection = (selectedImage: MediaItem) => {
    setHeroImageUrl(selectedImage.url)
    setHeroImageAlt(selectedImage.alt_text || selectedImage.file_name)
    setShowHeroMediaLibrary(false)
    
    toast({
      title: 'Hero Image Set',
      description: `Set "${selectedImage.file_name}" as the hero image.`,
    })
  }

  // Legacy image insertion for fallback
  const insertImage = () => insertAtCursor('![Alt text](', ')')

  const handlePreview = async () => {
    console.log('Preview button clicked!')
    try {
      // Prepare article data for preview
      const previewData = {
        title,
        author,
        content,
        summary,
        heroImageUrl,
        heroImageAlt,
        tags
      }

      console.log('Sending preview data:', previewData)

      // Send to preview API
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewData)
      })

      console.log('Preview response status:', response.status)

      if (response.ok) {
        // Get the HTML content
        const htmlContent = await response.text()
        console.log('Received HTML content, length:', htmlContent.length)
        
        // Create a blob URL instead of data URL for better compatibility
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const blobUrl = URL.createObjectURL(blob)
        
        // Open in new tab
        const newWindow = window.open(blobUrl, '_blank')
        if (!newWindow) {
          throw new Error('Popup blocked - please allow popups for this site')
        }
        
        // Clean up the blob URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl)
        }, 10000)
      } else {
        const errorText = await response.text()
        console.error('Preview API error:', errorText)
        throw new Error('Failed to generate preview')
      }
    } catch (error: any) {
      console.error('Preview error:', error)
      toast({
        title: 'Preview Error',
        description: error.message || 'Failed to generate preview. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleSave = async (saveStatus: 'draft' | 'published' | 'scheduled') => {
    try {
      setIsSaving(true)
      setError('')

      // Validation
      if (!title.trim()) {
        throw new Error('Title is required')
      }
      if (!content.trim()) {
        throw new Error('Content is required')
      }
      if (!author.trim()) {
        throw new Error('Author is required')
      }
      if (!categoryId) {
        throw new Error('Category is required')
      }
      if (!slug.trim()) {
        throw new Error('URL slug is required')
      }

      const articleData = {
        title: title.trim(),
        author: author.trim(),
        content: content.trim(),
        summary: summary.trim(),
        slug: slug.trim(),
        category_id: categoryId,
        hero_image_url: heroImageUrl.trim(),
        hero_image_alt: heroImageAlt.trim(),
        meta_description: metaDescription.trim(),
        focus_keyword: focusKeyword.trim(),
        featured_main: featuredMain,
        featured_category: featuredCategory,
        status: saveStatus,
        tags,
        subcategory: subcategory || null,
        published_at: saveStatus === 'scheduled' && scheduledDate ? 
          new Date(scheduledDate).toISOString() : 
          (saveStatus === 'published' ? new Date().toISOString() : null)
      }

      let result
      if (isEditing && articleId) {
        // Update existing article
        result = await fetch(`/api/articles/${articleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        })
      } else {
        // Create new article
        result = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(articleData)
        })
      }

      if (!result.ok) {
        const errorData = await result.json().catch(() => ({ error: 'Failed to save article' }))
        throw new Error(errorData.error || 'Failed to save article')
      }

      const savedArticle = await result.json()
      
      toast({
        title: 'Success!',
        description: `Article ${isEditing ? 'updated' : 'created'} successfully as ${saveStatus}`,
      })

      // If this was a new article, redirect to edit mode
      if (!isEditing && savedArticle.article?.id) {
        router.push(`/admin/articles/editor?id=${savedArticle.article.id}`)
      } else if (saveStatus === 'published') {
        router.push('/admin/articles')
      }
    } catch (err: any) {
      console.error('Save error:', err)
      setError(err.message || 'Failed to save article')
      toast({
        title: 'Save Error',
        description: err.message || 'Failed to save article. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditing || !articleId) return
    
    const confirmed = window.confirm('Are you sure you want to delete this article? This action cannot be undone.')
    if (!confirmed) return

    try {
      setIsDeleting(true)
      
      const result = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE'
      })

      if (!result.ok) {
        const errorData = await result.json().catch(() => ({ error: 'Failed to delete article' }))
        throw new Error(errorData.error || 'Failed to delete article')
      }

      toast({
        title: 'Article Deleted',
        description: 'The article has been successfully deleted.',
      })

      router.push('/admin/articles')
    } catch (err: any) {
      console.error('Delete error:', err)
      toast({
        title: 'Delete Error',
        description: err.message || 'Failed to delete article. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Combine selected date and time into datetime string
  const handleScheduleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: 'Error',
        description: 'Please select both date and time.',
        variant: 'destructive'
      })
      return
    }

    // Convert date and time to datetime-local format
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const datetime = `${year}-${month}-${day}T${selectedTime}`
    
    setScheduledDate(datetime)
    handleSave('scheduled')
    setShowSchedulePopup(false)
  }

  // Initialize default time - use current time + 1 hour for future dates, or 12:00 for flexibility
  const getDefaultTime = () => {
    const now = new Date()
    // For content migration flexibility, default to a neutral time (12:00)
    return '12:00'
  }

  // Initialize schedule popup with default values
  const handleScheduleClick = () => {
    if (!selectedDate) {
      // Default to today instead of tomorrow for content migration flexibility
      const today = new Date()
      setSelectedDate(today)
    }
    if (!selectedTime) {
      setSelectedTime(getDefaultTime())
    }
    setShowSchedulePopup(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">{isEditing ? 'Loading article...' : 'Loading editor...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/articles" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Article' : 'Create New Article'}
              </h1>
              {title && (
                <>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-600 truncate max-w-md">{title}</span>
                </>
              )}
            </div>
            <div className="flex space-x-3">
              {/* Save Draft - For viewers, show but disable with tooltip */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={isSaving || !hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit')}
                title={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit') ? 'Read-only access - cannot save changes' : ''}
              >
                {isSaving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save Draft
                {!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit') && (
                  <span className="ml-1 text-xs text-gray-400">(Read-only)</span>
                )}
              </Button>

              {/* Schedule - Only for users who can publish */}
              {hasPermission(currentUser, 'articles:publish') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScheduleClick}
                  disabled={isSaving}
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule
                </Button>
              )}

              {/* Preview - Always available */}
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300"
                onClick={handlePreview}
              >
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>

              {/* Publish - Only for users who can publish */}
              {hasPermission(currentUser, 'articles:publish') && (
                <Button
                  size="sm"
                  onClick={() => handleSave('published')}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-1" />
                  {isEditing && status === 'published' ? 'Update' : 'Publish'}
                </Button>
              )}

              {/* Delete - Only for users who can delete */}
              {isEditing && hasPermission(currentUser, 'articles:delete') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Read-only mode banner for viewers */}
        {!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit') && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Eye className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Read-only mode:</strong> You're viewing this article with viewer permissions. 
              You can explore the content and interface but cannot save changes or publish articles.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Article Info */}
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                {isEditing && (
                  <div className="flex items-center space-x-2">
                    <Badge variant={status === 'published' ? 'default' : 'secondary'}>
                      {status}
                    </Badge>
                    {featuredMain && <Badge variant="outline">Featured Main</Badge>}
                    {featuredCategory && <Badge variant="outline">Featured Category</Badge>}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Enter article title..."
                      className="mt-1"
                      readOnly={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author *</Label>
                    <Input
                      id="author"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Author name..."
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="article-url-slug"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={subcategory} onValueChange={setSubcategory} disabled={!categoryId || availableSubcategories.length === 0}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={
                          !categoryId ? "Select a category first..." : 
                          availableSubcategories.length === 0 ? "No subcategories available" :
                          "Select subcategory..."
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSubcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.slug}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {categoryId && availableSubcategories.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Choose from {availableSubcategories.length} subcategories for this category
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="summary">Summary *</Label>
                  <Textarea
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Brief summary of the article..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <Label htmlFor="meta-description" className="flex items-center justify-between">
                    <span>Meta Description *</span>
                    <span className={`text-xs ${metaDescription.length >= 120 && metaDescription.length <= 160 ? 'text-green-600' : 'text-red-600'}`}>
                      {metaDescription.length}/160
                    </span>
                  </Label>
                  <Textarea
                    id="meta-description"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Write a compelling description for search engines (120-160 characters)..."
                    className="mt-1"
                    rows={3}
                    maxLength={160}
                  />
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        metaDescription.length >= 120 && metaDescription.length <= 160 
                          ? 'bg-green-500' 
                          : metaDescription.length > 160 
                            ? 'bg-red-500' 
                            : 'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((metaDescription.length / 160) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Optimal length: 120-160 characters for best search engine display
                  </p>
                </div>

                {/* Focus Keyword */}
                <div>
                  <Label htmlFor="focus-keyword" className="flex items-center justify-between">
                    <span>Focus Keyword *</span>
                    {focusKeyword && content && (
                      <span className="text-xs text-blue-600">
                        Density: {((content.toLowerCase().split(focusKeyword.toLowerCase()).length - 1) / content.split(' ').length * 100).toFixed(1)}%
                      </span>
                    )}
                  </Label>
                  <Input
                    id="focus-keyword"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g., best travel credit cards"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The main keyword/phrase you want this article to rank for. Use 0.5-2% density for optimal SEO.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Content</span>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowLivePreview(!showLivePreview)}
                      className={showLivePreview ? 'bg-blue-50 border-blue-200' : ''}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {showLivePreview ? 'Hide Preview' : 'Show Live Preview'}
                    </Button>
                    <span className="text-sm text-gray-500">
                      {content.split(' ').filter(word => word.length > 0).length} words • {Math.ceil(content.split(' ').filter(word => word.length > 0).length / 200)} min read
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b">
                  <Button variant="outline" size="sm" onClick={() => insertHeader(1)} title="Heading 1">
                    <span className="text-xs font-semibold">H1</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertHeader(2)} title="Heading 2">
                    <span className="text-xs font-semibold">H2</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertHeader(3)} title="Heading 3">
                    <span className="text-xs font-semibold">H3</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertHeader(4)} title="Heading 4">
                    <span className="text-xs font-semibold">H4</span>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => insertAtCursor('\n\n', '\n\n')} title="New Paragraph">
                    <span className="text-xs font-semibold">P</span>
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={insertBold}>
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={insertItalic}>
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={insertUnderline}>
                    <Underline className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={insertList}>
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={insertOrderedList}>
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={insertQuote}>
                    <Quote className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={insertImageFromLibrary}
                    disabled={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit')}
                    title={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit') ? 'Read-only access - cannot insert images' : 'Insert image from media library'}
                  >
                    <Image className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={insertLink}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={insertHorizontalRule}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>

                <div className={`flex ${showLivePreview ? 'divide-x divide-gray-200' : ''}`}>
                  {/* Editor */}
                  <div className={showLivePreview ? 'w-1/2' : 'w-full'}>
                    <Textarea
                      id="content-textarea"
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      placeholder={hasPermission(currentUser, 'articles:create') || hasPermission(currentUser, 'articles:edit') 
                        ? "Start writing your article here... Use the toolbar above for formatting."
                        : "Article content (read-only view)"
                      }
                      className={`min-h-[500px] border-none resize-none ${showLivePreview ? 'rounded-none' : ''}`}
                      readOnly={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit')}
                    />
                  </div>
                  
                  {/* Live Preview */}
                  {showLivePreview && (
                    <div className="w-1/2 p-4 bg-gray-50 max-h-[500px] overflow-y-auto">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-xs text-gray-500 mb-3 pb-2 border-b">
                          🔄 Live Preview - Images will display here
                        </div>
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ 
                            __html: content ? renderMarkdownToHtml(content) : '<p style="color: #9ca3af; font-style: italic;">Start typing to see preview...</p>' 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Modern SEO Analysis */}
            <ModernSEOAnalyzer
              content={content}
              title={title}
              metaDescription={metaDescription}
              focusKeyword={focusKeyword}
              author={{ name: author }}
              slug={slug}
            />

            {/* Hero Image */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Featured Image</Label>
                  <Button 
                    variant="outline" 
                    className="w-full mt-1 h-10 justify-start"
                    onClick={() => {
                      setShowHeroMediaLibrary(true)
                      if (mediaItems.length === 0) {
                        loadMediaItems()
                      }
                    }}
                    disabled={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit')}
                    title={!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit') ? 'Read-only access - cannot change images' : ''}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    {heroImageUrl ? 'Change Image' : 'Choose from Media Library'}
                    {!hasPermission(currentUser, 'articles:create') && !hasPermission(currentUser, 'articles:edit') && (
                      <span className="ml-2 text-xs text-gray-400">(Read-only)</span>
                    )}
                  </Button>
                </div>
                <div>
                  <Label htmlFor="hero-image-alt">Alt Text</Label>
                  <Input
                    id="hero-image-alt"
                    value={heroImageAlt}
                    onChange={(e) => setHeroImageAlt(e.target.value)}
                    placeholder="Descriptive alt text..."
                    className="mt-1"
                  />
                </div>
                {heroImageUrl && (
                  <div>
                    <img
                      src={heroImageUrl}
                      alt={heroImageAlt || 'Hero image preview'}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <div className="text-xs text-gray-500 mt-1 truncate">
                      {heroImageUrl}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publishing Options */}
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured-main">Featured (Main Page)</Label>
                  <Switch
                    id="featured-main"
                    checked={featuredMain}
                    onCheckedChange={setFeaturedMain}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured-category">Featured (Category)</Label>
                  <Switch
                    id="featured-category"
                    checked={featuredCategory}
                    onCheckedChange={setFeaturedCategory}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tags.join(', ')}
                    onChange={(e) => handleTagsChange(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Enhanced Schedule Dialog */}
        <SimpleModal 
          isOpen={showSchedulePopup} 
          onClose={() => setShowSchedulePopup(false)}
          title="Schedule Publication"
        >
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Choose when this article should be published. You can select any date and time, including past dates for content migration.
            </p>

            <div className="space-y-6 py-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Publication Date</Label>
                <div className="border rounded-md p-3 bg-gray-50">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="time-input" className="text-sm font-medium">
                  Publication Time
                </Label>
                <div className="relative">
                  <Input
                    id="time-input"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="text-lg font-mono"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Preview */}
              {selectedDate && selectedTime && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800">
                    <strong>Publication date & time:</strong>
                    <div className="text-blue-900 font-medium mt-1">
                      {selectedDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })} at {selectedTime}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowSchedulePopup(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleScheduleConfirm}
                disabled={!selectedDate || !selectedTime || isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                                 {isSaving ? (
                   <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Saving...
                   </>
                 ) : (
                   <>
                     <Calendar className="w-4 h-4 mr-2" />
                     Set Publication Date
                   </>
                 )}
              </Button>
            </div>
          </div>
        </SimpleModal>

        {/* Media Library Dialog for In-Text Images */}
        <SimpleModal 
          isOpen={showMediaLibrary} 
          onClose={() => setShowMediaLibrary(false)}
          title="Select Image for Article"
        >
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Choose an image to insert into your article content
            </p>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search images by name, alt text, or caption..."
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={loadMediaItems} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>

              <ScrollArea className="h-96">
                {isLoadingMedia ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading media...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mediaItems
                      .filter(item =>
                        item.file_name.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
                        item.alt_text.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
                        item.caption.toLowerCase().includes(mediaSearchQuery.toLowerCase())
                      )
                      .map((image) => (
                        <div
                          key={image.id}
                          className="border rounded-lg p-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                          onClick={() => handleImageSelection(image)}
                        >
                          <img
                            src={image.url}
                            alt={image.alt_text || image.file_name}
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="mt-2">
                            <p className="text-xs font-medium truncate">
                              {image.file_name}
                            </p>
                            {image.alt_text && (
                              <p className="text-xs text-gray-500 truncate">
                                Alt: {image.alt_text}
                              </p>
                            )}
                            {image.caption && (
                              <p className="text-xs text-gray-500 truncate">
                                Caption: {image.caption}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {!isLoadingMedia && mediaItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Image className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No images found</p>
                    <p className="text-xs text-gray-400">Upload images in the Media Library first</p>
                  </div>
                )}
              </ScrollArea>
            </div>
        </SimpleModal>

        {/* Media Library Dialog for Hero Image */}
        <SimpleModal 
          isOpen={showHeroMediaLibrary} 
          onClose={() => setShowHeroMediaLibrary(false)}
          title="Select Hero Image"
        >
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Choose an image to use as the featured hero image for this article
            </p>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search images by name, alt text, or caption..."
                  value={mediaSearchQuery}
                  onChange={(e) => setMediaSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={loadMediaItems} variant="outline" size="sm">
                  Refresh
                </Button>
              </div>

              <ScrollArea className="h-96">
                {isLoadingMedia ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Loading media...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {mediaItems
                      .filter(item =>
                        item.file_name.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
                        item.alt_text.toLowerCase().includes(mediaSearchQuery.toLowerCase()) ||
                        item.caption.toLowerCase().includes(mediaSearchQuery.toLowerCase())
                      )
                      .map((image) => (
                        <div
                          key={image.id}
                          className={`relative border rounded-lg p-2 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                            heroImageUrl === image.url ? 'border-blue-500 bg-blue-50' : ''
                          }`}
                          onClick={() => handleHeroImageSelection(image)}
                        >
                          <img
                            src={image.url}
                            alt={image.alt_text || image.file_name}
                            className="w-full h-24 object-cover rounded"
                          />
                          <div className="mt-2">
                            <p className="text-xs font-medium truncate">
                              {image.file_name}
                            </p>
                            {image.alt_text && (
                              <p className="text-xs text-gray-500 truncate">
                                Alt: {image.alt_text}
                              </p>
                            )}
                            {image.caption && (
                              <p className="text-xs text-gray-500 truncate">
                                Caption: {image.caption}
                              </p>
                            )}
                          </div>
                          {heroImageUrl === image.url && (
                            <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-1">
                              <CheckCircle className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

                {!isLoadingMedia && mediaItems.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Image className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500">No images found</p>
                    <p className="text-xs text-gray-400">Upload images in the Media Library first</p>
                  </div>
                )}
              </ScrollArea>
            </div>
        </SimpleModal>


      </div>
    </div>
  )
} 