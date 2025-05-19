import { defineType, defineField } from 'sanity'
import { EyeOpenIcon } from '@sanity/icons'
import { Iframe } from 'sanity-plugin-iframe-pane'

const previewUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const previewSecret = process.env.SANITY_PREVIEW_SECRET || 'my-super-secret-token'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    })
  ],
  preview: {
    select: {
      title: 'title'
    }
  },
  // @ts-expect-error Sanity Studio custom document views
  views: [
    {
      name: 'preview',
      title: 'Category Preview',
      icon: EyeOpenIcon,
      type: 'component',
      component: Iframe,
      options: {
        url: (doc) => `${previewUrl}/api/preview?type=category&slug=${doc.slug?.current}&secret=${previewSecret}`
      }
    }
  ]
}) 