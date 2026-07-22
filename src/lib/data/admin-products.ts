import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import type { Product, ProductImage, ProductVariant, MetalPurity } from '@/lib/domain'
import { primaryImage, fromPrice } from '@/lib/domain'
import { publicImageUrl } from '@/lib/storage'

/**
 * Admin product data access (service-role, server-only).
 * Unlike the public data layer, this reads ALL products (incl. inactive).
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
  variants: RawVariant[] | null
  images: RawImage[] | null
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
  images: (p.images ?? []).map(mapImage),
})

const SELECT = '*, variants(*), images(*)'

export async function adminGetProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = createAdminClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('products')
    .select(SELECT)
    .order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as RawProduct[]).map(mapProduct)
}

export async function adminGetProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data, error } = await supabase.from('products').select(SELECT).eq('id', id).maybeSingle()
  if (error || !data) return null
  return mapProduct(data as RawProduct)
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
