import type { Metadata } from 'next'
import { Container, Section, SectionHeading } from '@/components/common'
import { BriefWizard } from '@/components/custom-design/brief-wizard'
import { CustomBriefHeading } from '@/components/custom-design/custom-copy'
import { CustomHero, CustomProcess, CustomPricing, CustomFaq } from '@/components/custom-design/custom-copy'

export const metadata: Metadata = {
  title: 'Bespoke — Custom Gold Design',
  description:
    'Commission a one-of-a-kind piece of gold jewellery, made by hand to your vision by our craftsmen in Multan’s Sarafa Bazar.',
}

export default function CustomDesignPage() {
  return (
    <>
      <CustomHero />
      <CustomProcess />
      <CustomPricing />

      <Section id="brief">
        <Container>
          <CustomBriefHeading />
          <div className="mt-12">
            <BriefWizard />
          </div>
        </Container>
      </Section>

      <CustomFaq />
    </>
  )
}
