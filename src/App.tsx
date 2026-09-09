import { ProjectCard } from './ProjectCard'
import { projects } from './projects'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-20 sm:px-8">
        <header className="mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            {projects.length} projects live
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            codebase.fyi
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
            Things I'm building on the side. Some are for work, some are for
            family, all of them are works in progress.
          </p>
        </header>

        <main className="flex-1">
          <ul className="grid gap-5 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.url}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        </main>

        <footer className="mt-20 border-t border-neutral-200 pt-6 text-sm text-neutral-500 dark:border-neutral-800">
          <p>&copy; {new Date().getFullYear()} codebase.fyi</p>
        </footer>
      </div>
    </div>
  )
}

export default App
