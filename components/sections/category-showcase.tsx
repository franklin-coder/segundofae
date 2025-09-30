
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

const categories = [
  {
    id: 'earrings',
    name: 'Earrings',
    slug: 'earrings',
    description: 'Elegant drops and modern hoops crafted with intricate techniques.',
    image: 'https://i.etsystatic.com/5313580/r/il/a580ee/2331209321/il_570xN.2331209321_e2gx.jpg',
    href: '/subcategories/earrings',
    color: 'from-[#AEBBB2] to-[#8B9C8F]',
    subcategories: ['Crochet', 'Beaded', 'Resin']
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    slug: 'necklaces',
    description: 'Statement pieces and delicate chains that complement any style.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
    href: '/subcategories/necklaces',
    color: 'from-[#0A8E81] to-[#087267]',
    subcategories: ['Crochet', 'Beaded']
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Layering essentials and statement cuffs made with love.',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
    href: '/subcategories/bracelets',
    color: 'from-[#0A8E81] to-[#33C3B5]',
    subcategories: ['Beaded', 'Crochet']
  }
]

export default function CategoryShowcase() {
  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated collections, each piece handcrafted with attention to detail and artistic flair.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div key={category.slug} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {category.name} Collection
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{category.name}</h3>
                <p className="text-gray-600">{category.description}</p>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        href={`/products/${category.slug}/${subcategory.toLowerCase()}`}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors border-b border-transparent hover:border-gray-300"
                      >
                        {subcategory} {category.name}
                      </Link>
                    ))}
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link href={`/products/${category.slug}`}>
                      Shop All {category.name}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
