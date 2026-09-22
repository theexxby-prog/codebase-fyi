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

// Edit this list to add, remove, or reorder projects. The first one is what
// the page opens on.
export const projects: Project[] = [
  {
    name: 'nfl',
    description:
      'The phone build of NFLBar, the macOS menu bar app. Five days of fixtures, kickoff times converted to wherever you are, the network carrying each game and a streaming link per service; it keeps the last board when the signal drops.',
    url: 'https://nfl.codebase.fyi',
    accent: 'blue',
    tags: ['Workers', 'PWA', 'ESPN'],
    status: 'live',
    added: '2026-09-20',
  },
  {
    name: 'cricket',
    description:
      "India men's T20Is, ODIs and Tests, with start times in your timezone and a Willow link. Fixtures come from CricketData and live scoring from ESPN, because a 100 hits a day cap does not survive polling a Test match.",
    url: 'https://cricket.codebase.fyi',
    accent: 'emerald',
    tags: ['Workers', 'PWA', 'CricketData', 'ESPN'],
    status: 'live',
    added: '2026-09-20',
  },
  {
    name: 'ledger',
    description:
      'Cards, annual fees, credits and subscriptions in one place, fed by SimpleFIN. Tells you which card to use, which fee is worth it, and what to cancel before it renews.',
    url: 'https://ledger.codebase.fyi',
    accent: 'violet',
    tags: ['Workers', 'Durable Objects', 'SimpleFIN', 'Mac mirror'],
    status: 'live',
    added: '2026-09-13',
    // Behind a PIN and full of real card data, so the preview is a mockup
    // with invented cards and figures.
    preview: false,
    mock: 'ledger.html',
  },
  {
    name: 'loans',
    description:
      'Family student-loan tracker. Balances tick daily from verified servicer figures, payments are matched from the bank feed through SimpleFIN, and each month the studentaid.gov file reconciles the record.',
    url: 'https://loans.codebase.fyi',
    accent: 'rose',
    tags: ['Workers', 'D1', 'Cron', 'SimpleFIN'],
    status: 'live',
    added: '2026-09-14',
    // Behind a PIN and full of real balances, so it gets a poster instead.
    preview: false,
  },
  {
    name: 'plexpull',
    description:
      'Browse a shared Plex library from any device and queue downloads; a Mac app picks them up and pulls the files home. Cloudflare Workers, D1 and a stdlib-only Python server.',
    url: 'https://plexpull.codebase.fyi',
    accent: 'emerald',
    tags: ['Workers', 'D1', 'Python', 'Mac app'],
    status: 'live',
    added: '2026-09-13',
    // Sits behind a PIN and browses a private library, so the preview is a
    // mockup with invented titles and no real artwork.
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

/** The url of the most recently added project (first in list order on a tie), for the "New" badge. */
export const newestUrl = projects.reduce<Project | undefined>(
  (best, p) => (p.added && (!best?.added || p.added > best.added) ? p : best),
  undefined,
)?.url
