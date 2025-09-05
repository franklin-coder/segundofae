
"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Lock, CreditCard, Truck, User, Mail, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/cart/cart-context'
import { useRouter } from 'next/navigation'
import StripePaymentForm from './stripe-payment-form'

const CheckoutForm = () => {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment'>('shipping')
  const [formData, setFormData] = useState({
    // Contact Information
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Shipping Address
    address: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    
    // Options
    saveInfo: false,
    subscribe: true
  })

  const subtotal = total || 0
  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.12
  const totalAmount = subtotal + shipping + tax

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Crear payment intent cuando se pasa al step de payment
  useEffect(() => {
    if (currentStep === 'payment' && !clientSecret && totalAmount > 0) {
      createPaymentIntent()
    }
  }, [currentStep, totalAmount, clientSecret])

  const createPaymentIntent = async () => {
    try {
      setIsProcessing(true)
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'cad',
          metadata: {
            customer_email: formData.email,
            customer_name: `${formData.firstName} ${formData.lastName}`,
            items: items?.map(item => `${item?.name} (${item?.quantity})`).join(', ') || ''
          }
        }),
      })

      const result = await response.json()
      
      if (result.error) {
        console.error('Error creating payment intent:', result.error)
      } else {
        setClientSecret(result.client_secret)
        setPaymentIntentId(result.payment_intent_id)
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.email || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.province || !formData.postalCode) {
      alert('Please fill in all required fields')
      return
    }
    
    setCurrentStep('payment')
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    // Limpiar carrito y redirigir a página de éxito
    clearCart()
    router.push(`/checkout/success?payment_intent=${paymentIntent.id}`)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error)
    // El error ya se muestra en el componente de Stripe
  }

  if (items?.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Add some beautiful pieces to your cart before checkout.
        </p>
        <Button 
          onClick={() => router.push('/products')}
          className="bg-[#0A8E81] hover:bg-[#087267]"
        >
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Checkout Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 'shipping' ? 'text-[#0A8E81]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'shipping' ? 'bg-[#0A8E81] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Shipping</span>
            </div>
            <div className="w-12 h-px bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-[#0A8E81]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'payment' ? 'bg-[#0A8E81] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        {currentStep === 'shipping' ? (
          <form onSubmit={handleShippingSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-[#0A8E81]" />
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-[#0A8E81]" />
              <h3 className="text-lg font-semibold">Shipping Address</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address*</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="apartment">Apartment, Suite, etc.</Label>
                <Input
                  id="apartment"
                  value={formData.apartment}
                  onChange={(e) => handleInputChange('apartment', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City*</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province*</Label>
                  <select 
                    id="province"
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    required
                  >
                    <option value="">Select Province</option>
                    <option value="BC">British Columbia</option>
                    <option value="AB">Alberta</option>
                    <option value="ON">Ontario</option>
                    <option value="QC">Quebec</option>
                    {/* Add other provinces */}
                  </select>
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code*</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Options */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="saveInfo"
                checked={formData.saveInfo}
                onCheckedChange={(checked) => handleInputChange('saveInfo', checked as boolean)}
              />
              <label htmlFor="saveInfo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Save this information for next time
              </label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="subscribe"
                checked={formData.subscribe}
                onCheckedChange={(checked) => handleInputChange('subscribe', checked as boolean)}
              />
              <label htmlFor="subscribe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                Email me with news and offers
              </label>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            type="submit"
            className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white py-4 text-lg font-medium"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Continue to Payment
            </div>
          </Button>
        </form>
        ) : (
          /* Payment Step */
          <div className="space-y-8">
            {/* Order Summary Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">Complete Your Order</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Shipping to:</strong> {formData.firstName} {formData.lastName}</p>
                <p>{formData.address}, {formData.city}, {formData.province} {formData.postalCode}</p>
                <p><strong>Email:</strong> {formData.email}</p>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-[#0A8E81]" />
                <h3 className="text-lg font-semibold">Payment Information</h3>
                <Lock className="h-4 w-4 text-green-600 ml-auto" />
              </div>
              
              {clientSecret ? (
                <StripePaymentForm
                  clientSecret={clientSecret}
                  totalAmount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  orderDetails={{
                    ...formData,
                    items: items,
                    subtotal: subtotal,
                    shipping: shipping,
                    tax: tax,
                    total: totalAmount
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0A8E81] border-t-transparent mx-auto mb-4" />
                  <p className="text-gray-600">Preparing secure checkout...</p>
                </div>
              )}
            </div>

            {/* Back Button */}
            <Button
              onClick={() => setCurrentStep('shipping')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Back to Shipping Information
            </Button>
          </div>
        )}
      </motion.div>

      {/* Order Summary */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24 space-y-6">
          <h3 className="text-xl font-bold">Order Summary</h3>
          
          {/* Cart Items */}
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {items?.map((item, index) => (
              <div key={`${item?.id}-${index}`} className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item?.image || '/images/placeholder-product.jpg'}
                    alt={item?.name || 'Product'}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{item?.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{item?.category}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">
                    ${((item?.price || 0) * (item?.quantity || 1)).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {item?.quantity || 1}
                  </div>
                </div>
              </div>
            )) || []}
          </div>

          <hr />

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Tax (GST/PST)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <hr />
            
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-[#0A8E81]">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Badges */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-green-600" />
              <span>SSL secured checkout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4 text-green-600" />
              <span>Free shipping on orders $50+</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CheckoutForm
