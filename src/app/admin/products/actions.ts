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

  revalidatePath('/admin/products')
  revalidatePath(`/collections/${values.slug}`)
  revalidatePath('/collections')
  return {}
}
