'use client'

import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import { PartialBlock } from "@blocknote/core"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { useState, useEffect, useCallback } from 'react'

interface BlockEditorCoreProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

// Custom upload function with metadata support
const uploadFileWithMetadata = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  // Use smart defaults for metadata
  const smartAltText = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
  formData.append('altText', smartAltText)
  formData.append('category', 'article')
  
  try {
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) throw new Error('Upload failed')
    
    const result = await response.json()
    return {
      url: result.url,
      altText: result.altText,
      caption: result.caption
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw error
  }
}

export default function BlockEditorCore({
  content,
  onChange,
  placeholder = 'Start writing...',
  className = ''
}: BlockEditorCoreProps) {
  const [initialContent, setInitialContent] = useState<PartialBlock[]>([
    {
      type: "paragraph",
      content: "",
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  // Create editor with enhanced image support
  const editor = useCreateBlockNote({
    initialContent,
    uploadFile: uploadFileWithMetadata,
  })

  // Convert HTML content to blocks on initial load
  useEffect(() => {
    const initializeContent = async () => {
      if (content && content.trim() !== '') {
        try {
          const blocks = await editor.tryParseHTMLToBlocks(content)
          setInitialContent(blocks)
          editor.replaceBlocks(editor.document, blocks)
        } catch (error) {
          console.error('Error parsing HTML to blocks:', error)
          // Fallback to default paragraph if parsing fails
          setInitialContent([
            {
              type: "paragraph",
              content: "",
            },
          ])
        }
      } else {
        // Set default paragraph for empty content
        setInitialContent([
          {
            type: "paragraph",
            content: "",
          },
        ])
      }
      setIsLoading(false)
    }

    if (editor) {
      initializeContent()
    }
  }, [content, editor])

  // Handle content changes with caption processing
  const handleChange = useCallback(async () => {
    try {
      const html = await editor.blocksToHTMLLossy(editor.document)
      
      // Process HTML to add captions for images with caption data
      const processedHtml = processImageCaptions(html)
      
      onChange(processedHtml)
    } catch (error) {
      console.error('Error converting blocks to HTML:', error)
    }
  }, [editor, onChange])

  // Function to process images and add captions
  const processImageCaptions = (html: string): string => {
    // For now, process images that already have data-caption attributes
    // In the future, this can be enhanced to fetch from database
    return html.replace(
      /<img([^>]+)data-caption="([^"]*)"([^>]*)>/g,
      (match, beforeCaption, caption, afterCaption) => {
        if (caption && caption.trim()) {
          return `<figure class="image-with-caption">
                    <img${beforeCaption}${afterCaption}>
                    <figcaption class="image-caption">${caption}</figcaption>
                  </figure>`
        }
        return match
      }
    )
  }

  if (isLoading) {
    return (
      <div className={`border rounded-lg p-4 min-h-[400px] flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg bg-white overflow-hidden ${className}`}>
      <style jsx global>{`
        .bn-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          border: none !important;
        }
        
        .bn-editor {
          min-height: 400px;
          padding: 1.5rem;
        }
        
        .bn-block-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 1.5rem 0 1rem 0;
          color: #111827;
        }
        
        .bn-block-content h2 {
          font-size: 2rem;
          font-weight: 600;
          margin: 1.25rem 0 0.75rem 0;
          color: #1f2937;
        }
        
        .bn-block-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
          color: #374151;
        }
        
        .bn-block-content p {
          font-size: 1.125rem;
          line-height: 1.75;
          margin: 0.75rem 0;
          color: #374151;
        }
        
        .bn-block-content ul,
        .bn-block-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .bn-block-content li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .bn-block-content blockquote {
          border-left: 4px solid #3b82f6;
          padding: 1rem 1.5rem;
          margin: 1.5rem 0;
          background: #f8fafc;
          border-radius: 0.5rem;
          font-style: italic;
          color: #4b5563;
        }
        
        /* Enhanced image styling with caption support */
        .bn-block-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Figure with caption styling */
        .bn-block-content figure.image-with-caption {
          margin: 1.5rem 0;
          text-align: center;
        }
        
        .bn-block-content figure.image-with-caption img {
          margin: 0;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .bn-block-content figcaption.image-caption {
          margin-top: 0.75rem;
          font-size: 0.875rem;
          color: #6b7280;
          font-style: italic;
          text-align: center;
          line-height: 1.5;
          max-width: 80%;
          margin-left: auto;
          margin-right: auto;
        }
        
        .bn-block-content a {
          color: #3b82f6;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        
        .bn-block-content a:hover {
          color: #1d4ed8;
        }
        
        .bn-block-content code {
          background: #f1f5f9;
          color: #1e293b;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          font-size: 0.9em;
        }
        
        .bn-block-content pre {
          background: #1e293b;
          color: #f1f5f9;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
          overflow-x: auto;
        }
        
        /* Customize the slash menu */
        .bn-suggestion-menu {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        /* Customize the formatting toolbar */
        .bn-formatting-toolbar {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Customize the side menu */
        .bn-side-menu {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        /* Ensure proper focus styling */
        .bn-editor:focus {
          outline: none;
        }
        
        /* Placeholder styling */
        .bn-block-content[data-placeholder]:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
        }
      `}</style>
      
      <BlockNoteView 
        editor={editor} 
        onChange={handleChange}
        theme="light"
      />
    </div>
  )
} 