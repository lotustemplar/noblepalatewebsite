// Schema: Review
// Individual whiskey review with the NPS scoring system
// Aroma (15) + Palate (45) + Finish (20) + Style (10) + Value (10) = 100

export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'whiskey',
      title: 'Whiskey',
      type: 'reference',
      to: [{ type: 'whiskey' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'reviewer',
      title: 'Reviewer',
      type: 'reference',
      to: [{ type: 'reviewer' }],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'aroma',
      title: 'Aroma (max 15)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(15),
    },
    {
      name: 'palate',
      title: 'Palate (max 45)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(45),
    },
    {
      name: 'finish',
      title: 'Finish (max 20)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(20),
    },
    {
      name: 'style',
      title: 'Style / Uniqueness (max 10)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
    },
    {
      name: 'value',
      title: 'Value (max 10)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(10),
    },
    {
      name: 'notes',
      title: 'Tasting Notes',
      type: 'text',
      rows: 4,
    },
  ],
  preview: {
    select: {
      whiskeyName: 'whiskey.name',
      reviewerName: 'reviewer.name',
      aroma: 'aroma',
      palate: 'palate',
      finish: 'finish',
      style: 'style',
      value: 'value',
    },
    prepare({ whiskeyName, reviewerName, aroma, palate, finish, style, value }) {
      const total = (aroma || 0) + (palate || 0) + (finish || 0) + (style || 0) + (value || 0)
      return {
        title: `${whiskeyName || 'Unknown'} — ${total}/100`,
        subtitle: `by ${reviewerName || 'Unknown'}`,
      }
    },
  },
}
