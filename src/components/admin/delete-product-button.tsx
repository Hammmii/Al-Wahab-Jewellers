'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteProductAction } from '@/app/admin/products/actions'

export function DeleteProductButton({ id, slug, name }: { id: string; slug: string; name: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    const res = await deleteProductAction(id, slug)
    setDeleting(false)
    setConfirming(false)
    if (res.error) {
      alert(res.error)
      return
    }
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Delete &quot;{name}&quot;?</span>
        <Button type="button" variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
          {deleting ? '…' : 'Yes'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)} disabled={deleting}>
          No
        </Button>
      </div>
    )
  }

  return (
    <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirming(true)}>
      Delete
    </Button>
  )
}
