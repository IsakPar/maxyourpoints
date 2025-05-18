import { defineType, defineField } from 'sanity'

export const quoteBlock = defineType({
  name: 'quoteBlock',
  title: 'Quote Block',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string'
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string'
    })
  ],
  preview: {
    select: {
      title: 'quote',
      subtitle: 'author'
    }
  }
}) 