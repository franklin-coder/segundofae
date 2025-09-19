
"use client"

import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe'
import { Button } from '@/components/ui/button'
import { Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useStripeError } from '@/hooks/use-stripe-error'
import ErrorAlert from '@/components/ui/error-alert'
import LoadingSpinner from '@/components/ui/loading-spinner'

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
  const { error, setStripeError, clearError, getErrorSuggestion, hasError } = useStripeError()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setStripeError({ message: 'Stripe has not loaded yet. Please wait.', type: 'validation_error' })
      return
    }

    setIsLoading(true)
    clearError()

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
        setStripeError(stripeError)
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
            setStripeError({ 
              message: result.error || 'Payment confirmation failed', 
              type: 'api_error' 
            })
            onError(result.error || 'Payment confirmation failed')
          }
        } catch (confirmError) {
          console.error('Error confirming payment:', confirmError)
          setStripeError({ 
            message: 'Payment succeeded but confirmation failed. Please contact support.', 
            type: 'api_error' 
          })
          onError('Payment confirmation failed')
        }
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        setStripeError({ 
          message: 'Your payment is being processed. You will receive a confirmation email shortly.', 
          type: 'validation_error' 
        })
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        setStripeError({ 
          message: 'Your payment requires additional authentication. Please complete the verification.', 
          type: 'validation_error' 
        })
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      setStripeError(error)
      onError(error.message || 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {hasError && error && (
        <ErrorAlert
          title="Payment Error"
          message={error.message}
          suggestion={getErrorSuggestion(error)}
          onDismiss={clearError}
          variant={error.type === 'validation_error' ? 'warning' : 'destructive'}
        />
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
            fields: {
              billingDetails: {
                name: 'auto',
                email: 'auto',
                phone: 'auto',
                address: {
                  country: 'auto',
                  line1: 'auto',
                  line2: 'auto',
                  city: 'auto',
                  state: 'auto',
                  postalCode: 'auto'
                }
              }
            }
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" color="white" />
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Pay ${totalAmount.toFixed(2)} CAD
          </div>
        )}
      </Button>

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <Lock className="h-4 w-4 text-green-600" />
          <span>Your payment information is secure and encrypted</span>
        </div>
        <div className="text-xs text-gray-500">
          Powered by Stripe • PCI DSS compliant
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
