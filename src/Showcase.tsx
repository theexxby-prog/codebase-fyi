import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { newestUrl, projects, type Accent, type Project } from './projects'
import previewSizes from './previews.json'

// One project on stage at a time, every project one click away in the rail.
// Advances on its own until the visitor touches it; arrow keys work too.

const AUTOPLAY_MS = 7000

const accents: Record<Accent, { color: string; tile: string }> = {
  blue: { color: 'oklch(0.62 0.19 250)', tile: 'from-blue-500 to-indigo-600' },
  rose: { color: 'oklch(0.65 0.2 12)', tile: 'from-rose-500 to-pink-600' },
  amber: { color: 'oklch(0.72 0.17 65)', tile: 'from-amber-500 to-orange-600' },
  violet: { color: 'oklch(0.62 0.21 300)', tile: 'from-violet-500 to-purple-600' },
  emerald: { color: 'oklch(0.68 0.16 165)', tile: 'from-emerald-500 to-teal-600' },
}

const sizes: Record<string, { w: number; h: number }> = previewSizes

const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '')

// First two letters of the leading word, so names sharing a surname
// (Shania Mehta / Samara Mehta) don't collapse to the same monogram.
function monogram(name: string) {
  const [first = ''] = name.split(' ').filter(Boolean)
  return first.slice(0, 2).toUpperCase()
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function Showcase() {
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [paused, setPaused] = useState(false)
  const reduced = usePrefersReducedMotion()
  const timer = useRef<number | null>(null)
  const active = projects[index]
  const running = autoplay && !paused && !reduced

  const goTo = useCallback((next: number, manual = true) => {
    setIndex(((next % projects.length) + projects.length) % projects.length)
    if (manual) setAutoplay(false)
  }, [])

  useEffect(() => {
    if (!running) return
    timer.current = window.setTimeout(() => goTo(index + 1, false), AUTOPLAY_MS)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [index, running, goTo])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(index + 1)
      if (e.key === 'ArrowLeft') goTo(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, goTo])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Projects"
      className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <Stage project={active} index={index} onPrev={() => goTo(index - 1)} onNext={() => goTo(index + 1)} />

      <div className="flex min-h-0 min-w-0 flex-col gap-4">
        <Details project={active} />
        <Rail index={index} onSelect={(i) => goTo(i)} running={running} />
      </div>
    </section>
  )
}

function Stage({
  project,
  index,
  onPrev,
  onNext,
}: {
  project: Project
  index: number
  onPrev: () => void
  onNext: () => void
}) {
  const accent = accents[project.accent]
  return (
    <div
      className="stage group relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5 dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-black/40"
      style={{ '--accent': accent.color } as CSSProperties}
    >
      <div className="flex items-center gap-1.5 border-b border-neutral-200 bg-neutral-100 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-800/60">
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="size-2 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        <span className="ml-2 truncate font-mono text-[11px] text-neutral-500">{hostname(project.url)}</span>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-neutral-400">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${project.name}`}
        className="relative block aspect-[16/10] min-h-0 flex-1 bg-neutral-100 lg:aspect-auto dark:bg-neutral-800"
      >
        {projects.map((p, i) => {
          const host = hostname(p.url)
          const image = sizes[host]
          const acc = accents[p.accent]
          return (
            <div
              key={p.url}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
            >
              {image ? (
                <img
                  src={`/previews/${host}.webp`}
                  alt={`Screenshot of ${p.name}`}
                  width={image.w}
                  height={image.h}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="stage-img size-full object-cover"
                  style={{ '--pan': `${Math.min(14, 3 + (image.h / image.w) * 3)}s` } as CSSProperties}
                />
              ) : (
                <div className={`flex size-full items-center justify-center bg-gradient-to-br ${acc.tile}`}>
                  <span className="text-6xl font-semibold tracking-tight text-white/90">{monogram(p.name)}</span>
                </div>
              )}
            </div>
          )
        })}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="pointer-events-none absolute right-4 bottom-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-neutral-900 opacity-0 shadow backdrop-blur transition group-hover:opacity-100 dark:bg-neutral-900/90 dark:text-neutral-100">
          Open {hostname(project.url)}
          <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
            <path d="M5 11L11 5M11 5H6M11 5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>

      <ArrowButton side="left" label="Previous project" onClick={onPrev} />
      <ArrowButton side="right" label="Next project" onClick={onNext} />
    </div>
  )
}

function ArrowButton({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 ${side === 'left' ? 'left-3' : 'right-3'} flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-700 opacity-0 shadow backdrop-blur transition group-hover:opacity-100 hover:text-neutral-900 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:scale-95 dark:border-neutral-700 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:text-white dark:focus-visible:outline-neutral-100`}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
        <path d={side === 'left' ? 'M10 3L5 8l5 5' : 'M6 3l5 5-5 5'} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function Details({ project }: { project: Project }) {
  const accent = accents[project.accent]
  return (
    <div key={project.url} className="reveal-fast" style={{ '--accent': accent.color } as CSSProperties}>
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold tracking-tight text-balance">{project.name}</h2>
        {project.url === newestUrl && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">New</span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{project.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {project.tags?.map((tag) => (
          <span key={tag} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
            {tag}
          </span>
        ))}
      </div>
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:scale-[0.98] dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white dark:focus-visible:outline-neutral-100"
      >
        Open {hostname(project.url)}
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
          <path d="M5 11L11 5M11 5H6M11 5v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  )
}

function Rail({ index, onSelect, running }: { index: number; onSelect: (i: number) => void; running: boolean }) {
  return (
    <ul
      className="-mx-1 flex min-h-0 gap-2 overflow-x-auto px-1 pb-1 lg:mt-auto lg:flex-col lg:overflow-y-auto lg:pb-0"
      role="tablist"
      aria-label="All projects"
    >
      {projects.map((p, i) => {
        const on = i === index
        const accent = accents[p.accent]
        return (
          <li key={p.url} className="shrink-0 lg:shrink">
            <button
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => onSelect(i)}
              style={{ '--accent': accent.color } as CSSProperties}
              className={`rail-item relative flex w-44 items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition lg:w-full ${
                on
                  ? 'border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900'
                  : 'border-transparent hover:bg-white/70 dark:hover:bg-neutral-900/60'
              } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 dark:focus-visible:outline-neutral-100`}
            >
              <span
                className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${accent.tile} text-xs font-semibold text-white/90`}
              >
                {monogram(p.name)}
              </span>
              <span className="min-w-0">
                <span className={`block truncate text-sm ${on ? 'font-medium text-neutral-900 dark:text-neutral-100' : 'text-neutral-700 dark:text-neutral-300'}`}>
                  {p.name}
                </span>
                <span className="block truncate font-mono text-[11px] text-neutral-500">{hostname(p.url)}</span>
              </span>
              {on && (
                <span
                  aria-hidden="true"
                  className={`progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-[var(--accent)] ${running ? 'progress-run' : ''}`}
                  style={{ '--autoplay': `${AUTOPLAY_MS}ms` } as CSSProperties}
                />
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
