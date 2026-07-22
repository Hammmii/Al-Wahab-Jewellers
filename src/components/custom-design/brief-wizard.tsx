'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { IconGift, IconPurity } from '@/components/icons'

const PIECE_TYPES = ['Ring', 'Engagement', 'Bridal set', 'Necklace', 'Pendant', 'Earrings', 'Bangles', 'Other']
const OCCASIONS = ['Wedding', 'Engagement', 'Anniversary', 'Gift', 'Heirloom', 'Just for me']
const METALS = [
  { id: '22k-yellow', label: '22K Yellow', swatch: '#D4AF37' },
  { id: '21k-yellow', label: '21K Yellow', swatch: '#C9A227' },
  { id: '18k-white', label: '18K White', swatch: '#E5E4E2' },
  { id: 'rose', label: 'Rose Gold', swatch: '#B76E79' },
  { id: 'advise', label: "Not sure — advise me", swatch: 'transparent' },
]
const GEMS = ['None', 'Diamond', 'Emerald', 'Ruby', 'Sapphire', 'Kundan-Polki', 'Birthstone', 'I have my own stones']
const BUDGETS = [
  { id: 'under-100k', label: 'Under Rs 100K', min: 0, max: 100000 },
  { id: '100-300k', label: 'Rs 100K – 300K', min: 100000, max: 300000 },
  { id: '300-600k', label: 'Rs 300K – 600K', min: 300000, max: 600000 },
  { id: '600k-1m', label: 'Rs 600K – 1M', min: 600000, max: 1000000 },
  { id: '1m+', label: 'Rs 1M+', min: 1000000, max: null },
  { id: 'discuss', label: 'Prefer to discuss', min: null, max: null },
]
const TIMELINES = ['Flexible · standard 6–8 weeks', 'Urgent · under 4 weeks', 'For a specific date']

interface Brief {
  pieceType: string
  occasion: string
  words: string
  metal: string
  gems: string[]
  budget: string
  timeline: string
  sourcing: string
  name: string
  phone: string
  city: string
  email: string
}
const EMPTY: Brief = {
  pieceType: '', occasion: '', words: '', metal: '', gems: [],
  budget: '', timeline: '', sourcing: '', name: '', phone: '', city: '', email: '',
}
const STORAGE_KEY = 'alwahab-brief'

const STEPS = ['Vision', 'Details', 'Budget', 'Review'] as const

