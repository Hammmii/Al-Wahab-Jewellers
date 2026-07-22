import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type Props = {
  name: string
  email: string
  phone?: string
  message: string
}

/** Sent to the shop when a visitor submits the contact form. */
export function ContactNotificationEmail({ name, email, phone, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>New enquiry from {name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>New Enquiry</Heading>
          <Section>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{name}</Text>
            <Text style={styles.label}>Contact</Text>
            <Text style={styles.value}>
              {email}
              {phone ? ` · ${phone}` : ''}
            </Text>
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.label}>Message</Text>
          <Text style={styles.message}>{message}</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default ContactNotificationEmail

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
  value: { color: '#fafaf9', fontSize: 16, margin: 0 },
  message: { color: '#e7e5e4', fontSize: 15, lineHeight: 1.6, margin: 0 },
  hr: { borderColor: '#3f2e10', margin: '24px 0' },
}
