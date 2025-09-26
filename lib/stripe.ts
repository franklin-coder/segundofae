import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'
import { validateStripeEnvironment } from './env-validation'

// Validación solo para el cliente (publishable key)
const validateClientStripeEnvironment = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  }
  
  if (!publishableKey.startsWith('pk_')) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY does not appear to be valid')
  }
  
  return publishableKey
}

// Lazy validation para el servidor - solo valida cuando se necesita
let stripeEnv: ReturnType<typeof validateStripeEnvironment> | null = null

const getStripeEnv = () => {
  if (!stripeEnv) {
    stripeEnv = validateStripeEnvironment()
  }
  return stripeEnv
}

// Cliente de Stripe para el frontend - SOLO valida publishable key
let stripePromise: Promise<any>
export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = validateClientStripeEnvironment() // ← CAMBIO AQUÍ
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

// Cliente de Stripe para el backend - lazy initialization
let stripeInstance: Stripe | null = null
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      const env = getStripeEnv()
      stripeInstance = new Stripe(env.secretKey, {
        apiVersion: '2025-08-27.basil', // ✅ Tu versión original
      })
    }
    return (stripeInstance as any)[prop]
  }
})

export default stripe