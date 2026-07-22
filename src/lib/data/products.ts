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
  variants: RawVariant[] | null
  images: RawImage[] | null
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

const mapProduct = (p: RawProduct): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  categoryId: p.category_id,
  collectionId: p.collection_id,
  description: p.description,
  metalType: p.metal_type,
  isFeatured: p.is_featured,
  isActive: p.is_active,
  variants: (p.variants ?? []).map(mapVariant),
  images: (p.images ?? []).map(mapImage).sort(byPosition),
})

const PRODUCT_SELECT = '*, variants(*), images(*)'

// ─── Queries ────────────────────────────────────────────────────────────────

/** All active products, newest first. */
export async function getProducts(): Promise<Product[]> {
  if (!isConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as RawProduct[]).map(mapProduct)
}

/** Featured active products for the homepage carousel. */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  if (!isConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return (data as RawProduct[]).map(mapProduct)
}

/** A single active product by slug, or null. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isConfigured()) return null
  const supabase = await createClient()
  if (!supabase) return null
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return mapProduct(data as RawProduct)
}

/** Active products within a category (by category slug). */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  if (!isConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .filter('category_id', 'in', `(
      select id from categories where slug = '${categorySlug.replace(/'/g, "''")}'
    )`)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return (data as RawProduct[]).map(mapProduct)
}

/** Full-text + fuzzy search over active products. */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!isConfigured() || !query.trim()) return []
  const supabase = await createClient()
  if (!supabase) return []
  const term = query.trim()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('is_active', true)
    .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error || !data) return []
  return (data as RawProduct[]).map(mapProduct)
}
