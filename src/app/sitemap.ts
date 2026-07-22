import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site'
import { getProducts } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url

  const staticRoutes = ['', '/collections', '/custom-design', '/virtual-try-on', '/about', '/contact'].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    }),
  )

  // Category routes (falls back to [] when Supabase isn’t live yet).
  const categories = await getCategories()
  const categoryRoutes = categories.map((c) => ({
    url: `${base}/collections?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Product routes.
  const products = await getProducts()
  const productRoutes = products.map((p) => ({
    url: `${base}/collections/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
