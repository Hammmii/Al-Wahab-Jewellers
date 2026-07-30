import { ProductForm } from '@/components/admin/product-form'
import { createProductAction } from '../actions'
import { getCategories, getCollections } from '@/lib/data/categories'

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([getCategories(), getCollections()])

  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">Add product</h1>
      <p className="mt-1 text-sm text-muted-foreground">Create a new piece in the catalogue.</p>
      <div className="mt-6">
        <ProductForm action={createProductAction} categories={categories} collections={collections} />
      </div>
    </div>
  )
}
