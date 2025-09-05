
"use client"

import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface StripePaymentFormProps {
  clientSecret: string
  totalAmount: number
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  orderDetails: any
}

// Componente interno del formulario de pago
const PaymentForm = ({ totalAmount, onSuccess, onError, orderDetails }: {
  totalAmount: number
  onSuccess: (paymentIntent: any) => void
  onError: (error: string) => void
  orderDetails: any
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please wait.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Confirmar el pago
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      })

      if (stripeError) {
        setError(stripeError.message || 'An error occurred during payment')
        onError(stripeError.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirmar el pago en nuestro backend
        try {
          const response = await fetch('/api/confirm-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment_intent_id: paymentIntent.id,
              order_details: orderDetails
            }),
          })

          const result = await response.json()
          
          if (result.success) {
            onSuccess(paymentIntent)
          } else {
            setError(result.error || 'Payment confirmation failed')
            onError(result.error || 'Payment confirmation failed')
          }
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError)
          setError('Payment succeeded but confirmation failed. Please contact support.')
          onError('Payment confirmation failed')
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setError(error.message || 'An unexpected error occurred')
      onError(error.message || 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay']
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white py-4 text-lg font-medium"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Pay ${totalAmount.toFixed(2)} CAD
          </div>
        )}
      </Button>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock className="h-4 w-4 text-green-600" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>
    </form>
  )
}

// Componente principal que envuelve con Elements
const StripePaymentForm = ({ 
  clientSecret, 
  totalAmount, 
  onSuccess, 
  onError,
  orderDetails 
}: StripePaymentFormProps) => {
  const stripePromise = getStripe()

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#0A8E81',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        borderRadius: '8px',
      },
    },
  }

  return (
    <Elements options={options} stripe={stripePromise}>
      <PaymentForm
        totalAmount={totalAmount}
        onSuccess={onSuccess}
        onError={onError}
        orderDetails={orderDetails}
      />
    </Elements>
  )
}

export default StripePaymentForm
