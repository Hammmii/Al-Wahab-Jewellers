import { createClient } from '@/lib/supabase/server'
import type { Category, Collection } from '@/lib/domain'

const isConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function getCategories(): Promise<Category[]> {
  if (!isConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true })

  if (error || !data) return []
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
  if (!isConfigured()) return []
  const supabase = await createClient()
  if (!supabase) return []
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) return []
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
