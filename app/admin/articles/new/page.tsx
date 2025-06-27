'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// Removed Supabase - using backend API
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, Upload, Calendar, Star, Settings, Tag, AlertCircle, Clock, Image as ImageIcon, Globe, Search } from 'lucide-react'
import Link from 'next/link'
import SimpleDynamicEditor from '@/components/ui/simple-dynamic-editor'
import ImageUpload from '../../components/ImageUpload'
import { useToast } from '@/components/ui/use-toast'
import { api } from '@/lib/api'

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

export default function NewArticlePageWordPressStyle() {
  const router = useRouter()
  const { toast } = useToast()
  // Using backend API instead of Supabase

  // Content state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  
  // Categorization
  const [categoryId, setCategoryId] = useState('')
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  // Media
  const [heroImageUrl, setHeroImageUrl] = useState('')
  const [heroImageAlt, setHeroImageAlt] = useState('')
  
  // Author & metadata
  const [authorName, setAuthorName] = useState('Max Your Points Team')
  const [readingTime, setReadingTime] = useState(1)
  
  // SEO
  const [metaDescription, setMetaDescription] = useState('')
  const [focusKeyword, setFocusKeyword] = useState('')
  const [slug, setSlug] = useState('')
  
  // Features
  const [featuredMain, setFeaturedMain] = useState(false)
  const [featuredCategory, setFeaturedCategory] = useState(false)
  const [trendingScore, setTrendingScore] = useState(0)
  
  // Related articles
  const [selectedRelatedArticles, setSelectedRelatedArticles] = useState<string[]>([])
  
  // Data
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  
  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  // Media library state
  const [mediaImages, setMediaImages] = useState<any[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Editor image insertion function
  const [editorInsertImageFn, setEditorInsertImageFn] = useState<((imageUrl: string, altText: string) => void) | null>(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data from backend API...')
        
        // Load categories using API client
        const categoriesData = await api.getCategories()
        setCategories(categoriesData.categories || [])

        // Load subcategories using direct fetch (as api client doesn't have this method yet)
        const subcategoriesResponse = await fetch('/api/admin/subcategories')
        if (subcategoriesResponse.ok) {
          const subcategoriesData = await subcategoriesResponse.json()
          setSubcategories(subcategoriesData.subcategories || [])
        }

        // Load articles for related articles selection using API client
        const articlesData = await api.getArticles({ limit: 50 })
        setArticles(articlesData.articles || [])

      } catch (err) {
        console.error('Error loading data:', err)
        toast({
          title: 'Loading Error',
          description: 'Failed to load categories and data. Please refresh the page.',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()
      setSlug(autoSlug)
    }
  }, [title, slug])

  // Calculate reading time
  useEffect(() => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const time = Math.max(1, Math.ceil(wordCount / 200))
    setReadingTime(time)
  }, [content])

  // Auto-generate meta description from summary
  useEffect(() => {
    if (summary && !metaDescription) {
      setMetaDescription(summary.slice(0, 160))
    }
  }, [summary, metaDescription])

  const filteredSubcategories = subcategories.filter(sub => sub.category_id === categoryId)
  
  // Debug logging
  console.log('🔍 Debug subcategories:', {
    categoryId,
    subcategories: subcategories.length,
    filteredSubcategories: filteredSubcategories.length,
    filtered: filteredSubcategories
  })

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Load media images
  const loadMediaImages = async () => {
    setMediaLoading(true)
    try {
      const response = await fetch('/api/admin/images')
      if (response.ok) {
        const data = await response.json()
        setMediaImages(data.images || [])
      } else {
        console.error('Failed to load media images')
        setMediaImages([])
      }
    } catch (err) {
      console.error('Failed to load media:', err)
      setMediaImages([])
    } finally {
      setMediaLoading(false)
    }
  }

  // Filter images based on search term
  const filteredImages = mediaImages.filter(image => 
    image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const selectHeroImage = (imageUrl: string, imageAlt: string) => {
    setHeroImageUrl(imageUrl)
    setHeroImageAlt(imageAlt)
    setShowMediaLibrary(false)
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
      author: authorName || 'Max Your Points Team',
      date: new Date().toLocaleDateString(),
      readTime: readingTime + ' min read'
    }
    
    console.log('🔍 Preview data:', previewData)
    
    // Store preview data in sessionStorage
    sessionStorage.setItem('articlePreview', JSON.stringify(previewData))
    
    // Open preview in new tab
    window.open('/admin/articles/preview', '_blank')
  }

  const handleSave = async (saveStatus: 'draft' | 'published' | 'scheduled') => {
    setIsSaving(true)
    setError('')

    try {
      // Validation
      const errors: string[] = []
      if (!title.trim()) errors.push('Title')
      if (!summary.trim()) errors.push('Summary')
      if (!content.trim()) errors.push('Content')
      if (!categoryId) errors.push('Category')
      if (!heroImageUrl.trim()) errors.push('Hero Image')
      if (!heroImageAlt.trim()) errors.push('Hero Image Alt Text')

      if (saveStatus === 'published') {
        if (!metaDescription.trim()) errors.push('Meta Description')
        if (!focusKeyword.trim()) errors.push('Focus Keyword')
      }

      if (errors.length > 0) {
        const errorMessage = `The following fields are required: ${errors.join(', ')}`
        toast({
          title: 'Validation Error',
          description: errorMessage,
          variant: 'destructive'
        })
        throw new Error(errorMessage)
      }

      const finalPublishDate = saveStatus === 'published' ? new Date() : null

      // Save article
      const articleData = {
        title: title.trim(),
        slug: slug || title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        summary: summary.trim(),
        content: content.trim(),
        status: saveStatus,
        published_at: finalPublishDate ? finalPublishDate.toISOString() : null,
        category_id: categoryId,
        hero_image_url: heroImageUrl.trim(),
        hero_image_alt: heroImageAlt.trim(),
        meta_description: metaDescription.trim(),
        focus_keyword: focusKeyword.trim(),
        featured_main: featuredMain,
        featured_category: featuredCategory,
        tags: tags.length > 0 ? tags : []
      }

      console.log('Saving article to backend:', articleData)
      
      // Use real API call instead of mock
      const articleResult = await api.createArticle(articleData)
      
      if (!articleResult) throw new Error('Failed to create article')

      const articleId = articleResult.article?.id || articleResult.id

      // Note: Subcategories and related articles will be implemented later
      // For now, we focus on basic article creation
      
      const statusMessages = {
        draft: 'Article saved as draft',
        published: 'Article published successfully!',
        scheduled: 'Article scheduled successfully!'
      }

      toast({
        title: 'Success',
        description: statusMessages[saveStatus],
        variant: 'default'
      })

      router.push('/admin/articles')

    } catch (err: any) {
      console.error('Article save error:', err)
      const errorMessage = err.message || 'An unexpected error occurred'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: `Failed to save article: ${errorMessage}`,
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* WordPress-style Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/articles">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  All Articles
                </Link>
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">Add New Article</h1>
              {title && (
                <>
                  <div className="h-6 w-px bg-gray-300"></div>
                  <span className="text-sm text-gray-500 truncate max-w-xs">{title}</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreview}
                disabled={!title || !content}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSave('draft')}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSave('published')}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add title"
                className="text-2xl font-bold border-none shadow-none p-0 h-auto placeholder:text-gray-400 focus:ring-0"
                style={{ fontSize: '2rem', lineHeight: '2.5rem' }}
              />
            </div>

            {/* Permalink */}
            {slug && (
              <div className="flex items-center text-sm text-gray-500">
                <Globe className="w-4 h-4 mr-1" />
                <span>Permalink: </span>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="ml-2 text-blue-600 border-none shadow-none p-0 h-auto focus:ring-0 bg-transparent"
                />
              </div>
            )}

            {/* Media Buttons */}
            <div className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg border">
              <span className="text-sm font-medium text-gray-600">Media:</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open('/admin/media', '_blank')}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>

              <Dialog open={showMediaLibrary} onOpenChange={setShowMediaLibrary}>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowMediaLibrary(true)
                      loadMediaImages()
                    }}
                  >
                    <Star className="h-4 w-4 mr-1" />
                    {heroImageUrl ? 'Change Hero Image' : 'Set Hero Image'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>Select Hero Image</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="flex gap-2">
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or tags..."
                        className="flex-1"
                      />
                      <Button variant="outline" onClick={loadMediaImages}>
                        <Search className="h-4 w-4 mr-1" />
                        Search
                      </Button>
                    </div>

                    {/* Current Hero Image */}
                    {heroImageUrl && (
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <Label className="text-sm font-medium text-blue-800">Current Hero Image:</Label>
                        <div className="mt-2 flex gap-4 items-start">
                          <img src={heroImageUrl} alt="Current hero" className="w-32 h-24 object-cover rounded border" />
                          <div className="flex-1 space-y-2">
                            <Input
                              value={heroImageAlt}
                              onChange={(e) => setHeroImageAlt(e.target.value)}
                              placeholder="Alt text for accessibility..."
                              className="bg-white"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => selectHeroImage('', '')}
                            >
                              Remove Hero Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Gallery */}
                    <div className="max-h-96 overflow-y-auto">
                      {mediaLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Loading images...</span>
                        </div>
                      ) : filteredImages.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {filteredImages.map((image) => (
                            <div
                              key={image.id}
                              className="cursor-pointer group relative border rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                              onClick={() => selectHeroImage(image.url, image.alt)}
                            >
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                              <div className="p-2">
                                <p className="text-xs font-medium truncate">{image.alt}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {image.tags.map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {searchTerm ? 'No images found matching your search.' : 'No images available.'}
                        </div>
                      )}
                    </div>

                    {/* Manual URL Input */}
                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium">Or enter image URL manually:</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="Paste image URL..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const url = (e.target as HTMLInputElement).value
                              if (url) {
                                selectHeroImage(url, 'Image from URL')
                              }
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={() => window.open('/admin/media', '_blank')}
                        >
                          Open Media Library
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>


            </div>

            {/* Main Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <SimpleDynamicEditor
                content={content}
                onChange={setContent}
                onInsertImage={setEditorInsertImageFn}
                placeholder="Start writing your article..."
                className="border-none"
              />
            </div>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
                <CardDescription>
                  Brief description that appears in article previews and search results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write a compelling summary of your article..."
                  rows={3}
                  maxLength={200}
                  className="resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">{summary.length}/200 characters</span>
                  <span className="text-xs text-gray-400">Used for previews and meta description</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Publish Box */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Publish</CardTitle>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Featured on Main Page</Label>
                  <Switch
                    checked={featuredMain}
                    onCheckedChange={setFeaturedMain}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Featured in Category</Label>
                  <Switch
                    checked={featuredCategory}
                    onCheckedChange={setFeaturedCategory}
                  />
                </div>

                <div className="pt-3 border-t space-y-2">
                  <Button
                    onClick={() => handleSave('draft')}
                    disabled={isSaving}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    {isSaving ? 'Saving...' : 'Save Draft'}
                  </Button>
                  <Button
                    onClick={() => handleSave('published')}
                    disabled={isSaving}
                    className="w-full"
                    size="sm"
                  >
                    {isSaving ? 'Publishing...' : 'Publish Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Primary Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose category" />
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
                    <Label className="text-sm font-medium">Subcategories</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {filteredSubcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`sub-${subcategory.id}`}
                            checked={selectedSubcategories.includes(subcategory.id)}
                            onChange={() => {
                              if (selectedSubcategories.includes(subcategory.id)) {
                                setSelectedSubcategories(selectedSubcategories.filter(id => id !== subcategory.id))
                              } else if (selectedSubcategories.length < 4) {
                                setSelectedSubcategories([...selectedSubcategories, subcategory.id])
                              }
                            }}
                            disabled={!selectedSubcategories.includes(subcategory.id) && selectedSubcategories.length >= 4}
                            className="rounded"
                          />
                          <Label 
                            htmlFor={`sub-${subcategory.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {subcategory.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add new tag"
                      className="text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button
                      onClick={addTag}
                      variant="outline"
                      size="sm"
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:bg-red-100"
                          onClick={() => removeTag(tag)}
                        >
                          {tag} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Author */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label className="text-sm font-medium">Author Name</Label>
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter author name"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will be displayed as the article author
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <Search className="w-4 h-4 mr-2" />
                  SEO
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Focus Keyword</Label>
                  <Input
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Main keyword to rank for"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Meta Description</Label>
                  <Textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Description for search engines"
                    className="mt-1"
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {metaDescription.length}/160 characters
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
} 