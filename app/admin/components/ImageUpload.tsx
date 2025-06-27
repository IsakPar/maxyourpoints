'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Upload, X, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { api } from '@/lib/api'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onAltChange?: (alt: string) => void
  altValue?: string
  onCaptionChange?: (caption: string) => void
  captionValue?: string
  onTitleChange?: (title: string) => void
  titleValue?: string
  label?: string
  className?: string
  category?: string
  showMetadataFields?: boolean
}

interface UploadPreview {
  file: File
  preview: string
  isHEIC: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onAltChange,
  altValue = '',
  onCaptionChange,
  captionValue = '',
  onTitleChange,
  titleValue = '',
  label = "Hero Image",
  className,
  category = 'article',
  showMetadataFields = true
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value || '')
  
  // Upload preview and metadata modal
  const [uploadPreview, setUploadPreview] = useState<UploadPreview | null>(null)
  const [pendingAltText, setPendingAltText] = useState('')
  const [pendingCaption, setPendingCaption] = useState('')
  const [pendingTitle, setPendingTitle] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const prepareUpload = async (file: File) => {
    setError('')
    setSuccess('')

    try {
      // Validate file size (20MB limit for processing)
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('File size must be less than 20MB')
      }

      // Check for HEIC format
      const isHEIC = file.type === 'image/heic' || file.type === 'image/heif' || 
                     file.name.toLowerCase().endsWith('.heic') || 
                     file.name.toLowerCase().endsWith('.heif')

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      if (!isHEIC && !allowedTypes.includes(file.type)) {
        throw new Error('Supported formats: JPEG, PNG, WebP, GIF, HEIC/HEIF')
      }

      // Create preview URL
      let previewUrl: string
      if (isHEIC) {
        // For HEIC files, show a placeholder
        previewUrl = '/placeholder.jpg'
      } else {
        previewUrl = URL.createObjectURL(file)
      }

      // Set up upload preview with metadata form
      setUploadPreview({
        file,
        preview: previewUrl,
        isHEIC
      })

      // Pre-fill with existing values or smart defaults
      setPendingAltText(altValue || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
      setPendingCaption(captionValue || '')
      setPendingTitle(titleValue || '')

    } catch (err: any) {
      console.error('Upload preparation error:', err)
      setError(err.message || 'Upload preparation failed')
    }
  }

  const handleUpload = async () => {
    if (!uploadPreview) return

    setIsUploading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', uploadPreview.file)
      formData.append('altText', pendingAltText)
      formData.append('caption', pendingCaption)
      formData.append('title', pendingTitle)
      formData.append('category', category)

      // Use API client which includes authentication
      const result = await api.uploadFile(formData)

      onChange(result.url)
      
      // Update parent component metadata
      if (onAltChange) onAltChange(pendingAltText)
      if (onCaptionChange) onCaptionChange(pendingCaption)
      if (onTitleChange) onTitleChange(pendingTitle)
      
      // Show success message with processing details
      let successMessage = 'Image uploaded successfully!'
      if (result.wasHEIC) {
        successMessage = `HEIC converted to PNG and uploaded! (${result.compressionRatio}% size reduction)`
      } else if (result.optimized && result.compressionRatio > 0) {
        successMessage = `Image optimized and uploaded! (${result.compressionRatio}% size reduction)`
      }
      
      setSuccess(successMessage)
      
      // Clean up preview
      if (uploadPreview.preview !== '/placeholder.jpg') {
        URL.revokeObjectURL(uploadPreview.preview)
      }
      setUploadPreview(null)
      
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const cancelUpload = () => {
    if (uploadPreview && uploadPreview.preview !== '/placeholder.jpg') {
      URL.revokeObjectURL(uploadPreview.preview)
    }
    setUploadPreview(null)
    setPendingAltText('')
    setPendingCaption('')
    setPendingTitle('')
    setError('')
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      prepareUpload(files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      prepareUpload(files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setSuccess('Image URL updated!')
      setError('')
    }
  }

  const clearImage = () => {
    onChange('')
    setUrlInput('')
    setSuccess('')
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">{label}</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={uploadMethod === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMethod('upload')}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload
          </Button>
          <Button
            type="button"
            variant={uploadMethod === 'url' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUploadMethod('url')}
          >
            <ImageIcon className="h-4 w-4 mr-1" />
            URL
          </Button>
        </div>
      </div>

      {uploadMethod === 'upload' ? (
        <Card>
          <CardContent className="p-6">
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300",
                isUploading ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-gray-400"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={isUploading}
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                  <p className="text-lg font-medium text-gray-700">Processing...</p>
                  <p className="text-sm text-gray-500">Converting and optimizing your image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports JPEG, PNG, WebP, GIF, HEIC (max 20MB)
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    HEIC files will be automatically converted to PNG
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUrlSubmit}>
                Add URL
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Image Display */}
      {value && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <img
                src={value}
                alt={altValue || 'Uploaded image'}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Current Image
                </p>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {value}
                </p>
                {altValue && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Alt:</strong> {altValue}
                  </p>
                )}
                {captionValue && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Caption:</strong> {captionValue}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inline metadata fields for existing workflows */}
      {showMetadataFields && !uploadPreview && (
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Alt Text <span className="text-red-500">*</span></Label>
            <Textarea
              placeholder="Describe the image for accessibility and SEO..."
              value={altValue}
              onChange={(e) => onAltChange?.(e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Caption</Label>
            <Input
              placeholder="Optional caption that will appear below the image..."
              value={captionValue}
              onChange={(e) => onCaptionChange?.(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <Input
              placeholder="Optional title attribute for the image..."
              value={titleValue}
              onChange={(e) => onTitleChange?.(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <Alert>
          <Check className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Preview and Metadata Modal */}
      <Dialog open={!!uploadPreview} onOpenChange={() => cancelUpload()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Image Details</DialogTitle>
            <DialogDescription>
              Please add alt text and caption before uploading your image.
            </DialogDescription>
          </DialogHeader>
          
          {uploadPreview && (
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                {uploadPreview.isHEIC ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">HEIC Preview</p>
                      <p className="text-xs text-gray-500">Will be converted to PNG</p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={uploadPreview.preview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div>
                <Label className="text-sm font-medium">
                  Alt Text <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Describe the image for accessibility and SEO..."
                  value={pendingAltText}
                  onChange={(e) => setPendingAltText(e.target.value)}
                  className="mt-1"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Essential for accessibility and SEO
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Caption</Label>
                <Input
                  placeholder="Optional caption that will appear below the image..."
                  value={pendingCaption}
                  onChange={(e) => setPendingCaption(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  placeholder="Optional title attribute for the image..."
                  value={pendingTitle}
                  onChange={(e) => setPendingTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={cancelUpload}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || !pendingAltText.trim()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Image'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 