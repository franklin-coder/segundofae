
import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // Obtener la instancia de Stripe de forma segura
    const stripe = getStripeServer()
    
    const body = await request.json()
    const { amount, currency = 'cad', metadata = {}, customer_email, items = [] } = body

    // Validar que el amount sea válido
    if (!amount || typeof amount !== 'number' || amount < 0.50) {
      return NextResponse.json({
        error: 'Invalid amount. Minimum amount is $0.50 CAD'
      }, { status: 400 })
    }

    // Validar currency
    if (!['cad', 'usd'].includes(currency.toLowerCase())) {
      return NextResponse.json({
        error: 'Invalid currency. Only CAD and USD are supported'
      }, { status: 400 })
    }

    // Validar email si se proporciona
    if (customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 })
    }

    // Preparar metadata enriquecida
    const enrichedMetadata = {
      ...metadata,
      source: 'FaeLight Crafts',
      timestamp: new Date().toISOString(),
      customer_email: customer_email || 'guest',
      items_count: items.length.toString(),
      items_summary: items.slice(0, 3).map((item: any) => 
        `${item.name} (${item.quantity})`
      ).join(', ') + (items.length > 3 ? '...' : ''),
      order_type: 'online_store'
    }

    // Crear el payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency.toLowerCase(),
      metadata: enrichedMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
      receipt_email: customer_email || undefined,
      description: `FaeLight Crafts Order - ${items.length} item${items.length !== 1 ? 's' : ''}`,
      statement_descriptor: 'FAELIGHT CRAFTS',
      statement_descriptor_suffix: 'JEWELRY',
    })

    console.log(`Payment intent created: ${paymentIntent.id} for $${amount} ${currency.toUpperCase()}`)

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      amount: amount,
      currency: currency.toUpperCase()
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    
    // Manejo específico de errores de Stripe
    if (error.type === 'StripeCardError') {
      return NextResponse.json({
        error: 'Your card was declined. Please try a different payment method.'
      }, { status: 400 })
    }
    
    if (error.type === 'StripeRateLimitError') {
      return NextResponse.json({
        error: 'Too many requests. Please try again in a moment.'
      }, { status: 429 })
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        error: 'Invalid request. Please check your payment information.'
      }, { status: 400 })
    }
    
    if (error.type === 'StripeAPIError') {
      return NextResponse.json({
        error: 'Payment service temporarily unavailable. Please try again.'
      }, { status: 503 })
    }
    
    if (error.type === 'StripeConnectionError') {
      return NextResponse.json({
        error: 'Network error. Please check your connection and try again.'
      }, { status: 503 })
    }

    // Error específico de configuración
    if (error.message?.includes('apiKey') || error.message?.includes('authenticator')) {
      return NextResponse.json({
        error: 'Payment service configuration error. Please contact support.'
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'An unexpected error occurred while processing your payment. Please try again.'
    }, { status: 500 })
  }
}
