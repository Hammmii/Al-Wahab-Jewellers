import { createClient } from '@/lib/supabase/server'
import type { Category, Collection } from '@/lib/domain'

const isConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function getCategories(): Promise<Category[]> {
  if (!isConfigured()) {
    if (process.env.NODE_ENV !== "production") console.warn('[categories:getCategories] Supabase not configured')
    return []
  }
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true })

  if (error) {
    console.error(`[categories:getCategories] Supabase query failed: ${error.message}`, {
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return []
  }
  if (!data) return []
  return (data as Array<{
    id: string
    name: string
    slug: string
    description: string | null
    position: number
  }>).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    position: c.position,
  }))
}

export async function getCollections(): Promise<Collection[]> {
  if (!isConfigured()) {
    if (process.env.NODE_ENV !== "production") console.warn('[categories:getCollections] Supabase not configured')
    return []
  }
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error(`[categories:getCollections] Supabase query failed: ${error.message}`, {
      code: error.code,
      details: error.details,
      hint: error.hint,
    })
    return []
  }
  if (!data) return []
  return (data as Array<{
    id: string
    name: string
    slug: string
    description: string | null
  }>).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
  }))
}
