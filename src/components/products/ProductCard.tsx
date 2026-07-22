'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Product } from '@/lib/domain'
import { fromPrice, primaryImage } from '@/lib/domain'
import { publicImageUrl } from '@/lib/storage'
import { useCart, useWishlist } from '@/lib/stores/cart-wishlist-stores'
import { KaratBadge, Price } from '@/components/common'
import { IconCart, IconHeart } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const addItem = useCart((s) => s.addItem)
  const toggleWishlist = useWishlist((s) => s.toggle)
  const [wished, setWished] = useState(useWishlist.getState().has(product.id))
  const t = useT()

  const image = primaryImage(product)
  const price = fromPrice(product)
  const src = image ? publicImageUrl(image.storagePath) : ''
  const firstVariant = product.variants[0]

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWished((v) => !v)
    toggleWishlist(product.id)
  }

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!firstVariant) return
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      variantId: firstVariant.id,
      price: firstVariant.price,
      image: src,
      metalPurity: firstVariant.metalPurity,
      size: firstVariant.size ?? undefined,
    })
  }

  return (
    <Link
      href={`/collections/${product.slug}`}
      className={cn(
        'group surface-card lift edge-glow relative flex flex-col overflow-hidden rounded-xl',
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-card">
        {src ? (
          <Image
            src={src}
            alt={image?.altText ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={wished}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors',
            wished
              ? 'border-primary bg-primary/20 text-primary'
              : 'border-border/60 bg-background/60 text-muted-foreground hover:text-primary',
          )}
        >
          <IconHeart className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-headline text-lg leading-snug text-foreground">{product.name}</h3>
        {product.metalType ? (
          <span className="text-xs text-muted-foreground">{product.metalType}</span>
        ) : null}
        {firstVariant ? <KaratBadge purity={firstVariant.metalPurity} /> : null}

        <div className="mt-auto flex items-center justify-between pt-3">
          {price != null ? (
            <Price amount={price} from={product.variants.length > 1} />
          ) : (
            <span className="text-sm text-muted-foreground">{t('product.enquire')}</span>
          )}

          <button
            type="button"
            onClick={handleAdd}
            disabled={!firstVariant}
            aria-label={t('product.addToCart')}
            className="flex h-9 items-center gap-2 rounded-full border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-40"
          >
            <IconCart className="h-4 w-4" /> {t('product.addToCart')}
          </button>
        </div>
      </div>
    </Link>
  )
}
