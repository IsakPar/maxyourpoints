import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useFormValue } from 'sanity'
import { PortableTextBlock, PortableTextSpan } from '@portabletext/types'
import { NumberInputProps, set } from 'sanity'

interface SeoCheck {
  name: string
  points: number
  check: () => boolean
  description: string
}

interface LinkMark {
  _type: 'link'
  _key: string
  href: string
}

export function SeoScorePanel(props: NumberInputProps) {
  const { value = 0, onChange } = props
  const [score, setScore] = useState(0)
  const [checks, setChecks] = useState<Array<SeoCheck & { passed: boolean }>>([])

  // Get form values
  const title = useFormValue(['title']) as string
  const slug = useFormValue(['slug']) as { current: string }
  const focusKeyword = useFormValue(['focusKeyword']) as string
  const tags = useFormValue(['tags']) as string[]
  const coverImage = useFormValue(['coverImage']) as { alt: string }
  const seoMetaDescription = useFormValue(['seoMetaDescription']) as string
  const content = useFormValue(['content']) as PortableTextBlock[]

  useEffect(() => {
    if (!focusKeyword) {
      setScore(0)
      setChecks([])
      onChange(set(0))
      return
    }

    const wordCount = content
      ? content
          .filter((block) => block._type === 'block')
          .reduce((count, block) => {
            const text = block.children
              ?.map((child) => (child as PortableTextSpan).text)
              .join(' ')
            return count + (text?.split(/\s+/).length || 0)
          }, 0)
      : 0

    const hasOutboundLink = content?.some((block) => {
      if (block._type !== 'block') return false
      return block.children?.some((child) => {
        if (!child.marks) return false
        return child.marks.some((mark: string) => {
          const link = block.markDefs?.find((def) => def._key === mark) as unknown as LinkMark
          return link?._type === 'link' && !link.href.includes('maxyourpoints.com')
        })
      })
    })

    const hasInternalLink = content?.some((block) => {
      if (block._type !== 'block') return false
      return block.children?.some((child) => {
        if (!child.marks) return false
        return child.marks.some((mark: string) => {
          const link = block.markDefs?.find((def) => def._key === mark) as unknown as LinkMark
          return link?._type === 'link' && link.href.startsWith('/blog/')
        })
      })
    })

    const hasSubheading = content?.some(
      (block) =>
        block._type === 'block' &&
        block.style === 'h2' &&
        block.children?.some((child) =>
          (child as PortableTextSpan).text.toLowerCase().includes(focusKeyword.toLowerCase())
        )
    )

    const seoChecks: SeoCheck[] = [
      {
        name: 'Title',
        points: 15,
        check: () => title?.toLowerCase().includes(focusKeyword.toLowerCase()),
        description: 'Focus keyword in title'
      },
      {
        name: 'Slug',
        points: 10,
        check: () => slug?.current.toLowerCase().includes(focusKeyword.toLowerCase()),
        description: 'Focus keyword in URL'
      },
      {
        name: 'Tags',
        points: 10,
        check: () => tags?.some((tag) => tag.toLowerCase() === focusKeyword.toLowerCase()),
        description: 'Focus keyword matches a tag'
      },
      {
        name: 'Alt Text',
        points: 15,
        check: () => coverImage?.alt?.toLowerCase().includes(focusKeyword.toLowerCase()),
        description: 'Focus keyword in image alt text'
      },
      {
        name: 'Meta Description',
        points: 10,
        check: () => seoMetaDescription?.toLowerCase().includes(focusKeyword.toLowerCase()),
        description: 'Focus keyword in meta description'
      },
      {
        name: 'Subheading',
        points: 10,
        check: () => hasSubheading,
        description: 'Focus keyword in subheading'
      },
      {
        name: 'Outbound Links',
        points: 10,
        check: () => hasOutboundLink,
        description: 'Contains outbound links'
      },
      {
        name: 'Internal Links',
        points: 10,
        check: () => hasInternalLink,
        description: 'Contains internal links'
      },
      {
        name: 'Word Count',
        points: 10,
        check: () => wordCount > 750,
        description: 'Content is over 750 words'
      }
    ]

    const checksWithResults = seoChecks.map((check) => ({
      ...check,
      passed: check.check()
    }))

    const totalScore = checksWithResults.reduce(
      (sum, check) => sum + (check.passed ? check.points : 0),
      0
    )

    setChecks(checksWithResults)
    setScore(totalScore)
    onChange(set(totalScore))
  }, [
    title,
    slug,
    focusKeyword,
    tags,
    coverImage,
    seoMetaDescription,
    content,
    onChange
  ])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green'
    if (score >= 60) return 'yellow'
    return 'red'
  }

  return (
    <Card padding={3} radius={2} tone="primary">
      <Stack space={3}>
        <Flex align="center" justify="space-between">
          <Text size={2} weight="semibold">
            SEO Score: {score}/100
          </Text>
          <Text size={1} style={{ color: getScoreColor(score) }}>
            {score >= 80
              ? 'Excellent!'
              : score >= 60
              ? 'Good'
              : 'Needs Improvement'}
          </Text>
        </Flex>

        <Box
          style={{
            height: '4px',
            backgroundColor: '#eee',
            borderRadius: '2px',
            overflow: 'hidden'
          }}
        >
          <Box
            style={{
              width: `${score}%`,
              height: '100%',
              backgroundColor: getScoreColor(score),
              transition: 'width 0.3s ease'
            }}
          />
        </Box>

        <Stack space={2}>
          {checks.map((check) => (
            <Flex key={check.name} align="center" gap={2}>
              <Text size={1} style={{ color: check.passed ? 'green' : 'red' }}>
                {check.passed ? '✓' : '×'}
              </Text>
              <Text size={1}>
                {check.name} ({check.points} pts) - {check.description}
              </Text>
            </Flex>
          ))}
        </Stack>
      </Stack>
    </Card>
  )
} 