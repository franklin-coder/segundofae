
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ProductsGrid from './products-grid'
import ProductsFilter from './products-filter'
import { getCategoryInfo, getSubcategoryName, getApiValue } from '@/lib/subcategories'

interface ProductsPageProps {
  category?: string
  subcategory?: string
}

const ProductsPage = ({ category, subcategory }: ProductsPageProps) => {
  // Obtener información usando las utilidades
  const currentCategory = category ? getCategoryInfo(category) : null
  const subcategoryName = category && subcategory ? getSubcategoryName(category, subcategory) : null

  // Determinar el título de la página
  const getPageTitle = () => {
    if (category === 'and-more') {
      return 'And More'
    }
    if (subcategoryName) {
      return subcategoryName
    }
    if (currentCategory) {
      return currentCategory.name
    }
    return 'All Products'
  }

  // Determinar la URL de regreso
  const getBackUrl = () => {
    if (subcategory && category) {
      return `/subcategories/${category}`
    }
    return '/#explore-collections'
  }

  // Determinar el texto del botón de regreso
  const getBackText = () => {
    if (subcategory && category) {
      return `Back to ${currentCategory?.name || 'Category'}`
    }
    return 'Back to Collections'
  }

  // Construir el filtro de categoría para la API usando la utilidad
  const apiCategory = category ? getApiValue(category, subcategory) : undefined

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-8">
        {/* Back Navigation */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href={getBackUrl()}>
            <Button 
              variant="ghost" 
              className="text-[#0A8E81] hover:text-[#087267] hover:bg-[#0A8E81]/10 p-0"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {getBackText()}
            </Button>
          </Link>
        </motion.div>

        {/* Page Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {category === 'and-more' 
              ? 'Discover our unique collection of special pieces and accessories'
              : `Explore our beautiful collection of ${getPageTitle().toLowerCase()}`
            }
          </p>
        </motion.div>

        {/* Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ProductsFilter currentCategory={apiCategory} />
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ProductsGrid category={apiCategory} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
