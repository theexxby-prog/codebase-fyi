export type Project = {
  name: string
  description: string
  url: string
  tags?: string[]
  status?: 'live' | 'in-progress' | 'archived'
}

// Edit this list to add, remove, or reorder your projects.
export const projects: Project[] = [
  {
    name: 'Shania Mehta Portfolio',
    description: 'Personal portfolio site built with React and Tailwind.',
    url: 'https://shania.mehtahouse.cc',
    tags: ['React', 'Tailwind'],
    status: 'live',
  },
  {
    name: 'Project Two',
    description: 'Short description of what this project does.',
    url: 'https://example.com',
    tags: ['Tag'],
    status: 'in-progress',
  },
]
