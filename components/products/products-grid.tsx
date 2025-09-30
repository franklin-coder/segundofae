
'use client'

import { useEffect, useState } from 'react'
import ProductCard from './product-card'
import { Product } from '@/lib/types'

interface ProductsGridProps {
  category?: string
  subcategory?: string
}

export default function ProductsGrid({ category, subcategory }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        let url = '/api/products'
        const params = new URLSearchParams()
        
        if (category) {
          params.append('category', category)
        }
        if (subcategory) {
          params.append('subcategory', subcategory)
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, subcategory])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading products: {error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
