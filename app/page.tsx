
import { Suspense } from 'react'
import HeroSection from '@/components/sections/hero-section'
import CategoryShowcase from '@/components/sections/category-showcase'
import AboutPreview from '@/components/sections/about-preview'

export default function HomePage() {
  return (
    <div className="pt-16 lg:pt-20">
      <HeroSection />
      <CategoryShowcase />
      <AboutPreview />
    </div>
  )
}
