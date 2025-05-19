import { Card, Stack, Text, Button, Box, Flex, Inline, Spinner, Grid } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import { format } from 'date-fns'

export default function DashboardPanel() {
  const client = useClient({ apiVersion: '2023-01-01' })
  const [posts, setPosts] = useState<any[]>([])
  const [seoAverage, setSeoAverage] = useState<number | null>(null)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [topKeywords, setTopKeywords] = useState<Array<{keyword: string, count: number}>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch recent posts with all required fields
        const results = await client.fetch(`
          *[_type == "post"]{
            _id,
            title,
            slug,
            seoScore,
            publishedAt,
            focusKeyword,
            category->{title}
          }
        `)

        // Get latest 5 posts
        const latest = [...results]
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 5)
        setPosts(latest)

        // Calculate category counts
        const categorySummary: Record<string, number> = {}
        results.forEach(post => {
          if (post.category?.title) {
            categorySummary[post.category.title] = (categorySummary[post.category.title] || 0) + 1
          }
        })
        setCategoryCounts(categorySummary)

        // Calculate keyword frequency
        const keywordCount: Record<string, number> = {}
        results.forEach(post => {
          if (post.focusKeyword) {
            keywordCount[post.focusKeyword] = (keywordCount[post.focusKeyword] || 0) + 1
          }
        })
        const sortedKeywords = Object.entries(keywordCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([keyword, count]) => ({ keyword, count }))
        setTopKeywords(sortedKeywords)

        // Calculate average SEO score
        const validScores = results.map(r => r.seoScore || 0)
        const avg = validScores.reduce((acc, val) => acc + val, 0) / validScores.length
        setSeoAverage(Math.round(avg))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <Card padding={5} radius={3} shadow={1} style={{ maxWidth: 900, margin: '2rem auto' }}>
      <Stack space={5}>
        <Box>
          <Text size={4} weight="bold">Welcome to MaxYourPoints Studio</Text>
          <Text muted size={2}>Content overview and performance metrics</Text>
        </Box>

        {loading ? (
          <Flex align="center" justify="center" padding={4}>
            <Spinner muted />
          </Flex>
        ) : (
          <>
            <Grid columns={[1, 1, 2]} gap={4}>
              <Card padding={4} radius={2} shadow={1}>
                <Stack space={3}>
                  <Text size={3} weight="semibold">📝 Recent Articles</Text>
                  {posts.map(post => (
                    <Flex key={post._id} align="center" justify="space-between">
                      <Text>{post.title}</Text>
                      <Button
                        text="Edit"
                        tone="primary"
                        onClick={() => window.location.href = `/desk/post;${post._id}`}
                      />
                    </Flex>
                  ))}
                </Stack>
              </Card>

              <Card padding={4} radius={2} shadow={1}>
                <Stack space={3}>
                  <Text size={3} weight="semibold">📊 Content Overview</Text>
                  <Box>
                    <Text size={2} weight="medium">Category Distribution</Text>
                    <Stack space={2}>
                      {Object.entries(categoryCounts).map(([cat, count]) => (
                        <Flex key={cat} justify="space-between">
                          <Text>{cat}</Text>
                          <Text>{count} posts</Text>
                        </Flex>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Card>

              <Card padding={4} radius={2} shadow={1}>
                <Stack space={3}>
                  <Text size={3} weight="semibold">🔍 Top Focus Keywords</Text>
                  <Stack space={2}>
                    {topKeywords.map(({ keyword, count }) => (
                      <Flex key={keyword} justify="space-between">
                        <Text>#{keyword}</Text>
                        <Text muted>{count} posts</Text>
                      </Flex>
                    ))}
                  </Stack>
                </Stack>
              </Card>

              <Card padding={4} radius={2} shadow={1}>
                <Stack space={3}>
                  <Text size={3} weight="semibold">📈 SEO Performance</Text>
                  <Box>
                    <Text size={2} weight="medium">Average SEO Score</Text>
                    <Text size={4} weight="bold">{seoAverage}/100</Text>
                  </Box>
                </Stack>
              </Card>
            </Grid>

            <Box>
              <Text size={3} weight="semibold">⚙️ Quick Actions</Text>
              <Inline space={3}>
                <Button text="Create New Post" tone="positive" onClick={() => window.location.href = '/desk/post'} />
                <Button text="View All Posts" tone="default" onClick={() => window.location.href = '/desk/post;'} />
              </Inline>
            </Box>
          </>
        )}
      </Stack>
    </Card>
  )
} 