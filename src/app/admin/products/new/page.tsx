import { ProductForm } from '@/components/admin/product-form'
import { createProductAction } from '../actions'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">Add product</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create a new piece in the catalogue.</p>
      <div className="mt-6">
        <ProductForm action={createProductAction} />
      </div>
    </div>
  )
}
