'use client'

import { useState } from 'react'
import Image from 'next/image'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { cn } from '@/lib/utils'
import { publicImageUrl } from '@/lib/storage'
import type { ProductImage } from '@/lib/domain'

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0)
  const sorted = [...images].sort((a, b) => a.position - b.position)
  const current = sorted[active]
  const src = current ? publicImageUrl(current.storagePath) : ''

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
        No image
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="surface-card relative aspect-square overflow-hidden rounded-xl">
        <TransformWrapper
          initialScale={1}
          minScale={1}
          maxScale={4}
          centerOnInit
          wheel={{ step: 0.05 }}
          doubleClick={{ mode: 'zoomIn', step: 0.7 }}
        >
          <TransformComponent
            wrapperClass="!h-full !w-full"
            contentClass="!h-full !w-full"
          >
            {src ? (
              <Image
                src={src}
                alt={current.altText ?? name}
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            ) : null}
          </TransformComponent>
        </TransformWrapper>
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          Hover / scroll to zoom
        </span>
      </div>

      {sorted.length > 1 ? (
        <div className="grid grid-cols-4 gap-3">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg border transition-colors',
                i === active ? 'border-primary' : 'border-border hover:border-primary/40',
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
            >
              <Image
                src={publicImageUrl(img.storagePath)}
                alt={img.altText ?? `${name} view ${i + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
