'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { IconRing, IconNecklace, IconBracelet, IconEarring } from '@/components/icons'

type Category = 'rings' | 'necklaces' | 'bracelets' | 'earrings'

const CATEGORIES: { id: Category; label: string; Icon: typeof IconRing }[] = [
  { id: 'rings', label: 'Ring', Icon: IconRing },
  { id: 'necklaces', label: 'Necklace', Icon: IconNecklace },
  { id: 'bracelets', label: 'Bracelet', Icon: IconBracelet },
  { id: 'earrings', label: 'Earrings', Icon: IconEarring },
]

/**
 * Honest "preview composer" (NOT AI). The visitor uploads a photo and
 * positions/scales a jewellery glyph on it to visualise scale and style.
 * No detection is claimed — this is a simple, transparent visualisation tool.
 */
export function PreviewComposer() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [category, setCategory] = useState<Category>('rings')
  const [scale, setScale] = useState(100)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeCat = CATEGORIES.find((c) => c.id === category)!
  const ActiveIcon = activeCat.Icon

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  const updateFromPointer = (clientX: number, clientY: number) => {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) })
  }

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') ?? ''),
      email: String(form.get('email') ?? ''),
      phone: String(form.get('phone') ?? ''),
      ringId: `${activeCat.label} preview`,
    }
    try {
      await fetch('/api/virtual-try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      setDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="surface-card flex flex-col items-center rounded-xl p-10 text-center">
        <ActiveIcon className="h-10 w-10 text-primary" />
        <h3 className="mt-4 font-headline text-2xl text-foreground">Request received</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you. Our team will reach out within 24 hours to help you find or design the perfect piece.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          Start over
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Stage */}
      <div className="lg:col-span-3">
        <div
          ref={stageRef}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border bg-card"
          onPointerDown={(e) => {
            dragging.current = true
            updateFromPointer(e.clientX, e.clientY)
          }}
          onPointerMove={(e) => dragging.current && updateFromPointer(e.clientX, e.clientY)}
          onPointerUp={() => (dragging.current = false)}
          onPointerLeave={() => (dragging.current = false)}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="Your photo" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground"
            >
              <ActiveIcon className="h-10 w-10" />
              <span className="text-sm">Upload a photo of your hand, wrist, or neck to preview</span>
              <span className="text-xs underline">Choose a photo</span>
            </button>
          )}

          {photo ? (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-primary"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, -50%) scale(${scale / 100})` }}
            >
              <div className="rounded-full bg-background/40 p-2 backdrop-blur-sm">
                <ActiveIcon className="h-12 w-12" />
              </div>
            </div>
          ) : null}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickPhoto} className="hidden" />

        {photo ? (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategory(id)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                    id === category
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40',
                  )}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Size</Label>
                <span className="text-sm text-muted-foreground">{scale}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={220}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-[hsl(var(--primary))]"
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Drag the {activeCat.label.toLowerCase()} glyph to position it. This is a simple preview
              tool to gauge scale and style — not an AI try-on.
            </p>

            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              Change photo
            </Button>
          </div>
        ) : null}
      </div>

      {/* Quote form */}
      <form onSubmit={submit} className="surface-card space-y-5 rounded-xl p-6 lg:col-span-2">
        <div>
          <h2 className="font-headline text-xl text-foreground">Request a quote</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Like what you see? Tell us about it and we’ll help you find or make the piece.
          </p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
          <Input name="name" required minLength={2} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Phone</span>
          <Input name="phone" required minLength={10} placeholder="0300 1234567" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Email (optional)</span>
          <Input name="email" type="email" />
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? 'Sending…' : 'Request a Quote'}
        </Button>
      </form>
    </div>
  )
}
