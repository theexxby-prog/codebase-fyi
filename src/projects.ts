export type Project = {
  name: string
  description: string
  url: string
  tags?: string[]
  status?: 'live' | 'in-progress' | 'archived'
}

// Edit this list to add, remove, or reorder projects.
export const projects: Project[] = [
  {
    name: 'Datamatics Business Solutions',
    description: 'Campaign management and lead generation platform for B2B demand gen.',
    url: 'https://datamatics.codebase.fyi',
    tags: ['Platform', 'Demand Gen'],
    status: 'live',
  },
  {
    name: 'Shania Mehta',
    description:
      'Portfolio for an Associate Account Executive at BerlinRosen, covering PR strategy for NYC cities and real estate brands.',
    url: 'https://shania.mehtahouse.cc',
    tags: ['Portfolio', 'React'],
    status: 'live',
  },
  {
    name: 'Samara Mehta',
    description:
      'Portfolio for a hospitality professional and kinesiology student, from barista to assistant manager.',
    url: 'https://samara.mehtahouse.cc',
    tags: ['Portfolio', 'React'],
    status: 'live',
  },
]
