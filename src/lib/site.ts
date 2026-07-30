/**
 * Central site configuration. Drives metadata, sitemap, robots, and JSON-LD.
 * Keep brand facts here (only confirmed ones — see the brand-story memory).
 */
export const siteConfig = {
  name: 'Al-Wahab Jewellers',
  /** Filled in at launch with the real domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:9002',
  description:
    'A family-run gold atelier in Multan’s Sarafa Bazar. Genuine gold, hand-finished jewellery, and bespoke commissions.',
  locale: 'en_PK',
  address: {
    street: 'Sarafa Bazar, Shop #2',
    city: 'Multan',
    country: 'PK',
  },
  phone: '03009631161',
  whatsapp: '03009631161',
  owner: {
    name: 'Sikandar Hayat',
    experience: '30+ years',
  },
  contacts: [
    { name: 'Sikandar Hayat', phone: '03009631161', role: 'Owner' },
    { name: 'Abdullah Sikandar', phone: '+92 304 9316562', role: 'Sales' },
    { name: 'Abdul Wahab', phone: '+92 300 0835875', role: 'Sales' },
  ],
  keywords: [
    'gold jewellers Multan',
    'Sarafa Bazar gold',
    'gold rings Pakistan',
    'gold necklaces',
    'bridal jewellery Multan',
    'bespoke gold design',
    'Sikandar Hayat jewellers',
  ],
} as const
