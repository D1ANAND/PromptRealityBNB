export const metadata = {
  title: 'Home - PromptReality',
  description: 'PromptReality is a platform for creating AI experiences in augmented reality.',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
// import FeaturesBlocks from '@/components/features-blocks'
// import Testimonials from '@/components/testimonials'
// import Newsletter from '@/components/newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      {/* <FeaturesBlocks />
      <Testimonials />
      <Newsletter /> */}
    </>
  )
}
