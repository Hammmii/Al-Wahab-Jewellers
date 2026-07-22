import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export type VirtualTryOnDetails = {
  name?: string
  email?: string
  phone?: string
  ringId: string
  hasImage?: boolean
}

/** Sent to the shop when a customer requests a virtual try-on. */
export function VirtualTryOnNotificationEmail({
  name,
  email,
  phone,
  ringId,
  hasImage,
}: VirtualTryOnDetails) {
  const customerName = name || 'Not provided'
  const contactParts = [email, phone].filter(Boolean)
  const contact = contactParts.length > 0 ? contactParts.join(' · ') : 'Not provided'

  return (
    <Html>
      <Head />
      <Preview>Virtual try-on request for {ringId}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Virtual Try-On Request</Heading>

          <Section>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{customerName}</Text>
          </Section>

          <Section>
            <Text style={styles.label}>Contact</Text>
            <Text style={styles.value}>{contact}</Text>
          </Section>

          <Section>
            <Text style={styles.label}>Product / Ring ID</Text>
            <Text style={styles.value}>{ringId}</Text>
          </Section>

          {hasImage ? (
            <Section>
              <Text style={styles.label}>Reference image</Text>
              <Text style={styles.value}>Customer uploaded a reference image with this request.</Text>
            </Section>
          ) : null}

          <Hr style={styles.hr} />

          <Text style={styles.message}>
            Please respond to this request within 24 hours. If contact details were provided,
            reach out to confirm the design, sizing, and next steps.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

/** Sent to the customer confirming their virtual try-on request. */
export function VirtualTryOnConfirmationEmail({
  name,
  email,
  phone,
  ringId,
}: VirtualTryOnDetails) {
  const greeting = name ? `Hi ${name},` : 'Hi there,'

  return (
    <Html>
      <Head />
      <Preview>We received your virtual try-on request</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Virtual Try-On Request Received</Heading>

          <Text style={styles.value}>{greeting}</Text>
          <Text style={styles.message}>
            Thank you for your interest in Al-Wahab Jewellers. We have received your request
            to see how product <strong style={{ color: '#e0b04b' }}>{ringId}</strong> looks as a
            virtual try-on.
          </Text>

          <Hr style={styles.hr} />

          <Section>
            <Text style={styles.label}>What happens next?</Text>
            <Text style={styles.message}>
              Our team will review your request and get back to you within 24 hours. If we need
              any sizing photos or additional details, we will contact you at the details you
              provided.
            </Text>
          </Section>

          {(phone || email) && (
            <Section>
              <Text style={styles.label}>Your contact details</Text>
              {phone ? <Text style={styles.value}>Phone: {phone}</Text> : null}
              {email ? (
                <Text style={styles.value}>
                  Email: <Link style={styles.link}>{email}</Link>
                </Text>
              ) : null}
            </Section>
          )}

          <Hr style={styles.hr} />

          <Text style={styles.footer}>
            Al-Wahab Jewellers — Sarafa Bazar, Shop #2, Multan
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default VirtualTryOnNotificationEmail

const styles = {
  body: { backgroundColor: '#0c0a09', margin: 0 },
  container: {
    backgroundColor: '#1c1917',
    border: '1px solid #3f2e10',
    borderRadius: 8,
    margin: '40px auto',
    padding: 32,
    maxWidth: 560,
  },
  h1: { color: '#e0b04b', fontSize: 24, margin: '0 0 24px' },
  label: {
    color: '#a8a29e',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    margin: '16px 0 4px',
  },
  value: { color: '#fafaf9', fontSize: 15, margin: 0 },
  message: { color: '#e7e5e4', fontSize: 15, lineHeight: 1.6, margin: '8px 0 0' },
  link: { color: '#e0b04b', textDecoration: 'none' },
  footer: { color: '#a8a29e', fontSize: 13, margin: '16px 0 0' },
  hr: { borderColor: '#3f2e10', margin: '24px 0' },
}
