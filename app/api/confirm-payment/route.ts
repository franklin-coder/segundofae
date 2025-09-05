
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_intent_id, order_details } = body

    // Validar el payment intent
    if (!payment_intent_id) {
      return NextResponse.json({
        error: 'Payment intent ID is required'
      }, { status: 400 })
    }

    // Obtener el payment intent de Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    // Verificar que el pago fue exitoso
    if (paymentIntent.status === 'succeeded') {
      
      // Aquí puedes guardar la orden en la base de datos
      console.log('Order confirmed:', {
        payment_intent_id,
        amount: paymentIntent.amount / 100,
        customer_email: order_details?.email,
        order_details,
        timestamp: new Date().toISOString()
      })

      // TODO: Enviar email de confirmación al cliente
      // TODO: Guardar la orden en la base de datos
      // TODO: Reducir inventario si es necesario

      return NextResponse.json({
        success: true,
        payment_intent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100
        },
        message: 'Payment confirmed successfully'
      })
    } else {
      return NextResponse.json({
        error: 'Payment not completed',
        status: paymentIntent.status
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Error confirming payment:', error)
    return NextResponse.json({
      error: error.message || 'An error occurred while confirming payment'
    }, { status: 500 })
  }
}
