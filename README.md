# codebase.fyi

Landing page linking out to pet projects. React + TypeScript + Vite + Tailwind CSS 4.

## Commands

```bash
npm install
npm run dev     # local dev server
npm run build   # production build -> dist/
```

## Adding a project

Edit `src/projects.ts` and add an entry to the `projects` array:

```ts
{
  name: 'Project Name',
  description: 'One line about it.',
  url: 'https://example.com',
  accent: 'violet',      // blue | rose | amber | violet | emerald (glow behind the screenshot)
  group: 'personal',     // personal | work | family (label on the card)
  tags: ['React'],       // optional
  added: '2026-01-01',   // optional; the newest project is featured at the top
  status: 'live',        // optional: 'live' | 'in-progress' | 'archived'
  preview: false,        // optional: skip the screenshot (private sites)
}
```

Then regenerate the previews (below) so the new project gets one.

## Screenshot previews

Each card shows a screenshot of the site that pans down on hover. The images
live in `public/previews/` and are committed, so a normal build needs nothing
extra. Regenerate them when a site changes, or after adding a project:

```bash
npm i -D playwright sharp
npx playwright install chromium
npm run capture
```

That reads the urls from `src/projects.ts`, writes one webp per host, and
updates `src/previews.json` with the image sizes the hover animation needs.
Uninstall `playwright` and `sharp` afterwards to keep deploy builds lean.

### Sites that shouldn't be screenshotted

Never point the capture script at anything behind a login or showing customer
data. Mark it `preview: false` and it is skipped entirely; the card falls back
to a gradient tile with the project's initials.

If you still want a visual, add `mock: 'name.html'` alongside it and drop a
self-contained page in `scripts/mocks/`. The script renders that local file
instead of the live site, so the preview shows the product with invented
accounts and figures rather than anyone's real data. `scripts/mocks/datamatics.html`
is the working example.

## Hero image

`public/hero.webp` (and the `hero-960.webp` phone crop) is a generated backdrop,
a single violet-to-emerald light ribbon on black, made with Black Forest Labs
FLUX. Regenerate or replace it freely; the header copy sits over the left half,
so keep that side dark.

## Deploying

This repo includes `vercel.json`. Push to GitHub and import the repo in Vercel,
or deploy directly with the Vercel CLI (`vercel --prod`) from this directory.
Point the `codebase.fyi` domain (registered at Porkbun) at the Vercel project
via Vercel's domain settings, then update the DNS records at Porkbun (or
change the domain's nameservers to Vercel's) to match.
