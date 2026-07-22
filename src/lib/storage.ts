/**
 * Resolve a product image path to its URL.
 *
 * - Paths starting with "/" are served from the app's /public folder (e.g.
 *   "/Ring1.jpg") — used for seeded/local images, no Storage needed.
 * - Otherwise the path is treated as a Supabase Storage object key and
 *   resolved to its public CDN URL. Returns '' when Supabase isn't configured.
 */
export function publicImageUrl(
  storagePath: string,
  bucket = 'product-images',
): string {
  if (!storagePath) return ''
  if (storagePath.startsWith('/')) return storagePath // local /public asset
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return ''
  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`
}
