import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'fullName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isDescendant',
      title: 'Is Direct Descendant?',
      description: 'Turn ON for blood relatives (Sani, children, grandchildren). Turn OFF for spouses/in-laws.',
      type: 'boolean',
      initialValue: true, 
      options: {
        layout: 'checkbox'
      }
    }),
    defineField({
      name: 'generation',
      title: 'Generation Level',
      description: '1 = Sani/Wives, 2 = Children/Spouses, 3 = Grandchildren, 4 = Great-Grandchildren',
      type: 'number',
      initialValue: 3,
      validation: (Rule) => Rule.required().min(1).integer(),
    }),
    defineField({
      name: 'sex',
      title: 'Sex',
      type: 'string',
      options: {
        list: [
          { title: 'Male', value: 'male' },
          { title: 'Female', value: 'female' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'profileImage',
      title: 'Primary Profile Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Image Gallery',
      description: 'Additional photos for the gallery slider',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    
    // --- UPDATED AUDIO FIELD (Multiple) ---
    defineField({
      name: 'audioGallery',
      title: 'Audio Narrations',
      description: 'Upload multiple audio clips (e.g., Biography, Interviews)',
      type: 'array',
      of: [
        {
          type: 'file',
          options: { accept: 'audio/*' },
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Label',
              description: 'e.g., "Life Story" or "2024 Interview"',
              validation: (Rule) => Rule.required()
            }
          ]
        }
      ]
    }),

    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'birthDate',
      title: 'Date of Birth',
      type: 'date',
    }),
    defineField({
      name: 'isDeceased',
      title: 'Is Deceased?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'deathDate',
      title: 'Date of Death',
      type: 'date',
      hidden: ({ document }) => !document?.isDeceased,
    }),
  ],
  preview: {
    select: {
      title: 'fullName',
      media: 'profileImage',
      gen: 'generation',
      descendant: 'isDescendant'
    },
    prepare(selection) {
      const { title, media, gen, descendant } = selection
      const genLabel = gen ? `Gen ${gen}` : ''
      const typeLabel = descendant ? 'Blood' : 'In-Law'
      return {
        title: title,
        subtitle: `${genLabel} • ${typeLabel}`,
        media: media,
      }
    },
  },
})