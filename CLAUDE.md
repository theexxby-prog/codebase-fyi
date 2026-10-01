# codebase-fyi

The public front door at codebase.fyi: the apps anyone can use, plus a door to the
family's home screen (home.codebase.fyi, a separate private repo). Plain HTML/CSS built
with Vite, no framework. Since 2026-10-01 it uses the house style (design.codebase.fyi/v2), like
every app; the earlier glass and three-look designs (Fable, 2026-09-28/29) are retired.

| | |
|---|---|
| Live | https://codebase.fyi (the apex 308s to www.codebase.fyi) |
| GitHub | theexxby-prog/codebase-fyi (public) |
| Mac folder | ~/dev/codebase-fyi |
| Deploys by | push or merge to `main` (Vercel's GitHub integration builds it). Never run the `vercel` CLI |
| Cloudflare | n/a for hosting (no wrangler config). DNS for the domain is on Cloudflare |
| Read also | README.md (files, adding an app, deploying) |

## Rules
- Pull first. Other sessions edit this repo: a cloud session redesigned it on
  2026-09-15 while the Mac clone was behind.
- The deploy is a push to `main`. Don't run `vercel` or `vercel --prod`; it bypasses the
  GitHub integration and can leave production out of step with `main`.
- To check a deploy went out, compare the `assets/index-*.js` name in the live HTML
  (`curl -s https://www.codebase.fyi | grep -o 'assets/index-[^"]*\.js'`) with the one in
  a local `npm run build` (`dist/index.html`). Same name means the live site is this code.
- The old Cloudflare Worker stub for this domain is retired (GitHub repo
  `codebase-fyi-worker`, archived on the Mac). Never deploy it; it would take the domain
  back from Vercel.
- DNS is on Cloudflare with DNSSEC on. Before moving nameservers off Cloudflare, remove
  the DS record at the registrar first, or the domain stops resolving.
- The cards are written straight into `index.html` (no data file, no framework), so the
  page works without JavaScript and link previews see the content.
- **One look: the house style** (design.codebase.fyi/v2). Ink, Emblem and Postcards were retired
  2026-10-01 (Vishal: "yes - remove"). `src/look-house.css` copies the house v2 values (warm ground,
  system font, title left, cards with the ink drawing flush on top, soft hairline shadow, graphite
  accent) because the page doesn't link house.css; when house v2's colours change, copy them here.
  `<html data-look="house">` stays hard-coded (the CSS is scoped to it). `src/site.css` is the layout.
  - Theme: light unless the moon/sun toggle (`.theme`, outermost top right) chose dark, saved as
    `localStorage.theme` like every house app; `?theme=` wins for one visit; the system setting is
    ignored. Set by the head script before first paint.
  - The grid is one 8-card `.grid.board`: 2 across on the phone, 4 on desktop, so it's a full
    rectangle at both widths. Adding or removing a card means keeping it a multiple of 4 (or
    rebalancing).
  - Check with the symmetry tool: `node ~/dev/design-codebase-fyi/tools/symmetry-check.mjs
    http://localhost:4173/` (and `?theme=dark`) against `npm run build && npx vite preview --port 4173`.
  - `src/glass.css` is kept only for its base reset and the status dot.
- Status dots come from `https://home.codebase.fyi/api/public-status` (up/down only, for
  apps marked `public: true` in the home repo's `src/apps.js`). If it fails the dots stay
  neutral; the page never depends on it.
- Only public apps get a card here. Loans, ledger, medical, house, books, plexpull,
  pricegap and list live on the family home screen and are never linked or described
  here.
- `public/og.png` is a 1200×630 screenshot of the page (house look, light). Retake it after a
  big visual change.
- This repo is public. Nothing personal goes in it: no finances, no account ids, no
  secrets.

## Session handoff (every session, on any device)

Vishal works on this repo from the Mac terminal, the Claude desktop and phone apps, and
cloud sessions at claude.ai/code. A cloud session sees only this repo, not the Mac's
`~/.claude` files or memory. So anything the next session needs goes in this file, and
`main` on GitHub is the single source of truth.

**Start**
1. The SessionStart hook (`.claude/hooks/session-start.sh`) prints a sync report. If it
   says this copy is behind, run `git pull --ff-only` before touching anything. If it
   lists another branch or an open PR, tell Vishal and ask whether to merge it first.
2. Read **Current state** at the bottom of this file.

**Finish** (every session that changed anything, before saying you're done)
1. Rewrite **Current state**: the date, where you worked (Mac, cloud or phone), what
   changed, what is live, what isn't deployed or tested yet, and what's next. Keep it
   short and current, not a diary. Lasting rules and lessons go in the sections above it.
2. Get the work onto `main`:
   - Mac: commit and `git push origin main`.
   - Cloud: you can push only your own `claude/...` branch. Push it, then
     `gh pr create --fill` and `gh pr merge --squash --delete-branch`, unless Vishal
     asked to review first.
3. If it needs a deploy you couldn't run (cloud sessions can't reach Cloudflare), list
   it under "Not deployed yet" so the next Mac session ships it.

## Current state
_Updated 2026-10-01 from the Mac._
- **Live 2026-10-01: house style only.** The house look became the default, then Ink, Emblem and
  Postcards were retired the same day (their CSS, drawings, the footer switch, the seal, the pointer
  sheen). Same content and 8 cards. Symmetry check OK light and dark at 390 and 1440. `public/og.png`
  is in the house look.
- **Open:** check on a real iPhone. The remote branch `claude/webpage-styling-issues-rgssn3`
  (2026-09-14) is stale, nothing ahead of main.
