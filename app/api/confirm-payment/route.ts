
import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    // Obtener la instancia de Stripe de forma segura
    const stripe = getStripeServer()
    
    const body = await request.json()
    const { payment_intent_id, order_details } = body

    if (!payment_intent_id) {
      return NextResponse.json({
        success: false,
        error: 'Payment intent ID is required'
      }, { status: 400 })
    }

    // Verificar el estado del payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({
        success: false,
        error: 'Payment has not been completed successfully'
      }, { status: 400 })
    }

    // Aquí puedes agregar lógica adicional como:
    // - Guardar la orden en la base de datos
    // - Enviar emails de confirmación
    // - Actualizar inventario
    // - etc.

    console.log(`Payment confirmed: ${payment_intent_id}`, {
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer_email: paymentIntent.receipt_email,
      order_details
    })

    return NextResponse.json({
      success: true,
      payment_intent: {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status
      }
    })

  } catch (error: any) {
    console.error('Error confirming payment:', error)
    
    // Manejo específico de errores de Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        success: false,
        error: 'Invalid payment intent ID'
      }, { status: 400 })
    }

    // Error específico de configuración
    if (error.message?.includes('apiKey') || error.message?.includes('authenticator')) {
      return NextResponse.json({
        success: false,
        error: 'Payment service configuration error. Please contact support.'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to confirm payment. Please contact support.'
    }, { status: 500 })
  }
}
