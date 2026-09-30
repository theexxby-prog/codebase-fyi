# codebase-fyi

The public front door at codebase.fyi: the apps anyone can use, plus a door to the
family's home screen (home.codebase.fyi, a separate private repo). Plain HTML/CSS built
with Vite, no framework. Designed by Fable: the glass (2026-09-28) and the three looks
(2026-09-29).

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
- `src/glass.css` must stay identical to `home-codebase-fyi/public/glass.css`.
- **Three looks, one page.** `<html data-look="ink|emblem|postcards">` picks the look;
  `src/look-*.css` hold each look's colours, card surfaces and grid spans, scoped under
  `[data-look="…"]`. `src/site.css` is the layout they share. Markup, copy, links and
  status dots are written once in `index.html`; every card carries its three drawings
  (`.ink`, `.em`, `.stamp`, inline SVG) and the look's CSS shows one.
  - Default is **emblem**. The head script in `index.html` sets the look before first
    paint: `?look=` for that visit (not saved), else the choice saved in
    `localStorage.look`, else emblem. The footer's "Look" control saves the choice.
  - Ink and postcards override the colour tokens (`--bg`, `--ink`…) and follow the same
    theme rule as glass.css (dark by default, light on `prefers-color-scheme: light`
    unless `data-theme=dark`, light on `data-theme=light`). Don't change how the theme
    is chosen here.
  - The grid is one 8-card `.grid.board`; it must be a full rectangle in every look at
    both widths. Emblem's spans are set per `data-app` (phone: NFL, Cricket, NFLBar and
    Home span 2; desktop: NFL and Cricket span 2, Home spans 3). Adding or removing a card
    means re-balancing those spans.
  - Emblem's "next game" chips from the mockup are left out until there is real data.
  - Check every look with the symmetry tool:
    `node ~/dev/design-codebase-fyi/tools/symmetry-check.mjs http://localhost:4173/?look=ink`
    (and emblem, postcards) against `npm run build && npx vite preview --port 4173`.
  - **To retire a look later:** delete its `src/look-*.css` and its import in
    `src/main.js`, remove its button from the footer `.look` group, drop its SVG from each
    card (`.ink` for ink, `.em` for emblem, `.stamp` plus `.mark` for postcards; the
    `#postmark` symbol and `.seal` go with postcards, `.sig` with ink), and remove its name
    from the `looks` list in the head script. If only one look is left, remove the footer
    control and the head script's look branch, and hard-code `data-look` on `<html>`.
- Status dots come from `https://home.codebase.fyi/api/public-status` (up/down only, for
  apps marked `public: true` in the home repo's `src/apps.js`). If it fails the dots stay
  neutral; the page never depends on it.
- Only public apps get a card here. Loans, ledger, medical, house, books, plexpull,
  pricegap and list live on the family home screen and are never linked or described
  here.
- `public/og.png` is a 1200×630 screenshot of the page in dark mode. Retake it after a
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
_Updated 2026-09-29 from the Mac._
- **Vishal is trying the three looks "for a few days" and may change his mind: don't remove any
  look until he picks.** Next-game chips on Emblem are deferred (need small endpoints on NFL and
  Cricket served from their caches; Cricket has a 100 calls/day budget).
- **Live 2026-09-29 (main 63c3505, Vishal said ship):** the front page rebuilt as one
  8-card grid with three switchable looks (Ink shelf, Emblem board, Postcards), default
  emblem, footer "Look" switch saved in localStorage. Also: the group is an eyebrow inside
  each card, Shania and Samara have different drawings, the family door is a "Home" card,
  the card says "Datamatics" (not "Datamatics portal"), the footer lost the "Cloudflare
  Workers, Vercel" span. Symmetry checker passes for all three looks at 390 and 1440.
  Vercel builds a preview for the branch; Vishal wants to toggle between the looks for a
  few days before choosing.
- **Not deployed yet:** the branch above (merge to `main` when Vishal says so). After it
  goes live, retake `public/og.png` in the chosen look.
- **Open / next:** pick one look and retire the other two (steps under Rules), or keep
  all three; check on a real iPhone. The remote branch `claude/webpage-styling-issues-rgssn3`
  (2026-09-14) is stale, nothing ahead of main.
