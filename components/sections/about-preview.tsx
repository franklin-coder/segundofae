
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AboutPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Crafted with Love in Victoria
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Every piece at FaeLight Crafts is handmade with passion and precision. 
            From selecting the finest materials to the final finishing touches, 
            we pour our heart into creating jewelry that tells your unique story. 
            Based in beautiful Victoria, Canada, we draw inspiration from the 
            natural beauty that surrounds us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/about">Read Our Story</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
