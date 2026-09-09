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
  accent: 'violet',      // blue | rose | amber | violet | emerald
  tags: ['React'],       // optional
  status: 'live',        // optional: 'live' | 'in-progress' | 'archived'
  preview: false,        // optional: skip the screenshot (private sites)
}
```

Then regenerate the previews (below) so the new project gets one.

## Screenshot previews

Each card frames a screenshot of the site that pans down on hover. The images
live in `public/previews/` and are committed, so a normal build needs nothing
extra. Regenerate them when a site changes, or after adding a project:

```bash
npm i -D playwright sharp
npx playwright install chromium
npm run capture
```

That reads the urls from `src/projects.ts`, writes one webp per host, and
updates `src/previews.json` with the image sizes the hover animation needs.
Anything marked `preview: false` is skipped and falls back to a gradient tile
with its initials, which is what private or login-gated sites should use.
Uninstall `playwright` and `sharp` afterwards to keep deploy builds lean.

## Deploying

This repo includes `vercel.json`. Push to GitHub and import the repo in Vercel,
or deploy directly with the Vercel CLI (`vercel --prod`) from this directory.
Point the `codebase.fyi` domain (registered at Porkbun) at the Vercel project
via Vercel's domain settings, then update the DNS records at Porkbun (or
change the domain's nameservers to Vercel's) to match.
