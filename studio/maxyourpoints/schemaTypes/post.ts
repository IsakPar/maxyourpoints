import { defineType, defineField } from 'sanity'
import { SeoScorePanel } from '../components/SeoScorePanel'
import { PreviewPost } from '../components/PreviewPost'
import { PreviewCategory } from '../components/PreviewCategory'

interface SanityDocument {
  category?: {
    _ref: string
  }
}

const subcategoriesByCategory: Record<string, string[]> = {
  'airlines-aviation': ['Reviews', 'News', 'Deals', 'Guides'],
  'credit-cards-points': ['Reviews', 'News', 'Deals', 'Guides'],
  'hotels-trip-reports': ['Reviews', 'News', 'Deals', 'Trip Reports'],
  'travel-hacks-deals': ['News', 'Deals', 'Guides']
}

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.'
        }
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'reference',
      to: [{ type: 'subcategory' }],
      options: {
        filter: 'category._ref == $categoryId'
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      description: 'The main keyword you want to rank for'
    }),
    defineField({
      name: 'seoMetaDescription',
      title: 'SEO Meta Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of the post for search engines'
    }),
    defineField({
      name: 'seoScore',
      title: 'SEO Score',
      type: 'number',
      components: {
        input: SeoScorePanel
      },
      readOnly: true
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Post',
      type: 'boolean',
      description: 'Whether this post should be featured on the homepage',
      initialValue: false
    })
  ],

  preview: {
    select: {
      title: 'title',
      summary: 'summary',
      coverImage: 'coverImage',
      category: 'category.title',
      subcategory: 'subcategory.title',
      tags: 'tags'
    },
    prepare(selection) {
      const { title, summary, coverImage, category, subcategory, tags } = selection
      return {
        title,
        subtitle: `${category} > ${subcategory}`,
        media: coverImage
      }
    }
  }
}) 