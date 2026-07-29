import { Section } from '@/components/common'
import { ProductCard } from '@/components/products/ProductCard'
import { Stagger, StaggerItem } from '@/components/motion/reveal'
import { getProducts, getProductsByCategory, searchProducts } from '@/lib/data/products'
import { getCategories } from '@/lib/data/categories'
import type { Category } from '@/lib/domain'
import { CollectionsHeading, CollectionsEmpty, CategoryTabs, SearchResultsHeading } from '@/components/collections/collections-copy'

const CATS_FALLBACK: Category[] = [
  { id: 'rings', name: 'Rings', slug: 'rings', description: null, position: 0 },
  { id: 'necklaces', name: 'Necklaces', slug: 'necklaces', description: null, position: 1 },
  { id: 'bracelets', name: 'Bracelets', slug: 'bracelets', description: null, position: 2 },
  { id: 'earrings', name: 'Earrings', slug: 'earrings', description: null, position: 3 },
]

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const activeCategory = params?.category?.toLowerCase() ?? 'all'
  const searchQuery = params?.search?.trim() ?? ''

  const [categories, products] = await Promise.all([
    getCategories().then((c) => (c.length ? c : CATS_FALLBACK)),
    searchQuery
      ? searchProducts(searchQuery)
      : activeCategory === 'all'
        ? getProducts()
        : getProductsByCategory(activeCategory),
  ])

  const tabs = [{ name: 'All', slug: 'all' }, ...categories.map((c) => ({ name: c.name, slug: c.slug }))]

  return (
    <>
      <Section spacing="tight" className="pb-0">
        <CollectionsHeading />
        {searchQuery ? <SearchResultsHeading query={searchQuery} count={products.length} /> : null}
        {!searchQuery ? <CategoryTabs categories={categories} active={activeCategory} /> : null}
      </Section>

      <Section spacing="default" className="pt-8">
        {products.length === 0 ? (
          <CollectionsEmpty searchQuery={searchQuery} />
        ) : (
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </Section>
    </>
  )
}
