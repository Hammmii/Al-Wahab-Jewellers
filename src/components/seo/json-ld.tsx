import { siteConfig } from '@/lib/site'

/**
 * Organization structured data, rendered once in the root layout so search
 * engines rich-result the brand. Brand facts only (no fabricated phone/email).
 */
export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/og.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
  }
  return (
    <script
      type="application/ld+json"
      // Schema is built from static, trusted config — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/** Product structured data for product detail pages. */
export function ProductJsonLd({
  name,
  description,
  slug,
  price,
  imageUrls,
}: {
  name: string
  description?: string | null
  slug: string
  price?: number | null
  imageUrls: string[]
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description ?? undefined,
    url: `${siteConfig.url}/collections/${slug}`,
    image: imageUrls.length ? imageUrls : undefined,
    offers: price
      ? {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
