
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900 font-berkshire-swash">
          FaeLight Crafts
        </h1>
        <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Handcrafted jewelry and accessories made with love in Victoria, Canada. 
          Each piece tells a unique story of artisanal excellence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-gray-900 hover:bg-gray-800">
            <Link href="/products">Shop All Products</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">Learn Our Story</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
