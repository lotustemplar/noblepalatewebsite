import { next } from '@vercel/edge';

const SANITY_PROJECT = 'utqvc7uf';
const SANITY_DATASET = 'production';
const API_VERSION = '2026-03-22';

const CRAWLERS = /facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot|pinterest|imessage|iframely|embedly/i;

function sanityImageUrl(ref) {
  if (!ref) return null;
  // Convert sanity image ref to URL: image-abc123-800x600-jpg → abc123-800x600.jpg
  const parts = ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT}/${SANITY_DATASET}/${id}.${ext}?w=1200&h=630&fit=crop`;
}

async function fetchFromSanity(query, params = {}) {
  let url = `https://${SANITY_PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  for (const [key, val] of Object.entries(params)) {
    url += `&$${key}="${encodeURIComponent(val)}"`;
  }
  const res = await fetch(url);
  const data = await res.json();
  return data.result;
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const path = url.pathname;

  // Only intercept for social media crawlers
  if (!CRAWLERS.test(ua)) {
    return next();
  }

  let title = 'Noble Palate Society';
  let description = 'Chasing Perfection, One Pour at a Time. Expert whiskey reviews and curated tastings.';
  let image = null;
  let pageUrl = url.href;

  try {
    if (path.startsWith('/whiskey/')) {
      const slug = path.replace('/whiskey/', '');
      const whiskey = await fetchFromSanity(
        `*[_type == "whiskey" && slug.current == $slug][0]{name, description, "imageRef": image.asset._ref}`,
        { slug }
      );
      if (whiskey) {
        title = `${whiskey.name} — Noble Palate Society`;
        description = whiskey.description || description;
        image = sanityImageUrl(whiskey.imageRef);
      }
    } else if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      const post = await fetchFromSanity(
        `*[_type == "blogPost" && slug.current == $slug][0]{title, excerpt, "imageRef": heroImage.asset._ref}`,
        { slug }
      );
      if (post) {
        title = `${post.title} — Noble Palate Society`;
        description = post.excerpt || description;
        image = sanityImageUrl(post.imageRef);
      }
    } else {
      // Home page - get site settings
      const settings = await fetchFromSanity(
        `*[_type == "siteSettings"][0]{"imageRef": logo.asset._ref, tagline}`
      );
      if (settings) {
        description = settings.tagline || description;
        image = sanityImageUrl(settings.imageRef);
      }
    }
  } catch (e) {
    // Fall through with defaults
  }

  // If no image found, use a default
  if (!image) {
    image = `${url.origin}/logo.png`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Noble Palate Society">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
</head>
<body>
  <p>${title}</p>
  <p>${description}</p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export const config = {
  matcher: ['/', '/whiskey/:path*', '/blog/:path*', '/database'],
};
