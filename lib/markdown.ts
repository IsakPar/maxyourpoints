export function convertMarkdownToHtml(content: string): string {
  if (!content) return ''
  
  return content
    // Handle images with optional captions
    .replace(/!\[([^\]]*)\]\(([^)]+)\)\s*\n?(<div[^>]*>.*?<\/div>)?/g, (match, alt, src, caption) => {
      const imageHtml = `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto; margin: 2rem auto; border-radius: 0.75rem; display: block; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);" />`
      if (caption) {
        // Extract caption content from div
        const captionText = caption.replace(/<[^>]*>/g, '').trim()
        return `<div style="text-align: center; margin: 2rem 0;">${imageHtml}<div style="text-align: center; font-style: italic; margin-top: 0.75rem; color: #6b7280; font-size: 0.875rem; line-height: 1.5;">${captionText}</div></div>`
      }
      return `<div style="text-align: center; margin: 2rem 0;">${imageHtml}</div>`
    })
    // Headers with proper styling
    .replace(/^### (.*$)/gm, '<h3 style="font-family: \'Inter\', sans-serif; font-size: 1.5rem; font-weight: 600; line-height: 1.3; margin: 1.5rem 0 0.75rem 0; color: #374151; letter-spacing: -0.015em;">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 style="font-family: \'Merriweather\', Georgia, serif; font-size: 2rem; font-weight: 700; line-height: 1.25; margin: 1.75rem 0 1rem 0; color: #1f2937; letter-spacing: -0.02em;">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 style="font-family: \'Merriweather\', Georgia, serif; font-size: 2.5rem; font-weight: 700; line-height: 1.2; margin: 2rem 0 1.25rem 0; color: #111827; letter-spacing: -0.025em;">$1</h1>')
    // Text formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 600; color: #1f2937;">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="font-style: italic; color: #4b5563;">$1</em>')
    .replace(/<u>(.*?)<\/u>/g, '<u style="text-decoration: underline;">$1</u>')
    // Links with enhanced styling
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #6366f1; text-decoration: none; font-weight: 500; border-bottom: 2px solid transparent; transition: all 0.2s ease;" onmouseover="this.style.color=\'#4f46e5\'; this.style.borderBottomColor=\'#6366f1\';" onmouseout="this.style.color=\'#6366f1\'; this.style.borderBottomColor=\'transparent\';">$1</a>')
    // Lists with better formatting
    .replace(/^- (.*$)/gm, '<li style="margin: 0.5rem 0; line-height: 1.7; font-family: \'Inter\', sans-serif; font-size: 1.125rem; color: #374151;">• $1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li style="margin: 0.5rem 0; line-height: 1.7; font-family: \'Inter\', sans-serif; font-size: 1.125rem; color: #374151;">$1</li>')
    // Enhanced blockquotes
    .replace(/^> (.*$)/gm, '<blockquote style="font-family: \'Merriweather\', Georgia, serif; font-size: 1.25rem; font-style: italic; font-weight: 400; line-height: 1.6; border-left: 4px solid #6366f1; padding: 1.5rem 2rem; margin: 2rem 0; color: #4b5563; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr style="border: none; height: 2px; background: linear-gradient(90deg, #14b8a6, #3b82f6); margin: 2rem 0; border-radius: 1px;">')
    // Convert line breaks to proper paragraph breaks
    .replace(/\n\n/g, '</p><p style="font-family: \'Inter\', sans-serif; font-size: 1.125rem; font-weight: 400; line-height: 1.75; margin: 1rem 0; color: #374151; letter-spacing: -0.005em;">')
    // Wrap remaining text in paragraphs with enhanced styling
    .replace(/^(?!<[h1-6]|<img|<div|<blockquote|<hr|<ul|<ol|<li)(.+)/gm, '<p style="font-family: \'Inter\', sans-serif; font-size: 1.125rem; font-weight: 400; line-height: 1.75; margin: 1rem 0; color: #374151; letter-spacing: -0.005em;">$1</p>')
    // Clean up empty paragraph tags
    .replace(/<p style="[^"]*"><\/p>/g, '')
    // Handle first paragraph styling (lead paragraph)
    .replace(/^<p style="([^"]*)"/, '<p style="$1 font-size: 1.25rem; font-weight: 400; color: #4b5563; line-height: 1.6;"')
} 