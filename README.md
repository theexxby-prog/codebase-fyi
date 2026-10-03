# codebase.fyi

The public front door: a short list of the apps anyone can use, plus a door to the
family's home screen at home.codebase.fyi. Plain HTML and CSS built with Vite; no
framework. It has its own look, "Device wall + live strip", not the shared house style.

```bash
npm install
npm run dev     # local dev server
npm run build   # production build -> dist/
```

## Files

- `index.html`: the whole page, cards included. One `<a class="card">` per app, each with its device drawn
  as inline SVG. Screens hold neutral placeholders; real games come from the feed.
- `src/site.css`: the whole stylesheet (system font, light and dark, device float and tilt).
- `src/main.js`: the moon/sun toggle, live status dots, the "Right now" strip, the NFL / Cricket / NFLBar
  screens, pointer tilt and pausing off-screen cards.
- `design/device-wall-mockup.html`: Fable's approved mockup (demo data), for reference.
- `test/page.test.js`: grid symmetry, no retired apps, no invented numbers, system font, cheap animation.
- `public/og.png`: the link-preview image, a 1200×630 screenshot of the page (light).

## Adding a public app

Copy a card in `index.html`, change the link, name, blurb and drawing, and give it a
`data-id`. The grid is 2 across on the phone and 4 on desktop, so keep the number of cards
a multiple of 4 (the wide Datamatics card counts as two), or the last row won't be full (see CLAUDE.md; `npm test` checks it). For its status dot to go
live, add the same id with `public: true` to `home-codebase-fyi/src/apps.js` and deploy that
Worker. Private apps (anything with personal data) go only on the home screen, never here.

## Deploying

Push or merge to `main`; Vercel's GitHub integration builds and publishes it. Never run
the `vercel` CLI.
