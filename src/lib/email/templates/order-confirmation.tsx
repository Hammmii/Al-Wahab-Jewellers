import * as React from 'react'
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

export type OrderConfirmationItem = {
  name: string
  quantity: number
  lineTotal: number // PKR
}

type Props = {
  customerName: string
  orderNumber: string
  items: OrderConfirmationItem[]
  total: number // PKR
  paymentMethod: 'cod' | 'bank_transfer'
}

/** Sent to the customer to confirm their order. */
export function OrderConfirmationEmail({
  customerName,
  orderNumber,
  items,
  total,
  paymentMethod,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Order confirmed — {orderNumber}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={h1}>Thank you for your order</Heading>
          <Text style={value}>Hi {customerName},</Text>
          <Text style={message}>
            We&apos;ve received your order <strong style={{ color: '#e0b04b' }}>#{orderNumber}</strong>.
            Our team will call you shortly to confirm details.
          </Text>

          <Hr style={hr} />
          {items.map((item) => (
            <Row key={item.name} style={{ marginBottom: 8 }}>
              <Column style={itemName}>{item.name} × {item.quantity}</Column>
              <Column style={itemPrice}>Rs {item.lineTotal.toLocaleString('en-PK')}</Column>
            </Row>
          ))}
          <Hr style={hr} />

          <Row>
            <Column style={label}>Total</Column>
            <Column style={totalPrice}>Rs {total.toLocaleString('en-PK')}</Column>
          </Row>
          <Row>
            <Column style={label}>Payment</Column>
            <Column style={value}>
              {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}
            </Column>
          </Row>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail

const body = { backgroundColor: '#0c0a09', margin: 0 }
const container = {
  backgroundColor: '#1c1917',
  border: '1px solid #3f2e10',
  borderRadius: 8,
  margin: '40px auto',
  padding: 32,
  maxWidth: 560,
}
const h1 = { color: '#e0b04b', fontSize: 24, margin: '0 0 16px' }
const value = { color: '#fafaf9', fontSize: 15, margin: 0 }
const message = { color: '#e7e5e4', fontSize: 15, lineHeight: 1.6, margin: '8px 0 0' }
const label = { color: '#a8a29e', fontSize: 13, margin: '8px 0' }
const itemName = { color: '#e7e5e4', fontSize: 14 }
const itemPrice = { color: '#fafaf9', fontSize: 14, textAlign: 'right' as const }
const totalPrice = { color: '#e0b04b', fontSize: 16, fontWeight: 700, textAlign: 'right' as const }
const hr = { borderColor: '#3f2e10', margin: '20px 0' }
