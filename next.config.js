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
  images: { unoptimized: true },
  
  // Configuraciones específicas para Vercel y Prisma
  experimental: {
    // Optimizaciones para serverless
    serverComponentsExternalPackages: ['@prisma/client', '@prisma/engines'],
    // Reducir el tamaño del bundle
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/@esbuild/linux-x64',
      ],
    },
  },

  // Configuración de webpack para Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Optimizaciones específicas para el servidor
      config.externals.push({
        '@prisma/client': '@prisma/client',
        '@prisma/engines': '@prisma/engines',
      })
    }
    
    // Configuración para manejar archivos binarios de Prisma
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader',
    })

    return config
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://maps.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.stripe.com https://maps.googleapis.com https://checkout.stripe.com",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          },
          // Headers específicos para optimizar Prisma en Vercel
          {
            key: 'X-Prisma-Serverless',
            value: 'true'
          }
        ]
      }
    ]
  },

  // Configuración de redirects para manejar errores de base de datos
  async redirects() {
    return []
  },

  // Configuración de rewrites para API routes
  async rewrites() {
    return []
  },

  // Variables de entorno públicas
  env: {
    PRISMA_SERVERLESS: 'true',
  },
}

module.exports = nextConfig
