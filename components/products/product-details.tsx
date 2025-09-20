
"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, Heart, Share2, ShoppingCart, Truck, RotateCcw, Shield, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCart } from '@/components/cart/cart-context'
import { Product } from '@/lib/types'

interface ProductDetailsProps {
  product: Product
}

const ProductDetails = ({ product }: ProductDetailsProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '/images/placeholder-product.jpg',
          category: product.category
        })
      }
    }
  }

  const handleShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL to clipboard
      navigator?.clipboard?.writeText(window.location.href)
    }
  }

  if (!product) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <motion.div 
          className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Image
            src={product.images?.[selectedImageIndex] || '/images/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <Badge className="bg-[#0A8E81] text-white">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge variant="secondary">
                Sale
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index 
                    ? 'border-[#0A8E81]' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">
              {product.category}
            </Badge>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-1">(4.8)</span>
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-[#0A8E81]">
                ${product.price?.toFixed(2)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <Badge className="bg-red-100 text-red-800">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </Badge>
            )}
          </div>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Quantity and Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {product.inStock ? (
                <span className="text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  In Stock
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-[#0A8E81] hover:bg-[#087267] text-white py-3 text-lg font-medium"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`px-4 ${isWishlisted ? 'bg-red-50 border-red-200' : ''}`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="px-4"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="border-t pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-[#0A8E81]" />
              </div>
              <div>
                <div className="font-medium">Free Shipping</div>
                <div className="text-gray-600">Orders over $50</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-full flex items-center justify-center">
                <RotateCcw className="h-5 w-5 text-[#0A8E81]" />
              </div>
              <div>
                <div className="font-medium">30-Day Returns</div>
                <div className="text-gray-600">Easy returns</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-[#0A8E81]" />
              </div>
              <div>
                <div className="font-medium">Authentic</div>
                <div className="text-gray-600">Handmade quality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="border-t pt-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600 leading-relaxed">
                {product.longDescription || product.description}
              </p>
            </div>
            {product.dimensions && (
              <div>
                <h4 className="font-medium mb-2">Dimensions</h4>
                <p className="text-gray-600">{product.dimensions}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetails
