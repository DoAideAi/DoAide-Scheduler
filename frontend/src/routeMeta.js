/**
 * SEO metadata for every public, indexable route. Shared by the useSEO hook
 * (wired in App) and scripts/prerender-routes.mjs (static HTML, sitemap,
 * serve.json), so keep it plain JS with no JSX or browser-only imports.
 * Signed-in pages and booking links (/book/...) are deliberately absent.
 * Tools also reachable at a short path list it in `aliases`: same page,
 * canonical to /tools/..., left out of the sitemap.
 */

import { BLOG_ARTICLES } from './data/blogArticles.js'

export const SITE = {
  name: 'DoAide Scheduler',
  baseUrl: 'https://scheduler.doaide.com',
  ogImage: 'https://scheduler.doaide.com/og-scheduler.png',
}

const ORG = { '@type': 'Organization', name: 'DoAide', url: 'https://doaide.com' }

// Product + FAQ structured data, home page only (moved from index.html,
// where it was stamped on every URL).
const HOME_GRAPH = [
    {
      "@type": "SoftwareApplication",
      "name": "DoAide Scheduler",
      "url": "https://scheduler.doaide.com",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "AI-powered meeting scheduling with booking links, calendar sync, and team scheduling.",
      "offers": [
        {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "name": "Free"
        },
        {
          "@type": "Offer",
          "price": "12",
          "priceCurrency": "USD",
          "name": "Pro"
        },
        {
          "@type": "Offer",
          "price": "25",
          "priceCurrency": "USD",
          "name": "Team"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How does DoAide Scheduler prevent double-booking?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "It syncs with your calendar in real-time. When someone books a slot, it's immediately blocked across all connected calendars."
          }
        },
        {
          "@type": "Question",
          "name": "Can I set different availability for different meeting types?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Each meeting type has its own availability rules, buffer times, and duration settings."
          }
        },
        {
          "@type": "Question",
          "name": "Does it work with Google Calendar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. On the Pro plan, DoAide Scheduler connects to Google Calendar: your busy times block booking slots and new bookings are added to your calendar. Outlook and Apple Calendar are not supported yet."
          }
        },
        {
          "@type": "Question",
          "name": "Is there a free plan?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. The Free plan includes 20 meetings per month with one meeting type. No credit card required."
          }
        }
      ]
    }
  ]

// Fit "<title> | DoAide Scheduler" into ~70 chars; long titles go without it.
const withSuffix = (title) => (`${title} | DoAide Scheduler`.length <= 70 ? `${title} | DoAide Scheduler` : title)

const tool = (path, aliases, h1, title, description) => ({
  path,
  aliases,
  h1,
  title: withSuffix(title),
  description,
  kind: 'tool',
})

export const routes = [
  {
    path: '/',
    kind: 'home',
    h1: 'Smart Meeting Scheduling for Businesses',
    title: 'DoAide Scheduler — Free Online Appointment Booking & Scheduling',
    description:
      'Share your booking link, let clients pick a time and never double-book again. Free meeting scheduler with Google Calendar sync on Pro.',
  },
  tool('/tools/meeting-cost-calculator', ['/calculator'], 'Meeting Cost Calculator', 'Meeting Cost Calculator — What Meetings Really Cost',
    'Find out what your meetings really cost from attendees, hourly rate, length and frequency. Free meeting cost calculator, no sign-up.'),
  tool('/tools/timezone-converter', ['/timezone'], 'World Timezone Converter', 'Time Zone Converter — Best Meeting Time',
    'Compare time zones side by side and find the best meeting time for teams across cities. Free online time zone converter.'),
  tool('/tools/availability-finder', [], 'Availability Finder', 'Availability Finder — Find Overlapping Free Slots',
    'Find overlapping available time slots across several people’s schedules in seconds. Free availability finder, no sign-up.'),
  tool('/tools/meeting-planner', [], 'AI Meeting Planner', 'AI Meeting Agenda Generator',
    'Generate a structured meeting agenda with AI, with time boxes and tips for running the meeting. Free, no sign-up required.'),
  tool('/tools/weekly-planner', [], 'Weekly Planner', 'Weekly Planner — Time-Blocking Schedule',
    'Plan your week with time-blocking: block out focus time, meetings and breaks in a weekly schedule. Free online weekly planner.'),
  {
    path: '/templates-gallery',
    kind: 'page',
    h1: 'Scheduling Templates',
    title: withSuffix('Free Scheduling & Booking Page Templates'),
    description: 'Start with a proven meeting page. Pick a scheduling template and customise it for your workflow.',
  },
  {
    path: '/embed',
    kind: 'page',
    h1: 'Embed Scheduling Tools on Your Website',
    title: withSuffix('Embed Free Scheduling Tools on Your Website'),
    description:
      'Add a free meeting cost calculator, templates gallery or time zone converter to your website with one line of code.',
  },
  {
    path: '/pricing',
    kind: 'page',
    h1: 'Pricing',
    title: withSuffix('Pricing — Free, Pro $12 & Team $25'),
    description:
      'Free for 20 meetings a month. Pro ($12/mo) adds unlimited meetings and Google Calendar sync; Team ($25/mo) adds round-robin scheduling.',
  },
  {
    path: '/blog',
    kind: 'blog',
    h1: 'DoAide Scheduler Blog',
    title: withSuffix('Scheduling & Meeting Productivity Blog'),
    description:
      'Guides on running better meetings, scheduling across time zones, appointment booking and calendar management.',
  },
  ...BLOG_ARTICLES.map((a) => ({
    path: `/blog/${a.slug}`,
    kind: 'post',
    h1: a.title,
    title: withSuffix(a.title),
    description: a.description,
    published: a.published,
  })),
]

export const canonicalFor = (path) => `${SITE.baseUrl}${path}`

export const metaForPath = (path) => routes.find((r) => r.path === path || r.aliases?.includes(path))

export function jsonLdFor(route) {
  const url = canonicalFor(route.path)
  switch (route.kind) {
    case 'home':
      return { '@context': 'https://schema.org', '@graph': HOME_GRAPH }
    case 'tool':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: route.h1,
        url,
        description: route.description,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: canonicalFor('/') },
      }
    case 'post':
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: route.h1,
        description: route.description,
        url,
        mainEntityOfPage: url,
        datePublished: route.published,
        author: ORG,
        publisher: ORG,
      }
    default:
      return {
        '@context': 'https://schema.org',
        '@type': route.kind === 'blog' ? 'Blog' : 'WebPage',
        name: route.h1,
        url,
        description: route.description,
        isPartOf: { '@type': 'WebSite', name: SITE.name, url: canonicalFor('/') },
      }
  }
}
