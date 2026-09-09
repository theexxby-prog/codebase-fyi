import type { Project } from './projects'

const statusStyles = {
  'in-progress': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  archived: 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400',
} as const

const statusLabels = {
  'in-progress': 'In progress',
  archived: 'Archived',
} as const

// First two letters of the leading word, so names sharing a surname
// (Shania Mehta / Samara Mehta) don't collapse to the same monogram.
function monogram(name: string) {
  const [first = ''] = name.split(' ').filter(Boolean)
  return first.slice(0, 2).toUpperCase()
}

export function ProjectCard({ project }: { project: Project }) {
  const badge =
    project.status && project.status !== 'live' ? project.status : undefined

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:translate-y-0 active:shadow-none dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:shadow-black/40 dark:focus-visible:outline-neutral-100"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900">
          {monogram(project.name)}
        </span>
        <h2 className="flex-1 font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
          {project.name}
        </h2>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-4 shrink-0 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
        >
          <path
            d="M5 11L11 5M11 5H6M11 5v5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {badge && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[badge]}`}
          >
            {statusLabels[badge]}
          </span>
        )}
        {project.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  )
}
