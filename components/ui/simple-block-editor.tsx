'use client'

import { useCreateBlockNote, createReactBlockSpec } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import { defaultBlockSpecs, BlockNoteSchema, defaultProps } from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import dynamic from 'next/dynamic'

interface SimpleBlockEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  onInsertImage?: (insertImageFn: (imageUrl: string, altText: string) => void) => void
}

// Main component with SSR protection
export default function SimpleBlockEditor(props: SimpleBlockEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className={`border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-white ${props.className}`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return <SimpleBlockEditorCore {...props} />
}

// The actual editor component (only renders on client)
function SimpleBlockEditorCore({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = '',
  onInsertImage
}: SimpleBlockEditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [mediaImages, setMediaImages] = useState<any[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [pendingImageBlock, setPendingImageBlock] = useState<any>(null)

  // Load media library images
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

  // Handle media library selection
  const handleMediaLibrarySelect = useCallback((block: any) => {
    console.log('📚 Opening media library for block:', block)
    setPendingImageBlock(block)
    loadMediaImages()
    setShowMediaLibrary(true)
  }, [])

  // Create custom image block with media library integration
  const CustomImageBlock = createReactBlockSpec(
    {
      type: "image",
      propSchema: {
        ...defaultProps,
        url: {
          default: "",
        },
        caption: {
          default: "",
        },
        showUploadError: {
          default: false,
        },
      },
      content: "none",
    },
    {
      render: ({ block, editor }) => {
        const hasImage = block.props.url

        if (hasImage) {
          // Show the actual image
          return (
            <div className="custom-image-block">
              <img
                src={block.props.url}
                alt={block.props.caption || ''}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  margin: '1rem 0',
                }}
              />
              {block.props.caption && (
                <div style={{
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontStyle: 'italic',
                  marginTop: '0.5rem',
                }}>
                  {block.props.caption}
                </div>
              )}
            </div>
          )
        }

        // Show upload interface with media library option
        return (
          <div 
            className="custom-image-upload"
            style={{
              border: '2px dashed #3b82f6',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              background: '#eff6ff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.currentTarget.style.background = '#dbeafe'
              e.currentTarget.style.borderColor = '#1d4ed8'
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.background = '#eff6ff'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onDrop={async (e) => {
              e.preventDefault()
              e.currentTarget.style.background = '#eff6ff'
              e.currentTarget.style.borderColor = '#3b82f6'
              
              const file = e.dataTransfer?.files[0]
              if (file && file.type.startsWith('image/')) {
                try {
                  const formData = new FormData()
                  formData.append('file', file)
                  formData.append('category', 'article')
                  formData.append('altText', file.name || 'Uploaded image')

                  const result = await api.uploadFile(formData)
                  editor.updateBlock(block, {
                    type: "image",
                    props: {
                      url: result.url,
                      caption: result.altText || '',
                    },
                  })
                } catch (error) {
                  console.error('Upload failed:', error)
                }
              }
            }}
          >
            <div style={{
              color: '#3b82f6',
              fontWeight: '600',
              fontSize: '1rem',
              marginBottom: '1rem',
            }}>
              🖼️ Add an Image
            </div>

            <div style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
              {/* Upload button */}
              <button
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#1d4ed8' }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#3b82f6' }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Trigger file input
                  const fileInput = document.createElement('input')
                  fileInput.type = 'file'
                  fileInput.accept = 'image/*'
                  fileInput.onchange = async (event) => {
                    const file = (event.target as HTMLInputElement)?.files?.[0]
                    if (file) {
                      try {
                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('category', 'article')
                        formData.append('altText', file.name || 'Uploaded image')

                        const result = await api.uploadFile(formData)
                        editor.updateBlock(block, {
                          type: "image",
                          props: {
                            url: result.url,
                            caption: result.altText || '',
                          },
                        })
                      } catch (error) {
                        console.error('Upload failed:', error)
                      }
                    }
                  }
                  fileInput.click()
                }}
              >
                📤 Upload
              </button>

              {/* Media Library button */}
              <button
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#047857' }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#10b981' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMediaLibrarySelect(block)
                }}
              >
                📚 Media Library
              </button>

              {/* Embed button */}
              <button
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#4b5563' }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#6b7280' }}
                onClick={(e) => {
                  e.stopPropagation()
                  const url = prompt('Enter image URL:')
                                      if (url) {
                      editor.updateBlock(block, {
                        type: "image",
                        props: {
                          url: url,
                          caption: '',
                        },
                      })
                  }
                }}
              >
                🔗 Embed
              </button>
            </div>

            <div style={{
              color: '#6b7280',
              fontSize: '0.75rem',
              marginTop: '0.75rem',
            }}>
              Or drag & drop an image here
            </div>
          </div>
        )
      },
    }
  )

  // Create custom schema with modified image block
  const schema = BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      image: CustomImageBlock,
    },
  })

  // Create editor with custom schema
  const editor = useCreateBlockNote({
    schema,
    uploadFile: async (file: File) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', 'article')
        formData.append('altText', file.name || 'Uploaded image')

        const result = await api.uploadFile(formData)
        console.log('✅ File uploaded via drag & drop:', result.url)
        return result.url
      } catch (error) {
        console.error('❌ Upload error:', error)
        throw error
      }
    },
    initialContent: [
      {
        type: "paragraph",
        content: "",
      },
    ],
  })

  // Function to insert image at cursor position
  const insertImageAtCursor = useCallback((imageUrl: string, altText: string = '') => {
    if (!editor) {
      console.warn('Editor not ready for image insertion')
      return
    }

    try {
      // If we have a pending image block, replace it
      if (pendingImageBlock) {
        editor.updateBlock(pendingImageBlock, {
          type: "image",
          props: {
            url: imageUrl,
            caption: altText,
          },
        })
        setPendingImageBlock(null)
      } else {
        // Get the current cursor position and insert new image
        const currentPosition = editor.getTextCursorPosition()
        
        editor.insertBlocks([{
          type: "image",
          props: {
            url: imageUrl,
            caption: altText,
          },
        }] as any, currentPosition.block, "after")
      }
      
      console.log('✅ Image inserted:', imageUrl)
    } catch (error) {
      console.error('❌ Failed to insert image:', error)
    }
  }, [editor, pendingImageBlock])

  // Filter images based on search
  const filteredImages = mediaImages.filter(image => 
    image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Select image from media library
  const selectImage = (imageUrl: string, altText: string) => {
    if (pendingImageBlock) {
      // Update existing image block
      editor.updateBlock(pendingImageBlock, {
        type: "image",
        props: {
          url: imageUrl,
          caption: altText,
        },
      })
    } else {
      // Insert new image block at cursor position
      const currentBlock = editor.getTextCursorPosition().block
      const newImageBlock = {
        type: "image" as const,
        props: {
          url: imageUrl,
          caption: altText,
        },
      }
      
      editor.insertBlocks([newImageBlock], currentBlock, "after")
    }
    
    setShowMediaLibrary(false)
    setPendingImageBlock(null)
    setSearchTerm('')
  }

  // Expose image insertion function to parent component
  useEffect(() => {
    if (onInsertImage && editor && !isLoading) {
      onInsertImage(insertImageAtCursor)
    }
  }, [onInsertImage, editor, isLoading, insertImageAtCursor])

  // Initialize content only once
  useEffect(() => {
    const initializeContent = async () => {
      if (!editor || isInitialized) return
      
      setIsLoading(true)
      
      try {
        if (content && content.trim() !== '') {
          console.log('🔄 Initializing editor with existing content...')
          const blocks = await editor.tryParseHTMLToBlocks(content)
          editor.replaceBlocks(editor.document, blocks)
          console.log('✅ Content initialized successfully')
        } else {
          console.log('📝 Starting with empty content')
        }
      } catch (error) {
        console.log('⚠️ Content parsing error (using fallback):', error)
        try {
          editor.replaceBlocks(editor.document, [
            {
              type: "paragraph",
              content: content || "",
            },
          ])
        } catch (fallbackError) {
          console.log('❌ Fallback content setting failed:', fallbackError)
        }
      } finally {
        setIsInitialized(true)
        setIsLoading(false)
      }
    }

    initializeContent()
  }, [editor])

  // Handle content changes
  const handleChange = useCallback(async () => {
    if (!editor || isLoading || !isInitialized) return
    
    try {
      const html = await editor.blocksToHTMLLossy(editor.document)
      onChange(html)
    } catch (error) {
      console.log('⚠️ Content conversion error (non-critical):', error)
    }
  }, [editor, onChange, isLoading, isInitialized])

  if (isLoading) {
    return (
      <div className={`border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-white ${className}`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  if (!editor) {
    return (
      <div className={`border rounded-lg p-4 min-h-[400px] flex items-center justify-center bg-white ${className}`}>
        <div className="text-red-500">Editor failed to load</div>
      </div>
    )
  }

  return (
    <>
      <div className={`border rounded-lg bg-white overflow-hidden relative ${className}`}>
        <style jsx global>{`
          /* Clean editor styling */
          .bn-container {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: none !important;
            max-height: none !important;
            height: auto !important;
          }
          
          .bn-editor {
            min-height: 400px !important;
            max-height: none !important;
            height: auto !important;
            padding: 1.5rem !important;
            overflow-y: visible !important;
          }
          
          /* Custom image block styling */
          .custom-image-block {
            margin: 1rem 0 !important;
          }
          
          .custom-image-upload:hover {
            border-color: #1d4ed8 !important;
            background: #dbeafe !important;
            transform: scale(1.02) !important;
          }
          
          /* Image styling */
          .bn-block-content img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
            margin: 1rem 0 !important;
          }
          
          /* Style other content */
          .bn-block-content h1 {
            font-size: 2.5rem !important;
            font-weight: 700 !important;
            margin: 1.5rem 0 1rem 0 !important;
            color: #111827 !important;
          }
          
          .bn-block-content h2 {
            font-size: 2rem !important;
            font-weight: 600 !important;
            margin: 1.25rem 0 0.75rem 0 !important;
            color: #1f2937 !important;
          }
          
          .bn-block-content h3 {
            font-size: 1.5rem !important;
            font-weight: 600 !important;
            margin: 1rem 0 0.5rem 0 !important;
            color: #374151 !important;
          }
          
          .bn-block-content p {
            font-size: 1.125rem !important;
            line-height: 1.75 !important;
            margin: 0.75rem 0 !important;
            color: #374151 !important;
          }
          
          .bn-block-content ul,
          .bn-block-content ol {
            margin: 1rem 0 !important;
            padding-left: 1.5rem !important;
          }
          
          .bn-block-content li {
            margin: 0.5rem 0 !important;
            line-height: 1.6 !important;
          }
          
          .bn-block-content blockquote {
            border-left: 4px solid #3b82f6 !important;
            padding: 1rem 1.5rem !important;
            margin: 1.5rem 0 !important;
            background: #f8fafc !important;
            border-radius: 0.5rem !important;
            font-style: italic !important;
            color: #4b5563 !important;
          }
          
          /* Clean up potential infinite scrolling issues */
          .bn-editor .ProseMirror {
            height: auto !important;
            max-height: none !important;
            overflow-y: visible !important;
          }
        `}</style>
        
        <BlockNoteView 
          editor={editor} 
          onChange={handleChange}
          theme="light"
          filePanel={true}
          sideMenu={true}
          slashMenu={true}
          formattingToolbar={true}
        />
        
        {/* Top toolbar for quick actions */}
        <div className="border-b bg-gray-50 px-4 py-2 flex gap-2 items-center">
          <button
            onClick={() => {
              // Insert a new image block at the current cursor position
              const currentBlock = editor.getTextCursorPosition().block
              const newImageBlock = {
                type: "image" as const,
                props: {
                  url: "",
                  caption: "",
                },
              }
              
              editor.insertBlocks([newImageBlock], currentBlock, "after")
              
              // Scroll the new block into view
              setTimeout(() => {
                const imageBlocks = document.querySelectorAll('.custom-image-upload')
                const lastBlock = imageBlocks[imageBlocks.length - 1]
                if (lastBlock) {
                  lastBlock.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }, 100)
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Add Image Block"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Image
          </button>
          
          <button
            onClick={() => {
              loadMediaImages()
              setShowMediaLibrary(true)
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            title="Browse Media Library"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Media Library
          </button>
          
          <div className="text-xs text-gray-500 ml-4">
            💡 Tip: Type "/" for more options or use the + button on the left
          </div>
        </div>

        {/* Floating Action Button for Adding Images */}
        <div className="absolute bottom-4 right-4 z-10">
          <button
            onClick={() => {
              // Insert a new image block at the current cursor position
              const currentBlock = editor.getTextCursorPosition().block
              const newImageBlock = {
                type: "image" as const,
                props: {
                  url: "",
                  caption: "",
                },
              }
              
              editor.insertBlocks([newImageBlock], currentBlock, "after")
              
              // Scroll the new block into view
              setTimeout(() => {
                const imageBlocks = document.querySelectorAll('.custom-image-upload')
                const lastBlock = imageBlocks[imageBlocks.length - 1]
                if (lastBlock) {
                  lastBlock.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }, 100)
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-105"
            title="Quick Add Image"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Choose Image from Media Library</h3>
              <button
                onClick={() => {
                  setShowMediaLibrary(false)
                  setPendingImageBlock(null)
                  setSearchTerm('')
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Images Grid */}
              <div className="max-h-[50vh] overflow-y-auto">
                {mediaLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading images...</p>
                  </div>
                ) : filteredImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredImages.map((image, index) => (
                      <div
                        key={image.id || index}
                        className="relative group cursor-pointer border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        onClick={() => selectImage(image.url, image.alt_text || image.filename || 'Image')}
                      >
                        <img
                          src={image.url}
                          alt={image.alt_text || image.filename}
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                            Select Image
                          </span>
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-gray-600 truncate font-medium">
                            {image.filename || 'Untitled'}
                          </p>
                          {image.alt_text && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {image.alt_text}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No images found matching your search.' : 'No images available.'}
                    <div className="mt-2">
                      <button
                        onClick={() => window.open('/admin/media', '_blank')}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Upload New Images
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 