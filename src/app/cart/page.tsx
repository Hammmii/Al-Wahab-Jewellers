'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Container, EmptyState, Price, Section } from '@/components/common'
import { useCart, useCartSubtotal } from '@/lib/stores/cart'
import { useHydrated } from '@/lib/stores/use-hydrated'
import { formatPKR } from '@/lib/format'
import { IconCart } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'

export default function CartPage() {
  const hydrated = useHydrated()
  const router = useRouter()
  const t = useT()
  const items = useCart((s) => s.items)
  const updateQuantity = useCart((s) => s.updateQuantity)
  const removeItem = useCart((s) => s.removeItem)
  const clear = useCart((s) => s.clear)
  const subtotal = useCartSubtotal()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isEmpty = mounted && hydrated && items.length === 0
  const totalItems = items.reduce((n, i) => n + i.quantity, 0)

  const handleCheckout = () => {
    if (items.length === 0) return
    router.push('/checkout')
  }

  if (isEmpty) {
    return (
      <Section>
        <Container>
          <EmptyState
            icon={<IconCart className="h-10 w-10" />}
            title={t('cart.empty')}
            description={t('cart.emptyDesc')}
            action={
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/collections">{t('cta.browseCollection')}</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/wishlist">{t('nav.wishlist')}</Link>
                </Button>
              </div>
            }
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">
              {t('cart.selection')}
            </span>
            <h1 className="mt-2 font-headline text-3xl text-foreground md:text-4xl">{t('cart.title')}</h1>
          </div>
          <Button variant="outline" onClick={clear} className="text-destructive hover:text-destructive">
            {t('cart.clear')}
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={`${item.productId}::${item.variantId ?? ''}`} className="surface-card flex gap-4 rounded-xl p-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <Link href={`/collections/${item.slug}`} className="hover:text-primary">
                        <h3 className="truncate font-headline text-lg text-foreground">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {[item.metalPurity, item.size].filter(Boolean).join(' · ') || ''}
                      </p>
                    </div>
                    <p className="whitespace-nowrap font-semibold text-primary">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-md border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId, item.variantId)}
                    >
                      {t('cart.remove')}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="surface-card sticky top-20 rounded-xl p-6">
              <h2 className="font-headline text-xl text-foreground">{t('cart.summary')}</h2>
              <div className="mt-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t('cart.subtotal')} ({totalItems} {t('cart.items')})
                  </span>
                  <Price amount={subtotal} />
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{formatPKR(subtotal)}</span>
                </div>

                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li>· {t('trust.payment')}</li>
                  <li>· {t('trust.hallmarked')}</li>
                  <li>· {t('product.purity')}</li>
                </ul>

                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  {t('cart.checkout')}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/collections">{t('cta.continueShopping')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
