
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { XCircle, ArrowLeft, ShoppingCart, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'

const CheckoutCancel = () => {
  const { items, itemCount } = useCart()
  
  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-16">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="h-12 w-12 text-orange-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Checkout Cancelled
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            No worries! Your cart items are still saved and waiting for you.
          </p>

          {/* Cart Status */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShoppingCart className="h-6 w-6 text-[#0A8E81]" />
              <h2 className="text-2xl font-semibold text-[#0A8E81]">
                Your Cart
              </h2>
            </div>
            
            {itemCount > 0 ? (
              <div>
                <p className="text-lg mb-4">
                  You have <strong>{itemCount}</strong> item{itemCount !== 1 ? 's' : ''} in your cart
                </p>
                <p className="text-gray-600 mb-6">
                  Your beautiful handcrafted pieces are still waiting for you. 
                  Complete your purchase whenever you're ready!
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg mb-4">Your cart is empty</p>
                <p className="text-gray-600 mb-6">
                  Explore our collection of beautiful handcrafted jewelry and accessories.
                </p>
              </div>
            )}
          </div>

          {/* What happened section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3 text-blue-900">What happened?</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• You may have clicked the back button during checkout</p>
              <p>• The payment process was interrupted</p>
              <p>• You chose to cancel the transaction</p>
              <p>• There may have been a temporary connection issue</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {itemCount > 0 ? (
              <Link href="/checkout">
                <Button 
                  size="lg"
                  className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Try Checkout Again
                </Button>
              </Link>
            ) : (
              <Link href="/products">
                <Button 
                  size="lg"
                  className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            )}
            
            <Link href="/cart">
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-full"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                View Cart
              </Button>
            </Link>
            
            <Link href="/">
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-full"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">
              Need help with your order?
            </p>
            <Link 
              href="/contact" 
              className="text-[#0A8E81] hover:underline font-medium"
            >
              Contact our support team
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutCancel
