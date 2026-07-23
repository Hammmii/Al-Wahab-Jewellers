'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { useT } from '@/lib/i18n/language-context'

export default function AdminLoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const t = useT()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    if (!supabase) {
      setError(t('admin.notAvailable'))
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    const redirect = search.get('redirect') ?? '/admin'
    router.push(redirect)
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="surface-card w-full max-w-md rounded-xl p-8">
        <div className="text-center">
          <span className="font-urdu text-3xl text-gold-shimmer">الوَہاب جیولرز</span>
          <h1 className="mt-2 font-headline text-2xl text-foreground">{t('admin.signIn')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('admin.signInSub')}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t('admin.email')}</span>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">{t('admin.password')}</span>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('admin.signingIn') : t('admin.signInBtn')}
          </Button>
        </form>

        <Link href="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-primary">
          ← {t('admin.backToStore')}
        </Link>
      </div>
    </div>
  )
}
