
"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSubcategories, getCategoryInfo } from '@/lib/subcategories'

interface SubcategoryShowcaseProps {
  category: string
}

const SubcategoryShowcase = ({ category }: SubcategoryShowcaseProps) => {
  // Obtener subcategorías y información de la categoría usando las utilidades
  const subcategoriesData = getSubcategories(category)
  const currentCategory = getCategoryInfo(category)

  // Mapear subcategorías con imágenes y colores
  const subcategories = subcategoriesData.map((sub, index) => {
    const images = {
      'necklaces-crochet': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
      'necklaces-beaded': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'bracelets-beaded': 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80',
      'bracelets-crochet': 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'earrings-crochet': 'https://i.etsystatic.com/5313580/r/il/a580ee/2331209321/il_570xN.2331209321_e2gx.jpg',
      'earrings-beaded': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      'earrings-resin': 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }

    const colors = [
      'from-[#0A8E81] to-[#087267]',
      'from-[#AEBBB2] to-[#8B9C8F]',
      'from-[#0A8E81] to-[#33C3B5]',
      'from-[#AEBBB2] to-[#C1CFC5]'
    ]

    return {
      ...sub,
      image: images[sub.apiValue as keyof typeof images] || images['necklaces-crochet'],
      href: `/products/${category}/${sub.id}`,
      color: colors[index % colors.length]
    }
  })

  if (!currentCategory || subcategories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/">
            <Button className="bg-[#0A8E81] hover:bg-[#087267]">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-20">
        {/* Back Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/#explore-collections">
            <Button 
              variant="ghost" 
              className="text-[#0A8E81] hover:text-[#087267] hover:bg-[#0A8E81]/10 p-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Collections
            </Button>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
            {currentCategory.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {currentCategory.description}
          </p>
        </motion.div>

        {/* Subcategories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subcategories.map((subcategory, index) => (
            <motion.div
              key={subcategory.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              <Link href={subcategory.href}>
                <div className="group relative overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover-lift">
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={subcategory.image}
                      alt={subcategory.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${subcategory.color} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6" style={{ color: '#FAF5EF' }}>
                      <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                        {subcategory.name}
                      </h3>
                      <p className="text-sm opacity-90 mb-4">
                        {subcategory.description}
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
    </div>
  )
}

export default SubcategoryShowcase
