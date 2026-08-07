'use client'

import { useT } from '@/lib/i18n/language-context'
import { siteConfig } from '@/lib/site'
import { phoneE164, formatPhoneDisplay } from '@/lib/format'

export function ContactHeading() {
  const t = useT()
  return (
    <div className="text-center">
      <span className="text-xs font-medium uppercase tracking-luxury text-primary/80">Contact</span>
      <h1 className="mt-3 font-headline text-4xl text-foreground md:text-5xl">{t('contact.title')}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('contact.subtitle')}</p>
    </div>
  )
}

export function ContactSidebar() {
  const t = useT()
  return (
    <div className="space-y-6">
      <div className="surface-card flex items-start gap-4 rounded-xl p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary text-xl">
          ⌖
        </span>
        <div>
          <h3 className="font-headline text-lg text-foreground">{t('contact.showroom')}</h3>
          <p className="text-sm text-muted-foreground">
            {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.country}
          </p>
        </div>
      </div>

      <div className="surface-card rounded-xl p-6 text-sm text-muted-foreground">
        <h3 className="font-headline text-lg text-foreground">{t('contact.reachUs')}</h3>
        <ul className="mt-3 space-y-3">
          {siteConfig.contacts.map((contact) => (
            <li key={contact.phone} className="flex items-center justify-between gap-3">
              <span className="text-foreground">{contact.name}</span>
              <a
                href={`tel:${phoneE164(contact.phone)}`}
                dir="ltr"
                className="font-medium text-primary hover:underline"
              >
                {formatPhoneDisplay(contact.phone)}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <a
            href={`https://wa.me/${phoneE164(siteConfig.whatsapp).replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Message us on WhatsApp
          </a>
        </p>
      </div>

      <div className="surface-card rounded-xl p-6 text-sm text-muted-foreground">
        <h3 className="font-headline text-lg text-foreground">{t('contact.hours')}</h3>
        <p className="mt-2">{t('contact.hoursDesc')}</p>
      </div>
    </div>
  )
}
