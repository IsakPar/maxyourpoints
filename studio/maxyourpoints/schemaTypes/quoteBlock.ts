export default {
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string'
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string'
    }
  ]
} 