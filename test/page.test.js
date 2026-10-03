// Guards for the front page: a full-rectangle grid at 2 and 4 across (a wide card counts two cells and must start on
// an even cell), no retired apps, no invented numbers, system font only, and the dark theme only from the toggle.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (f) => readFile(new URL(`../${f}`, import.meta.url), "utf8");

test("the grid is a full rectangle at 2 and 4 across", async () => {
  const html = await read("index.html");
  const cards = [...html.matchAll(/<a class="card( wide)?" href="([^"]+)"/g)].map((m) => ({ wide: !!m[1], href: m[2] }));
  assert.equal(cards.length, 7, "seven apps");
  let at = 0;
  for (const c of cards) {
    if (c.wide) assert.equal(at % 2, 0, `${c.href} is wide but starts on an odd cell`);
    at += c.wide ? 2 : 1;
  }
  assert.equal(at % 4, 0, `${at} cells is not a multiple of 4`);
  assert.equal(new Set(cards.map((c) => c.href)).size, cards.length, "no duplicate cards");
});

test("retired and private apps never appear", async () => {
  const html = await read("index.html");
  for (const f of ["marker", "pricegap", "ledger.codebase", "loans.codebase", "medical.codebase", "balance.codebase", "books.codebase", "plexpull", "list.codebase"]) {
    assert.doesNotMatch(html, new RegExp(f, "i"), f);
  }
});

test("no invented numbers: the phone screens hold placeholders, not scores", async () => {
  const html = await read("index.html");
  assert.doesNotMatch(html, /\b\d{1,3}\/\d\b|\b\d{2} · [A-Z]{2,3} \d{2}\b|· [A-Z]{2,3} \d{2}</, "no fake scores");
  assert.doesNotMatch(html, /187|DAL|PHI|\+ 140/, "none of the mockup's sample numbers");
});

test("system font only, light by default and dark only from the toggle", async () => {
  const html = await read("index.html");
  const css = await read("src/site.css");
  const js = await read("src/main.js");
  assert.doesNotMatch(html, /fonts\.googleapis|fonts\.gstatic/);
  assert.doesNotMatch(css, /@import|font-family:\s*["']?(?!var\(--font\)|-apple-system)/);
  for (const [name, text] of [["index.html", html], ["site.css", css], ["main.js", js]]) assert.doesNotMatch(text, /prefers-color-scheme/, name);
  assert.match(css, /prefers-reduced-motion/);
  assert.doesNotMatch(css, /color-mix/); // needs iOS 16.2
  assert.match(html, /localStorage\.theme === 'dark'/);
  assert.match(html, /<html lang="en">/);
});

test("animation only moves transform, opacity and stroke-dashoffset", async () => {
  const css = await read("src/site.css");
  let n = 0;
  for (let i = css.indexOf("@keyframes"); i !== -1; i = css.indexOf("@keyframes", i + 1)) {
    let depth = 0, j = css.indexOf("{", i);
    for (; j < css.length; j++) { if (css[j] === "{") depth++; if (css[j] === "}" && --depth === 0) break; }
    const kf = css.slice(i, j + 1);
    assert.doesNotMatch(kf, /(?:^|[{;\s])(?:width|height|top|left|right|bottom|margin|padding|box-shadow|filter|background)\s*:/, kf.slice(0, 30));
    n++;
  }
  assert.ok(n >= 6, `found the keyframes (${n})`);
});
