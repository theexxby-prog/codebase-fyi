import { Projects } from './Projects'
import { ThemeToggle } from './ThemeToggle'
import { projects } from './projects'

function App() {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-8 pb-16 text-neutral-900 sm:px-8 md:pt-12 md:pb-24 dark:text-neutral-100">
      <header className="flex items-start justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            codebase<span className="text-neutral-400 dark:text-neutral-500">.fyi</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600 md:text-xl dark:text-neutral-400">
            Things I'm building on the side. Some for work, some for family, all of it a work in progress.
          </p>
          <p className="mt-3 font-mono text-xs text-neutral-500">{projects.length} projects</p>
        </div>
        <ThemeToggle />
      </header>

      <main className="mt-14 md:mt-20">
        <Projects />
      </main>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 font-mono text-xs text-neutral-500 md:mt-28 dark:border-neutral-800">
        <p>&copy; {new Date().getFullYear()} codebase.fyi</p>
        <a
          href="https://github.com/theexxby-prog/codebase-fyi"
          target="_blank"
          rel="noreferrer"
          className="rounded transition hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:hover:text-neutral-100 dark:focus-visible:outline-neutral-100"
        >
          source on GitHub
        </a>
      </footer>
    </div>
  )
}

export default App
