export type Accent = 'blue' | 'rose' | 'amber' | 'violet' | 'emerald'

export type Group = 'personal' | 'work' | 'family'

export type Project = {
  name: string
  description: string
  url: string
  accent: Accent
  /** Which section of the page the project sits under. */
  group: Group
  tags?: string[]
  status?: 'live' | 'in-progress' | 'archived'
  /** Set false to never screenshot the live site (private or login-gated). */
  preview?: boolean
  /** Render this file from scripts/mocks/ instead of the live site. */
  mock?: string
  /** The images are generated posters, not screenshots; the capture script
   *  leaves them alone and the card skips the scrolling pan. */
  poster?: boolean
  /** ISO date the project went up; the most recent one gets a "New" badge. */
  added?: string
}

// Label shown on each card for its group.
export const groups: { id: Group; label: string }[] = [
  { id: 'personal', label: 'Personal' },
  { id: 'work', label: 'Work' },
  { id: 'family', label: 'Family' },
]

// Edit this list to add, remove, or reorder projects. The most recently
// added one is featured at the top; the rest follow list order.
export const projects: Project[] = [
  {
    name: 'nfl',
    description:
      'The phone build of NFLBar, the macOS menu bar app. Five days of fixtures, kickoff times converted to wherever you are, the network carrying each game and a streaming link per service; it keeps the last board when the signal drops.',
    url: 'https://nfl.codebase.fyi',
    accent: 'blue',
    group: 'personal',
    tags: ['Workers', 'PWA', 'ESPN'],
    status: 'live',
    added: '2026-09-20',
    poster: true,
  },
  {
    name: 'cricket',
    description:
      "India men's T20Is, ODIs and Tests, with start times in your timezone and a Willow link. Fixtures come from CricketData and live scoring from ESPN, because a 100 hits a day cap does not survive polling a Test match.",
    url: 'https://cricket.codebase.fyi',
    accent: 'emerald',
    group: 'personal',
    tags: ['Workers', 'PWA', 'CricketData', 'ESPN'],
    status: 'live',
    added: '2026-09-20',
    poster: true,
  },
  {
    name: 'Family student loans',
    description:
      'Every federal student loan in the family, with balances, what auto-pays each month, and which servicer still needs chasing. Pulls from studentaid.gov, PIN-locked.',
    url: 'https://loans.codebase.fyi',
    accent: 'blue',
    group: 'family',
    tags: ['Finance', 'studentaid.gov', 'PIN-locked'],
    status: 'live',
    added: '2026-09-15',
    // PIN-gated and full of real balances and servicer notes, so it gets a
    // poster instead of a screenshot.
    preview: false,
    poster: true,
  },
  {
    name: 'ledger',
    description:
      'Cards, annual fees, credits and subscriptions in one place, fed by SimpleFIN. Tells you which card to use, which fee is worth it, and what to cancel before it renews.',
    url: 'https://ledger.codebase.fyi',
    accent: 'violet',
    group: 'personal',
    tags: ['Workers', 'Durable Objects', 'SimpleFIN', 'Mac mirror'],
    status: 'live',
    added: '2026-09-13',
    // Behind a PIN and full of real card data, so it gets a poster instead
    // of a screenshot.
    preview: false,
    poster: true,
  },
  {
    name: 'plexpull',
    description:
      'Browse a shared Plex library from any device and queue downloads; a Mac app picks them up and pulls the files home. Cloudflare Workers, D1 and a stdlib-only Python server.',
    url: 'https://plexpull.codebase.fyi',
    accent: 'emerald',
    group: 'personal',
    tags: ['Workers', 'D1', 'Python', 'Mac app'],
    status: 'live',
    added: '2026-09-13',
    // Sits behind a PIN and browses a private library, so it gets a poster
    // instead of a screenshot.
    preview: false,
    poster: true,
  },
  {
    name: 'Datamatics Business Solutions',
    description:
      'Campaign management and lead generation platform for B2B demand gen.',
    url: 'https://datamatics.codebase.fyi',
    accent: 'blue',
    group: 'work',
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
    group: 'family',
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
    group: 'family',
    tags: ['Portfolio', 'React'],
    status: 'live',
    added: '2026-09-05',
  },
]

/** The url of the most recently added project (first in list order on a tie), for the "New" badge. */
export const newestUrl = projects.reduce<Project | undefined>(
  (best, p) => (p.added && (!best?.added || p.added > best.added) ? p : best),
  undefined,
)?.url
