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
  phone: string
  jewelryType: string
  goldType: string
  weightGrams?: number
  budget?: number // PKR
  description?: string
}

/** Sent to the shop when a customer requests a custom design. */
export function CustomDesignNotificationEmail({
  name,
  email,
  phone,
  jewelryType,
  goldType,
  weightGrams,
  budget,
  description,
}: Props) {
  const row = (label: string, value: string) => (
    <Section key={label}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </Section>
  )

  return (
    <Html>
      <Head />
      <Preview>Custom design request from {name}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Custom Design Request</Heading>
          <Section>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{name}</Text>
            <Text style={styles.value}>
              {email} · {phone}
            </Text>
          </Section>
          <Hr style={styles.hr} />
          {row('Jewellery', jewelryType)}
          {row('Gold type', goldType)}
          {weightGrams ? row('Weight', `${weightGrams} g`) : null}
          {budget ? row('Budget', `Rs ${budget.toLocaleString('en-PK')}`) : null}
          {description ? (
            <Section>
              <Text style={styles.label}>Details</Text>
              <Text style={styles.message}>{description}</Text>
            </Section>
          ) : null}
        </Container>
      </Body>
    </Html>
  )
}

export default CustomDesignNotificationEmail

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
    margin: '12px 0 4px',
  },
  value: { color: '#fafaf9', fontSize: 15, margin: 0 },
  message: { color: '#e7e5e4', fontSize: 15, lineHeight: 1.6, margin: 0 },
  hr: { borderColor: '#3f2e10', margin: '20px 0' },
}
