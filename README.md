# Noble Palate Society 🥃

**NoblePalateSociety.com** — Expert whiskey reviews, curated tastings, and a community of connoisseurs.

*Sapientia Per Sensus — Wisdom Through the Senses*

## Tech Stack

- **React 18** + **Vite 5**
- Hosted on **Vercel**
- Fonts: Playfair Display, Cormorant Garamond, Outfit
- Images: Unsplash

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Demo Accounts

| Role  | Username       | Password  |
|-------|---------------|-----------|
| Admin | admin         | admin123  |
| Pro   | james_whiskey | pass123   |
| Pro   | sarah_malt    | pass123   |

## Features

- **Whiskey Database** — Browse, search, and filter all reviewed whiskeys
- **Dual Score System** — NPS Pro scores (gold) and Audience scores (purple) displayed separately
- **Review System** — Aroma (15), Palate (45), Finish (20), Style/Uniqueness (10), Value (10) = 100 total
- **Blog** — Latest reviews and tasting stories from Pro reviewers
- **User Auth** — Sign up, sign in, profile with review history
- **Admin Panel** — Manage users, toggle Pro status, add whiskeys, view all reviews
- **Mobile Responsive** — Fully functional on all devices

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import this repo
3. Vercel auto-detects Vite — click Deploy
4. Add custom domain: Settings → Domains → Add `NoblePalateSociety.com`
