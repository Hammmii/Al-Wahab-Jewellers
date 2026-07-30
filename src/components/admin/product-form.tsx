'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { slugify } from '@/lib/validations'
import type { MetalPurity } from '@/lib/domain'

const PURITIES: MetalPurity[] = ['24k', '22k', '21k', '18k', 'silver']

export interface VariantInput {
  metalPurity: MetalPurity
  weightGrams?: number
  size?: string
  price: number
  stock: number
}

export interface ProductFormValues {
  name: string
  slug: string
  description: string
  metalType: string
  categoryId: string
  collectionId: string
  isFeatured: boolean
  isActive: boolean
  variants: VariantInput[]
  images: string[] // storage paths
}

interface CategoryOption {
  id: string
  name: string
}

interface CollectionOption {
  id: string
  name: string
}

export function ProductForm({
  initial,
  action,
  categories = [],
  collections = [],
}: {
  initial?: Partial<ProductFormValues>
  action: (values: ProductFormValues) => Promise<{ error?: string } | void>
  categories?: CategoryOption[]
  collections?: CollectionOption[]
}) {
  const router = useRouter()
  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [metalType, setMetalType] = useState(initial?.metalType ?? '')
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [collectionId, setCollectionId] = useState(initial?.collectionId ?? '')
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false)
  const [isActive, setIsActive] = useState(initial?.isActive ?? true)
  const [variants, setVariants] = useState<VariantInput[]>(
    initial?.variants ?? [{ metalPurity: '22k', price: 0, stock: 0 }],
  )
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError('')
    const newPaths: string[] = []
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.set('file', file)
      const res = await fetch('/api/upload/product-image', { method: 'POST', body: formData })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json.success) {
        setUploadError(json.message || 'Upload failed')
        setUploading(false)
        return
      }
      newPaths.push(json.path)
    }
    setImages((prev) => [...prev, ...newPaths])
    setUploading(false)
  }

  const removeImage = (path: string) => setImages((prev) => prev.filter((p) => p !== path))

  const updateVariant = (i: number, patch: Partial<VariantInput>) =>
    setVariants((vs) => vs.map((v, idx) => (idx === i ? { ...v, ...patch } : v)))
  const addVariant = () =>
    setVariants((vs) => [...vs, { metalPurity: '22k', price: 0, stock: 0 }])
  const removeVariant = (i: number) => setVariants((vs) => vs.filter((_, idx) => idx !== i))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !slug || variants.length === 0) {
      setError('Name, slug, and at least one variant are required.')
      return
    }
    setSaving(true)
    const res = await action({ name, slug, description, metalType, categoryId, collectionId, isFeatured, isActive, variants, images })
    setSaving(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="surface-card space-y-4 rounded-xl p-6">
        <h2 className="font-headline text-lg text-foreground">Details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Name</span>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (!initial?.slug) setSlug(slugify(e.target.value))
              }}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Slug</span>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Metal / colour</span>
          <Input
            value={metalType}
            onChange={(e) => setMetalType(e.target.value)}
            placeholder="e.g. Yellow Gold, White Gold, Rose Gold"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Category</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-foreground">Collection</span>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-foreground">Description</span>
          <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-[hsl(var(--primary))]" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[hsl(var(--primary))]" />
            Active (visible)
          </label>
        </div>
      </div>

      <div className="surface-card space-y-4 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-lg text-foreground">Variants</h2>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Add variant</Button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-1 gap-3 rounded-md border border-border p-3 sm:grid-cols-5">
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">Purity</span>
              <select
                value={v.metalPurity}
                onChange={(e) => updateVariant(i, { metalPurity: e.target.value as MetalPurity })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {PURITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">Weight (g)</span>
              <Input type="number" step="0.001" value={v.weightGrams ?? ''} onChange={(e) => updateVariant(i, { weightGrams: e.target.value ? Number(e.target.value) : undefined })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">Size</span>
              <Input value={v.size ?? ''} onChange={(e) => updateVariant(i, { size: e.target.value || undefined })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs text-muted-foreground">Price (PKR)</span>
              <Input type="number" value={v.price} onChange={(e) => updateVariant(i, { price: Number(e.target.value) })} />
            </label>
            <div className="flex items-end gap-2">
              <label className="block flex-1">
                <span className="mb-1 block text-xs text-muted-foreground">Stock</span>
                <Input type="number" value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} />
              </label>
              {variants.length > 1 ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)} className="text-destructive">
                  Remove
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* Images */}
      <div className="surface-card space-y-4 rounded-xl p-6">
        <h2 className="font-headline text-lg text-foreground">Product Images</h2>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground hover:border-primary/40">
          <span>{uploading ? 'Uploading…' : 'Click to upload images (max 8 MB each)'}</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
          />
        </label>
        {uploadError ? <p className="text-xs text-destructive">{uploadError}</p> : null}
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {images.map((path) => (
              <div key={path} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`}
                  alt="Product"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(path)}
                  className="absolute right-1 top-1 rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</Button>
        <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
      </div>
    </form>
  )
}
