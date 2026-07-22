import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { adminGetProductRows } from '@/lib/data/admin-products'
import { formatPKR } from '@/lib/format'
import { EmptyState } from '@/components/common'
import { IconRing } from '@/components/icons'

export default async function AdminProductsPage() {
  const rows = await adminGetProductRows()

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{rows.length} in the catalogue</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">+ Add product</Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<IconRing className="h-10 w-10" />}
            title="No products yet"
            description="Once the database is connected, add your pieces here."
            action={
              <Button asChild>
                <Link href="/admin/products/new">Add your first product</Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="surface-card mt-6 overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price from</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-secondary/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.primaryImage ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-md border border-border">
                          <Image src={row.primaryImage} alt={row.name} fill sizes="40px" className="object-cover" />
                        </div>
                      ) : null}
                      <span className="font-medium text-foreground">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.fromPrice != null ? formatPKR(row.fromPrice) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {row.isActive ? (
                        <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">Active</span>
                      ) : (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Hidden</span>
                      )}
                      {row.isFeatured ? (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">Featured</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/products/${row.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
