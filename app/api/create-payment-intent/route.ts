
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = 'cad', metadata = {} } = body

    // Validar que el amount sea válido
    if (!amount || amount < 50) { // Minimum 50 cents
      return NextResponse.json({
        error: 'Invalid amount'
      }, { status: 400 })
    }

    // Crear el payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: currency,
      metadata: {
        ...metadata,
        source: 'FaeLight Crafts',
        timestamp: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json({
      error: error.message || 'An error occurred while creating payment intent'
    }, { status: 500 })
  }
}
