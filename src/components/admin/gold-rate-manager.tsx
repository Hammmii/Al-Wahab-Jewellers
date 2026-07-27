'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPKR, formatDate } from '@/lib/format'
import { useToast } from '@/hooks/use-toast'

const KARATS = ['24k', '22k', '21k', '18k'] as const
type Karat = (typeof KARATS)[number]

interface CurrentRate {
  karat: Karat
  ratePerTola: number | null
  effectiveAt: string | null
}

export function GoldRateManager() {
  const router = useRouter()
  const { toast } = useToast()
  const [current, setCurrent] = useState<CurrentRate[]>([])
  const [rates, setRates] = useState<Record<Karat, string>>({
    '24k': '', '22k': '', '21k': '', '18k': '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/gold-rates', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        const arr: CurrentRate[] = (data.rates ?? []).map((r: { karat: Karat; ratePerTola: number; effectiveAt: string }) => ({
          karat: r.karat, ratePerTola: r.ratePerTola, effectiveAt: r.effectiveAt,
        }))
        setCurrent(arr)
        // Pre-fill inputs with current rates
        arr.forEach((r) => {
          if (r.ratePerTola) setRates((prev) => ({ ...prev, [r.karat]: String(r.ratePerTola) }))
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/gold-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rates: KARATS.map((k) => ({
            karat: k,
            ratePerTola: Number(rates[k]) || 0,
            ratePer10g: Math.round((Number(rates[k]) || 0) / 11.664 * 10),
            ratePerGram: Math.round((Number(rates[k]) || 0) / 11.664),
          })),
        }),
      })
      if (res.ok) {
        toast({ title: 'Gold rates updated', description: 'The live rate is now updated across the site.' })
        router.refresh()
      } else {
        toast({ title: 'Failed to update', variant: 'destructive' })
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading current rates…</p>

  return (
    <div className="space-y-6">
      <div className="surface-card rounded-xl p-6">
        <h2 className="font-headline text-lg text-foreground">Current Rates (per Tola)</h2>
        {current.length > 0 ? (
          <div className="mt-4 space-y-2">
            {current.map((r) => (
              <div key={r.karat} className="flex justify-between border-b border-border pb-2 text-sm">
                <span className="font-medium text-foreground">{r.karat.toUpperCase()}</span>
                <span className="text-muted-foreground">
                  {r.ratePerTola ? formatPKR(r.ratePerTola) : 'Not set'}
                  {r.effectiveAt ? ` · ${formatDate(r.effectiveAt)}` : ''}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No rates set yet. Enter today's rate below.</p>
        )}
      </div>

      <div className="surface-card rounded-xl p-6">
        <h2 className="font-headline text-lg text-foreground">Set Today's Rate (per Tola, PKR)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {KARATS.map((k) => (
            <label key={k} className="block">
              <span className="mb-1.5 block text-sm font-medium text-foreground">{k.toUpperCase()} Gold</span>
              <Input
                type="number"
                value={rates[k]}
                onChange={(e) => setRates((prev) => ({ ...prev, [k]: e.target.value }))}
                placeholder="e.g. 268500"
              />
            </label>
          ))}
        </div>
        <Button className="mt-6" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Update Gold Rates'}
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          Enter the real rate from Multan's Sarafa Bazar. Per-10g and per-gram rates are auto-calculated.
        </p>
      </div>
    </div>
  )
}
