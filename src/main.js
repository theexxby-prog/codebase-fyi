// codebase.fyi: styles, the entrance stagger, the look switch, the pointer sheen on desktop
// (emblem only), and live status dots for the public apps. The dots come from
// home.codebase.fyi/api/public-status, which only ever says up or down for the apps shown
// here. If it can't be reached the dots just stay neutral.

import "./glass.css";
import "./site.css";
import "./look-emblem.css";
import "./look-ink.css";
import "./look-postcards.css";

const root = document.documentElement;

document.querySelectorAll(".rise").forEach((el, i) => el.style.setProperty("--i", i));

// the look switch in the footer; the head script already applied the saved choice
const opts = document.querySelectorAll(".look .opt");
const paintLook = () => opts.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.look === root.dataset.look)));
opts.forEach((b) =>
  b.addEventListener("click", () => {
    root.dataset.look = b.dataset.look;
    try { localStorage.setItem("look", b.dataset.look); } catch {}
    paintLook();
  }),
);
paintLook();

// postcards: the seal carries today's date
{
  const d = new Date();
  const mon = document.querySelector(".seal-mon");
  const day = document.querySelector(".seal-day");
  if (mon) mon.textContent = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  if (day) day.textContent = String(d.getDate());
}

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

// desktop only, emblem look: the specular arc follows the pointer
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let raf = 0;
  let target = null;
  let px = 0;
  let py = 0;
  document.addEventListener("pointermove", (e) => {
    if (root.dataset.look !== "emblem") return;
    const t = e.target.closest?.(".card, .pill");
    if (!t) return;
    target = t;
    px = e.clientX;
    py = e.clientY;
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = target.getBoundingClientRect();
        target.style.setProperty("--mx", (((px - r.left) / r.width) * 100).toFixed(1) + "%");
        target.style.setProperty("--my", (((py - r.top) / r.height) * 100).toFixed(1) + "%");
      });
  });
  document.addEventListener("pointerout", (e) => {
    const t = e.target.closest?.(".card, .pill");
    if (t) {
      t.style.removeProperty("--mx");
      t.style.removeProperty("--my");
    }
  });
}
