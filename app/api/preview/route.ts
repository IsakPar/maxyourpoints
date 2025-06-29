import { NextRequest, NextResponse } from 'next/server'
import { convertMarkdownToHtml } from '@/lib/markdown'

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json()
    
    // Create HTML preview with proper styling
    const previewHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Preview: ${articleData.title || 'Untitled Article'}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        .article-content img {
          max-width: 100%;
          height: auto;
          margin: 1rem auto;
          border-radius: 0.5rem;
        }
        .article-content .image-caption {
          text-align: center;
          font-style: italic;
          margin-top: 8px;
          color: #666;
          font-size: 14px;
        }
        .prose {
          max-width: none;
        }
        .prose h1 { @apply text-3xl font-bold mt-8 mb-4; }
        .prose h2 { @apply text-2xl font-bold mt-6 mb-3; }
        .prose h3 { @apply text-xl font-bold mt-4 mb-2; }
        .prose p { @apply mb-4 leading-relaxed; }
        .prose ul { @apply list-disc ml-6 mb-4; }
        .prose ol { @apply list-decimal ml-6 mb-4; }
        .prose li { @apply mb-1; }
        .prose blockquote { @apply border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4; }
        .prose hr { @apply border-t border-gray-300 my-8; }
        .prose a { @apply text-blue-600 hover:underline; }
        .prose strong { @apply font-bold; }
        .prose em { @apply italic; }
        .prose u { @apply underline; }
      </style>
    </head>
    <body class="bg-gray-50">
      <div class="min-h-screen">
        <!-- Preview Banner -->
        <div class="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <div class="max-w-4xl mx-auto">
            <p class="text-yellow-800 text-sm font-medium">
              📝 Preview Mode - This is how your article will appear when published
            </p>
          </div>
        </div>

        <!-- Article Content -->
        <div class="max-w-4xl mx-auto px-4 py-8">
          <article class="bg-white rounded-lg shadow-lg overflow-hidden">
            ${articleData.heroImageUrl ? `
            <div class="w-full">
              <img 
                src="${articleData.heroImageUrl}" 
                alt="${articleData.heroImageAlt || ''}"
                class="w-full h-64 md:h-96 object-cover"
              />
              ${articleData.heroImageAlt ? `
              <div class="px-6 py-2">
                <p class="text-sm text-gray-500 text-center italic">
                  ${articleData.heroImageAlt}
                </p>
              </div>
              ` : ''}
            </div>
            ` : ''}
            
            <div class="px-6 py-8">
              <!-- Article Header -->
              <header class="border-b border-gray-200 pb-6 mb-8">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">
                  ${articleData.title || 'Untitled Article'}
                </h1>
                
                ${articleData.summary ? `
                <p class="text-xl text-gray-600 mb-4 leading-relaxed">
                  ${articleData.summary}
                </p>
                ` : ''}
                
                <div class="flex items-center space-x-4 text-sm text-gray-500">
                  <span>By ${articleData.author || 'Unknown Author'}</span>
                  <span>•</span>
                  <span>${new Date().toLocaleDateString()}</span>
                  ${articleData.tags && articleData.tags.length > 0 ? `
                  <span>•</span>
                  <div class="flex items-center space-x-2">
                    ${articleData.tags.map(tag => `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">${tag}</span>`).join('')}
                  </div>
                  ` : ''}
                </div>
              </header>

              <!-- Article Content -->
              <div class="prose prose-lg max-w-none article-content">
                ${convertMarkdownToHtml(articleData.content || '')}
              </div>
            </div>
          </article>
        </div>
      </div>
    </body>
    </html>
    `

    return new NextResponse(previewHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    })
    
  } catch (error: any) {
    console.error('Preview API error:', error)
    return NextResponse.json({
      error: 'Failed to generate preview',
      message: error.message
    }, { status: 500 })
  }
}

 