// lib/debug-utils.ts
// Utilidades para debugging en producción

export interface DebugInfo {
  timestamp: string
  environment: string
  databaseConnected: boolean
  requestInfo?: {
    url: string
    method: string
    userAgent?: string
  }
}

export function getDebugInfo(request?: Request): DebugInfo {
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    databaseConnected: !!process.env.DATABASE_URL,
    requestInfo: request ? {
      url: request.url,
      method: request.method,
      userAgent: request.headers.get('user-agent') || undefined
    } : undefined
  }
}

export function logProductSearchAttempt(
  searchId: string, 
  category?: string, 
  result?: { found: boolean; actualId?: string; strategy?: string }
) {
  const logData = {
    type: 'PRODUCT_SEARCH',
    searchId,
    category,
    result,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  }
  
  console.log(`[DEBUG_PRODUCT_SEARCH]`, JSON.stringify(logData, null, 2))
}

export function logProductCreationAttempt(
  productData: { name: string; category: string; price: number },
  result?: { success: boolean; productId?: string; error?: string }
) {
  const logData = {
    type: 'PRODUCT_CREATION',
    productData,
    result,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseConnected: !!process.env.DATABASE_URL
  }
  
  console.log(`[DEBUG_PRODUCT_CREATION]`, JSON.stringify(logData, null, 2))
}

export function logDatabaseConnection() {
  const logData = {
    type: 'DATABASE_CONNECTION',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    databaseUrlLength: process.env.DATABASE_URL?.length || 0
  }
  
  console.log(`[DEBUG_DATABASE]`, JSON.stringify(logData, null, 2))
}

// Función para crear un endpoint de health check
export function createHealthCheckData() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      configured: !!process.env.DATABASE_URL,
      urlLength: process.env.DATABASE_URL?.length || 0
    },
    version: process.env.npm_package_version || 'unknown'
  }
}
