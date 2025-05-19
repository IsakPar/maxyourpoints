import { Card, Stack, Text } from '@sanity/ui'
import { PreviewProps } from 'sanity'

export function PreviewCategory(props: PreviewProps) {
  const { document } = props
  const { title, description, coverImage } = document.displayed

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Text size={4} weight="semibold">
          {title}
        </Text>
        {description && (
          <Text size={2} muted>
            {description}
          </Text>
        )}
        {coverImage && (
          <img
            src={coverImage.url}
            alt={coverImage.alt || ''}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </Stack>
    </Card>
  )
} 