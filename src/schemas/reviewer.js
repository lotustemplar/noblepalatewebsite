// Schema: Reviewer
// Pro reviewers and registered users
// Admin toggles isPro from Sanity Studio

export default {
  name: 'reviewer',
  title: 'Reviewer',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Display Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'avatar',
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'isPro',
      title: 'Pro Reviewer',
      type: 'boolean',
      initialValue: false,
      description: 'Toggle this ON to make this reviewer a PRO. Only admins should change this.',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'isPro',
      media: 'avatar',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? '⭐ PRO Reviewer' : 'Member',
        media,
      }
    },
  },
}
