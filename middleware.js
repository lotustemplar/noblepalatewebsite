const SANITY_URL = 'https://utqvc7uf.apicdn.sanity.io/v2026-03-22/data/query/production';

function imageUrl(ref) {
  if (!ref?.asset?._ref) return 'https://noblepalate.com/logo.png';
  const parts = ref.asset._ref.replace('image-', '').split('-');
  const ext = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/images/utqvc7uf/production/${id}.${ext}`;
}

function esc(str) {
  return (str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHtml(title, description, image, url) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${esc(title)}</title>
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Noble Palate Society" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>Redirecting...</body>
</html>`;
}

const BOT_UA = /facebookexternalhit|Facebot|Twitterbot|WhatsApp|LinkedInBot|Slackbot|TelegramBot|Pinterest|Discordbot/i;

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  
  if (!BOT_UA.test(ua)) {
    return;
  }

  const url = new URL(request.url);
  const path = url.pathname;

  try {
    if (path.startsWith('/whiskey/')) {
      const slug = path.replace('/whiskey/', '');
      const query = encodeURIComponent(`*[_type == "whiskey" && slug.current == "${slug}"][0]{name, description, image}`);
      const res = await fetch(`${SANITY_URL}?query=${query}`);
      const data = await res.json();
      const w = data.result;
      if (w) {
        return new Response(
          buildHtml(
            `${w.name} | Noble Palate Society`,
            (w.description || '').substring(0, 200),
            imageUrl(w.image),
            url.toString()
          ),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }
    }

    if (path.startsWith('/blog/')) {
      const slug = path.replace('/blog/', '');
      const query = encodeURIComponent(`*[_type == "blogPost" && slug.current == "${slug}"][0]{title, excerpt, heroImage}`);
      const res = await fetch(`${SANITY_URL}?query=${query}`);
      const data = await res.json();
      const p = data.result;
      if (p) {
        return new Response(
          buildHtml(
            `${p.title} | Noble Palate Society`,
            (p.excerpt || '').substring(0, 200),
            imageUrl(p.heroImage),
            url.toString()
          ),
          { headers: { 'Content-Type': 'text/html' } }
        );
      }
    }
  } catch (e) {
    console.error('Middleware error:', e);
  }

  return;
}

export const config = {
  matcher: ['/whiskey/:path*', '/blog/:path*'],
};
