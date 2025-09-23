
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'
import { validateStripeEnvironment } from './env-validation'

// Validate environment variables
const stripeEnv = validateStripeEnvironment()

// Cliente de Stripe para el frontend
let stripePromise: Promise<any>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripeEnv.publishableKey)
  }
  return stripePromise
}

// Cliente de Stripe para el backend
export const stripe = new Stripe(stripeEnv.secretKey, {
  apiVersion: '2025-08-27.basil',
})

export default stripe
