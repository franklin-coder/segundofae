
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Cliente de Stripe para el frontend
let stripePromise: Promise<any>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Cliente de Stripe para el backend
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
})

export default stripe
