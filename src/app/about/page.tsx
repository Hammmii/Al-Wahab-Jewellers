import type { Metadata } from 'next'
import { AboutHero, AboutStory, AboutValues } from '@/components/about/about-content'

export const metadata: Metadata = {
  title: 'About — Al-Wahab Jewellers',
  description:
    'A family-run gold shop in Multan’s Sarafa Bazar. Genuine gold, hand-finished jewellery, and honest craftsmanship.',
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
    </>
  )
}
