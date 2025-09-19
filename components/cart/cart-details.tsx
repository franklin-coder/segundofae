
"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag, ArrowRight, Lock, Truck, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from './cart-context'
import { config, calculateTax, calculateShipping, calculateTotal } from '@/lib/config'

const CartDetails = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart()

  if (items?.length === 0) {
    return (
      <div className="text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any beautiful handcrafted pieces to your cart yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button 
                size="lg"
                className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3 rounded-full"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Cart Items ({items?.length || 0})</h2>
          {items?.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {items?.map((item, index) => (
            <motion.div
              key={`${item?.id}-${index}`}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="relative w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item?.image || '/images/placeholder-product.jpg'}
                    alt={item?.name || 'Product'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 96px"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item?.name}
                      </h3>
                      <Badge variant="outline" className="capitalize text-xs">
                        {item?.category}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item?.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start sm:self-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => updateQuantity(item?.id, (item?.quantity || 1) - 1)}
                          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
                          disabled={(item?.quantity || 0) <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 border-x border-gray-300 min-w-[2.5rem] text-center">
                          {item?.quantity || 1}
                        </span>
                        <button
                          onClick={() => updateQuantity(item?.id, (item?.quantity || 1) + 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold text-[#0A8E81]">
                        ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${(item?.price || 0).toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )) || []}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <motion.div 
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-24"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          
          <div className="space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items?.length || 0} items)</span>
              <span>${total?.toFixed(2) || '0.00'}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{calculateShipping(total || 0) === 0 ? 'FREE' : `$${calculateShipping(total || 0).toFixed(2)}`}</span>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-gray-600">
              <span>Tax (estimated)</span>
              <span>${calculateTax(total || 0).toFixed(2)}</span>
            </div>

            <hr className="border-gray-200" />

            {/* Total */}
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-[#0A8E81]">
                ${calculateTotal(total || 0).toFixed(2)}
              </span>
            </div>

            {/* Free Shipping Notice */}
            {(total || 0) < config.business.freeShippingThreshold && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Add ${(config.business.freeShippingThreshold - (total || 0)).toFixed(2)} more for FREE shipping!
                  </span>
                </div>
              </div>
            )}

            {/* Checkout Button */}
            <Link href="/checkout">
              <Button 
                className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white py-3 text-lg font-medium"
                size="lg"
              >
                <Lock className="h-5 w-5 mr-2" />
                Secure Checkout
              </Button>
            </Link>

            {/* Continue Shopping */}
            <Link href="/products">
              <Button 
                variant="outline"
                className="w-full"
                size="lg"
              >
                Continue Shopping
              </Button>
            </Link>

            {/* Trust Badges */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4 text-green-600" />
                <span>Secure SSL encrypted checkout</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-4 w-4 text-green-600" />
                <span>Free shipping on orders over ${config.business.freeShippingThreshold}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Heart className="h-4 w-4 text-green-600" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CartDetails
