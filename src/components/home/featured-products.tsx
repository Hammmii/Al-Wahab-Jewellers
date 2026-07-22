import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedProducts } from '@/lib/data/products'
import { primaryImage, fromPrice } from '@/lib/domain'
import { publicImageUrl } from '@/lib/storage'
import { KaratBadge, Price, Section } from '@/components/common'
import { Stagger, StaggerItem } from '@/components/motion/reveal'
import { FeaturedHeading, FeaturedEmpty } from './featured-copy'

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(8)

  return (
    <Section>
      <FeaturedHeading />

      {products.length === 0 ? (
        <FeaturedEmpty />
      ) : (
        <Stagger className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const image = primaryImage(product)
            const price = fromPrice(product)
            const firstVariant = product.variants[0]
            const src = image ? publicImageUrl(image.storagePath) : ''

            return (
              <StaggerItem key={product.id}>
                <Link href={`/collections/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-card">
                    {src ? (
                      <Image
                        src={src}
                        alt={image?.altText ?? product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-headline text-lg leading-snug text-foreground">
                        {product.name}
                      </h3>
                      {firstVariant ? (
                        <KaratBadge purity={firstVariant.metalPurity} className="mt-1.5" />
                      ) : null}
                    </div>
                    {price != null ? (
                      <Price amount={price} from={product.variants.length > 1} size="md" />
                    ) : null}
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </Stagger>
      )}
    </Section>
  )
}
