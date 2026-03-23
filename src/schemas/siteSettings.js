// Schema: Site Settings
// This controls global site content - logo, hero image, tagline
// You manage this from: Sanity Studio → Site Settings

export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'Noble Palate Society',
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      initialValue: 'The Art of Whiskey, Elevated',
    },
    {
      name: 'motto',
      title: 'Motto',
      type: 'string',
      initialValue: 'Sapientia Per Sensus',
    },
    {
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'The Art of Whiskey, Elevated',
    },
    {
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      initialValue: 'Expert reviews, curated tastings, and a community of connoisseurs dedicated to discovering the world\'s finest spirits.',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
}
