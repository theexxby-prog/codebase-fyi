import { ProjectCard } from './ProjectCard'
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
    <div className="min-h-screen text-neutral-900 dark:text-neutral-100">
      <Background />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-12 sm:px-8 sm:py-16">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <header className="reveal mb-16 pt-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 font-mono text-xs text-neutral-600 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-400">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
            </span>
            {projects.length} projects live
          </span>

          <h1 className="mt-6 text-5xl font-semibold tracking-tighter sm:text-7xl">
            codebase
            <span className="bg-gradient-to-r from-blue-600 to-rose-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-rose-400">
              .fyi
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Things I'm building on the side. Some are for work, some are for
            family, all of them are works in progress.
          </p>
        </header>

        <main className="flex-1">
          <ul className="grid gap-5 sm:grid-cols-2">
            {projects.map((project, index) => (
              <li
                key={project.url}
                className="reveal min-w-0"
                style={{ animationDelay: `${120 + index * 90}ms` }}
              >
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </main>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 font-mono text-xs text-neutral-500 dark:border-neutral-800">
          <p>&copy; {new Date().getFullYear()} codebase.fyi</p>
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
