
import { loadStripe } from '@stripe/stripe-js'
import Stripe from 'stripe'

// Verificar que las variables de entorno estén disponibles
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripePublishableKey) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables')
}

if (!stripeSecretKey && typeof window === 'undefined') {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables')
}

// Cliente de Stripe para el frontend
let stripePromise: Promise<any> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    if (!stripePublishableKey) {
      console.error('Cannot initialize Stripe: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing')
      return Promise.reject(new Error('Stripe publishable key is not configured'))
    }
    
    stripePromise = loadStripe(stripePublishableKey, {
      // Configuraciones adicionales para mejorar la compatibilidad
      apiVersion: '2025-08-27.basil',
      locale: 'en', // o 'es' para español
    })
  }
  return stripePromise
}

// Cliente de Stripe para el backend
let stripeInstance: Stripe | null = null

export const getStripeServer = (): Stripe => {
  if (!stripeInstance) {
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
    }
    
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  }
  return stripeInstance
}

// Exportar la instancia por defecto para compatibilidad
export const stripe = typeof window === 'undefined' ? getStripeServer() : null
export default stripe
