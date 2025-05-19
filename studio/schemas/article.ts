import {defineField, defineType} from 'sanity'
import { calloutBlock } from './calloutBlock'
import { Tabs } from 'sanity-plugin-tabs'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
  fields: [
    Tabs({
      name: 'editorTabs',
      tabs: [
        {
          id: 'content',
          title: 'Content',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text',
              validation: (Rule) => Rule.required().max(200),
            }),
            defineField({
              name: 'category',
              title: 'Category',
              type: 'reference',
              to: [{type: 'category'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subCategories',
              title: 'Sub Categories',
              type: 'array',
              of: [{ 
                type: 'reference',
                to: [{ type: 'subcategory' }],
                options: {
                  filter: ({ document }) => {
                    return {
                      filter: 'category._ref == $categoryId',
                      params: {
                        categoryId: document?.category?._ref
                      }
                    }
                  }
                }
              }],
              validation: (Rule) => Rule.max(4),
              options: {
                layout: 'grid'
              }
            }),
            defineField({
              name: 'heroImage',
              title: 'Hero Image',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alternative Text',
                  validation: (Rule) => Rule.required(),
                },
              ],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [
                {
                  type: 'block',
                  marks: {
                    annotations: [
                      {
                        name: 'link',
                        type: 'object',
                        title: 'External Link',
                        fields: [
                          {
                            name: 'href',
                            type: 'url',
                            title: 'URL',
                            validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto'] }),
                          },
                          {
                            name: 'openInNewTab',
                            type: 'boolean',
                            title: 'Open in new tab',
                            initialValue: false,
                          },
                        ],
                      },
                    ],
                  },
                },
                {
                  type: 'image',
                  fields: [
                    {
                      name: 'alt',
                      type: 'string',
                      title: 'Alternative Text',
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                },
                {
                  type: 'object',
                  name: 'quoteBlock',
                  title: 'Quote Block',
                  fields: [
                    {
                      name: 'quote',
                      type: 'text',
                      title: 'Quote',
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: 'author',
                      type: 'string',
                      title: 'Author',
                    },
                    {
                      name: 'source',
                      type: 'string',
                      title: 'Source',
                    },
                  ],
                },
                { type: 'calloutBlock' },
              ],
            }),
          ],
        },
        {
          id: 'seo',
          title: 'SEO & Metadata',
          fields: [
            defineField({
              name: 'seoMetaDescription',
              title: 'SEO Meta Description',
              type: 'text',
              validation: (Rule) => Rule.required().min(50).max(160),
            }),
            defineField({
              name: 'focusKeyword',
              title: 'Focus Keyword',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'seoScore',
              title: 'SEO Score',
              type: 'number',
              readOnly: true
            }),
          ],
        },
        {
          id: 'linking',
          title: 'Tags & Internal Links',
          fields: [
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
              name: 'relatedArticles',
              title: 'Related Articles',
              description: 'Displayed at the end of the article as suggestions for further reading.',
              type: 'array',
              of: [{ 
                type: 'reference', 
                to: [{ type: 'article' }],
                options: {
                  filter: '_id != $id',
                  filterParams: { id: '^._id' }
                }
              }],
              validation: (Rule) => Rule.max(5),
              options: {
                layout: 'grid'
              }
            }),
          ],
        },
        {
          id: 'settings',
          title: 'Document Settings',
          fields: [
            defineField({
              name: 'slug',
              title: 'Slug',
              type: 'slug',
              options: {
                source: 'title',
                maxLength: 96,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'publishedAt',
              title: 'Published At',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'isFeatured',
              title: 'Featured Article',
              type: 'boolean',
              initialValue: false,
            }),
          ],
        },
      ],
    }),
  ],
}) 