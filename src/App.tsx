import { projects } from './projects'

const statusLabel: Record<NonNullable<(typeof projects)[number]['status']>, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  archived: 'Archived',
}

const statusStyle: Record<NonNullable<(typeof projects)[number]['status']>, string> = {
  live: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'in-progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  archived: 'bg-neutral-500/10 text-neutral-500 dark:text-neutral-400',
}

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-16 sm:px-8">
        <header className="mb-16">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">codebase.fyi</h1>
          <p className="mt-3 max-w-xl text-neutral-600 dark:text-neutral-400">
            A running list of things I'm building on the side.
          </p>
        </header>

        <main className="flex-1">
          <ul className="grid gap-4 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.url}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-full flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:focus-visible:outline-neutral-100 dark:active:bg-neutral-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-medium text-neutral-900 group-hover:underline dark:text-neutral-100">
                      {project.name}
                    </h2>
                    {project.status && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[project.status]}`}
                      >
                        {statusLabel[project.status]}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 flex-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {project.description}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <li
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </main>

        <footer className="mt-16 text-sm text-neutral-500 dark:text-neutral-500">
          <p>&copy; {new Date().getFullYear()} codebase.fyi</p>
        </footer>
      </div>
    </div>
  )
}

export default App
