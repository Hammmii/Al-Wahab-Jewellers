import { createClient } from '@/lib/supabase/server'
import type {
  Product,
  ProductImage,
  ProductVariant,
  MetalPurity,
} from '@/lib/domain'

const isConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ─── Raw (snake_case) row shapes returned by PostgREST ──────────────────────
interface RawVariant {
  id: string
  product_id: string
  metal_purity: MetalPurity
  weight_grams: number | null
  size: string | null
  price: number
  sku: string | null
  stock: number
}

interface RawImage {
  id: string
  product_id: string
  storage_path: string
  alt_text: string | null
  position: number
  is_primary: boolean
}

interface RawProduct {
  id: string
  name: string
  slug: string
  category_id: string | null
  collection_id: string | null
  description: string | null
  metal_type: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

// ─── Mappers (snake_case → camelCase domain) ────────────────────────────────
const mapVariant = (v: RawVariant): ProductVariant => ({
  id: v.id,
  productId: v.product_id,
  metalPurity: v.metal_purity,
  weightGrams: v.weight_grams,
  size: v.size,
  price: Number(v.price),
  sku: v.sku,
  stock: v.stock,
})

const mapImage = (i: RawImage): ProductImage => ({
  id: i.id,
  productId: i.product_id,
  storagePath: i.storage_path,
  altText: i.alt_text,
  position: i.position,
  isPrimary: i.is_primary,
})

const byPosition = (a: { position: number }, b: { position: number }) =>
  a.position - b.position

const mapProduct = (p: RawProduct, variants: RawVariant[], images: RawImage[]): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  categoryId: p.category_id,
  collectionId: p.collection_id,
  description: p.description,
  metalType: p.metal_type,
  isFeatured: p.is_featured,
  isActive: p.is_active,
  variants: variants.map(mapVariant),
  images: images.map(mapImage).sort(byPosition),
})

// ─── Helpers ────────────────────────────────────────────────────────────────

function logQueryError(
  operation: string,
  error: { message: string; details?: string; hint?: string; code?: string },
) {
  console.error(`[products:${operation}] Supabase query failed: ${error.message}`, {
    code: error.code,
    details: error.details,
    hint: error.hint,
  })
}

function groupBy<T, K extends string | number>(items: T[], keyFn: (item: T) => K): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = keyFn(item)
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {} as Record<K, T[]>)
}

/**
 * Fetch variants and images for a list of products and attach them.
 * We intentionally do NOT use embedded selects (e.g. `variants(*)`) because they
 * depend on PostgREST's schema-cache knowing the foreign-key relationship. After
 * a fresh migration that relationship can be missing from the cache until it is
 * reloaded, which would silently break the storefront. Separate queries are
 * robust and just as efficient for a jewellery catalogue.
 */
async function attachVariantsAndImages(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  products: RawProduct[],
): Promise<Product[]> {
  if (products.length === 0) return []

  const productIds = products.map((p) => p.id)

  const [{ data: variants, error: variantsError }, { data: images, error: imagesError }] =
    await Promise.all([
      supabase.from('product_variants').select('*').in('product_id', productIds),
      supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('position', { ascending: true }),
    ])

  if (variantsError) logQueryError('attachVariants', variantsError)
  if (imagesError) logQueryError('attachImages', imagesError)

  const variantsByProduct = groupBy<RawVariant, string>(variants ?? [], (v) => v.product_id)
  const imagesByProduct = groupBy<RawImage, string>(images ?? [], (i) => i.product_id)

  return products.map((p) =>
    mapProduct(p, variantsByProduct[p.id] ?? [], imagesByProduct[p.id] ?? []),
  )
}

// ─── Queries ────────────────────────────────────────────────────────────────

/**
 * Convert a raw user query into a websearch-style prefix query.
 * Strips non-word characters, then adds the `:*` prefix marker to each token
 * so "ring" also matches "rings". Returns an empty string for queries that
 * contain no searchable tokens.
 */
function toWebsearchPrefixTerm(term: string): string {
  return term
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => `${token}:*`)
    .join(' ')
}

/** All active products, newest first. */
export async function getProducts(): Promise<Product[]> {
  if (!isConfigured()) {
    if (process.env.NODE_ENV !== "production") console.warn('[products:getProducts] Supabase not configured')
    return []
  }
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    logQueryError('getProducts', error)
    return []
  }
  if (!data) return []

  return attachVariantsAndImages(supabase, data as RawProduct[])
}

/** Featured active products for the homepage carousel. */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!isConfigured()) {
    if (process.env.NODE_ENV !== "production") console.warn('[products:getFeaturedProducts] Supabase not configured')
    return []
  }
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    logQueryError('getFeaturedProducts', error)
    return []
  }
  if (!data) return []

  return attachVariantsAndImages(supabase, data as RawProduct[])
}

/** A single active product by slug, or null. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isConfigured()) {
    if (process.env.NODE_ENV !== "production") console.warn('[products:getProductBySlug] Supabase not configured')
    return null
  }
  const supabase = await createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    logQueryError('getProductBySlug', error)
    return null
  }
  if (!data) return null

  const product = data as RawProduct
  const [productWithRelations] = await attachVariantsAndImages(supabase, [product])
  return productWithRelations ?? null
}

/** Active products within a category (by category slug). */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isConfigured()) {
    if (process.env.NODE_ENV !== "production") console.warn('[products:getProductsByCategory] Supabase not configured')
    return []
  }
  const supabase = await createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .filter('category_id', 'in', `(
      select id from categories where slug = '${categorySlug.replace(/'/g, "''")}'
    )`)
    .order('created_at', { ascending: false })

  if (error) {
    logQueryError('getProductsByCategory', error)
    return []
  }
  if (!data) return []

  return attachVariantsAndImages(supabase, data as RawProduct[])
}

/** Full-text + fuzzy search over active products. */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!isConfigured() || !query.trim()) {
    if (!isConfigured()) if (process.env.NODE_ENV !== "production") console.warn('[products:searchProducts] Supabase not configured')
    return []
  }
  const supabase = await createClient()
  if (!supabase) return []

  const term = query.trim()

  // 1. Ranked full-text search against the generated tsvector (GIN index).
  const websearchTerm = toWebsearchPrefixTerm(term)
  let ftsProducts: RawProduct[] = []

  if (websearchTerm) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .textSearch('search_vector', websearchTerm, { type: 'websearch' })
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      logQueryError('searchProducts:fts', error)
    } else {
      ftsProducts = (data as RawProduct[] | null) ?? []
    }
  }

  if (ftsProducts.length > 0) {
    return attachVariantsAndImages(supabase, ftsProducts)
  }

  // 2. Fallback: trigram-enabled ilike on name (products_name_trgm_idx).
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .ilike('name', `%${term}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    logQueryError('searchProducts:fuzzy', error)
    return []
  }
  if (!data) return []

  return attachVariantsAndImages(supabase, data as RawProduct[])
}
