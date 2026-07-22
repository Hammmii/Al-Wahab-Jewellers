import Link from 'next/link'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Container, EmptyState, Section } from '@/components/common'
import { ProductDetail } from '@/components/products/product-detail'
import { ProductJsonLd } from '@/components/seo/json-ld'
import { getProductBySlug } from '@/lib/data/products'
import { publicImageUrl } from '@/lib/storage'
import { fromPrice } from '@/lib/domain'
import { siteConfig } from '@/lib/site'
import { IconRing } from '@/components/icons'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    return {
      title: `Not found — ${siteConfig.name}`,
      description: siteConfig.description,
    }
  }

  const imagePath =
    product.images.find((i) => i.isPrimary)?.storagePath ?? product.images[0]?.storagePath
  const imageUrl = imagePath ? publicImageUrl(imagePath) : null

  return {
    title: product.name,
    description: product.description ?? siteConfig.description,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      url: `${siteConfig.url}/collections/${product.slug}`,
      images: imageUrl ? [{ url: imageUrl, alt: product.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description ?? undefined,
      images: imageUrl ? { url: imageUrl, alt: product.name } : undefined,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return (
      <Section>
        <Container>
          <EmptyState
            icon={<IconRing className="h-10 w-10" />}
            title="Piece not found"
            description="This piece isn't available. It may have moved or sold."
            action={
              <Button asChild>
                <Link href="/collections">Back to Collection</Link>
              </Button>
            }
          />
        </Container>
      </Section>
    )
  }

  const price = fromPrice(product)

  return (
    <Section>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        slug={product.slug}
        price={price}
        imageUrls={product.images.map((i) => publicImageUrl(i.storagePath)).filter(Boolean)}
      />
      <Container>
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/collections" className="hover:text-primary">Collection</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        <ProductDetail product={product} />
      </Container>
    </Section>
  )
}
