import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/supabase/configured'
import { getAdminUser } from '@/lib/auth/admin'

const MAX_SIZE = 8 * 1024 * 1024 // 8 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg']

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: false, message: 'Storage not configured' }, { status: 503 })
  }

  const admin = await getAdminUser()
  if (!admin?.isAdmin) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ success: false, message: 'File too large (max 8 MB)' }, { status: 400 })
  }

  if (!ALLOWED.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
    return NextResponse.json({ success: false, message: 'Unsupported file type' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ success: false, message: 'Storage not available' }, { status: 503 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${admin.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error } = await supabase.storage
    .from('product-images')
    .upload(path, arrayBuffer, { contentType: file.type || 'image/jpeg', upsert: false })

  if (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, path })
}
