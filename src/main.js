// codebase.fyi: the theme toggle, live status dots, the "Right now" strip, the NFL / Cricket / NFLBar screens,
// pointer tilt, and pausing what nobody can see. Everything here only adds to the page: the HTML already holds
// every card, and if a feed can't be reached the dots go neutral, the strip stays hidden and the screens keep
// their neutral placeholder bars. Nothing on the page is invented: games and the match come from the feed.
//
// Feeds (home.codebase.fyi, open to anyone, up/down and public facts only):
//   /api/public-status  { apps: { id: { up } } } for the public apps
//   /api/public-now     { cricket: {state,start,label,teams,lines} | null, nfl: {total,live,games[]} | null }

import "./site.css";

const HOME = "https://home.codebase.fyi";
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- theme: light unless the toggle chose dark (the head script already applied it) ----------
const themeBtn = $(".theme");
function paintTheme() {
  const dark = root.dataset.theme === "dark";
  themeBtn?.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#0c0d10" : "#f4f4f1"));
}
themeBtn?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.theme = next; } catch {}
  paintTheme();
});
paintTheme();

// ---------- status dots ----------
const cards = [...document.querySelectorAll(".card[data-id]")];
const waiting = () => cards.filter((c) => c.dataset.s === "checking");
fetch(`${HOME}/api/public-status`)
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data?.apps) return;
    for (const card of cards) {
      const s = data.apps[card.dataset.id];
      if (!s) continue;
      card.dataset.s = s.up ? "up" : "down";
      const host = $(".host span", card);
      if (host && !s.up) { host.dataset.url = host.textContent; host.textContent = "Not responding"; }
      $(".dot", card)?.setAttribute("title", s.up ? "Up" : "Not responding");
    }
  })
  .catch(() => {})
  .finally(() => waiting().forEach((c) => (c.dataset.s = "none"))); // never leave a dot blinking for ever

// ---------- time words, in the visitor's own timezone ----------
const when = (iso) => new Date(iso).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" });
function inWords(iso) {
  const mins = Math.round((Date.parse(iso) - Date.now()) / 60000);
  if (mins <= 0) return "now";
  if (mins < 60) return `${mins}m`;
  if (mins < 48 * 60) return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  return `${Math.round(mins / 1440)} days`;
}

// ---------- tiny SVG helpers for the screens ----------
const NS = "http://www.w3.org/2000/svg";
const svg = (html) => { const g = document.createElementNS(NS, "g"); g.innerHTML = html; return g; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const fit = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

function fillNflPhone(nfl) {
  const rows = $("#nfl-rows");
  if (!rows || !nfl?.games?.length) return;
  const out = nfl.games.slice(0, 4).map((g, i) => {
    const y = 54 + i * 36;
    const score = g.state === "in" && g.awayScore != null ? `${g.away} ${g.awayScore} · ${g.home} ${g.homeScore}` : `${g.away} · ${g.home}`;
    return `<rect class="panel" x="12" y="${y}" width="96" height="30" rx="8"/><text class="ink" font-size="8" font-weight="700" x="20" y="${y + 13}">${esc(score)}</text><text class="mute" font-size="8" font-weight="700" x="20" y="${y + 24}">${g.state === "in" ? "Live" : esc(fit(when(g.kickoff), 18))}</text>`;
  }).join("");
  rows.replaceChildren(svg(out));
  if (nfl.live) { $("#nfl-live").closest(".card").classList.add("is-live"); }
}

function fillCricketPhone(c) {
  const g = $("#cricket-card");
  if (!g || !c) return;
  const [a, b] = c.teams.map((t) => t.short || t.name || "");
  const head = `${a} v ${b}${c.label ? " · " + c.label : ""}`;
  const live = c.state === "in" && c.lines.length;
  const big = live ? c.lines[0].score.split(" ")[0] : inWords(c.start);
  const sub = live ? `${c.lines[0].short} batting` : "to the start";
  g.replaceChildren(svg(`<text class="mute" font-size="9" font-weight="700" x="20" y="71">${esc(fit(head, 22))}</text><text class="ink" font-size="${big.length > 7 ? 14 : 18}" font-weight="800" x="20" y="96">${esc(big)}</text><text class="tint" font-size="9" font-weight="700" x="20" y="106">${esc(sub)}</text>`));
}

function fillNflBar(nfl) {
  const pill = $("#bar-pill"), rows = $("#bar-rows");
  if (!nfl?.games?.length) return;
  const g0 = nfl.games.find((g) => g.state === "in") || nfl.games[0];
  if (pill) pill.textContent = g0.state === "in" && g0.awayScore != null ? `${g0.away} ${g0.awayScore} · ${g0.home} ${g0.homeScore}` : `${g0.away} · ${g0.home}`;
  if (rows) {
    const out = nfl.games.slice(0, 3).map((g, i) => {
      const y = 46 + i * 22;
      const left = g.state === "in" && g.awayScore != null ? `${g.away} ${g.awayScore} · ${g.home} ${g.homeScore}` : `${g.away} · ${g.home}`;
      return `<rect class="scr" x="136" y="${y}" width="96" height="18" rx="5"/><text class="ink" font-size="8" font-weight="700" x="142" y="${y + 12}">${esc(left)}</text><text class="${g.state === "in" ? "tint" : "mute"}" font-size="8" font-weight="700" x="${g.state === "in" ? 218 : 194}" y="${y + 12}">${g.state === "in" ? "Live" : esc(new Date(g.kickoff).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).replace(" ", ""))}</text>`;
    }).join("");
    rows.replaceChildren(svg(out));
  }
}

// ---------- "Right now" strip ----------
function chips(now) {
  const out = [];
  const c = now.cricket;
  if (c?.start) {
    const [a, b] = c.teams.map((t) => t.short || t.name || "");
    if (c.state === "in") {
      const l = c.lines[0];
      out.push({ tint: "#22c55e", href: "https://cricket.codebase.fyi", text: `Live: ${a} v ${b}${l ? " · " + l.short + " " + l.score.split(" ")[0] : ""}` });
    } else {
      const mins = (Date.parse(c.start) - Date.now()) / 60000;
      out.push({ tint: "#22c55e", href: "https://cricket.codebase.fyi", text: mins < 48 * 60 ? `India play in ${inWords(c.start)}` : `India: ${a} v ${b}, ${when(c.start)}` });
    }
  }
  const n = now.nfl;
  if (n?.games?.length) {
    const first = n.games[0];
    if (n.live) out.push({ tint: "#3b82f6", href: "https://nfl.codebase.fyi", text: `NFL: ${n.live} ${n.live === 1 ? "game" : "games"} live` });
    else out.push({ tint: "#3b82f6", href: "https://nfl.codebase.fyi", text: `NFL: ${first.away} · ${first.home}, ${when(first.kickoff)}` });
    out.push({ tint: "#3b82f6", href: "https://nfl.codebase.fyi", text: `${n.total} NFL ${n.total === 1 ? "game" : "games"} this week` });
  }
  return out;
}

function paintNow(now) {
  const items = chips(now);
  const live = $("#live");
  if (items.length && live) {
    live.innerHTML = '<span class="tag"><i></i>RIGHT NOW</span>' + items.map((x, i) =>
      `<a class="chip" href="${x.href}" style="--tint:${x.tint};--d:${(i * 0.08).toFixed(2)}s"><b></b>${esc(x.text)}</a>`).join("");
    live.hidden = false;
  }
  fillNflPhone(now.nfl);
  fillCricketPhone(now.cricket);
  fillNflBar(now.nfl);
}

fetch(`${HOME}/api/public-now`)
  .then((r) => (r.ok ? r.json() : null))
  .then((now) => { if (now) paintNow(now); })
  .catch(() => {});

// ---------- pointer tilt (mouse only; the devices also float on their own) ----------
if (!reduce && matchMedia("(hover:hover)").matches) {
  document.querySelectorAll(".card").forEach((card) => {
    const dev = $(".dev", card);
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width) * 2 - 1, dy = ((e.clientY - r.top) / r.height) * 2 - 1;
      dev.style.setProperty("--ry", -20 + dx * 24 + "deg");
      dev.style.setProperty("--rx", 9 - dy * 16 + "deg");
    });
    card.addEventListener("pointerleave", () => { dev.style.removeProperty("--ry"); dev.style.removeProperty("--rx"); });
  });
}

// ---------- pause what nobody can see ----------
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("paused", !e.isIntersecting)), { rootMargin: "40px" });
  cards.forEach((c) => io.observe(c));
}
document.addEventListener("visibilitychange", () => document.body.classList.toggle("paused", document.hidden));
