'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminUser } from '@/lib/auth/admin'
import type { ProductFormValues } from '@/components/admin/product-form'

async function requireAdmin() {
  const user = await getAdminUser()
  if (!user?.isAdmin) throw new Error('Not authorized')
  return createAdminClient()
}

export async function createProductAction(values: ProductFormValues): Promise<{ error?: string }> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: 'Not authorized.' }
  }
  if (!supabase) return { error: 'Database not configured.' }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      metal_type: values.metalType || null,
      is_featured: values.isFeatured,
      is_active: values.isActive,
    })
    .select('id')
    .single()

  if (error || !product) return { error: error?.message ?? 'Failed to create product.' }

  const productId = (product as { id: string }).id
  const { error: variantError } = await supabase.from('product_variants').insert(
    values.variants.map((v) => ({
      product_id: productId,
      metal_purity: v.metalPurity,
      weight_grams: v.weightGrams ?? null,
      size: v.size ?? null,
      price: v.price,
      stock: v.stock,
    })),
  )
  if (variantError) return { error: variantError.message }

  // Insert product images
  if (values.images.length > 0) {
    const { error: imageError } = await supabase.from('product_images').insert(
      values.images.map((path, i) => ({
        product_id: productId,
        storage_path: path,
        alt_text: values.name,
        position: i,
        is_primary: i === 0,
      })),
    )
    if (imageError) return { error: imageError.message }
  }

  revalidatePath('/admin/products')
  revalidatePath('/collections')
  return {}
}

export async function updateProductAction(
  id: string,
  values: ProductFormValues,
): Promise<{ error?: string }> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: 'Not authorized.' }
  }
  if (!supabase) return { error: 'Database not configured.' }

  const { error } = await supabase
    .from('products')
    .update({
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      metal_type: values.metalType || null,
      is_featured: values.isFeatured,
      is_active: values.isActive,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  // Replace variants: delete + re-insert (simple and robust for small variant sets).
  await supabase.from('product_variants').delete().eq('product_id', id)
  const { error: variantError } = await supabase.from('product_variants').insert(
    values.variants.map((v) => ({
      product_id: id,
      metal_purity: v.metalPurity,
      weight_grams: v.weightGrams ?? null,
      size: v.size ?? null,
      price: v.price,
      stock: v.stock,
    })),
  )
  if (variantError) return { error: variantError.message }

  // Replace images: delete + re-insert.
  await supabase.from('product_images').delete().eq('product_id', id)
  if (values.images.length > 0) {
    const { error: imageError } = await supabase.from('product_images').insert(
      values.images.map((path, i) => ({
        product_id: id,
        storage_path: path,
        alt_text: values.name,
        position: i,
        is_primary: i === 0,
      })),
    )
    if (imageError) return { error: imageError.message }
  }

  revalidatePath('/admin/products')
  revalidatePath(`/collections/${values.slug}`)
  revalidatePath('/collections')
  return {}
}
