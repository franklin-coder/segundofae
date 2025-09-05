
"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Mail, ArrowRight, Home, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

const CheckoutSuccess = () => {
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const orderNumber = `FC${Date.now().toString().slice(-6)}`
  
  useEffect(() => {
    if (paymentIntentId) {
      // Aquí podrías hacer una llamada a tu API para obtener detalles de la orden
      console.log('Payment Intent ID:', paymentIntentId)
      setOrderDetails({
        paymentIntentId,
        orderNumber
      })
    }
  }, [paymentIntentId, orderNumber])
  
  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-16">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your beautiful handcrafted jewelry is on its way to you.
          </p>

          {/* Order Details */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-[#0A8E81]">
              Order Confirmation
            </h2>
            <div className="text-lg font-mono font-bold mb-4">
              Order #{orderNumber}
            </div>
            {paymentIntentId && (
              <div className="flex items-center justify-center gap-2 mb-4 text-sm text-gray-500">
                <CreditCard className="h-4 w-4" />
                <span>Payment ID: {paymentIntentId}</span>
              </div>
            )}
            <p className="text-gray-600 mb-6">
              A confirmation email has been sent to your email address with all the order details.
              {paymentIntentId && ' Your payment has been successfully processed.'}
            </p>
            
            {/* Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-[#0A8E81]/10 rounded-full flex items-center justify-center mb-3">
                  <Package className="h-6 w-6 text-[#0A8E81]" />
                </div>
                <h3 className="font-semibold mb-2">Order Processing</h3>
                <p className="text-sm text-gray-600">We'll prepare your handcrafted items with care</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-[#0A8E81]/10 rounded-full flex items-center justify-center mb-3">
                  <Truck className="h-6 w-6 text-[#0A8E81]" />
                </div>
                <h3 className="font-semibold mb-2">Shipping</h3>
                <p className="text-sm text-gray-600">Your order will be shipped within 3-5 business days</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 bg-[#0A8E81]/10 rounded-full flex items-center justify-center mb-3">
                  <Mail className="h-6 w-6 text-[#0A8E81]" />
                </div>
                <h3 className="font-semibold mb-2">Updates</h3>
                <p className="text-sm text-gray-600">You'll receive tracking information via email</p>
              </div>
            </div>
          </div>

          {/* Actions */}
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
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-2">
              Questions about your order?
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

export default CheckoutSuccess
