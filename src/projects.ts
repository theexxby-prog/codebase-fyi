export type Accent = 'blue' | 'rose' | 'amber' | 'violet' | 'emerald'

export type Project = {
  name: string
  description: string
  url: string
  accent: Accent
  tags?: string[]
  status?: 'live' | 'in-progress' | 'archived'
  /** Set false to never screenshot the live site (private or login-gated). */
  preview?: boolean
  /** Render this file from scripts/mocks/ instead of the live site. */
  mock?: string
  /** ISO date the project went up; the most recent one gets a "New" badge. */
  added?: string
}

// Edit this list to add, remove, or reorder projects.
export const projects: Project[] = [
  {
    name: 'plexpull',
    description:
      'Browse a shared Plex library from any device and queue downloads; a Mac app picks them up and pulls the files home. Cloudflare Workers, D1 and a stdlib-only Python server.',
    url: 'https://plexpull.codebase.fyi',
    accent: 'emerald',
    tags: ['Workers', 'D1', 'Python', 'Mac app'],
    status: 'live',
    added: '2026-09-13',
    // Sits behind Cloudflare Access and browses a private library, so the
    // preview is a mockup with invented titles and no real artwork.
    preview: false,
    mock: 'plexpull.html',
  },
  {
    name: 'Datamatics Business Solutions',
    description:
      'Campaign management and lead generation platform for B2B demand gen.',
    url: 'https://datamatics.codebase.fyi',
    accent: 'blue',
    tags: ['Platform', 'Demand Gen'],
    status: 'live',
    // Real portal is login-gated and shows client data, so the preview is a
    // mockup with invented accounts and figures.
    preview: false,
    mock: 'datamatics.html',
    added: '2026-09-09',
  },
  {
    name: 'Shania Mehta',
    description:
      'Portfolio for an Associate Account Executive at BerlinRosen, covering PR strategy for NYC cities and real estate brands.',
    url: 'https://shania.mehtahouse.cc',
    accent: 'rose',
    tags: ['Portfolio', 'React'],
    status: 'live',
    added: '2026-09-05',
  },
  {
    name: 'Samara Mehta',
    description:
      'Portfolio for a hospitality professional and kinesiology student, from barista to assistant manager.',
    url: 'https://samara.mehtahouse.cc',
    accent: 'amber',
    tags: ['Portfolio', 'React'],
    status: 'live',
    added: '2026-09-05',
  },
]

/** The url of the most recently added project, for the "New" badge. */
export const newestUrl = projects
  .filter((p) => p.added)
  .sort((a, b) => (b.added! > a.added! ? 1 : -1))[0]?.url
