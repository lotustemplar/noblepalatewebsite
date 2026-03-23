import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'pendingReview',
  title: 'Pending Review',
  type: 'document',
  fields: [
    defineField({name: 'whiskey', title: 'Whiskey', type: 'reference', to: [{type: 'whiskey'}], validation: r => r.required()}),
    defineField({name: 'reviewerName', title: 'Reviewer Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'reviewerEmail', title: 'Reviewer Email', type: 'string'}),
    defineField({name: 'aroma', title: 'Aroma (max 15)', type: 'number', validation: r => r.required().min(0).max(15)}),
    defineField({name: 'palate', title: 'Palate (max 45)', type: 'number', validation: r => r.required().min(0).max(45)}),
    defineField({name: 'finish', title: 'Finish (max 20)', type: 'number', validation: r => r.required().min(0).max(20)}),
    defineField({name: 'style', title: 'Style / Uniqueness (max 10)', type: 'number', validation: r => r.required().min(0).max(10)}),
    defineField({name: 'value', title: 'Value (max 10)', type: 'number', validation: r => r.required().min(0).max(10)}),
    defineField({name: 'notes', title: 'Tasting Notes', type: 'text', rows: 4}),
    defineField({name: 'approved', title: 'Approved', type: 'boolean', initialValue: false, description: 'Toggle ON to approve this review and show it on the site.'}),
    defineField({name: 'submittedAt', title: 'Submitted At', type: 'datetime'}),
  ],
  preview: {
    select: {w: 'whiskey.name', name: 'reviewerName', approved: 'approved', aroma: 'aroma', palate: 'palate', finish: 'finish', style: 'style', value: 'value'},
    prepare({w, name, approved, aroma, palate, finish, style, value}) {
      const t = (aroma||0)+(palate||0)+(finish||0)+(style||0)+(value||0)
      return {title: `${approved ? '✅' : '⏳'} ${w||'?'} — ${t}/100`, subtitle: `by ${name||'?'}`}
    },
  },
})
