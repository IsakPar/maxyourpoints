import { defineField, defineType } from 'sanity'
import { SeoScorePanel } from '../components/SeoScorePanel'

const subcategoriesByCategory: Record<string, string[]> = {
  "airlines-aviation": ["Reviews", "News", "Deals", "Guides"],
  "credit-cards-points": ["Reviews", "News", "Deals", "Guides"],
  "hotels-trip-reports": ["Reviews", "News", "Deals", "Trip Reports"],
  "travel-hacks-deals": ["News", "Deals", "Guides"]
}

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      validation: Rule => Rule.required().max(200)
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: Rule => Rule.required()
        }
      ]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subcategory',
      type: 'string',
      title: 'Subcategory',
      options: {
        list: [
          { title: 'Reviews', value: 'Reviews' },
          { title: 'News', value: 'News' },
          { title: 'Deals', value: 'Deals' },
          { title: 'Guides', value: 'Guides' },
          { title: 'Trip Reports', value: 'Trip Reports' }
        ]
      },
      hidden: ({ document }) => !document?.category,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'seoMetaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      validation: Rule => Rule.required().min(50).max(160)
    }),
    defineField({
      name: 'seoScore',
      title: 'SEO Score',
      type: 'number',
      readOnly: true,
      components: {
        input: SeoScorePanel
      }
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'quoteBlock',
          title: 'Quote'
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Article',
      type: 'boolean',
      initialValue: false
    })
  ]
}) 