export function BriefWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState<Brief>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [ref, setRef] = useState('')

  // Autosave to localStorage so a half-finished brief survives a refresh.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) setBrief({ ...EMPTY, ...JSON.parse(saved) })
    } catch {
      /* ignore */
    }
  }, [])
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(brief))
    } catch {
      /* ignore */
    }
  }, [brief])

  const set = (patch: Partial<Brief>) => setBrief((b) => ({ ...b, ...patch }))
  const canNext = step === 0 ? !!brief.pieceType : step === 1 ? !!brief.metal : step === 2 ? !!brief.budget && !!brief.timeline : true

  const submit = async () => {
    setSubmitting(true)
    const payload = {
      name: brief.name,
      email: brief.email,
      phone: brief.phone,
      jewelryType: brief.pieceType,
      goldType: brief.metal,
      budget: BUDGETS.find((b) => b.id === brief.budget)?.max ?? '',
      weight: '',
      description: [
        `Occasion: ${brief.occasion || '—'}`,
        `In their words: ${brief.words || '—'}`,
        `Gemstones: ${brief.gems.join(', ') || '—'}`,
        `Timeline: ${brief.timeline}`,
        `Metal sourcing: ${brief.sourcing || '—'}`,
        `City: ${brief.city}`,
      ].join('\n'),
    }
    try {
      const res = await fetch('/api/custom-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      setRef(data.requestId ?? `AW-${Date.now().toString().slice(-6)}`)
      setDone(true)
      try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="surface-card flex flex-col items-center rounded-xl p-10 text-center">
        <span className="text-primary"><IconPurity className="h-10 w-10" /></span>
        <h3 className="mt-4 font-headline text-2xl text-foreground">Brief received</h3>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Your reference is <span className="font-mono text-primary">{ref}</span>. Our master goldsmith will
          review it and reply within 24 hours to arrange a consultation.
        </p>
        <p className="mt-4 max-w-md text-xs text-muted-foreground">
          Prefer to talk now? Message us on WhatsApp and quote your reference.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push('/')}>Back to home</Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Wizard */}
      <div className="lg:col-span-2">
        {/* Progress */}
        <div className="mb-6 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className="flex-1">
                <div className="h-1 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: i <= step ? '100%' : '0%' }}
                  />
                </div>
                <span className={cn('mt-1.5 block text-[11px] uppercase tracking-wide', i === step ? 'text-primary' : 'text-muted-foreground')}>
                  {i + 1}. {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card rounded-xl p-6 md:p-8">
          {/* Step 1 — Vision */}
          {step === 0 ? (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <Label>What are we creating?</Label>
                <Chips value={brief.pieceType} options={PIECE_TYPES} onPick={(v) => set({ pieceType: v })} />
              </div>
              <div>
                <Label>Occasion</Label>
                <Chips value={brief.occasion} options={OCCASIONS} onPick={(v) => set({ occasion: v })} />
              </div>
              <label className="block">
                <Label>In your words (optional)</Label>
                <Textarea rows={3} value={brief.words} onChange={(e) => set({ words: e.target.value })} placeholder="My grandmother's bangle, but with my initials…" />
              </label>
            </div>
          ) : null}

          {/* Step 2 — Details */}
          {step === 1 ? (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <Label>Metal &amp; karat</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {METALS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => set({ metal: m.label })}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all',
                        brief.metal === m.label ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40',
                      )}
                    >
                      <span className="h-4 w-4 rounded-full border border-border" style={{ background: m.swatch }} />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Gemstones (select any)</Label>
                <MultiChips value={brief.gems} options={GEMS} onToggle={(v) => set({ gems: brief.gems.includes(v) ? brief.gems.filter((g) => g !== v) : [...brief.gems, v] })} />
              </div>
            </div>
          ) : null}

          {/* Step 3 — Budget & timeline */}
          {step === 2 ? (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <Label>Budget range</Label>
                <Chips value={brief.budget} options={BUDGETS.map((b) => b.label)} onPick={(v) => set({ budget: BUDGETS.find((b) => b.label === v)?.id ?? '' })} />
              </div>
              <div>
                <Label>Timeline</Label>
                <Chips value={brief.timeline} options={TIMELINES} onPick={(v) => set({ timeline: v })} />
              </div>
              <div>
                <Label>Metal sourcing</Label>
                <Chips
                  value={brief.sourcing}
                  options={['Buy gold from Al-Wahab at today’s rate', 'Exchange my old jewellery']}
                  onPick={(v) => set({ sourcing: v })}
                />
              </div>
            </div>
          ) : null}

          {/* Step 4 — You */}
          {step === 3 ? (
            <div className="space-y-4 animate-fade-in-up">
              <p className="text-sm text-muted-foreground">A few details and you’re done.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Name"><Input value={brief.name} onChange={(e) => set({ name: e.target.value })} /></FormField>
                <FormField label="Phone / WhatsApp"><Input value={brief.phone} onChange={(e) => set({ phone: e.target.value })} placeholder="0300 1234567" /></FormField>
                <FormField label="City"><Input value={brief.city} onChange={(e) => set({ city: e.target.value })} /></FormField>
                <FormField label="Email (optional)"><Input type="email" value={brief.email} onChange={(e) => set({ email: e.target.value })} /></FormField>
              </div>
            </div>
          ) : null}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Back</Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>Continue</Button>
            ) : (
              <Button onClick={submit} disabled={submitting || !brief.name || !brief.phone}>
                {submitting ? 'Sending…' : 'Submit brief'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Live brief card */}
      <aside className="lg:col-span-1">
        <div className="surface-card sticky top-20 rounded-xl p-6">
          <h3 className="font-headline text-lg text-foreground">Your brief</h3>
          <p className="mt-1 text-xs text-muted-foreground">Updates as you go.</p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <Row label="Piece" value={brief.pieceType} />
            <Row label="Occasion" value={brief.occasion} />
            <Row label="Metal" value={brief.metal} />
            <Row label="Gemstones" value={brief.gems.join(', ')} />
            <Row label="Budget" value={BUDGETS.find((b) => b.id === brief.budget)?.label} />
            <Row label="Timeline" value={brief.timeline} />
          </dl>
          <div className="gold-rule my-5" />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <IconGift className="h-4 w-4 text-primary" /> You approve at sketch &amp; wax before any gold is poured.
          </p>
        </div>
      </aside>
    </div>
  )
}

/* ── small helpers ───────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2.5 block text-sm font-medium text-foreground">{children}</span>
}
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  )
}
function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{value || '—'}</dd>
    </div>
  )
}
function Chips({ value, options, onPick }: { value: string; options: string[]; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onPick(o)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm transition-all',
            value === o ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
function MultiChips({ value, options, onToggle }: { value: string[]; options: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onToggle(o)}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm transition-all',
            value.includes(o) ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40',
          )}
        >
          {o}
        </button>
      ))}
    </div>
  )
}
