
"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/cart/cart-context'
import AdminProductControls from '@/components/admin/admin-product-controls'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onProductDeleted?: () => void
}

const ProductCard = ({ product, onProductDeleted }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/images/placeholder-product.jpg',
        category: product.category
      })
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement quick view modal
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement wishlist functionality
  }

  if (!product) return null

  return (
    <motion.div
      className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      <Link href={`/products/${product.category}/${product.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          <Image
            src={product.images?.[0] || '/images/placeholder-product.jpg'}
            alt={product.name || 'Product image'}
            fill
            className={`object-cover transition-all duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />

          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center space-x-2 transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-gray-900"
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-gray-100 text-gray-900"
              onClick={handleToggleWishlist}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-1">
            {product.featured && (
              <Badge className="bg-[#0A8E81] text-white text-xs">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge variant="secondary" className="text-xs">
                Sale
              </Badge>
            )}
          </div>

          {/* Admin Controls */}
          <AdminProductControls
            productId={product.id}
            productName={product.name}
            onProductDeleted={onProductDeleted}
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#0A8E81] transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {product.category}
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-[#0A8E81]">
                ${product.price?.toFixed(2) || '0.00'}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white transition-all duration-300"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard
