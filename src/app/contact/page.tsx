import type { Metadata } from 'next'
import { Container, Section } from '@/components/common'
import { ContactForm } from '@/components/contact/contact-form'
import { ContactHeading, ContactSidebar } from '@/components/contact/contact-sidebar'

export const metadata: Metadata = {
  title: 'Contact — Al-Wahab Jewellers',
  description:
    'Visit us at Sarafa Bazar, Shop 2, Multan, or send us a message.',
}

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <ContactHeading />
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <ContactForm />
          <ContactSidebar />
        </div>
      </Container>
    </Section>
  )
}
