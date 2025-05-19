'use client'

import { useFormValue } from 'sanity'
import React, { useMemo } from 'react'

const SeoScorePanel = () => {
  const title = useFormValue(['title']) as string
  const slug = useFormValue(['slug', 'current']) as string
  const meta = useFormValue(['seoMetaDescription']) as string
  const keyword = useFormValue(['focusKeyword']) as string
  const blocks = useFormValue(['content']) as any[]

  const scoreDetails = useMemo(() => {
    if (!keyword) return { score: 0, checks: [] }

    const checks = []

    // 1. Focus keyword in title
    checks.push({
      label: 'Focus keyword in SEO title',
      pass: title?.toLowerCase().includes(keyword.toLowerCase()) || false,
      weight: 15
    })

    // 2. Focus keyword in meta description
    checks.push({
      label: 'Focus keyword in meta description',
      pass: meta?.toLowerCase().includes(keyword.toLowerCase()) || false,
      weight: 10
    })

    // 3. Focus keyword in slug
    checks.push({
      label: 'Focus keyword in slug',
      pass: slug?.toLowerCase().includes(keyword.toLowerCase()) || false,
      weight: 5
    })

    // 4. Focus keyword in first paragraph
    const firstBlockText = blocks?.find(b => b._type === 'block')?.children?.map((c: any) => c.text).join(' ') || ''
    checks.push({
      label: 'Focus keyword in first paragraph',
      pass: firstBlockText.toLowerCase().includes(keyword.toLowerCase()),
      weight: 10
    })

    // 5. Focus keyword in body
    const allText = blocks?.filter(b => b._type === 'block')?.map((block: any) =>
      block.children?.map((c: any) => c.text).join(' ')
    ).join(' ') || ''
    const keywordMatches = allText.toLowerCase().match(new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'g')) || []
    const wordCount = allText.split(/\s+/).length
    const density = wordCount > 0 ? (keywordMatches.length / wordCount) * 100 : 0

    checks.push({
      label: 'Focus keyword in body content',
      pass: keywordMatches.length > 0,
      weight: 10
    })

    // 6. Title length
    checks.push({
      label: 'SEO title length (50–60 chars)',
      pass: title?.length >= 50 && title.length <= 60,
      weight: 5
    })

    // 7. Focus keyword in H2/H3
    const hasKeywordInHeading = blocks?.some(b =>
      b._type === 'block' && ['h2', 'h3'].includes(b.style) &&
      b.children?.some((c: any) => c.text.toLowerCase().includes(keyword.toLowerCase()))
    )
    checks.push({
      label: 'Focus keyword in H2 or H3 subheading',
      pass: !!hasKeywordInHeading,
      weight: 5
    })

    // 8. Image with alt text containing keyword
    const imgWithKeywordAlt = blocks?.some(b =>
      b._type === 'image' && b.alt?.toLowerCase().includes(keyword.toLowerCase())
    )
    checks.push({
      label: 'Image with focus keyword in alt text',
      pass: !!imgWithKeywordAlt,
      weight: 10
    })

    // 9. Outbound link (to external domain)
    const outboundLink = allText.includes('http') && allText.includes('.com')
    checks.push({
      label: 'Outbound link to external resource',
      pass: outboundLink,
      weight: 5
    })

    // 10. Internal link (your own domain or relative URL)
    const internalLink = allText.includes('/blog') || allText.includes('maxyourpoints.com')
    checks.push({
      label: 'Internal link to another article',
      pass: internalLink,
      weight: 5
    })

    // 11. Readability: paragraph length + headings
    const usesHeadings = blocks?.some(b => ['h2', 'h3'].includes(b.style))
    const paragraphs = blocks?.filter(b => b._type === 'block')
    const shortParas = paragraphs?.filter(p => p.children?.map((c: any) => c.text).join(' ').length < 300)
    checks.push({
      label: 'Readability (short paragraphs & subheadings)',
      pass: usesHeadings && shortParas.length >= 2,
      weight: 10
    })

    // 12. Keyword density (1–2%)
    checks.push({
      label: 'Keyword density (1–2%)',
      pass: density >= 1 && density <= 2,
      weight: 10
    })

    // 13. Power word or number in title
    const hasPower = /\b(best|top|fast|ultimate|guide|\d+)\b/i.test(title)
    checks.push({
      label: 'Title readability (power word or number)',
      pass: hasPower,
      weight: 5
    })

    // Calculate total score
    const score = checks.reduce((acc, check) => acc + (check.pass ? check.weight : 0), 0)
    return { score, checks }
  }, [title, slug, meta, keyword, blocks])

  return (
    <div style={{ border: '1px solid #ddd', padding: 16, marginTop: 24, borderRadius: 8 }}>
      <h4>📈 SEO Score: {scoreDetails.score}/100</h4>
      <ul style={{ marginTop: 12 }}>
        {scoreDetails.checks.map((check, i) => (
          <li key={i} style={{ marginBottom: 4, color: check.pass ? 'green' : 'orange' }}>
            {check.pass ? '✅' : '⚠️'} {check.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SeoScorePanel 