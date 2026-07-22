'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contactSchema, type ContactInput } from '@/lib/validations'
import { IconPurity } from '@/components/icons'
import { useT } from '@/lib/i18n/language-context'

export function ContactForm() {
  const t = useT()
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) })

  const onSubmit = async (data: ContactInput) => {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    reset()
    setDone(true)
  }

  if (done) {
    return (
      <div className="surface-card flex flex-col items-center rounded-xl p-10 text-center">
        <span className="text-primary">
          <IconPurity className="h-10 w-10" />
        </span>
        <h3 className="mt-4 font-headline text-2xl text-foreground">{t('contact.sentTitle')}</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t('contact.sentDesc')}</p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>
          {t('contact.sendAnother')}
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="surface-card space-y-5 rounded-xl p-6 md:p-8">
      <Field label={t('field.name')} error={errors.name?.message}>
        <Input {...register('name')} autoComplete="name" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t('field.email')} error={errors.email?.message}>
          <Input type="email" {...register('email')} autoComplete="email" />
        </Field>
        <Field label={t('field.phone')} error={errors.phone?.message}>
          <Input {...register('phone')} placeholder="0300 1234567" autoComplete="tel" />
        </Field>
      </div>
      <Field label={t('field.message')} error={errors.message?.message}>
        <Textarea rows={5} {...register('message')} />
      </Field>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? t('cta.sending') : t('cta.send')}
      </Button>
    </form>
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
