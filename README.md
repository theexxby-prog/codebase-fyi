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
  tags: ['React'],       // optional
  status: 'live',        // optional: 'live' | 'in-progress' | 'archived'
}
```

## Deploying

This repo includes `vercel.json`. Push to GitHub and import the repo in Vercel,
or deploy directly with the Vercel CLI (`vercel --prod`) from this directory.
Point the `codebase.fyi` domain (registered at Porkbun) at the Vercel project
via Vercel's domain settings, then update the DNS records at Porkbun (or
change the domain's nameservers to Vercel's) to match.
