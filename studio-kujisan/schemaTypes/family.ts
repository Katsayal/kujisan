import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'family',
  title: 'Family Profile', // Represents a Household (e.g., "The Sani Nadede Family")
  type: 'document',
  fields: [
    defineField({
      name: 'familyName',
      title: 'Family Name',
      type: 'string',
      description: 'E.g. "The Sani Abubakar Family"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Page Slug',
      type: 'slug',
      options: {
        source: 'familyName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headOfFamily',
      title: 'Head of Family',
      description: 'Usually the father. The system will auto-fetch all his wives and children.',
      type: 'reference',
      to: [{ type: 'person' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'familyBio',
      title: 'Family Biography',
      description: 'The story of this nuclear family unit.',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'familyAudio',
      title: 'Family Audio Story',
      type: 'file',
      options: { accept: 'audio/*' },
    }),
    defineField({
      name: 'mainImage',
      title: 'Family Cover Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Family Gallery',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
  ],
  preview: {
    select: {
      title: 'familyName',
      subtitle: 'headOfFamily.fullName',
      media: 'mainImage',
    },
  },
})