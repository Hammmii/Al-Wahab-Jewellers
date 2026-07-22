'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Container, EmptyState, Section } from '@/components/common'
import { useCart, useCartSubtotal } from '@/lib/stores/cart'
import { useHydrated } from '@/lib/stores/use-hydrated'
import { formatPKR } from '@/lib/format'
import { orderSchema, type OrderInput } from '@/lib/validations'
import { IconCart } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'

export default function CheckoutPage() {
  const hydrated = useHydrated()
  const t = useT()
  const items = useCart((s) => s.items)
  const subtotal = useCartSubtotal()
  const clear = useCart((s) => s.clear)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: { paymentMethod: 'cod' },
  })

  const onSubmit = async (data: OrderInput) => {
    const payload = {
      ...data,
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      clear()
      window.location.href = '/checkout/success'
    }
  }

  if (mounted && hydrated && items.length === 0) {
    return (
      <Section>
        <Container>
          <EmptyState
            icon={<IconCart className="h-10 w-10" />}
            title={t('order.nothingToCheckout')}
            description={t('cart.emptyDesc')}
            action={
              <Button asChild>
                <Link href="/collections">{t('cta.browseCollection')}</Link>
              </Button>
            }
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section>
      <Container>
        <h1 className="mb-8 font-headline text-3xl text-foreground md:text-4xl">{t('order.title')}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="surface-card rounded-xl p-6">
              <h2 className="font-headline text-xl text-foreground">{t('order.contact')}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label={t('order.name')} error={errors.customerName?.message}>
                  <Input {...register('customerName')} autoComplete="name" />
                </Field>
                <Field label={t('order.phone')} error={errors.phone?.message}>
                  <Input {...register('phone')} placeholder="0300 1234567" autoComplete="tel" />
                </Field>
                <Field label={t('order.email')} error={errors.email?.message}>
                  <Input type="email" {...register('email')} autoComplete="email" />
                </Field>
              </div>
            </div>

            <div className="surface-card rounded-xl p-6">
              <h2 className="font-headline text-xl text-foreground">{t('order.address')}</h2>
              <div className="mt-4 grid gap-4">
                <Field label={t('order.addressLine')} error={errors.address?.line1?.message}>
                  <Input {...register('address.line1')} autoComplete="address-line1" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={t('order.city')} error={errors.address?.city?.message}>
                    <Input {...register('address.city')} autoComplete="address-level2" />
                  </Field>
                  <Field label={t('order.province')} error={errors.address?.province?.message}>
                    <Input {...register('address.province')} />
                  </Field>
                </div>
                <Field label={t('order.postal')}>
                  <Input {...register('address.postalCode')} />
                </Field>
              </div>
            </div>

            <div className="surface-card rounded-xl p-6">
              <h2 className="font-headline text-xl text-foreground">{t('order.payment')}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" value="cod" {...register('paymentMethod')} className="accent-[hsl(var(--primary))]" />
                  <span>
                    <span className="block font-medium text-foreground">{t('order.cod')}</span>
                    <span className="text-sm text-muted-foreground">{t('order.codDesc')}</span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" value="bank_transfer" {...register('paymentMethod')} className="accent-[hsl(var(--primary))]" />
                  <span>
                    <span className="block font-medium text-foreground">{t('order.bank')}</span>
                    <span className="text-sm text-muted-foreground">{t('order.bankDesc')}</span>
                  </span>
                </label>
              </div>
              <div className="mt-4">
                <Field label={t('order.notes')}>
                  <Textarea rows={3} {...register('notes')} />
                </Field>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="surface-card sticky top-20 rounded-xl p-6">
              <h2 className="font-headline text-xl text-foreground">{t('order.yourOrder')}</h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={`${item.productId}::${item.variantId ?? ''}`} className="flex justify-between gap-3 text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-muted-foreground/70">× {item.quantity}</span>
                    </span>
                    <span className="text-foreground">{formatPKR(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-semibold">
                <span>{t('cart.total')}</span>
                <span className="text-primary">{formatPKR(subtotal)}</span>
              </div>
              <Button type="submit" size="lg" className="mt-5 w-full" disabled={isSubmitting}>
                {isSubmitting ? t('order.placing') : t('order.placeOrder')}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">{t('order.confirmNote')}</p>
            </div>
          </div>
        </form>
      </Container>
    </Section>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  )
}
