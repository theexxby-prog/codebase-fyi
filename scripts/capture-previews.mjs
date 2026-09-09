/*
 * Regenerates the scrolling preview images in public/previews/.
 *
 * Needs tooling that isn't part of the app build:
 *   npm i -D playwright sharp && npx playwright install chromium
 *   npm run capture
 *
 * Reads the target URLs straight out of src/projects.ts so the two can't
 * drift, writes one webp per host plus src/previews.json (intrinsic sizes,
 * which the card uses to work out how far to scroll on hover).
 */
import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const WIDTH = 900
const MAX_RATIO = 3.2 // cap page height so the hover scroll stays watchable

const source = readFileSync(new URL('../src/projects.ts', import.meta.url), 'utf8')

// Split into per-project blocks so each flag stays tied to its own url.
const targets = source
  .split(/\},\s*\{/)
  .filter((block) => block.includes('url:'))
  .map((block) => ({
    url: block.match(/url:\s*'([^']+)'/)?.[1],
    mock: block.match(/mock:\s*'([^']+)'/)?.[1],
    skip: /preview:\s*false/.test(block),
  }))
  // A mock stands in for sites that can't be shot live (private, login-gated).
  .filter((t) => t.url && (t.mock || !t.skip))

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

const sizes = {}

for (const { url, mock } of targets) {
  const host = new URL(url).hostname.replace(/^www\./, '')
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
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
    const resized = sharp(shot).resize({ width: WIDTH })
    const meta = await resized.toBuffer({ resolveWithObject: true })
    const height = Math.min(meta.info.height, Math.round(WIDTH * MAX_RATIO))

    await sharp(meta.data)
      .extract({ left: 0, top: 0, width: WIDTH, height })
      .webp({ quality: 78 })
      .toFile(new URL(`../public/previews/${host}.webp`, import.meta.url).pathname)

    sizes[host] = { w: WIDTH, h: height }
    console.log(`captured ${host} (${WIDTH}x${height})`)
  } catch (error) {
    console.error(`failed ${host}:`, String(error).split('\n')[0])
  }
  await ctx.close()
}

writeFileSync(
  new URL('../src/previews.json', import.meta.url),
  `${JSON.stringify(sizes, null, 2)}\n`,
)

await browser.close()
console.log('wrote src/previews.json')
