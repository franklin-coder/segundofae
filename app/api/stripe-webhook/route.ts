
import { NextRequest, NextResponse } from 'next/server'
import { getStripeServer } from '@/lib/stripe'
import { headers } from 'next/headers'

export const dynamic = "force-dynamic"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Obtener la instancia de Stripe de forma segura
    const stripe = getStripeServer()
    
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json({
        error: 'Webhook secret not configured'
      }, { status: 500 })
    }

    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({
        error: 'Missing stripe-signature header'
      }, { status: 400 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({
        error: 'Invalid signature'
      }, { status: 400 })
    }

    // Manejar diferentes tipos de eventos
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        // Aquí puedes agregar lógica para manejar pagos exitosos
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)
        // Aquí puedes agregar lógica para manejar pagos fallidos
        break

      case 'charge.dispute.created':
        const dispute = event.data.object
        console.log('Dispute created:', dispute.id)
        // Aquí puedes agregar lógica para manejar disputas
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook error:', error)
    
    // Error específico de configuración
    if (error.message?.includes('apiKey') || error.message?.includes('authenticator')) {
      return NextResponse.json({
        error: 'Payment service configuration error'
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'Webhook processing failed'
    }, { status: 500 })
  }
}
