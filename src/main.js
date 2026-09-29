// codebase.fyi: styles, the entrance stagger, the pointer sheen on desktop,
// and live status dots for the public apps. The dots come from
// home.codebase.fyi/api/public-status, which only ever says up or down for
// the apps shown here. If it can't be reached the dots just stay neutral.

import "./glass.css";
import "./site.css";

document.querySelectorAll(".rise").forEach((el, i) => el.style.setProperty("--i", i));

fetch("https://home.codebase.fyi/api/public-status")
  .then((r) => (r.ok ? r.json() : null))
  .then((data) => {
    if (!data) return;
    document.querySelectorAll(".card[data-id]").forEach((card) => {
      const s = data.apps[card.dataset.id];
      const dot = card.querySelector(".dot");
      if (!s || !dot) return;
      dot.className = "dot" + (s.up ? "" : " down");
      dot.title = s.up ? "Up" : "Not responding";
    });
  })
  .catch(() => {});

// desktop only: the specular arc follows the pointer
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  let raf = 0;
  let target = null;
  let px = 0;
  let py = 0;
  document.addEventListener("pointermove", (e) => {
    const t = e.target.closest?.(".glass");
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
    const t = e.target.closest?.(".glass");
    if (t) {
      t.style.removeProperty("--mx");
      t.style.removeProperty("--my");
    }
  });
}
