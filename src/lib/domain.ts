/**
 * Normalized domain types for the storefront.
 * These are camelCase shapes derived from the snake_case Supabase schema
 * (see supabase/migrations/0001_init.sql). The data-access layer in
 * src/lib/data maps DB rows to these.
 */

export type MetalPurity = '24k' | '22k' | '21k' | '18k' | 'silver'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  position: number
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface ProductVariant {
  id: string
  productId: string
  metalPurity: MetalPurity
  weightGrams: number | null
  size: string | null
  price: number // PKR
  sku: string | null
  stock: number
}

export interface ProductImage {
  id: string
  productId: string
  storagePath: string
  altText: string | null
  position: number
  isPrimary: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  categoryId: string | null
  collectionId: string | null
  description: string | null
  metalType: string | null
  isFeatured: boolean
  isActive: boolean
  variants: ProductVariant[]
  images: ProductImage[]
}

/** Convenience: the primary (or first) image path, for cards/thumbnails. */
export function primaryImage(product: Product): ProductImage | null {
  return product.images.find((i) => i.isPrimary) ?? product.images[0] ?? null
}

/** Convenience: the lowest-priced variant (the "from" price). */
export function fromPrice(product: Product): number | null {
  if (product.variants.length === 0) return null
  return Math.min(...product.variants.map((v) => v.price))
}
