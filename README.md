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
  poster: true,          // optional: generated art instead of a screenshot (see Posters)
}
```

Then regenerate the previews (below) so the new project gets one.

## Previews

Each card shows an image of the project, two webps per host in
`public/previews/` (a desktop one and a `.mobile` one the card swaps in below
768px). They are committed, so a normal build needs nothing extra. Sizes live
in `src/previews.json`; a host missing from that file falls back to a solid
accent tile with the project's initials.

### Posters

The apps (nfl, cricket, loans, ledger, plexpull) are marked `poster: true`
and show generated art instead of a screenshot: made with Black Forest Labs
FLUX through the Flux MCP server in Claude Code, one object that stands for
the project, lit in the card's accent colour, cinematic and shallow depth of
field, empty space on the left, no text in the image. Generate at 1920x1200,
save as webp at quality 82, and crop a 960x1200 slice centred on the subject
for the `.mobile` file. The capture script skips poster projects.

| Host | Subject |
| --- | --- |
| nfl.codebase.fyi | Football on the yard line under blue floodlights |
| cricket.codebase.fyi | Red cricket ball on an emerald pitch, stumps behind |
| loans.codebase.fyi | Mortarboard and tassel on a desk beside a ledger, rose light |
| ledger.codebase.fyi | Three matte metal cards on slate, violet rim light |
| plexpull.codebase.fyi | Film projector throwing a teal beam through dust |

### Screenshots

The rest show a screenshot of the site that pans down on hover. Regenerate
them when a site changes, or after adding a project:

```bash
npm i -D playwright sharp
npx playwright install chromium
npm run capture
```

That reads the urls from `src/projects.ts`, writes the two webps per host,
and updates `src/previews.json` with the image sizes the hover animation
needs. Uninstall `playwright` and `sharp` afterwards to keep deploy builds
lean.

### Sites that shouldn't be screenshotted

Never point the capture script at anything behind a login or showing customer
data. Mark it `preview: false` and it is skipped entirely; the card falls back
to the accent tile.

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

Pushing or merging to `main` is the deploy: Vercel's GitHub integration builds
and publishes it. Don't run the Vercel CLI (`vercel`, `vercel --prod`) from this
directory; it bypasses that and can leave production out of step with `main`.

`codebase.fyi` is registered at Porkbun, with DNS on Cloudflare and DNSSEC on.
The records there point at Vercel. Don't move the nameservers without first
removing the DS record at Porkbun, or the domain stops resolving.
