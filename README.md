# codebase.fyi

The public front door: a short list of the apps anyone can use, plus a door to the
family's home screen at home.codebase.fyi. Plain HTML and CSS built with Vite; no
framework. The glass design is by Fable.

```bash
npm install
npm run dev     # local dev server
npm run build   # production build -> dist/
```

## Files

- `index.html`: the whole page, cards included. One `<a class="card">` per app, each with
  its three drawings (ink, emblem, stamp) as inline SVG.
- `src/glass.css`: the shared glass system. **Identical** to
  `home-codebase-fyi/public/glass.css`; change both together.
- `src/site.css`: the layout shared by the three looks.
- `src/look-ink.css`, `src/look-emblem.css`, `src/look-postcards.css`: one file per look,
  scoped under `html[data-look="…"]`. Emblem is the default; `?look=ink` previews another;
  the footer control saves the choice in localStorage.
- `src/main.js`: entrance stagger, the look switch, pointer sheen (emblem), the seal's date
  and the live status dots.
- `public/og.png`: the link-preview image, a 1200×630 screenshot of the page (dark).

## Adding a public app

Copy a card in `index.html`, change the link, name, blurb, the three drawings and `--tint`,
and give it a `data-id` and a `data-app`. Then re-balance the emblem spans in
`src/look-emblem.css` so every row of the grid is full at both widths (see CLAUDE.md). For its status dot to go live, add the same id with `public: true` to
`home-codebase-fyi/src/apps.js` and deploy that Worker. Private apps (anything with
personal data) go only on the home screen, never here.

## Deploying

Push or merge to `main`; Vercel's GitHub integration builds and publishes it. Never run
the `vercel` CLI.
