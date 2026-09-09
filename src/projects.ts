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
}

// Edit this list to add, remove, or reorder projects.
export const projects: Project[] = [
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
  },
  {
    name: 'Shania Mehta',
    description:
      'Portfolio for an Associate Account Executive at BerlinRosen, covering PR strategy for NYC cities and real estate brands.',
    url: 'https://shania.mehtahouse.cc',
    accent: 'rose',
    tags: ['Portfolio', 'React'],
    status: 'live',
  },
  {
    name: 'Samara Mehta',
    description:
      'Portfolio for a hospitality professional and kinesiology student, from barista to assistant manager.',
    url: 'https://samara.mehtahouse.cc',
    accent: 'amber',
    tags: ['Portfolio', 'React'],
    status: 'live',
  },
]
