
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
  const [isStripeReady, setIsStripeReady] = useState(false)
  const { error, setStripeError, clearError, getErrorSuggestion, hasError } = useStripeError()

  // Verificar que Stripe esté listo
  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true)
    }
  }, [stripe, elements])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      setStripeError({ 
        message: 'Stripe has not loaded yet. Please wait and try again.', 
        type: 'validation_error' 
      })
      return
    }

    if (!isStripeReady) {
      setStripeError({ 
        message: 'Payment system is still loading. Please wait a moment.', 
        type: 'validation_error' 
      })
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
        console.error('Stripe payment error:', stripeError)
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
            console.error('Payment confirmation failed:', result.error)
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

      {!isStripeReady && (
        <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
          <LoadingSpinner size="sm" />
          <span className="ml-2 text-gray-600">Loading payment system...</span>
        </div>
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
        disabled={!stripe || !elements || isLoading || !isStripeReady}
        className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" color="white" />
            Processing Payment...
          </div>
        ) : !isStripeReady ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" color="white" />
            Loading...
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
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null)
  const [stripeError, setStripeError] = useState<string | null>(null)

  useEffect(() => {
    // Inicializar Stripe de forma segura
    const initializeStripe = async () => {
      try {
        const stripe = await getStripe()
        setStripePromise(Promise.resolve(stripe))
      } catch (error: any) {
        console.error('Failed to initialize Stripe:', error)
        setStripeError(error.message || 'Failed to load payment system')
        onError('Failed to load payment system. Please refresh the page and try again.')
      }
    }

    initializeStripe()
  }, [onError])

  if (stripeError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <h3 className="font-medium">Payment System Error</h3>
        </div>
        <p className="mt-2 text-red-700">{stripeError}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Refresh Page
        </Button>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-lg text-gray-600">Loading payment system...</span>
      </div>
    )
  }

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
        fontFamily: 'system-ui, sans-serif',
      },
    },
    loader: 'auto' as const,
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
