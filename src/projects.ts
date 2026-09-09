export type Accent = 'blue' | 'rose' | 'amber' | 'violet' | 'emerald'

export type Project = {
  name: string
  description: string
  url: string
  accent: Accent
  tags?: string[]
  status?: 'live' | 'in-progress' | 'archived'
  /** Set false for anything private — no screenshot is captured or shown. */
  preview?: boolean
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
    // Client portal behind a login; its screen shows real client names.
    preview: false,
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
