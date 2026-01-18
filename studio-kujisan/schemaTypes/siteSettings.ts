import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings (Homepage)',
  type: 'document',
  fields: [
    // --- HERO SECTION ---
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      description: 'The main big text (e.g., KUJISAN)',
      initialValue: 'KUJISAN'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'string',
      description: 'The smaller text above/below (e.g., The Lineage of Sani Abubakar Nadede)',
    }),
    defineField({
      name: 'heroImage',
      title: 'Homepage Background Image',
      type: 'image',
      options: { hotspot: true },
      description: 'High quality family photo for the landing page background',
    }),

    // --- ABOUT / ORIGIN SECTION ---
    defineField({
      name: 'aboutTitle',
      title: 'About Section Title',
      type: 'string',
      initialValue: 'Who is Sani Abubakar Nadede?',
    }),
    defineField({
      name: 'aboutImage',
      title: 'Patriarch Portrait',
      type: 'image',
      options: { hotspot: true },
      description: 'The vintage photo of the root ancestor',
    }),
    defineField({
      name: 'aboutContent',
      title: 'About Content',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The history and mission statement.',
    }),

    // --- STATISTICS SECTION (Manual Override) ---
    defineField({
      name: 'stats',
      title: 'Live Statistics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', type: 'string', title: 'Label (e.g., Living Members)' },
            { name: 'value', type: 'string', title: 'Value (e.g., 150+)' },
          ]
        }
      ]
    }),
  ],
})