
"use client"

import { motion } from 'framer-motion'
import ProductCard from './product-card'
import { ArrowRight } from 'lucide-react'
import { Product } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface RelatedProductsProps {
  products: Product[]
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="mt-20">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#000000' }}>
          You Might Also Like
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover more beautiful pieces from our collection that complement your style
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {products.slice(0, 4).map((product, index) => (
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
            <ProductCard product={product} onProductDeleted={() => window.location.reload()} />
          </motion.div>
        ))}
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
            className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </section>
  )
}

export default RelatedProducts
