import { defineType, defineField } from 'sanity'

interface SubcategoryDocument {
  category?: {
    _ref: string
  }
  title?: string
}

export default defineType({
  name: 'subcategory',
  title: 'Subcategory',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Subcategory Name',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc, context) => {
          const parent = context.parent as SubcategoryDocument
          const parentRef = parent?.category?._ref || ''
          const categorySlug = parentRef.replace('category-', '')
          return `${categorySlug}-${parent?.title || ''}`
        },
        slugify: input =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .slice(0, 96)
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Parent Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title'
    }
  }
}) 