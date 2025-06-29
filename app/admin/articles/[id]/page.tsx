'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, Loader2, AlertCircle, X, Upload, Calendar, Star, Trash2 } from 'lucide-react'
import Link from 'next/link'
import AdvancedSEOCalculator from '../../components/AdvancedSEOCalculator'
import ImageUpload from '../../components/ImageUpload'
import { useToast } from '@/components/ui/toast-provider'

interface Category {
  id: string
  name: string
  description?: string
  slug: string
}

interface Subcategory {
  id: string
  name: string
  description?: string
  category_id: string
  slug: string
}

interface Article {
  id: string
  title: string
  slug: string
}

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const [id, setId] = useState<string | null>(null)
  
  // Content Tab State
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('')
  const [content, setContent] = useState('')

  // SEO Tab State
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [seoScore, setSeoScore] = useState(0)

  // Tags Tab State
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [relatedArticles, setRelatedArticles] = useState<string[]>([])

  // Settings Tab State
  const [slug, setSlug] = useState('')
  const [publishedAt, setPublishedAt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft')
  const [featuredMain, setFeaturedMain] = useState(false)
  const [featuredCategory, setFeaturedCategory] = useState(false)
  
  // Author State
  const [authorName, setAuthorName] = useState('Isak Parild')
  const [authorBio, setAuthorBio] = useState('')
  const [authorAvatar, setAuthorAvatar] = useState('')
  
  // Auto-calculated fields
  const [readingTime, setReadingTime] = useState(0)

  // UI State
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('content')
  const [articleNotFound, setArticleNotFound] = useState(false)

  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [availableArticles, setAvailableArticles] = useState<Article[]>([])
  const [originalSlug, setOriginalSlug] = useState('') // Track original slug for validation
  
  const router = useRouter()
  const supabase = createClient()
  const { showToast } = useToast()

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  // Load article data and related data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Load article data first - start with basic query
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*')
          .eq('id', id)
          .single()

        console.log('Article query result:', { articleData, articleError })

        if (articleError) {
          console.error('Article error details:', articleError)
          if (articleError.code === 'PGRST116') {
            setArticleNotFound(true)
            return
          }
          throw articleError
        }

        if (!articleData) {
          setArticleNotFound(true)
          return
        }

        // Load related data separately (temporarily disabled - tables don't exist yet)
        // const [subcategoriesResult, relationsResult] = await Promise.all([
        //   supabase
        //     .from('article_subcategories') 
        //     .select('subcategory_id')
        //     .eq('article_id', id),
        //   supabase
        //     .from('article_relations')
        //     .select('related_article_id')
        //     .eq('article_id', id)
        // ])
        
        const subcategoriesResult = { data: [] }
        const relationsResult = { data: [] }

        console.log('Related data:', { subcategoriesResult, relationsResult })

        // Populate form with article data
        setTitle(articleData.title || '')
        setSummary(articleData.summary || '')
        setCategoryId(articleData.category_id || '')
        setHeroImageUrl(articleData.hero_image_url || '')
        setHeroImageAlt(articleData.hero_image_alt || '')
        
        // Handle content field - might be JSONB or string
        let contentValue = ''
        if (typeof articleData.content === 'string') {
          contentValue = articleData.content
        } else if (typeof articleData.content === 'object' && articleData.content !== null) {
          // If it's stored as JSONB, convert back to string
          contentValue = articleData.content.html || articleData.content.content || JSON.stringify(articleData.content)
        }
        setContent(contentValue)
        
        setMetaDescription(articleData.meta_description || '')
        setFocusKeyword(articleData.focus_keyword || '')
        setSeoScore(articleData.seo_score || 0)
        setTags(articleData.tags || [])
        setSlug(articleData.slug || '')
        setOriginalSlug(articleData.slug || '')
        setStatus(articleData.status || 'draft')
        setFeaturedMain(articleData.featured_main || false)
        setFeaturedCategory(articleData.featured_category || false)
        
        // Handle author fields
        setAuthorName(articleData.author_name || 'Isak Parild')
        setAuthorBio(articleData.author_bio || '')
        setAuthorAvatar(articleData.author_avatar || '')
        setReadingTime(articleData.reading_time || 0)
        
        // Handle published_at date formatting
        if (articleData.published_at) {
          const date = new Date(articleData.published_at)
          const localDatetime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16)
          setPublishedAt(localDatetime)
        }

        // Set subcategories
        const subcategoryIds = subcategoriesResult.data?.map((as: any) => as.subcategory_id) || []
        setSelectedSubcategories(subcategoryIds)

        // Set related articles
        const relatedIds = relationsResult.data?.map((ar: any) => ar.related_article_id) || []
        setRelatedArticles(relatedIds)

        // Load other data in parallel
        const [categoriesRes, subcategoriesRes, articlesRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          // supabase.from('subcategories').select('*').order('name'), // Table doesn't exist yet
          Promise.resolve({ data: [] }), // Mock empty subcategories for now
          supabase.from('articles').select('id, title, slug').eq('status', 'published').neq('id', id).order('title')
        ])

        if (categoriesRes.data) setCategories(categoriesRes.data)
        if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data)
        if (articlesRes.data) setAvailableArticles(articlesRes.data)

      } catch (err: any) {
        console.error('Error loading article:', err)
        setError('Failed to load article. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id, supabase])

  // Filter subcategories based on selected category
  useEffect(() => {
    if (categoryId) {
      const filtered = subcategories.filter(sub => sub.category_id === categoryId)
      setFilteredSubcategories(filtered)
      // Reset subcategories if they don't belong to the new category
      setSelectedSubcategories(prev => 
        prev.filter(subId => filtered.find(sub => sub.id === subId))
      )
    } else {
      setFilteredSubcategories([])
      setSelectedSubcategories([])
    }
  }, [categoryId, subcategories])

  // Calculate SEO score
  useEffect(() => {
    const calculateSEOScore = () => {
      let score = 0
      
      // Title optimization (25 points)
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15
      if (title.length >= 30 && title.length <= 60) score += 10
      
      // Meta description optimization (25 points)
      if (metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) score += 15
      if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 10
      
      // Content optimization (30 points)
      const contentWords = content.split(/\s+/).length
      if (contentWords >= 300) score += 15
      
      const keywordDensity = (content.toLowerCase().split(focusKeyword.toLowerCase()).length - 1) / contentWords * 100
      if (keywordDensity >= 0.5 && keywordDensity <= 2.5) score += 15
      
      // URL optimization (10 points)
      if (slug.toLowerCase().includes(focusKeyword.toLowerCase())) score += 10
      
      // Image optimization (10 points)
      if (heroImageAlt.toLowerCase().includes(focusKeyword.toLowerCase())) score += 10
      
      return Math.min(score, 100)
    }

    if (focusKeyword) {
      setSeoScore(calculateSEOScore())
    }
  }, [title, metaDescription, content, focusKeyword, slug, heroImageAlt])

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tag = tagInput.trim()
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag])
        setTagInput('')
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Handle subcategory selection
  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      if (prev.includes(subcategoryId)) {
        return prev.filter(id => id !== subcategoryId)
      } else if (prev.length < 4) { // Max 4 subcategories
        return [...prev, subcategoryId]
      }
      return prev
    })
  }

  // Handle related articles
  const toggleRelatedArticle = (articleId: string) => {
    setRelatedArticles(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId)
      } else if (prev.length < 5) { // Max 5 related articles
        return [...prev, articleId]
      }
      return prev
    })
  }

  // Save as draft
  const handleSaveDraft = async () => {
    await handleSave('draft')
  }

  // Publish immediately
  const handlePublish = async () => {
    await handleSave('published')
  }

  // Schedule publication
  const handleSchedule = async () => {
    if (!publishedAt) {
      setError('Please select a publication date and time')
      return
    }
    await handleSave('scheduled')
  }

  // Preview functionality
  const handlePreview = () => {
    // Create a preview object with current form data
    const previewData = {
      title: title || 'Untitled Article',
      summary: summary || 'No summary provided',
      content: content || '<p>No content yet</p>',
      hero_image_url: heroImageUrl || null,
      hero_image_alt: heroImageAlt || null,
      category: categories.find(c => c.id === categoryId)?.name || 'Uncategorized',
      tags: tags,
      author: 'Preview Author',
      date: new Date().toLocaleDateString(),
      readTime: '5 min read'
    }
    
    // Store preview data in sessionStorage
    sessionStorage.setItem('articlePreview', JSON.stringify(previewData))
    
    // Open preview in new tab
    window.open('/admin/articles/preview', '_blank')
  }

  // Delete article
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      setIsLoading(true)
      
      // Delete related data first
      await Promise.all([
        supabase.from('article_subcategories').delete().eq('article_id', id),
        supabase.from('article_relations').delete().eq('article_id', id)
      ])

      // Delete the article
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error

      showToast({
        title: 'Success!',
        description: 'Article deleted successfully.',
        variant: 'success'
      })

      router.push('/admin/articles')
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(`Failed to delete article: ${err.message}`)
      showToast({
        title: 'Error',
        description: `Failed to delete article: ${err.message}`,
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Main save function for updates
  const handleSave = async (saveStatus: 'draft' | 'published' | 'scheduled') => {
    if (saveStatus === 'draft') {
      setIsSaving(true)
    } else {
      setIsLoading(true)
    }
    setError('')

    try {
      // Validation with detailed feedback
      const errors: string[] = []
      
      // Basic validation (always required)
      if (!title.trim()) errors.push('Title')
      if (!summary.trim()) errors.push('Summary')
      if (!content.trim()) errors.push('Content')
      if (!categoryId) errors.push('Category')
      
      // Publication validation (required for publish/schedule)
      if (saveStatus !== 'draft') {
        if (!metaDescription.trim()) errors.push('Meta Description (SEO tab)')
        if (!focusKeyword.trim()) errors.push('Focus Keyword (SEO tab)')
        if (!heroImageUrl.trim()) errors.push('Hero Image')
        if (!heroImageAlt.trim()) errors.push('Hero Image Alt Text')
      }
      
      if (errors.length > 0) {
        const errorMessage = `The following fields are required: ${errors.join(', ')}`
        showToast({
          title: 'Validation Error',
          description: errorMessage,
          variant: 'error'
        })
        throw new Error(errorMessage)
      }

      // Check for slug uniqueness (if changed)
      if (slug !== originalSlug) {
        const { data: existingArticle } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
          .single()

        if (existingArticle) {
          throw new Error('This URL slug is already in use. Please choose a different one.')
        }
      }

      // Prepare article data
      const articleData = {
        title: title.trim(),
        slug: slug.trim(),
        summary: summary.trim(),
        content: content.trim(),
        hero_image_url: heroImageUrl.trim() || null,
        hero_image_alt: heroImageAlt.trim() || null,
        category_id: categoryId,
        meta_description: metaDescription.trim(),
        focus_keyword: focusKeyword.trim(),
        seo_score: seoScore,
        tags: tags,
        status: saveStatus,
        published_at: saveStatus === 'scheduled' ? publishedAt : (saveStatus === 'published' ? new Date().toISOString() : null),
        featured_main: featuredMain,
        featured_category: featuredCategory,
        featured: featuredMain || featuredCategory, // Backward compatibility
        author_name: authorName.trim(),
        author_bio: authorBio.trim() || null,
        author_avatar: authorAvatar.trim() || null,
        reading_time: readingTime,
        updated_at: new Date().toISOString()
      }

      // Update article
      const { error: articleError } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', id)

      if (articleError) throw articleError

      // Update subcategories
      // First delete existing ones
      await supabase
        .from('article_subcategories')
        .delete()
        .eq('article_id', id)

      // Insert new ones
      if (selectedSubcategories.length > 0) {
        const subcategoryData = selectedSubcategories.map(subId => ({
          article_id: id,
          subcategory_id: subId
        }))

        const { error: subError } = await supabase
          .from('article_subcategories')
          .insert(subcategoryData)

        if (subError) throw subError
      }

      // Update related articles
      // First delete existing ones
      await supabase
        .from('article_relations')
        .delete()
        .eq('article_id', id)

      // Insert new ones
      if (relatedArticles.length > 0) {
        const relatedData = relatedArticles.map(relatedId => ({
          article_id: id,
          related_article_id: relatedId
        }))

        const { error: relatedError } = await supabase
          .from('article_relations')
          .insert(relatedData)

        if (relatedError) throw relatedError
      }

      // Update original slug for future validation
      setOriginalSlug(slug)

      // Success - show success message
      const statusText = saveStatus === 'published' ? 'published' : saveStatus === 'scheduled' ? 'scheduled' : 'saved as draft'
      
      showToast({
        title: 'Success!',
        description: `Article "${title}" has been ${statusText} successfully.`,
        variant: 'success'
      })
      
    } catch (err: any) {
      console.error('Article update error:', err)
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      
      showToast({
        title: 'Error',
        description: `Failed to update article: ${errorMessage}`,
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
  }

  // Loading state
  if (isLoading && !isSaving) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading article...</p>
        </div>
      </div>
    )
  }

  // Article not found
  if (articleNotFound) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h1>
            <p className="text-gray-600 mb-6">
              The article you're looking for doesn't exist or may have been deleted.
            </p>
            <Button asChild>
              <Link href="/admin/articles">
                Return to Articles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/articles">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-gray-600 mt-2">
              Update your blog post content and settings
            </p>
          </div>
        </div>
        
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading || isSaving}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Article
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content with Tabs - Same as New Article Page */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="relative">
            Content
            {(!title.trim() || !summary.trim() || !content.trim() || !categoryId || !heroImageUrl.trim() || !heroImageAlt.trim()) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="seo" className="relative">
            SEO & Metadata
            {(!metaDescription.trim() || !focusKeyword.trim()) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tags">Tags & Links</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Content</CardTitle>
                  <CardDescription>
                    Main content and categorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="The main title of your article"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="summary">Summary *</Label>
                    <Textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Brief summary of the article (max 200 characters)"
                      className="mt-1"
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {summary.length}/200 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your article content in Markdown format..."
                      className="mt-1 min-h-[500px] font-mono"
                      rows={20}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You can use Markdown formatting (e.g., **bold**, *italic*, # headers, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Category & Classification</CardTitle>
                  <CardDescription>
                    Organize your content for better discoverability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
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

                  {filteredSubcategories.length > 0 && (
                    <div>
                      <Label>Subcategories (Optional)</Label>
                      <p className="text-sm text-gray-500 mb-3">
                        Select up to 4 subcategories that best describe your article
                      </p>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {filteredSubcategories.map((subcategory) => (
                          <div key={subcategory.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`sub-${subcategory.id}`}
                              checked={selectedSubcategories.includes(subcategory.id)}
                              onChange={() => toggleSubcategory(subcategory.id)}
                              disabled={!selectedSubcategories.includes(subcategory.id) && selectedSubcategories.length >= 4}
                              className="rounded"
                            />
                            <Label 
                              htmlFor={`sub-${subcategory.id}`}
                              className="text-sm flex-1"
                            >
                              {subcategory.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedSubcategories.length}/4 selected
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="xl:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Image</CardTitle>
                  <CardDescription>
                    Main image for the article - upload directly to storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={heroImageUrl}
                    onChange={setHeroImageUrl}
                    onAltChange={setHeroImageAlt}
                    altValue={heroImageAlt}
                    label="Upload Image *"
                  />
                </CardContent>
              </Card>

              <AdvancedSEOCalculator
                content={content}
                metadata={{
                  title,
                  metaDescription,
                  slug,
                  focusKeyword,
                  heroImageUrl,
                  heroImageAlt
                }}
                articleId={id || undefined}
                onScoreChange={setSeoScore}
              />
            </div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Optimization</CardTitle>
                <CardDescription>
                  Optimize your article for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="focusKeyword">Focus Keyword *</Label>
                  <Input
                    id="focusKeyword"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Main keyword to optimize for"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Choose a primary keyword this article should rank for
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description *</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Description that appears in search results"
                    className="mt-1"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {metaDescription.length}/160 characters. This appears in search results.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Score</CardTitle>
                <CardDescription>
                  Real-time analysis of your SEO optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${
                    seoScore >= 80 ? 'text-green-600' : 
                    seoScore >= 60 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>
                    {seoScore}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {seoScore >= 80 ? 'Excellent' : 
                     seoScore >= 60 ? 'Good' : 
                     seoScore >= 40 ? 'Needs Improvement' : 
                     'Poor'} SEO Score
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add relevant tags to improve content discovery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tagInput">Add Tags</Label>
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInput}
                    placeholder="Type a tag and press Enter"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Press Enter or comma to add tags
                  </p>
                </div>

                {tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Current Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                          >
                            <X size={12} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related Articles</CardTitle>
                <CardDescription>
                  Up to 5 related articles (excludes current article)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {availableArticles.map((article) => (
                    <div key={article.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`article-${article.id}`}
                        checked={relatedArticles.includes(article.id)}
                        onChange={() => toggleRelatedArticle(article.id)}
                        disabled={!relatedArticles.includes(article.id) && relatedArticles.length >= 5}
                        className="rounded"
                      />
                      <Label 
                        htmlFor={`article-${article.id}`}
                        className="text-sm flex-1"
                      >
                        {article.title}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {relatedArticles.length}/5 selected
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication Settings</CardTitle>
                <CardDescription>
                  Configure slug, publication date, and featured status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-title"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Must be unique. Current URL: /blog/{slug}
                  </p>
                </div>

                <div>
                  <Label htmlFor="publishedAt">Publication Date & Time</Label>
                  <Input
                    id="publishedAt"
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Required for scheduling. Defaults to now when publishing.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Options</CardTitle>
                <CardDescription>
                  Control where this article is featured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featuredMain" className="flex flex-col space-y-1">
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Featured on Main Page
                    </span>
                    <span className="text-sm text-gray-500">
                      Show prominently on homepage
                    </span>
                  </Label>
                  <Switch
                    id="featuredMain"
                    checked={featuredMain}
                    onCheckedChange={setFeaturedMain}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="featuredCategory" className="flex flex-col space-y-1">
                    <span className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Featured on Category Page
                    </span>
                    <span className="text-sm text-gray-500">
                      Highlight on category listing
                    </span>
                  </Label>
                  <Switch
                    id="featuredCategory"
                    checked={featuredCategory}
                    onCheckedChange={setFeaturedCategory}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={isSaving || isLoading}
              className="flex-1"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving Draft...' : 'Update Draft'}
            </Button>
            
            <Button
              onClick={handlePreview}
              variant="outline"
              disabled={isLoading || isSaving}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button
              onClick={handleSchedule}
              variant="outline"
              disabled={isLoading || isSaving}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Publication
            </Button>
            
            <Button
              onClick={handlePublish}
              disabled={isLoading || isSaving}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Publishing...' : 'Update & Publish'}
            </Button>
          </div>
          
          <div className="mt-3">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/admin/articles">
                Cancel
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 