
"use client"

import { useState, useEffect, useCallback } from 'react'
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
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'newest'>('newest')

  const loadProducts = useCallback(async () => {
    const requestId = Math.random().toString(36).substring(7)
    const startTime = Date.now()
    
    try {
      // Reset states at the beginning of each load
      setLoading(true)
      setError(null)
      setProducts([]) // Clear previous products immediately
      
      const params = new URLSearchParams()
      
      if (category && category !== 'all') {
        params.append('category', category)
      }
      
      console.log(`[Grid:${requestId}] 🚀 Loading products for category: ${category || 'all'}`)
      
      const response = await fetch(`/api/products?${params}`, {
        // Add cache busting to prevent stale data
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
        }
      })
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const responseTime = Date.now() - startTime
      console.log(`[Grid:${requestId}] 📡 Response received in ${responseTime}ms - Status: ${response.status}`)
      
      const data = await response.json()
      console.log(`[Grid:${requestId}] ✅ Loaded ${data?.products?.length || 0} products for category: ${category || 'all'}`)
      
      // Enhanced logging for debugging
      if (data?.query) {
        console.log(`[Grid:${requestId}] 🔍 API Query info:`, data.query)
      }
      
      if (data?.products && Array.isArray(data.products)) {
        setProducts(data.products)
        console.log(`[Grid:${requestId}] 📦 Products set successfully`)
      } else {
        console.warn(`[Grid:${requestId}] ⚠️ Invalid products data received:`, data)
        setProducts([])
      }
    } catch (error) {
      const totalTime = Date.now() - startTime
      console.error(`[Grid:${requestId}] ❌ Error after ${totalTime}ms:`, error)
      
      // Enhanced error logging
      if (error instanceof Error) {
        console.error(`[Grid:${requestId}] Error name:`, error.name)
        console.error(`[Grid:${requestId}] Error message:`, error.message)
        if (error.stack) {
          console.error(`[Grid:${requestId}] Error stack:`, error.stack)
        }
      }
      
      // Set user-friendly error message
      let userErrorMessage = 'Failed to load products'
      if (error instanceof Error) {
        if (error.message.includes('HTTP 500')) {
          userErrorMessage = 'Server error occurred. Please try again.'
        } else if (error.message.includes('Failed to fetch')) {
          userErrorMessage = 'Network error. Please check your connection.'
        } else {
          userErrorMessage = error.message
        }
      }
      
      setError(userErrorMessage)
      setProducts([])
    } finally {
      const totalTime = Date.now() - startTime
      console.log(`[Grid:${requestId}] 🏁 Request completed in ${totalTime}ms`)
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

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

  if (error) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <div className="text-red-400 mb-4">
          <SlidersHorizontal className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error loading products
        </h3>
        <p className="text-gray-600 mb-6">
          {error}
        </p>
        <Button 
          onClick={() => loadProducts()}
          className="bg-[#0A8E81] hover:bg-[#087267]"
        >
          Try Again
        </Button>
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
