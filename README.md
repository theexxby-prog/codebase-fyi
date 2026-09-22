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
  preview: false,        // optional: never screenshot the live site (private)
}
```

Then give it a stage image (below).

## Stage images

Each project is shown on the stage as either a poster or a screenshot, one webp
per host in `public/previews/`. They are committed, so a normal build needs
nothing extra. Sizes live in `src/previews.json`; a host missing from that
file falls back to a gradient tile with the project's initials. The card
tells the two apart by shape: a tall image is a screenshot and pans down on
hover, a 16:10 image is a poster and gets a slow push-in.

### Posters

nfl, cricket, ledger, loans and plexpull use posters generated with FLUX
(Black Forest Labs) through the Flux MCP server in Claude Code. The prompts
follow one recipe so the set reads as a family: a single object that stands
for the project, lit in the card's accent colour, cinematic photograph,
shallow depth of field, empty space on the left, no text in the image (the
card already carries the name and hostname). Generate at 1920x1200 and save
as webp at quality 82.

| Host | Subject |
| --- | --- |
| nfl.codebase.fyi | Football on the yard line under blue floodlights |
| cricket.codebase.fyi | Red cricket ball on an emerald pitch, stumps behind |
| ledger.codebase.fyi | Three matte metal cards on slate, violet rim light |
| loans.codebase.fyi | Mortarboard and tassel on a desk beside a ledger, rose light |
| plexpull.codebase.fyi | Film projector throwing a teal beam through dust |

### Screenshots

Datamatics, Shania and Samara use real screenshots from
`scripts/capture-previews.mjs`. Datamatics is login-gated, so it renders the
mockup in `scripts/mocks/` with invented accounts and figures; never point
the script at anything showing customer data. The script needs tooling that
is not part of the build:

```bash
npm i -D playwright sharp
npx playwright install chromium
npm run capture -- shania.mehtahouse.cc
```

## Deploying

This repo includes `vercel.json`. Push to GitHub and import the repo in Vercel,
or deploy directly with the Vercel CLI (`vercel --prod`) from this directory.
Point the `codebase.fyi` domain (registered at Porkbun) at the Vercel project
via Vercel's domain settings, then update the DNS records at Porkbun (or
change the domain's nameservers to Vercel's) to match.
