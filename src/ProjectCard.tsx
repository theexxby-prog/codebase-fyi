import type { MouseEvent } from 'react'
import type { Accent, Project } from './projects'
import { SitePreview } from './SitePreview'
import previewSizes from './previews.json'

const accents: Record<Accent, { color: string; tile: string; ring: string }> = {
  blue: {
    color: 'oklch(0.62 0.19 250)',
    tile: 'from-blue-500 to-indigo-600',
    ring: 'group-hover:border-blue-500/40',
  },
  rose: {
    color: 'oklch(0.65 0.2 12)',
    tile: 'from-rose-500 to-pink-600',
    ring: 'group-hover:border-rose-500/40',
  },
  amber: {
    color: 'oklch(0.72 0.17 65)',
    tile: 'from-amber-500 to-orange-600',
    ring: 'group-hover:border-amber-500/40',
  },
  violet: {
    color: 'oklch(0.62 0.21 300)',
    tile: 'from-violet-500 to-purple-600',
    ring: 'group-hover:border-violet-500/40',
  },
  emerald: {
    color: 'oklch(0.68 0.16 165)',
    tile: 'from-emerald-500 to-teal-600',
    ring: 'group-hover:border-emerald-500/40',
  },
}

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

function hostname(url: string) {
  return new URL(url).hostname.replace(/^www\./, '')
}

const sizes: Record<string, { w: number; h: number }> = previewSizes

export function ProjectCard({ project }: { project: Project }) {
  const accent = accents[project.accent]
  const badge =
    project.status && project.status !== 'live' ? project.status : undefined
  const host = hostname(project.url)
  // Whatever the capture script produced — a live screenshot or a mockup.
  const preview = sizes[host]

  function trackPointer(event: MouseEvent<HTMLAnchorElement>) {
    const card = event.currentTarget
    const box = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${event.clientX - box.left}px`)
    card.style.setProperty('--my', `${event.clientY - box.top}px`)
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      onMouseMove={trackPointer}
      style={{ '--accent': accent.color } as React.CSSProperties}
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-neutral-900/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:translate-y-0 dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:shadow-black/40 dark:focus-visible:outline-neutral-100 ${accent.ring}`}
    >
      <div className="spotlight pointer-events-none absolute inset-0 -z-10" />

      <SitePreview
        host={host}
        name={project.name}
        image={preview}
        tile={accent.tile}
        monogram={monogram(project.name)}
      />

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-medium tracking-tight text-balance text-neutral-900 dark:text-neutral-100">
            {project.name}
          </h2>
        </div>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="size-4 shrink-0 text-neutral-400 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-900 dark:group-hover:text-neutral-100"
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
