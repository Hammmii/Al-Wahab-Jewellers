'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { KaratBadge, Price } from '@/components/common'
import { ProductGallery } from './product-gallery'
import { useCart, useWishlist } from '@/lib/stores/cart-wishlist-stores'
import { useToast } from '@/hooks/use-toast'
import { formatGrams } from '@/lib/format'
import { IconCart, IconHeart } from '@/components/icons'
import type { Product } from '@/lib/domain'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n/language-context'

export function ProductDetail({ product }: { product: Product }) {
  const addItem = useCart((s) => s.addItem)
  const toggleWishlist = useWishlist((s) => s.toggle)
  const { toast } = useToast()
  const t = useT()

  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]
  const wished = useWishlist.getState().has(product.id)

  const handleAdd = () => {
    if (!variant) return
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        variantId: variant.id,
        price: variant.price,
        metalPurity: variant.metalPurity,
        size: variant.size ?? undefined,
      },
      quantity,
    )
    toast({ title: 'Added to cart', description: `${quantity} × ${product.name}` })
  }

  const handleWishlist = () => {
    toggleWishlist(product.id)
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
      <ProductGallery images={product.images} name={product.name} />

      <div className="flex flex-col">
        {product.metalType ? (
          <span className="text-sm uppercase tracking-luxury text-primary/80">{product.metalType}</span>
        ) : null}
        <h1 className="mt-2 font-headline text-4xl text-foreground md:text-5xl">{product.name}</h1>

        <div className="mt-5">
          {variant ? <Price amount={variant.price} size="xl" /> : <span className="text-muted-foreground">Enquire for price</span>}
        </div>

        {product.description ? (
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>
        ) : null}

        <Separator className="my-6" />

        {/* Variant selection */}
        {product.variants.length > 0 ? (
          <div className="space-y-4">
            <div>
              <span className="mb-2 block text-sm font-medium text-foreground">{t('product.purity')}</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
                      v.id === variantId
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40',
                    )}
                  >
                    {v.metalPurity.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {variant ? (
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                {variant.weightGrams ? (
                  <>
                    <dt className="text-muted-foreground">{t('product.weight')}</dt>
                    <dd className="text-right text-foreground">{formatGrams(variant.weightGrams)}</dd>
                  </>
                ) : null}
                {variant.size ? (
                  <>
                    <dt className="text-muted-foreground">{t('product.size')}</dt>
                    <dd className="text-right text-foreground">{variant.size}</dd>
                  </>
                ) : null}
                <dt className="text-muted-foreground">{t('product.stock')}</dt>
                <dd className="text-right text-foreground">
                  {variant.stock > 0 ? `${variant.stock} ${t('product.available')}` : t('product.madeToOrder')}
                </dd>
              </dl>
            ) : null}
          </div>
        ) : null}

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-medium text-foreground">{t('product.quantity')}</span>
          <div className="flex items-center rounded-md border border-border">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</Button>
            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</Button>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
          <Button size="lg" onClick={handleAdd} disabled={!variant}>
            <IconCart className="mr-2 h-5 w-5" /> {t('product.addToCart')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleWishlist}
            className={cn('gap-2', wished && 'border-primary text-primary')}
            aria-pressed={wished}
          >
            <IconHeart className="h-5 w-5" /> {wished ? t('product.saved') : t('product.save')}
          </Button>
        </div>

        <Button asChild variant="secondary" size="lg" className="mt-3 w-full">
          <Link href="/contact">{t('cta.inquire')}</Link>
        </Button>

        {/* Reassurance — real facts only */}
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>· {t('trust.hallmarked')}</li>
          <li>· {t('trust.payment')}</li>
          <li>· {t('trust.location')}</li>
        </ul>
      </div>
    </div>
  )
}
