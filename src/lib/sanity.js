import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: 'utqvc7uf',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-03-22',
})

// Write client for submitting audience reviews
const writeToken = typeof import.meta !== 'undefined' ? import.meta.env.VITE_SANITY_WRITE_TOKEN : null;
export const writeClient = writeToken ? createClient({
  projectId: 'utqvc7uf',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-03-22',
  token: writeToken,
}) : null;

const builder = imageUrlBuilder(client)

export function urlFor(source) {
  if (!source) return null
  return builder.image(source)
}

// ─── GROQ Queries ───

export const QUERIES = {
  // Site settings (logo, hero image, site name)
  siteSettings: `*[_type == "siteSettings"][0]{
    siteName,
    tagline,
    motto,
    logo,
    heroImage,
    heroTitle,
    heroSubtitle
  }`,

  // All whiskeys
  allWhiskeys: `*[_type == "whiskey"] | order(name asc) {
    _id,
    name,
    slug,
    type,
    region,
    abv,
    price,
    description,
    image,
    "proReviews": *[_type == "review" && whiskey._ref == ^._id && reviewer->isPro == true]{
      _id,
      aroma,
      palate,
      finish,
      style,
      value,
      notes,
      _createdAt,
      "reviewerName": reviewer->name,
      "reviewerAvatar": reviewer->avatar,
      "reviewerSlug": reviewer->slug
    },
    "audienceReviews": *[_type == "review" && whiskey._ref == ^._id && reviewer->isPro != true]{
      _id, aroma, palate, finish, style, value, notes, _createdAt, "reviewerName": reviewer->name
    } + *[_type == "pendingReview" && whiskey._ref == ^._id && approved == true]{
      _id, aroma, palate, finish, style, value, notes, "reviewerName": reviewerName, "_createdAt": submittedAt
    }
  }`,

  // Single whiskey by slug
  whiskeyBySlug: `*[_type == "whiskey" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    type,
    region,
    abv,
    price,
    description,
    image,
    "proReviews": *[_type == "review" && whiskey._ref == ^._id && reviewer->isPro == true]{
      _id,
      aroma,
      palate,
      finish,
      style,
      value,
      notes,
      _createdAt,
      "reviewerName": reviewer->name,
      "reviewerAvatar": reviewer->avatar
    },
    "audienceReviews": *[_type == "review" && whiskey._ref == ^._id && reviewer->isPro != true]{
      _id, aroma, palate, finish, style, value, notes, _createdAt, "reviewerName": reviewer->name
    } + *[_type == "pendingReview" && whiskey._ref == ^._id && approved == true]{
      _id, aroma, palate, finish, style, value, notes, "reviewerName": reviewerName, "_createdAt": submittedAt
    }
  }`,

  // All blog posts
  allBlogPosts: `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    publishedAt,
    "authorName": author->name,
    "authorAvatar": author->avatar,
    "authorIsPro": author->isPro,
    "whiskeyName": featuredWhiskey->name,
    "whiskeySlug": featuredWhiskey->slug
  }`,

  // Single blog post by slug
  blogPostBySlug: `*[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    heroImage,
    body,
    publishedAt,
    "authorName": author->name,
    "authorAvatar": author->avatar,
    "authorIsPro": author->isPro,
    "featuredWhiskey": featuredWhiskey->{
      _id,
      name,
      slug,
      type,
      region,
      image,
      "proScore": math::avg(*[_type == "review" && whiskey._ref == ^._id && reviewer->isPro == true]{
        "total": aroma + palate + finish + style + value
      }.total)
    }
  }`,

  // Pro reviewers
  proReviewers: `*[_type == "reviewer" && isPro == true] | order(name asc) {
    _id,
    name,
    slug,
    avatar,
    bio,
    "reviewCount": count(*[_type == "review" && reviewer._ref == ^._id])
  }`,
}

// Helper to fetch data
export async function fetchSanity(query, params = {}) {
  try {
    const data = await client.fetch(query, params)
    return data
  } catch (err) {
    console.error('Sanity fetch error:', err)
    return null
  }
}

// Score helpers
export function calcAvgScore(reviews) {
  if (!reviews || reviews.length === 0) return null
  const total = reviews.reduce((sum, r) => sum + r.aroma + r.palate + r.finish + r.style + r.value, 0)
  return Math.round((total / reviews.length) * 10) / 10
}

export function scoreColor(s) {
  if (!s) return '#5a5550'
  return s >= 90 ? '#c9a84c' : s >= 80 ? '#8fbc6a' : s >= 70 ? '#7b68c4' : s >= 60 ? '#cf8f5b' : '#cf5b5b'
}

export function scoreLabel(s) {
  if (!s) return 'Not Reviewed'
  return s >= 95 ? 'Masterpiece' : s >= 90 ? 'Exceptional' : s >= 85 ? 'Excellent' : s >= 80 ? 'Very Good' : s >= 75 ? 'Good' : s >= 70 ? 'Above Average' : 'Average'
}

// Submit an audience review (pending approval)
export async function submitAudienceReview({ whiskeyId, name, email, aroma, palate, finish, style, value, notes }) {
  if (!writeClient) {
    console.error('Write client not configured')
    return { success: false, error: 'Review submission is not available right now.' }
  }
  try {
    await writeClient.create({
      _type: 'pendingReview',
      whiskey: { _type: 'reference', _ref: whiskeyId },
      reviewerName: name,
      reviewerEmail: email,
      aroma,
      palate,
      finish,
      style,
      value,
      notes,
      approved: false,
      submittedAt: new Date().toISOString(),
    })
    return { success: true }
  } catch (err) {
    console.error('Submit review error:', err)
    return { success: false, error: 'Failed to submit review. Please try again.' }
  }
}
