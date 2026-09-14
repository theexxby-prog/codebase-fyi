import type { CSSProperties } from 'react'
import { groups, newestUrl, projects, type Accent, type Project } from './projects'
import previewSizes from './previews.json'

// Every project on the page at once, grouped into sections. A row is a
// screenshot beside the write-up on wide screens and a stacked card on a
// phone; the whole thing is one link.

const tiles: Record<Accent, string> = {
  blue: 'from-blue-500 to-indigo-600',
  rose: 'from-rose-500 to-pink-600',
  amber: 'from-amber-500 to-orange-600',
  violet: 'from-violet-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-600',
}

type Size = { w: number; h: number }
const sizes: Record<string, Size & { mobile?: Size }> = previewSizes

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '')

// First two letters of the leading word, so names sharing a surname
// (Shania Mehta / Samara Mehta) don't collapse to the same monogram.
function monogram(name: string) {
  const [first = ''] = name.split(' ').filter(Boolean)
  return first.slice(0, 2).toUpperCase()
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function Projects() {
  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {groups.map((group) => {
        const rows = projects.filter((p) => p.group === group.id)
        if (rows.length === 0) return null
        return (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <h2
              id={`group-${group.id}`}
              className="mb-6 font-mono text-xs tracking-wider text-neutral-500 uppercase md:mb-8"
            >
              {group.heading}
            </h2>
            <ul className="flex flex-col gap-12 md:gap-16">
              {rows.map((p) => (
                <li key={p.url}>
                  <Row project={p} />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function Row({ project }: { project: Project }) {
  const host = hostname(project.url)
  const image = sizes[host]
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      className="group grid gap-5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-neutral-900 md:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] md:items-center md:gap-10 dark:focus-visible:outline-neutral-100"
    >
      <Preview project={project} host={host} image={image} />

      <div className="min-w-0 md:pt-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-2xl font-semibold tracking-tight underline-offset-4 group-hover:underline">{project.name}</h3>
          {project.url === newestUrl && (
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              New
            </span>
          )}
        </div>

        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 dark:text-neutral-400">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-neutral-500">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}

        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-neutral-500">
          <span className="text-neutral-900 dark:text-neutral-100">
            {host}
            <span aria-hidden="true" className="ml-1 inline-block transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </span>
          {project.added && (
            <>
              <span aria-hidden="true">·</span>
              <span>{formatDate(project.added)}</span>
            </>
          )}
        </p>
      </div>
    </a>
  )
}

function Preview({ project, host, image }: { project: Project; host: string; image?: Size & { mobile?: Size } }) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="ml-2 truncate font-mono text-[11px] text-neutral-500">{host}</span>
      </div>
      <div className="relative aspect-[4/5] bg-neutral-100 md:aspect-[16/10] dark:bg-neutral-800">
        {image ? (
          // Phones get a capture of the site's own phone layout; anything
          // wider gets the desktop capture.
          <picture className="contents">
            {image.mobile && (
              <source
                media="(max-width: 767px)"
                srcSet={`/previews/${host}.mobile.webp`}
                width={image.mobile.w}
                height={image.mobile.h}
              />
            )}
            <img
              src={`/previews/${host}.webp`}
              alt={`Screenshot of ${project.name}`}
              width={image.w}
              height={image.h}
              loading="lazy"
              decoding="async"
              className="preview-img size-full object-cover"
              style={{ '--pan': `${Math.min(14, 3 + (image.h / image.w) * 3)}s` } as CSSProperties}
            />
          </picture>
        ) : (
          <div className={`flex size-full items-center justify-center bg-gradient-to-br ${tiles[project.accent]}`}>
            <span className="text-5xl font-semibold tracking-tight text-white/90">{monogram(project.name)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
