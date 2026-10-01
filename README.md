# codebase.fyi

The public front door: a short list of the apps anyone can use, plus a door to the
family's home screen at home.codebase.fyi. Plain HTML and CSS built with Vite; no
framework. It uses the house style every app shares (design.codebase.fyi/v2).

```bash
npm install
npm run dev     # local dev server
npm run build   # production build -> dist/
```

## Files

- `index.html`: the whole page, cards included. One `<a class="card">` per app, each with
  its ink drawing (`svg.ink`, one gold detail) as inline SVG.
- `src/look-house.css`: the house style's colours, type and card surfaces, light and dark
  (house v2 values, copied; the page doesn't link house.css).
- `src/site.css`: the page layout. `src/glass.css`: the base reset and the status dot.
- `src/main.js`: entrance stagger, the moon/sun toggle and the live status dots.
- `public/og.png`: the link-preview image, a 1200×630 screenshot of the page (light).

## Adding a public app

Copy a card in `index.html`, change the link, name, blurb and drawing, and give it a
`data-id`. The grid is 2 across on the phone and 4 on desktop, so keep the number of cards
a multiple of 4, or the last row won't be full (see CLAUDE.md). For its status dot to go
live, add the same id with `public: true` to `home-codebase-fyi/src/apps.js` and deploy that
Worker. Private apps (anything with personal data) go only on the home screen, never here.

## Deploying

Push or merge to `main`; Vercel's GitHub integration builds and publishes it. Never run
the `vercel` CLI.
