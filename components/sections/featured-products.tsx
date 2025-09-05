
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/lib/types'

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products/featured')
      if (response?.ok) {
        const data = await response.json()
        setProducts(data?.products || [])
      }
    } catch (error) {
      console.error('Error loading featured products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleProductDeleted = () => {
    // Recargar productos después de eliminar uno
    loadProducts()
  }

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <Star className="h-6 w-6 text-[#0A8E81] mr-2" />
            <span className="text-[#0A8E81] font-medium">Featured Collection</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
            Handpicked for You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our most loved pieces, carefully selected for their unique beauty 
            and exceptional craftsmanship. Each item tells a story of artisanal dedication.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products?.slice(0, 4)?.map((product, index) => (
            <motion.div
              key={product?.id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "easeOut" 
              }}
            >
              <ProductCard product={product} onProductDeleted={handleProductDeleted} />
            </motion.div>
          )) || []}
        </div>

        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/products">
            <Button 
              size="lg"
              className="bg-[#0A8E81] hover:bg-[#087267] px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
              style={{ color: '#FAF5EF' }}
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedProducts
