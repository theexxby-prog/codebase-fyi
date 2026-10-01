// codebase.fyi: styles, the entrance stagger, the moon/sun toggle, and live status dots for the public
// apps. The dots come from home.codebase.fyi/api/public-status, which only ever says up or down for the
// apps shown here. If it can't be reached the dots just stay neutral.

import "./glass.css";
import "./site.css";
import "./look-house.css";

const root = document.documentElement;

document.querySelectorAll(".rise").forEach((el, i) => el.style.setProperty("--i", i));

// the moon/sun toggle (outermost top right, as in every house app); the head script already applied it
const themeBtn = document.querySelector(".theme");
function paintTheme() {
  const dark = root.dataset.theme === "dark";
  themeBtn?.setAttribute("aria-label", dark ? "Light mode" : "Dark mode");
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#15120f" : "#f5f1ea"));
}
themeBtn?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.theme = next; } catch {}
  paintTheme();
});
paintTheme();

fetch("https://home.codebase.fyi/api/public-status")
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data) return;
    document.querySelectorAll(".card[data-id]").forEach((card) => {
      const s = data.apps[card.dataset.id];
      if (!s) return;
      card.dataset.status = s.up ? "up" : "down";
      card.querySelectorAll(".dot").forEach((dot) => {
        dot.className = "dot" + (s.up ? "" : " down");
        dot.title = s.up ? "Up" : "Not responding";
      });
    });
  })
  .catch(() => {});
