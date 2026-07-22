// Form submissions — persisted to Supabase when configured, otherwise a no-op.
// Email notifications are sent by the route handlers (see src/lib/email).

import { createAdminClient } from '@/lib/supabase/admin'

export interface ContactSubmission {
  name: string
  email: string
  phone: string
  message: string
}

export interface CustomDesignSubmission {
  name: string
  email: string
  phone: string
  jewelryType: string
  goldType: string
  weight?: string
  budget: string
  description?: string
}

export interface VirtualTryOnSubmission {
  name?: string
  email?: string
  phone?: string
  ringId: string
  imageData?: string
}

const dbConfigured = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

const toNumber = (value?: string): number | undefined => {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export async function saveContactSubmission(data: ContactSubmission): Promise<string | null> {
  if (!dbConfigured()) {
    console.info('[contact] DB not configured — skipping persist')
    return null
  }
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data: row, error } = await supabase
    .from('contact_submissions')
    .insert({ name: data.name, email: data.email, phone: data.phone, message: data.message })
    .select('id')
    .single()

  if (error) {
    console.error('[contact] persist failed', error.message)
    return null
  }
  return (row as { id: string } | null)?.id ?? null
}

export async function saveCustomDesignRequest(
  data: CustomDesignSubmission,
): Promise<string | null> {
  if (!dbConfigured()) {
    console.info('[custom-design] DB not configured — skipping persist')
    return null
  }
  const supabase = createAdminClient()
  if (!supabase) return null
  const { data: row, error } = await supabase
    .from('custom_design_requests')
    .insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      jewelry_type: data.jewelryType,
      gold_type: data.goldType,
      weight_grams: toNumber(data.weight),
      budget: toNumber(data.budget),
      description: data.description ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[custom-design] persist failed', error.message)
    return null
  }
  return (row as { id: string } | null)?.id ?? null
}

// Try-on persistence lands when that feature is rebuilt (Replicate-based).
export async function saveVirtualTryOnSubmission(
  data: VirtualTryOnSubmission,
): Promise<string | null> {
  console.info('[virtual-try-on] submission received', {
    ringId: data.ringId,
    hasImage: !!data.imageData,
  })
  return null
}
