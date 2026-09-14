import { Projects } from './Projects'
import { projects } from './projects'

const newest = projects.reduce<string | undefined>(
  (best, p) => (p.added && (!best || p.added > best) ? p.added : best),
  undefined,
)

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Hero() {
  return (
    <header className="relative isolate flex min-h-[72svh] flex-col justify-end overflow-hidden md:min-h-[78svh]">
      {/* Ribbon backdrop; the ribbon lives in the right half, so the copy sits left. */}
      <picture>
        <source media="(max-width: 767px)" srcSet="/hero-960.webp" />
        <img
          src="/hero.webp"
          alt=""
          width={1920}
          height={1072}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 size-full object-cover object-[70%_50%] md:object-[50%_50%]"
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

      <div className="mx-auto w-full max-w-6xl px-6 pt-10 pb-12 sm:px-8 md:pb-20">
        <p className="reveal font-mono text-xs tracking-wider text-neutral-400 uppercase">codebase.fyi</p>
        <h1
          className="reveal mt-4 max-w-4xl font-display text-[2.75rem] leading-[0.95] font-semibold tracking-[-0.03em] text-balance sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ animationDelay: '80ms' }}
        >
          Things I'm building on the side.
        </h1>
        <p
          className="reveal mt-6 max-w-xl text-lg leading-relaxed text-neutral-300 md:text-xl"
          style={{ animationDelay: '160ms' }}
        >
          Some for work, some for family, all of it a work in progress.
        </p>
        <p className="reveal mt-8 font-mono text-xs text-neutral-500" style={{ animationDelay: '240ms' }}>
          {projects.length} projects{newest ? ` · newest added ${formatDate(newest)}` : ''}
        </p>
      </div>
    </header>
  )
}

function App() {
  return (
    // overflow-x-clip: the accent glows bleed past the page gutter on phones.
    // Clip (not hidden) so this never becomes a scroll container.
    <div className="overflow-x-clip text-neutral-100">
      <Hero />

      <main className="mx-auto max-w-6xl px-6 pt-16 sm:px-8 md:pt-24">
        <Projects />
      </main>

      <footer className="mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 pt-6 pb-12 font-mono text-xs text-neutral-500 sm:px-8 md:mt-32">
        <p>&copy; {new Date().getFullYear()} codebase.fyi</p>
        <a
          href="https://github.com/theexxby-prog/codebase-fyi"
          target="_blank"
          rel="noreferrer"
          className="rounded transition hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-100"
        >
          source on GitHub
        </a>
      </footer>
    </div>
  )
}

export default App
