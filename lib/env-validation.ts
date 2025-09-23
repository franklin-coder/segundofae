// Environment variable validation for Stripe integration
export const validateStripeEnvironment = () => {
  const requiredEnvVars = {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }

  const missingVars: string[] = []
  const invalidVars: string[] = []

  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missingVars.push(key)
    } else if (key === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' && value.includes('pk_test_temp')) {
      invalidVars.push(`${key} is using a temporary/placeholder value`)
    } else if (key === 'STRIPE_SECRET_KEY' && !value.startsWith('sk_')) {
      invalidVars.push(`${key} does not appear to be a valid Stripe secret key`)
    } else if (key === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' && !value.startsWith('pk_')) {
      invalidVars.push(`${key} does not appear to be a valid Stripe publishable key`)
    }
  })

  if (missingVars.length > 0) {
    throw new Error(`Missing required Stripe environment variables: ${missingVars.join(', ')}`)
  }

  if (invalidVars.length > 0) {
    throw new Error(`Invalid Stripe environment variables: ${invalidVars.join(', ')}`)
  }

  return {
    publishableKey: requiredEnvVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: requiredEnvVars.STRIPE_SECRET_KEY!,
    webhookSecret: requiredEnvVars.STRIPE_WEBHOOK_SECRET!,
  }
}

// Validate on module load in development
if (process.env.NODE_ENV === 'development') {
  try {
    validateStripeEnvironment()
    console.log('✅ Stripe environment variables validated successfully')
  } catch (error) {
    console.error('❌ Stripe environment validation failed:', error)
  }
}
