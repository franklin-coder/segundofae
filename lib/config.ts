
// Configuration constants for the application
export const config = {
  // App Information
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'FaeLight Crafts',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    description: 'Unique handcrafted jewelry and accessories',
    email: process.env.FROM_EMAIL || 'hello@faelightcrafts.com',
    supportEmail: process.env.ADMIN_EMAIL || 'support@faelightcrafts.com'
  },

  // Stripe Configuration
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    currency: 'cad',
    country: 'CA'
  },

  // Business Rules
  business: {
    freeShippingThreshold: 50, // CAD
    taxRate: 0.12, // 12% (GST + PST for most provinces)
    shippingCost: 9.99, // CAD
    minOrderAmount: 0.50, // CAD
    maxOrderAmount: 10000, // CAD
    orderNumberPrefix: 'FC',
    supportedCurrencies: ['CAD', 'USD'],
    supportedCountries: ['CA', 'US']
  },

  // Email Templates
  email: {
    templates: {
      orderConfirmation: 'order-confirmation',
      paymentFailed: 'payment-failed',
      shippingNotification: 'shipping-notification',
      adminNotification: 'admin-notification'
    }
  },

  // Social Media
  social: {
    instagram: process.env.INSTAGRAM_URL,
    facebook: process.env.FACEBOOK_URL,
    twitter: process.env.TWITTER_URL
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
    facebookPixelId: process.env.FACEBOOK_PIXEL_ID
  },

  // Feature Flags
  features: {
    enableNewsletter: true,
    enableReviews: true,
    enableWishlist: true,
    enableGuestCheckout: true,
    enableApplePay: true,
    enableGooglePay: true,
    enableInventoryTracking: false // Set to true when inventory system is implemented
  }
}

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const requiredEnvVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'DATABASE_URL'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

// Helper functions
export const formatCurrency = (amount: number, currency: string = config.stripe.currency) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

export const calculateTax = (subtotal: number) => {
  return subtotal * config.business.taxRate
}

export const calculateShipping = (subtotal: number) => {
  return subtotal >= config.business.freeShippingThreshold ? 0 : config.business.shippingCost
}

export const calculateTotal = (subtotal: number) => {
  const tax = calculateTax(subtotal)
  const shipping = calculateShipping(subtotal)
  return subtotal + tax + shipping
}

export const generateOrderNumber = () => {
  return `${config.business.orderNumberPrefix}${Date.now().toString().slice(-6)}`
}
