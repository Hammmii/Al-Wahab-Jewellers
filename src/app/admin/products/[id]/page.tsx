import { notFound } from 'next/navigation'
import { ProductForm, type ProductFormValues } from '@/components/admin/product-form'
import { updateProductAction } from '../actions'
import { adminGetProduct } from '@/lib/data/admin-products'
import { getCategories, getCollections } from '@/lib/data/categories'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [product, categories, collections] = await Promise.all([
    adminGetProduct(id),
    getCategories(),
    getCollections(),
  ])
  if (!product) return notFound()

  const initial: Partial<ProductFormValues> = {
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    metalType: product.metalType ?? '',
    categoryId: product.categoryId ?? '',
    collectionId: product.collectionId ?? '',
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    variants: product.variants.map((v) => ({
      metalPurity: v.metalPurity,
      weightGrams: v.weightGrams ?? undefined,
      size: v.size ?? undefined,
      price: v.price,
      stock: v.stock,
    })),
    images: product.images.map((i) => i.storagePath),
  }

  return (
    <div>
      <h1 className="font-headline text-3xl text-foreground">Edit product</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-6">
        <ProductForm
          initial={initial}
          action={(values) => updateProductAction(id, values)}
          categories={categories}
          collections={collections}
        />
      </div>
    </div>
  )
}
