import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import type { Product, ProductImage, ProductVariant, MetalPurity } from '@/lib/domain'
import { primaryImage, fromPrice } from '@/lib/domain'
import { publicImageUrl } from '@/lib/storage'

/**
 * Admin product data access (service-role, server-only).
 * Unlike the public data layer, this reads ALL products (incl. inactive).
 *
 * We avoid embedded selects (`variants(*)`) because they depend on PostgREST's
 * schema-cache knowing the foreign-key relationship; after migrations that
 * cache can be stale and embedded selects silently return empty relations.
 */

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
  images: images.map(mapImage),
})

function logQueryError(
  operation: string,
  error: { message: string; details?: string; hint?: string; code?: string },
) {
  console.error(`[admin-products:${operation}] Supabase query failed: ${error.message}`, {
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

async function attachVariantsAndImages(
  supabase: NonNullable<ReturnType<typeof createAdminClient>>,
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

export async function adminGetProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    console.warn('[admin-products:adminGetProducts] Supabase not configured')
    return []
  }
  const supabase = createAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    logQueryError('adminGetProducts', error)
    return []
  }
  if (!data) return []

  return attachVariantsAndImages(supabase, data as RawProduct[])
}

export async function adminGetProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    console.warn('[admin-products:adminGetProduct] Supabase not configured')
    return null
  }
  const supabase = createAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()

  if (error) {
    logQueryError('adminGetProduct', error)
    return null
  }
  if (!data) return null

  const product = data as RawProduct
  const [productWithRelations] = await attachVariantsAndImages(supabase, [product])
  return productWithRelations ?? null
}

/** Lightweight row for the list view (id, name, slug, price, status). */
export interface AdminProductRow {
  id: string
  name: string
  slug: string
  isActive: boolean
  isFeatured: boolean
  fromPrice: number | null
  primaryImage: string
}

export async function adminGetProductRows(): Promise<AdminProductRow[]> {
  const products = await adminGetProducts()
  return products.map((p) => {
    const img = primaryImage(p)
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      fromPrice: fromPrice(p),
      primaryImage: img ? publicImageUrl(img.storagePath) : '',
    }
  })
}
