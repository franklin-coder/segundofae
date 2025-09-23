
/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  output: process.env.NEXT_OUTPUT_MODE,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { 
    unoptimized: true,
    domains: ['images.stripe.com', 'q.stripe.com']
  },
  // Configuración adicional para Stripe
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Configuración para variables de entorno
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Configuración experimental para mejorar el rendimiento
  experimental: {
    optimizePackageImports: ['@stripe/stripe-js'],
  },
};

module.exports = nextConfig;
