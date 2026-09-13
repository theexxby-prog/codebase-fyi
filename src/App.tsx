import { Showcase } from './Showcase'
import { ThemeToggle } from './ThemeToggle'
import { projects } from './projects'

function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="dot-grid absolute inset-0 text-neutral-300 dark:text-neutral-700" />
      <div className="blob absolute -top-40 -left-32 size-[36rem] rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-500/10" />
      <div className="blob-slow absolute -top-24 right-[-10rem] size-[32rem] rounded-full bg-rose-500/15 blur-3xl dark:bg-rose-500/10" />
    </div>
  )
}

function App() {
  return (
    <div className="text-neutral-900 dark:text-neutral-100">
      <Background />

      {/* One screen on a laptop: header, the showcase, footer. Phones scroll. */}
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 px-5 py-5 sm:px-8 sm:py-6 md:h-dvh md:gap-8">
        <header className="reveal flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl">
              codebase
              <span className="bg-gradient-to-r from-blue-600 to-rose-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-rose-400">
                .fyi
              </span>
            </h1>
            <p className="hidden text-sm text-neutral-600 sm:block dark:text-neutral-400">
              Things I'm building on the side. Some for work, some for family, all works in progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-mono text-xs text-neutral-600 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
              {projects.length} projects live
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main className="reveal flex min-h-0 flex-1 flex-col" style={{ animationDelay: '120ms' }}>
          <Showcase />
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4 font-mono text-xs text-neutral-500 dark:border-neutral-800">
          <p>&copy; {new Date().getFullYear()} codebase.fyi</p>
          <p className="hidden sm:block">← → to switch projects</p>
          <a
            href="https://github.com/theexxby-prog/codebase-fyi"
            target="_blank"
            rel="noreferrer"
            className="rounded transition hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
          >
            source
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App
