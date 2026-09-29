# codebase.fyi

The public front door: a short list of the apps anyone can use, plus a door to the
family's home screen at list.codebase.fyi. Plain HTML and CSS built with Vite; no
framework. The glass design is by Fable.

```bash
npm install
npm run dev     # local dev server
npm run build   # production build -> dist/
```

## Files

- `index.html`: the whole page, cards included. One `<a class="tile card">` per app.
- `src/glass.css`: the shared glass system. **Identical** to
  `list.codebase.fyi/public/glass.css`; change both together.
- `src/site.css`: this page's layout.
- `src/main.js`: entrance stagger, pointer sheen, and the live status dots.
- `public/og.png`: the link-preview image, a 1200×630 screenshot of the page (dark).

## Adding a public app

Copy a card in `index.html`, change the link, name, blurb, icon and `--tint`, and give it
a `data-id`. For its status dot to go live, add the same id with `public: true` to
`list.codebase.fyi/src/apps.js` and deploy that Worker. Private apps (anything with
personal data) go only on the home screen, never here.

## Deploying

Push or merge to `main`; Vercel's GitHub integration builds and publishes it. Never run
the `vercel` CLI.
