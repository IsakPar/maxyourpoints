import { defineType, defineField } from 'sanity'

export const calloutBlock = defineType({
  name: 'calloutBlock',
  title: 'Callout Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Callout Title',
    }),
    defineField({
      name: 'body',
      type: 'text',
      title: 'Callout Content',
    }),
    defineField({
      name: 'style',
      type: 'string',
      title: 'Callout Type',
      options: {
        list: [
          { title: 'Tip', value: 'tip' },
          { title: 'Warning', value: 'warning' },
          { title: 'Note', value: 'note' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      style: 'style',
    },
    prepare({ title, style }) {
      return {
        title: `${style?.toUpperCase() || 'NOTE'}: ${title}`,
      }
    },
  },
})

export default calloutBlock 