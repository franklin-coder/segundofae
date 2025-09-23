
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json({
        error: 'Missing stripe-signature header'
      }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({
        error: 'Webhook secret not configured'
      }, { status: 500 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({
        error: 'Webhook signature verification failed'
      }, { status: 400 })
    }

    console.log(`Received webhook event: ${event.type} - ${event.id}`)

    // Manejar el evento
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          customer_email: paymentIntent.receipt_email,
          metadata: paymentIntent.metadata
        })
        
        // TODO: Actualizar estado de la orden en la base de datos
        // try {
        //   await updateOrderStatus(paymentIntent.id, 'paid')
        //   await sendConfirmationEmail(paymentIntent)
        //   await notifyAdmin('payment_succeeded', paymentIntent)
        // } catch (error) {
        //   console.error('Error processing successful payment:', error)
        // }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', {
          id: failedPayment.id,
          amount: failedPayment.amount / 100,
          currency: failedPayment.currency,
          last_payment_error: failedPayment.last_payment_error,
          metadata: failedPayment.metadata
        })
        
        // TODO: Manejar pago fallido
        // try {
        //   await updateOrderStatus(failedPayment.id, 'payment_failed')
        //   await notifyCustomerPaymentFailed(failedPayment)
        //   await notifyAdmin('payment_failed', failedPayment)
        // } catch (error) {
        //   console.error('Error processing failed payment:', error)
        // }
        break

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object
        console.log('Payment canceled:', {
          id: canceledPayment.id,
          cancellation_reason: canceledPayment.cancellation_reason,
          metadata: canceledPayment.metadata
        })
        
        // TODO: Manejar pago cancelado
        // try {
        //   await updateOrderStatus(canceledPayment.id, 'canceled')
        //   await restoreInventory(canceledPayment.metadata)
        // } catch (error) {
        //   console.error('Error processing canceled payment:', error)
        // }
        break

      case 'payment_intent.requires_action':
        const actionRequired = event.data.object
        console.log('Payment requires action:', {
          id: actionRequired.id,
          status: actionRequired.status,
          next_action: actionRequired.next_action
        })
        
        // TODO: Notificar al cliente que se requiere acción adicional
        break

      case 'payment_method.attached':
        const paymentMethod = event.data.object
        console.log('Payment method attached:', {
          id: paymentMethod.id,
          type: paymentMethod.type,
          customer: paymentMethod.customer
        })
        break

      case 'charge.succeeded':
        const charge = event.data.object
        console.log('Charge succeeded:', {
          id: charge.id,
          amount: charge.amount / 100,
          currency: charge.currency,
          payment_intent: charge.payment_intent,
          receipt_url: charge.receipt_url
        })
        break

      case 'charge.failed':
        const failedCharge = event.data.object
        console.log('Charge failed:', {
          id: failedCharge.id,
          amount: failedCharge.amount / 100,
          currency: failedCharge.currency,
          failure_code: failedCharge.failure_code,
          failure_message: failedCharge.failure_message
        })
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object
        console.log('Invoice payment succeeded:', {
          id: invoice.id,
          amount_paid: invoice.amount_paid / 100,
          currency: invoice.currency,
          customer: invoice.customer
        })
        break

      case 'customer.created':
        const customer = event.data.object
        console.log('Customer created:', {
          id: customer.id,
          email: customer.email,
          name: customer.name
        })
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
        // Log para debugging pero no fallar
        console.log('Event data:', JSON.stringify(event.data.object, null, 2))
    }

    return NextResponse.json({ 
      received: true,
      event_type: event.type,
      event_id: event.id,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Webhook error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    return NextResponse.json({
      error: 'Webhook processing failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
