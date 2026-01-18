import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'union',
  title: 'Union / Marriage',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Union Title',
      type: 'string',
      description: 'E.g., "Sani & Halima Family"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'partners',
      title: 'Partners',
      description: 'Select the two parents in this union',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }],
      validation: (Rule) => Rule.min(2).max(2).unique(),
    }),
    defineField({
      name: 'children',
      title: 'Children',
      description: 'Children specific to this mother/father pair',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'person' } }],
    }),
    defineField({
      name: 'marriageDate',
      title: 'Date of Marriage',
      type: 'date',
    }),
    defineField({
      name: 'familyGallery',
      title: 'Family Group Photos',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      partner0: 'partners.0.fullName',
      partner1: 'partners.1.fullName',
    },
    prepare(selection) {
      const { title, partner0, partner1 } = selection
      return {
        title: title || `${partner0} & ${partner1}`,
        subtitle: 'Union',
      }
    },
  },
})