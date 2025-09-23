
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { payment_intent_id, order_details } = body

    // Validar el payment intent
    if (!payment_intent_id || typeof payment_intent_id !== 'string') {
      return NextResponse.json({
        error: 'Valid payment intent ID is required'
      }, { status: 400 })
    }

    // Validar order_details
    if (!order_details || typeof order_details !== 'object') {
      return NextResponse.json({
        error: 'Order details are required'
      }, { status: 400 })
    }

    // Obtener el payment intent de Stripe
    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)
    } catch (stripeError: any) {
      console.error('Error retrieving payment intent:', stripeError)
      return NextResponse.json({
        error: 'Invalid payment intent ID'
      }, { status: 400 })
    }

    // Verificar que el pago fue exitoso
    if (paymentIntent.status === 'succeeded') {
      
      // Preparar datos de la orden
      const orderData = {
        payment_intent_id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency.toUpperCase(),
        customer_email: order_details?.email || paymentIntent.receipt_email,
        customer_name: `${order_details?.firstName || ''} ${order_details?.lastName || ''}`.trim(),
        shipping_address: {
          address: order_details?.address,
          apartment: order_details?.apartment,
          city: order_details?.city,
          province: order_details?.province,
          postal_code: order_details?.postalCode,
          country: order_details?.country || 'Canada'
        },
        items: order_details?.items || [],
        subtotal: order_details?.subtotal || 0,
        shipping: order_details?.shipping || 0,
        tax: order_details?.tax || 0,
        total: order_details?.total || paymentIntent.amount / 100,
        order_number: `FC${Date.now().toString().slice(-6)}`,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        stripe_payment_intent: paymentIntent.id,
        payment_method: paymentIntent.payment_method,
        metadata: paymentIntent.metadata
      }

      console.log('Order confirmed:', orderData)

      // TODO: Implementar guardado en base de datos
      // try {
      //   await saveOrderToDatabase(orderData)
      // } catch (dbError) {
      //   console.error('Error saving order to database:', dbError)
      //   // No fallar el proceso si la DB falla, pero loggear
      // }

      // TODO: Enviar email de confirmación al cliente
      // try {
      //   await sendConfirmationEmail(orderData)
      // } catch (emailError) {
      //   console.error('Error sending confirmation email:', emailError)
      //   // No fallar el proceso si el email falla
      // }

      // TODO: Reducir inventario si es necesario
      // try {
      //   await updateInventory(orderData.items)
      // } catch (inventoryError) {
      //   console.error('Error updating inventory:', inventoryError)
      // }

      // TODO: Enviar notificación al admin
      // try {
      //   await notifyAdmin(orderData)
      // } catch (notificationError) {
      //   console.error('Error sending admin notification:', notificationError)
      // }

      return NextResponse.json({
        success: true,
        order: {
          order_number: orderData.order_number,
          payment_intent_id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          customer_email: orderData.customer_email,
          created_at: orderData.created_at
        },
        message: 'Payment confirmed and order processed successfully'
      })
    } else if (paymentIntent.status === 'processing') {
      return NextResponse.json({
        success: false,
        error: 'Payment is still processing. Please wait a moment and try again.',
        status: paymentIntent.status
      }, { status: 202 })
    } else if (paymentIntent.status === 'requires_payment_method') {
      return NextResponse.json({
        success: false,
        error: 'Payment requires a valid payment method. Please try again.',
        status: paymentIntent.status
      }, { status: 400 })
    } else if (paymentIntent.status === 'requires_confirmation') {
      return NextResponse.json({
        success: false,
        error: 'Payment requires confirmation. Please complete the payment process.',
        status: paymentIntent.status
      }, { status: 400 })
    } else if (paymentIntent.status === 'canceled') {
      return NextResponse.json({
        success: false,
        error: 'Payment was canceled. Please try again.',
        status: paymentIntent.status
      }, { status: 400 })
    } else {
      return NextResponse.json({
        success: false,
        error: `Payment not completed. Status: ${paymentIntent.status}`,
        status: paymentIntent.status
      }, { status: 400 })
    }

  } catch (error: any) {
    console.error('Error confirming payment:', error)
    
    // Manejo específico de errores de Stripe
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({
        error: 'Invalid payment request. Please try again.'
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

    return NextResponse.json({
      error: 'An unexpected error occurred while confirming your payment. Please contact support.'
    }, { status: 500 })
  }
}
