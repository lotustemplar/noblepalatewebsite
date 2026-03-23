# Noble Palate Society 🥃 — Sanity CMS Edition

**NoblePalateSociety.com** — Content managed through Sanity Studio.

## Setup

### 1. Deploy the website
```bash
npm install
npm run dev        # Local development
npm run build      # Production build
```

### 2. Set up Sanity Studio (your content dashboard)

You need a separate Sanity Studio project to manage content. Run these commands in a NEW folder (not this one):

```bash
npm create sanity@latest -- --project-id utqvc7uf --dataset production --template clean
```

When prompted, name it "noble-palate-studio". Then copy the schema files from this project's `src/schemas/` folder into your studio's `schemaTypes/` folder.

Update your studio's `schemaTypes/index.js`:
```js
import siteSettings from './siteSettings'
import whiskey from './whiskey'
import reviewer from './reviewer'
import review from './review'
import blogPost from './blogPost'

export const schemaTypes = [siteSettings, whiskey, reviewer, review, blogPost]
```

Then deploy the studio:
```bash
npx sanity deploy
```

### 3. Add content
- Go to your deployed Sanity Studio
- Add Site Settings (upload your logo and hero image)
- Add Whiskeys with bottle images
- Add Reviewers (toggle isPro for pro reviewers)
- Add Reviews linking whiskeys to reviewers
- Add Blog Posts with hero images

All changes appear on your website automatically!

## Content Types

| Type | What it controls |
|------|-----------------|
| Site Settings | Logo, hero image, tagline, motto |
| Whiskey | Name, image, type, region, ABV, price, description |
| Reviewer | Name, avatar, isPro toggle, bio |
| Review | Whiskey + Reviewer + Aroma/Palate/Finish/Style/Value scores |
| Blog Post | Title, hero image, rich text body, featured whiskey |

## Scoring System
- Aroma: /15
- Palate: /45
- Finish: /20
- Style/Uniqueness: /10
- Value: /10
- **Total: /100**

Pro reviews and Audience reviews are displayed separately.
