'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container, EmptyState, Section } from '@/components/common'
import { useWishlist } from '@/lib/stores/cart-wishlist-stores'
import { useHydrated } from '@/lib/stores/use-hydrated'
import { IconHeart } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'

export default function WishlistPage() {
  const hydrated = useHydrated()
  const t = useT()
  const ids = useWishlist((s) => s.ids)
  const remove = useWishlist((s) => s.remove)
  const clear = useWishlist((s) => s.clear)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const showEmpty = mounted && hydrated && ids.length === 0

  return (
    <Section>
      <Container>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">
              {t('wishlist.saved')}
            </span>
            <h1 className="mt-2 font-headline text-3xl text-foreground md:text-4xl">
              {t('wishlist.title')}
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {ids.length === 0
                ? t('wishlist.emptyDesc')
                : `${ids.length} ${ids.length === 1 ? t('wishlist.count') : t('wishlist.countPlural')}`}
            </p>
          </div>
          {ids.length > 0 ? (
            <Button variant="outline" onClick={clear} className="text-destructive hover:text-destructive">
              {t('wishlist.clearAll')}
            </Button>
          ) : null}
        </div>

        {showEmpty ? (
          <EmptyState
            icon={<IconHeart className="h-10 w-10" />}
            title={t('wishlist.empty')}
            description={t('wishlist.emptyDesc')}
            action={
              <Button asChild>
                <Link href="/collections">{t('cta.browseCollection')}</Link>
              </Button>
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {ids.map((id) => (
              <li key={id} className="flex items-center justify-between gap-4 py-4">
                <Link href={`/collections/${id}`} className="font-headline text-lg text-foreground hover:text-primary">
                  {t('wishlist.saved')}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => remove(id)} className="text-muted-foreground hover:text-destructive">
                  {t('cart.remove')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </Section>
  )
}
