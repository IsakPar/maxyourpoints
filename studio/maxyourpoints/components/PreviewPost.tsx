import { Card, Stack, Text } from '@sanity/ui'
import { DocumentPreviewProps } from 'sanity'

export function PreviewPost(props: DocumentPreviewProps) {
  const { document } = props
  const { title, summary, coverImage, category, subcategory, tags } = document.displayed

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={4} weight="semibold">
          {title}
        </Text>
        {summary && (
          <Text size={2} muted>
            {summary}
          </Text>
        )}
        {coverImage && (
          <img
            src={coverImage.url}
            alt={coverImage.alt || ''}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
        <Stack space={2}>
          {category && (
            <Text size={1}>
              Category: {category.title}
            </Text>
          )}
          {subcategory && (
            <Text size={1}>
              Subcategory: {subcategory}
            </Text>
          )}
          {tags && tags.length > 0 && (
            <Text size={1}>
              Tags: {tags.join(', ')}
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  )
} 