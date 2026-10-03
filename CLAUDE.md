# codebase-fyi

The public front door at codebase.fyi: the apps anyone can use, plus a door to the
family's home screen (home.codebase.fyi, a separate private repo). Plain HTML/CSS built
with Vite, no framework. Since 2026-10-03 it has its own look, Fable's "Device wall + live strip" (not the
house style); earlier glass, three-look and house-style versions are in git history.

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
- **One look: "Device wall + live strip" (2026-10-03, Fable; Vishal chose it over a split-flap Departures
  board and a shopfront Street).** Each app is drawn as the device it runs on, as inline SVG in `index.html`:
  NFL and Cricket as phones, Datamatics as a laptop, Shania and Samara as browser windows, NFLBar as a Mac
  menu bar, Home as a door. Devices float, tilt toward the mouse and cast a soft shadow; the door swings
  open on hover. System font only (he has rejected serifs and display fonts; no Google Fonts). The approved
  mockup (with demo data) is `design/device-wall-mockup.html`. `src/site.css` is the whole stylesheet,
  `src/main.js` the behaviour. Marker was retired on 2026-10-03 and has no card.
  - **No invented numbers.** The phone screens hold neutral placeholder bars; real games and the match are
    filled in by `main.js` from the feed, or stay as bars. `test/page.test.js` fails on sample scores.
  - **"Right now" strip + live screens:** `https://home.codebase.fyi/api/public-now` (home repo `src/now.js`;
    next India match, this week's NFL games, public fields only, 5-min cache). The strip is hidden when the
    feed is empty or unreachable. Times are shown in the visitor's own timezone.
  - **The grid is symmetric: 7 apps in 8 cells.** 2 across on the phone, 4 on desktop; the Datamatics card is
    `.wide` (spans two columns, counts as two cells and must start on an even cell). `npm test` checks the
    cell count is a multiple of 4. Adding or removing an app means re-balancing (move the wide card, or add
    apps in pairs). Equal card heights.
  - Theme: light unless the moon/sun toggle (`.theme`, outermost top right) chose dark, saved as
    `localStorage.theme`; `?theme=` wins for one visit; the system setting is ignored (a test checks there is
    no `prefers-color-scheme`). Set by the head script before first paint.
  - Only transform, opacity and stroke-dashoffset animate; off-screen cards and a hidden tab pause
    (`.paused`); reduced motion shows rest states. No CSS `color-mix()` (needs iOS 16.2).
- Status dots come from `https://home.codebase.fyi/api/public-status` (up/down only, for
  apps marked `public: true` in the home repo's `src/apps.js`). If it fails the dots stay
  neutral; the page never depends on it.
- Only public apps get a card here. Loans, ledger, medical, house, books, plexpull, list and balance live on
  the family home screen and are never linked or described here (the Home card only says it is for the family).
- `public/og.png` is a 1200×630 screenshot of the page (light). Retake it after a big visual change, with the
  feeds blocked so it shows the neutral placeholder screens and never goes stale: headless Chrome with
  `--host-resolver-rules="MAP home.codebase.fyi 127.0.0.1:1" --window-size=1200,630 --screenshot=...` against
  `npx vite preview`. It can hang after writing the file; kill the headless Chrome afterwards.
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
_Updated 2026-10-03 from the Mac._
- **Live 2026-10-03: the Device wall redesign** (7 apps, Datamatics wide; Marker card removed because the app
  was retired the same day). Strip and the NFL / Cricket / NFLBar screens read the live feed. Tests 5/5, desktop
  and phone checked light and dark at 390 and 1156 wide: full rectangle, equal heights, no horizontal scroll.
  `public/og.png` retaken (placeholder screens).
- **Open / next:**
  - Not yet tried on a real iPhone (float animation smoothness with 7 cards, the strip scrolling sideways).
  - The "Right now" strip is NFL and Cricket only; no Marker, and no feed for the portfolios.
  - Link-preview caches (iMessage, Slack) may show the old image for a while.
