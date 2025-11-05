
"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CategoryShowcase = () => {
  const categories = [
    {
      id: 'necklaces',
      name: 'Necklaces',
      description: 'Statement pieces and delicate chains',
      image: '/julia_necklaces.png',
      href: '/products/necklaces',
      color: 'from-[#0A8E81] to-[#087267]'
    },
    {
      id: 'earrings',
      name: 'Earrings',
      description: 'Elegant drops and modern hoops',
      image: '/julia_earrings.png',
      href: '/products/earrings',
      color: 'from-[#AEBBB2] to-[#8B9C8F]'
    },
    {
      id: 'bracelets',
      name: 'Bracelets',
      description: 'Layering essentials and statement cuffs',
      image: '/julia_bracelet.png',
      href: '/products/bracelets',
      color: 'from-[#0A8E81] to-[#33C3B5]'
    },
    {
      id: 'and-more',
      name: 'And More',
      description: 'Discover other unique pieces',
      image: '/Book-and-Arrow-web.png',
      href: '/products/and-more',
      color: 'from-[#AEBBB2] to-[#C1CFC5]'
    }
  ]

  return (
    <section id="explore-collections" className="py-20" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
            Explore Our Collections
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            From finely detailed crochet and beaded jewelry to thoughtfully crafted resin pieces, plush creations, and everyday accessories, each item is designed with care and attention to detail. Every piece is unique, reflecting a dedication to craftsmanship and a love for thoughtful design. Our collection offers timeless elegance with a subtle, imaginative touch, for those who appreciate quality, individuality, and beauty in the objects they surround themselves with.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              <Link href={category.href}>
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ color: '#FAF5EF' }}>
                      <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-4">
                        {category.description}
                      </p>
                      
                      <Button 
                        variant="secondary"
                        className="w-fit bg-white/20 hover:bg-white/30 border-white/30 hover:border-white/50 transition-all duration-300"
                        style={{ color: '#FAF5EF' }}
                        size="sm"
                      >
                        Shop Now
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryShowcase
