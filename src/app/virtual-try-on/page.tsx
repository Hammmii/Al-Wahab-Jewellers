import type { Metadata } from 'next'
import { Container, Section } from '@/components/common'
import { PreviewComposer } from '@/components/try-on/preview-composer'
import {
  TryOnHero,
  TryOnTrust,
  TryOnComposerHeading,
  TryOnHonest,
  TryOnRealCta,
} from '@/components/try-on/try-on-copy'

export const metadata: Metadata = {
  title: 'Preview Studio — Virtual Try-On',
  description:
    'Preview how a ring, necklace, bracelet, or earrings might look. An honest visualisation tool — and a real try-on in our Multan showroom.',
}

export default function VirtualTryOnPage() {
  return (
    <>
      <TryOnHero />
      <TryOnTrust />

      <Section>
        <Container>
          <TryOnComposerHeading />
          <div className="mt-12">
            <PreviewComposer />
          </div>
        </Container>
      </Section>

      <TryOnHonest />
      <TryOnRealCta />
    </>
  )
}
