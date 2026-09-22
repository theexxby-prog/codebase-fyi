import type { CSSProperties } from 'react'
import { groups, newestUrl, projects, type Accent, type Project } from './projects'
import previewSizes from './previews.json'

// The newest project gets a full-width feature; the rest sit in a two-up
// grid. Every card is one link, lit from behind in its own accent color.

const accents: Record<Accent, string> = {
  blue: '#3b82f6',
  rose: '#f43f5e',
  amber: '#f59e0b',
  violet: '#8b5cf6',
  emerald: '#10b981',
}

type Size = { w: number; h: number }
const sizes: Record<string, Size & { mobile?: Size }> = previewSizes

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '')

const groupLabel = (id: Project['group']) => groups.find((g) => g.id === id)?.label ?? id

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
  const feature = projects.find((p) => p.url === newestUrl) ?? projects[0]
  const rest = projects.filter((p) => p !== feature)

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <Feature project={feature} />

      <ul className="grid gap-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16">
        {rest.map((p) => (
          <li key={p.url}>
            <Card project={p} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Feature({ project }: { project: Project }) {
  const host = hostname(project.url)
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      style={{ '--accent': accents[project.accent] } as CSSProperties}
      className="group grid gap-8 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-neutral-100 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:items-center md:gap-14"
    >
      <Preview project={project} host={host} />

      <div className="min-w-0">
        <Meta project={project} host={host} />
        <h2 className="mt-3 font-display text-4xl leading-none font-semibold tracking-[-0.03em] md:text-5xl">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
            {project.name}
          </span>
        </h2>
        <p className="mt-5 max-w-lg text-[17px] leading-relaxed text-neutral-300">{project.description}</p>
        <Tags project={project} />
        <Link host={host} />
      </div>
    </a>
  )
}

function Card({ project }: { project: Project }) {
  const host = hostname(project.url)
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noreferrer"
      style={{ '--accent': accents[project.accent] } as CSSProperties}
      className="group flex flex-col gap-6 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-neutral-100"
    >
      <Preview project={project} host={host} />

      <div className="min-w-0">
        <Meta project={project} host={host} />
        <h2 className="mt-2 font-display text-3xl leading-none font-semibold tracking-[-0.03em]">
          <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
            {project.name}
          </span>
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-neutral-400">{project.description}</p>
        <Tags project={project} />
        <Link host={host} />
      </div>
    </a>
  )
}

function Meta({ project, host }: { project: Project; host: string }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-neutral-500">
      <span className="uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
        {groupLabel(project.group)}
      </span>
      {project.url === newestUrl && (
        <>
          <span aria-hidden="true">·</span>
          <span className="uppercase tracking-wider text-neutral-300">Newest</span>
        </>
      )}
      {project.added && (
        <>
          <span aria-hidden="true">·</span>
          <span>{formatDate(project.added)}</span>
        </>
      )}
      <span className="sr-only">{host}</span>
    </p>
  )
}

function Tags({ project }: { project: Project }) {
  if (!project.tags?.length) return null
  return (
    <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-neutral-500">
      {project.tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  )
}

function Link({ host }: { host: string }) {
  return (
    <p className="mt-6 font-mono text-sm text-neutral-100">
      {host}
      <span aria-hidden="true" className="ml-1.5 inline-block transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </p>
  )
}

function Preview({ project, host }: { project: Project; host: string }) {
  const image = sizes[host]
  return (
    <div className="relative">
      <div aria-hidden="true" className="glow absolute -inset-8 -z-10 rounded-[2rem] blur-2xl md:-inset-12" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/10 shadow-2xl shadow-black/60 transition-transform duration-500 ease-out group-hover:-translate-y-1 md:aspect-[16/10]">
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
              alt={`${project.poster ? 'Poster for' : 'Screenshot of'} ${project.name}`}
              width={image.w}
              height={image.h}
              loading="lazy"
              decoding="async"
              // A poster has nothing to scroll, so it gets a slow push-in
              // instead of the screenshot's downward pan.
              className={`size-full object-cover ${project.poster ? 'preview-poster' : 'preview-img'}`}
              style={{ '--pan': `${Math.min(14, 3 + (image.h / image.w) * 3)}s` } as CSSProperties}
            />
          </picture>
        ) : (
          <div className="flex size-full items-center justify-center" style={{ background: 'var(--accent)' }}>
            <span className="font-display text-6xl font-semibold tracking-tight text-white/90">{monogram(project.name)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
