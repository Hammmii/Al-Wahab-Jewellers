import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { adminGetProductRows } from '@/lib/data/admin-products'
import { formatPKR } from '@/lib/format'
import { ProductsHeading, ProductsEmpty, ProductsTableHead, ProductStatus, EditText } from '@/components/admin/admin-copy'

export default async function AdminProductsPage() {
  const rows = await adminGetProductRows()

  return (
    <div>
      <ProductsHeading count={rows.length} />

      {rows.length === 0 ? (
        <ProductsEmpty />
      ) : (
        <div className="surface-card mt-6 overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <ProductsTableHead />
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
                    <ProductStatus isActive={row.isActive} isFeatured={row.isFeatured} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/products/${row.id}`}>
                        <EditText />
                      </Link>
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
