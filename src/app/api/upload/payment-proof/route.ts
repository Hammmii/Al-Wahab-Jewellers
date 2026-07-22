import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/configured'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

/**
 * Anonymous-safe payment proof upload.
 * Validation happens server-side, and the actual Storage write uses the
 * service-role client so anonymous users can still complete bank transfers.
 */
export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: 'service_unavailable', message: 'Upload service is unavailable.' },
      { status: 503 },
    )
  }

  const adminClient = createAdminClient()
  const serverClient = await createClient()
  if (!adminClient || !serverClient) {
    return NextResponse.json(
      { success: false, error: 'service_unavailable', message: 'Upload service is unavailable.' },
      { status: 503 },
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: 'missing_file', message: 'No file was provided.' },
        { status: 400 },
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'invalid_type',
          message: 'Only JPG, PNG, WebP, or PDF files are allowed.',
        },
        { status: 400 },
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'too_large', message: 'File size must be 5 MB or less.' },
        { status: 400 },
      )
    }

    // Authenticated users get their own prefix; anonymous uploads go under "anonymous".
    const {
      data: { user },
    } = await serverClient.auth.getUser()
    const prefix = user?.id ?? 'anonymous'
    const randomId = crypto.randomUUID()
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${prefix}/${randomId}/${safeName}`

    const { data, error } = await adminClient.storage.from('payment-proofs').upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

    if (error) {
      console.error('[upload:payment-proof] storage upload failed', error)
      return NextResponse.json(
        { success: false, error: 'upload_failed', message: 'Unable to upload file. Please try again.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, path: data.path }, { status: 201 })
  } catch (err) {
    console.error('[upload:payment-proof] unexpected error', err)
    return NextResponse.json(
      { success: false, error: 'upload_failed', message: 'Unable to upload file. Please try again.' },
      { status: 500 },
    )
  }
}
