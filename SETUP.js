// ══════════════════════════════════════════════════════
// SANITY SETUP GUIDE FOR NOBLE PALATE SOCIETY
// ══════════════════════════════════════════════════════
//
// STEP 1: Add CORS origins in Sanity
// Go to: https://www.sanity.io/manage/personal/project/utqvc7uf/api
// Under "CORS Origins", add:
//   - http://localhost:5173 (for local dev)
//   - https://*.vercel.app (for Vercel preview)
//   - https://noblepalatesociety.com (your custom domain)
//
// STEP 2: Create a Sanity Studio
// In a NEW folder, run:
//   npm create sanity@latest -- --project-id utqvc7uf --dataset production --template clean
//
// STEP 3: Copy the schema files
// Copy all files from src/schemas/ into your studio's schemaTypes/ folder
// Update schemaTypes/index.js to import them all
//
// STEP 4: Deploy the studio
//   cd your-studio-folder
//   npx sanity deploy
//
// STEP 5: Add your content!
// Open your studio URL and start adding whiskeys, reviews, blog posts.
// Everything updates on the live site automatically.
//
// ══════════════════════════════════════════════════════
