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
import { ArrowLeft, Save, Eye, Loader2, AlertCircle, X, Upload, Calendar, Star } from 'lucide-react'
import Link from 'next/link'
import AdvancedSEOCalculator from '../../components/AdvancedSEOCalculator'
import ImageUpload from '../../components/ImageUpload'
import SemanticAnalyzer from '../../components/SemanticAnalyzer'
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

export default function NewArticlePage() {
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
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('content')

  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([])
  const [availableArticles, setAvailableArticles] = useState<Article[]>([])
  
  const router = useRouter()
  const supabase = createClient()
  const { showToast } = useToast()

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, subcategoriesRes, articlesRes] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          // supabase.from('subcategories').select('*').order('name'), // Table doesn't exist yet
          Promise.resolve({ data: [] }), // Mock empty subcategories for now
          supabase.from('articles').select('id, title, slug').eq('status', 'published').order('title')
        ])

        if (categoriesRes.data) setCategories(categoriesRes.data)
        if (subcategoriesRes.data) setSubcategories(subcategoriesRes.data)
        if (articlesRes.data) setAvailableArticles(articlesRes.data)
      } catch (err) {
        console.error('Error loading data:', err)
      }
    }

    loadData()
  }, [supabase])

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

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
      setSlug(generatedSlug)
    }
  }, [title, slug])

  // Calculate reading time automatically
  useEffect(() => {
    const calculateReadingTime = () => {
      // Remove HTML tags and count words
      const textContent = content.replace(/<[^>]*>/g, '').trim()
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length
      
      // Average reading speed is 225 words per minute
      const readingTimeMinutes = Math.ceil(wordCount / 225)
      return Math.max(1, readingTimeMinutes) // Minimum 1 minute
    }

    if (content.trim()) {
      setReadingTime(calculateReadingTime())
    } else {
      setReadingTime(1)
    }
  }, [content])

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
      author: authorName || 'Isak Parild',
      author_bio: authorBio,
      author_avatar: authorAvatar,
      date: new Date().toLocaleDateString(),
      readTime: `${readingTime} min read`
    }
    
    // Store preview data in sessionStorage
    sessionStorage.setItem('articlePreview', JSON.stringify(previewData))
    
    // Open preview in new tab
    window.open('/admin/articles/preview', '_blank')
  }

  // Main save function
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

      // Prepare article data
      const articleData = {
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
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
        author_name: authorName.trim() || 'Isak Parild',
        author_bio: authorBio.trim() || null,
        author_avatar: authorAvatar.trim() || null,
        reading_time: readingTime
      }

      // Insert article
      const { data: articleResult, error: articleError } = await supabase
        .from('articles')
        .insert(articleData)
        .select()
        .single()

      if (articleError) throw articleError

      // Insert subcategories (temporarily disabled - table doesn't exist yet)
      // if (selectedSubcategories.length > 0) {
      //   const subcategoryData = selectedSubcategories.map(subId => ({
      //     article_id: articleResult.id,
      //     subcategory_id: subId
      //   }))

      //   const { error: subError } = await supabase
      //     .from('article_subcategories')
      //     .insert(subcategoryData)

      //   if (subError) throw subError
      // }

      // Insert related articles (temporarily disabled - table doesn't exist yet)
      // if (relatedArticles.length > 0) {
      //   const relatedData = relatedArticles.map(relatedId => ({
      //     article_id: articleResult.id,
      //     related_article_id: relatedId
      //   }))

      //   const { error: relatedError } = await supabase
      //     .from('article_relations')
      //     .insert(relatedData)

      //   if (relatedError) throw relatedError
      // }

      // Success - show success message and redirect
      const statusText = saveStatus === 'published' ? 'published' : saveStatus === 'scheduled' ? 'scheduled' : 'saved as draft'
      
      showToast({
        title: 'Success!',
        description: `Article "${title}" has been ${statusText} successfully.`,
        variant: 'success'
      })
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push('/admin/articles')
      }, 1500)
      
    } catch (err: any) {
      console.error('Article save error:', err)
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      
      showToast({
        title: 'Error',
        description: `Failed to save article: ${errorMessage}`,
        variant: 'error'
      })
    } finally {
      setIsLoading(false)
      setIsSaving(false)
    }
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
            <h1 className="text-3xl font-bold text-gray-900">New Article</h1>
            <p className="text-gray-600 mt-2">
              Create a new blog post following the CMS structure
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="content" className="relative">
            Content
            {(!title.trim() || !summary.trim() || !content.trim() || !categoryId || !heroImageUrl.trim() || !heroImageAlt.trim()) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="semantic">Semantic</TabsTrigger>
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
                      placeholder="Start writing your article content in Markdown format..."
                      className="mt-1 min-h-[500px] font-mono"
                      rows={20}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You can use Markdown formatting (e.g., **bold**, *italic*, # headers, etc.)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category & Subcategories</CardTitle>
                  <CardDescription>
                    Primary category and up to 4 subcategories
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select primary category" />
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
                      <Label>Subcategories (max 4)</Label>
                      <div className="mt-2 space-y-2">
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
                              className="text-sm"
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

              <Card>
                <CardHeader>
                  <CardTitle>Author Information</CardTitle>
                  <CardDescription>
                    Author details and reading time ({readingTime} min read)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="authorName">Author Name</Label>
                    <Input
                      id="authorName"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Article author name"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="authorBio">Author Bio (optional)</Label>
                    <Textarea
                      id="authorBio"
                      value={authorBio}
                      onChange={(e) => setAuthorBio(e.target.value)}
                      placeholder="Short bio about the author"
                      className="mt-1"
                      rows={2}
                      maxLength={150}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {authorBio.length}/150 characters
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="authorAvatar">Author Avatar URL (optional)</Label>
                    <Input
                      id="authorAvatar"
                      value={authorAvatar}
                      onChange={(e) => setAuthorAvatar(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="mt-1"
                    />
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <strong>Reading Time:</strong> {readingTime} minute{readingTime !== 1 ? 's' : ''} 
                    <br />
                    <span className="text-xs">
                      (Automatically calculated from content)
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                onScoreChange={setSeoScore}
              />
            </div>
          </div>
        </TabsContent>

        {/* Semantic Analysis Tab */}
        <TabsContent value="semantic" className="space-y-6">
          <SemanticAnalyzer 
            content={content}
            onContentChange={setContent}
          />
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Optimization</CardTitle>
                  <CardDescription>
                    Search engine optimization and metadata
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="focusKeyword">Focus Keyword *</Label>
                    <Input
                      id="focusKeyword"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="Primary keyword for SEO optimization"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="metaDescription">Meta Description *</Label>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="SEO meta description (50-160 characters)"
                      className="mt-1"
                      rows={3}
                      minLength={50}
                      maxLength={160}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {metaDescription.length}/160 characters
                      {metaDescription.length < 50 && metaDescription.length > 0 && (
                        <span className="text-orange-600 ml-2">Too short (min 50)</span>
                      )}
                      {metaDescription.length >= 50 && metaDescription.length <= 160 && metaDescription.length > 0 && (
                        <span className="text-green-600 ml-2">Good length</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
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
                onScoreChange={setSeoScore}
              />
            </div>
          </div>
        </TabsContent>

        {/* Tags & Links Tab */}
        <TabsContent value="tags" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Tags for categorizing and finding articles
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
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
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
                    Auto-generated from title. Must be unique.
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

      {/* Pre-publish Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Publication Checklist
          </CardTitle>
          <CardDescription>
            Complete these items before publishing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Content Requirements</h4>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${title.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {title.trim() ? '✅' : '❌'} Title
                </div>
                <div className={`flex items-center gap-2 ${summary.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.trim() ? '✅' : '❌'} Summary
                </div>
                <div className={`flex items-center gap-2 ${content.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {content.trim() ? '✅' : '❌'} Content
                </div>
                <div className={`flex items-center gap-2 ${categoryId ? 'text-green-600' : 'text-red-600'}`}>
                  {categoryId ? '✅' : '❌'} Category
                </div>
                <div className={`flex items-center gap-2 ${heroImageUrl.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {heroImageUrl.trim() ? '✅' : '❌'} Hero Image
                </div>
                <div className={`flex items-center gap-2 ${heroImageAlt.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {heroImageAlt.trim() ? '✅' : '❌'} Hero Image Alt Text
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">SEO Requirements</h4>
              <div className="space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${metaDescription.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {metaDescription.trim() ? '✅' : '❌'} Meta Description
                </div>
                <div className={`flex items-center gap-2 ${focusKeyword.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {focusKeyword.trim() ? '✅' : '❌'} Focus Keyword
                </div>
                <div className={`flex items-center gap-2 ${slug.trim() ? 'text-green-600' : 'text-red-600'}`}>
                  {slug.trim() ? '✅' : '❌'} URL Slug
                </div>
                <div className={`flex items-center gap-2 ${seoScore >= 60 ? 'text-green-600' : seoScore >= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {seoScore >= 60 ? '✅' : seoScore >= 30 ? '⚠️' : '❌'} SEO Score ({seoScore}/100)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              {isSaving ? 'Saving Draft...' : 'Save as Draft'}
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
              {isLoading ? 'Publishing...' : 'Publish Now'}
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