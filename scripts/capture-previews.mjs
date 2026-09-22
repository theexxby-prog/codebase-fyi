/*
 * Regenerates the scrolling preview images in public/previews/.
 *
 * Needs tooling that isn't part of the app build:
 *   npm i -D playwright sharp && npx playwright install chromium
 *   npm run capture
 *
 * Reads the target URLs straight out of src/projects.ts so the two can't
 * drift, writes two webps per host (a desktop shot and a phone shot, which
 * the row swaps in below 768px) plus src/previews.json with their sizes; the
 * desktop size also sets how long the hover pan takes.
 *
 * Pass host names to capture only those and leave the other images and their
 * recorded sizes as they are:  npm run capture -- plexpull.codebase.fyi
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

// Each variant is shot at its viewport, then scaled to `width` and cropped
// to at most `width * maxRatio` tall so the hover pan stays watchable.
const variants = [
  { key: 'desktop', suffix: '', viewport: { width: 1280, height: 900 }, width: 900, maxRatio: 3.2 },
  { key: 'mobile', suffix: '.mobile', viewport: { width: 390, height: 844 }, width: 390, maxRatio: 2.2 },
]

const source = readFileSync(new URL('../src/projects.ts', import.meta.url), 'utf8')
const only = process.argv.slice(2)

// Split into per-project blocks so each flag stays tied to its own url.
const targets = source
  .split(/\},\s*\{/)
  .filter((block) => block.includes('url:'))
  .map((block) => ({
    url: block.match(/url:\s*'([^']+)'/)?.[1],
    mock: block.match(/mock:\s*'([^']+)'/)?.[1],
    skip: /preview:\s*false/.test(block),
    poster: /poster:\s*true/.test(block),
  }))
  // A mock stands in for sites that can't be shot live (private, login-gated).
  // Poster projects have generated art in place of a screenshot; leave it be.
  .filter((t) => t.url && !t.poster && (t.mock || !t.skip))
  .filter((t) => only.length === 0 || only.includes(new URL(t.url).hostname.replace(/^www\./, '')))

if (targets.length === 0) {
  console.error('No capturable projects found in src/projects.ts')
  process.exit(1)
}

mkdirSync(new URL('../public/previews/', import.meta.url), { recursive: true })

const browser = await chromium.launch({
  // The sandboxed egress proxy can't complete a TLS 1.3 handshake for the
  // browser, so cap the version. Harmless everywhere else.
  args: ['--ssl-version-max=tls1.2', '--disable-quic'],
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
  ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
})

const sizesFile = new URL('../src/previews.json', import.meta.url)
const sizes = only.length ? JSON.parse(readFileSync(sizesFile, 'utf8')) : {}

for (const { url, mock } of targets) {
  const host = new URL(url).hostname.replace(/^www\./, '')
  const entry = {}

  for (const variant of variants) {
    const ctx = await browser.newContext({
      viewport: variant.viewport,
      deviceScaleFactor: 2,
      ...(variant.key === 'mobile' ? { isMobile: true, hasTouch: true } : {}),
    })
    const page = await ctx.newPage()
    try {
      if (mock) {
        const file = new URL(`./mocks/${mock}`, import.meta.url)
        await page.goto(file.href, { waitUntil: 'load', timeout: 30000 })
        await page.waitForTimeout(400)
      } else {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })

        // Walk down the page rather than jumping: these sites reveal sections
        // with IntersectionObserver, and anything that never crosses the
        // viewport stays invisible in a full-page screenshot.
        await page.evaluate(async () => {
          const step = Math.round(window.innerHeight * 0.75)
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y)
            await new Promise((r) => setTimeout(r, 250))
          }
          window.scrollTo(0, document.body.scrollHeight)
          await new Promise((r) => setTimeout(r, 600))
          window.scrollTo(0, 0)
        })
        await page.waitForTimeout(2000)
      }

      const shot = await page.screenshot({ type: 'png', fullPage: true })
      const resized = sharp(shot).resize({ width: variant.width })
      const meta = await resized.toBuffer({ resolveWithObject: true })
      const height = Math.min(meta.info.height, Math.round(variant.width * variant.maxRatio))

      await sharp(meta.data)
        .extract({ left: 0, top: 0, width: variant.width, height })
        .webp({ quality: 78 })
        .toFile(new URL(`../public/previews/${host}${variant.suffix}.webp`, import.meta.url).pathname)

      entry[variant.key] = { w: variant.width, h: height }
      console.log(`captured ${host} ${variant.key} (${variant.width}x${height})`)
    } catch (error) {
      console.error(`failed ${host} ${variant.key}:`, String(error).split('\n')[0])
    }
    await ctx.close()
  }

  // Keep the desktop size at the top level so older entries stay readable.
  if (entry.desktop) sizes[host] = { ...entry.desktop, ...(entry.mobile ? { mobile: entry.mobile } : {}) }
}

writeFileSync(sizesFile, `${JSON.stringify(sizes, null, 2)}\n`)

await browser.close()
console.log('wrote src/previews.json')
