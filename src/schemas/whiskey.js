// Schema: Whiskey
// Each whiskey in your database is one of these documents
// You manage this from: Sanity Studio → Whiskeys

export default {
  name: 'whiskey',
  title: 'Whiskey',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Bottle Image',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          'Bourbon',
          'Single Malt Scotch',
          'Blended Scotch',
          'Single Pot Still',
          'Irish Whiskey',
          'Japanese Whisky',
          'Rye',
          'Canadian Whisky',
          'Tennessee Whiskey',
          'Other',
        ],
      },
    },
    {
      name: 'region',
      title: 'Region',
      type: 'string',
    },
    {
      name: 'abv',
      title: 'ABV',
      type: 'string',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'type',
      media: 'image',
    },
  },
}
