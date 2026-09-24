# codebase-fyi

The landing page at codebase.fyi that lists Vishal's apps, one card per app. A Vite +
React + Tailwind site with no backend.

| | |
|---|---|
| Live | https://codebase.fyi (the apex 308s to www.codebase.fyi) |
| GitHub | theexxby-prog/codebase-fyi (public) |
| Mac folder | ~/dev/codebase-fyi |
| Deploys by | push or merge to `main` (Vercel's GitHub integration builds it). Never run the `vercel` CLI |
| Cloudflare | n/a for hosting (no wrangler config). DNS for the domain is on Cloudflare |
| Read also | README.md (adding a project, previews, posters recipe, deploying) |

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
- The card data is `src/projects.ts`. `src/ProjectList.tsx` renders it (the dark project
  index). When a new app goes live on a codebase.fyi subdomain, it gets a card here.
- Five apps (nfl, cricket, loans, ledger, plexpull) have `poster: true` and show
  FLUX-generated posters: a 16:10 desktop webp plus a 4:5 `.mobile` crop in
  `public/previews/`. Datamatics, Shania and Samara keep screenshots. The recipe is in
  the README.
- Never screenshot a site behind a login or showing real data. Use `preview: false`,
  and a mock page in `scripts/mocks/` if the card needs a visual. Apps that hold private
  data only get a card if Vishal asks.
- `playwright` and `sharp` are for `npm run capture` only. Uninstall them afterwards so
  deploy builds stay lean.
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
_Updated 2026-09-24 from the Mac (housekeeping session: added this handoff setup)._
- **Live:** the 2026-09-21 build (posters for the five apps, nfl and cricket cards). The
  live `assets/index-BQde0hR5.js` matches a local build of `main`. Eight cards: nfl
  (featured as newest), cricket, loans, ledger, plexpull, Datamatics, Shania, Samara.
- **Not deployed yet:** nothing.
- **Open / next:**
  - books.codebase.fyi went live 2026-09-23 and has no card yet. Ask Vishal whether to
    add one (it is PIN-gated, so it would need a poster or a mock, not a screenshot).
  - The Samara card is tagged `React`, but that site is a single static `index.html`.
  - The Datamatics card links to datamatics.codebase.fyi. The portal is also served at
    datamatics.mehtahouse.cc. Both answer; confirm which one Vishal wants on the card.
