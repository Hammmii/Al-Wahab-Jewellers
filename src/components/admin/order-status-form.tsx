'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
} from '@/app/admin/orders/actions'

const ORDER_STATUSES = ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'] as const
const PAYMENT_STATUSES = ['unpaid', 'paid', 'refunded'] as const

export function OrderStatusForm({
  orderId,
  currentStatus,
  currentPaymentStatus,
}: {
  orderId: string
  currentStatus: string
  currentPaymentStatus: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setError('')
    setLoading(true)

    const results: { error?: string }[] = await Promise.all([
      status !== currentStatus ? updateOrderStatusAction(orderId, status as typeof ORDER_STATUSES[number]) : Promise.resolve({}),
      paymentStatus !== currentPaymentStatus
        ? updatePaymentStatusAction(orderId, paymentStatus as typeof PAYMENT_STATUSES[number])
        : Promise.resolve({}),
    ])

    setLoading(false)
    const firstError = results.find((r) => r.error)?.error
    if (firstError) {
      setError(firstError)
      return
    }

    router.refresh()
  }

  const hasChanges = status !== currentStatus || paymentStatus !== currentPaymentStatus

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Order status</span>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-foreground">Payment status</span>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <Button onClick={handleSave} disabled={!hasChanges || loading} className="w-full">
        {loading ? 'Saving…' : 'Update status'}
      </Button>
    </div>
  )
}
