
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './product-card'
import { Button } from '@/components/ui/button'
import { Grid, List, SlidersHorizontal } from 'lucide-react'
import { Product } from '@/lib/types'

interface ProductsGridProps {
  category?: string
}

const ProductsGrid = ({ category }: ProductsGridProps) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest')

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (category && category !== 'all') {
        params.append('category', category)
      }
      
      const response = await fetch(`/api/products?${params}`)
      if (response?.ok) {
        const data = await response.json()
        setProducts(data?.products || [])
      }
    } catch (error) {
      console.error('Error loading products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [category])

  const handleProductDeleted = () => {
    // Recargar productos después de eliminar uno
    loadProducts()
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a?.name || '').localeCompare(b?.name || '')
      case 'price-low':
        return (a?.price || 0) - (b?.price || 0)
      case 'price-high':
        return (b?.price || 0) - (a?.price || 0)
      case 'newest':
        return new Date(b?.created_at || 0).getTime() - new Date(a?.created_at || 0).getTime()
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="text-sm text-gray-600">
          {products?.length || 0} {products?.length === 1 ? 'product' : 'products'} found
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sort Dropdown */}
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-300 rounded px-3 py-1.5 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="name">Name A-Z</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-[#0A8E81] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-[#0A8E81] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts?.length > 0 ? (
        <motion.div 
          className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}
          layout
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product?.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              layout
            >
              <ProductCard product={product} onProductDeleted={handleProductDeleted} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-400 mb-4">
            <SlidersHorizontal className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your filters or browse our other categories
          </p>
          <Button 
            onClick={() => window.location.href = '/products'}
            className="bg-[#0A8E81] hover:bg-[#087267]"
          >
            View All Products
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProductsGrid
