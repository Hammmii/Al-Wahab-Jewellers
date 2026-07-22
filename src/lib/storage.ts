/**
 * Resolve a Supabase Storage object path to its public CDN URL.
 * Returns '' when Supabase isn't configured (so callers can guard).
 */
export function publicImageUrl(
  storagePath: string,
  bucket = 'product-images',
): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return ''
  return `${base}/storage/v1/object/public/${bucket}/${storagePath}`
}
