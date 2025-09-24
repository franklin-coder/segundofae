// lib/prisma-utils.ts
// Utilidades específicas para manejo de errores de Prisma en serverless
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library'

// Tipos de errores específicos de Prisma
export interface PrismaError {
  code?: string
  message: string
  isRetryable: boolean
  shouldRecreateClient: boolean
}

// Función para analizar errores de Prisma
export const analyzePrismaError = (error: any): PrismaError => {
  const errorMessage = error?.message || String(error)
  
  // Error específico de prepared statements
  if (error?.code === '42P05' || errorMessage.includes('prepared statement') || errorMessage.includes('already exists')) {
    return {
      code: '42P05',
      message: 'Prepared statement conflict detected',
      isRetryable: true,
      shouldRecreateClient: true
    }
  }
  
  // Error de conexión
  if (errorMessage.includes('connection') || errorMessage.includes('timeout') || error?.code === 'P1001') {
    return {
      code: error?.code || 'CONNECTION_ERROR',
      message: 'Database connection error',
      isRetryable: true,
      shouldRecreateClient: true
    }
  }
  
  // Error de query
  if (error instanceof PrismaClientKnownRequestError) {
    return {
      code: error.code,
      message: error.message,
      isRetryable: ['P2002', 'P2025'].includes(error.code) ? false : true,
      shouldRecreateClient: false
    }
  }
  
  // Error desconocido de Prisma
  if (error instanceof PrismaClientUnknownRequestError) {
    return {
      code: 'UNKNOWN_REQUEST_ERROR',
      message: error.message,
      isRetryable: true,
      shouldRecreateClient: true
    }
  }
  
  // Error genérico
  return {
    code: 'GENERIC_ERROR',
    message: errorMessage,
    isRetryable: false,
    shouldRecreateClient: false
  }
}

// Función para logging estructurado de errores
export const logPrismaError = (error: any, context: string = 'unknown') => {
  const analyzedError = analyzePrismaError(error)
  
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    error: {
      code: analyzedError.code,
      message: analyzedError.message,
      isRetryable: analyzedError.isRetryable,
      shouldRecreateClient: analyzedError.shouldRecreateClient,
    },
    environment: process.env.NODE_ENV,
    vercel: {
      region: process.env.VERCEL_REGION,
      deployment: process.env.VERCEL_DEPLOYMENT_ID,
    }
  }
  
  if (analyzedError.code === '42P05') {
    console.error('🚨 PRISMA PREPARED STATEMENT ERROR:', JSON.stringify(logData, null, 2))
  } else if (analyzedError.isRetryable) {
    console.warn('⚠️ PRISMA RETRYABLE ERROR:', JSON.stringify(logData, null, 2))
  } else {
    console.error('❌ PRISMA ERROR:', JSON.stringify(logData, null, 2))
  }
}

// Función para crear métricas de rendimiento
export const createPrismaMetrics = () => {
  const metrics = {
    queries: 0,
    errors: 0,
    retries: 0,
    clientRecreations: 0,
    startTime: Date.now(),
  }
  
  return {
    incrementQuery: () => metrics.queries++,
    incrementError: () => metrics.errors++,
    incrementRetry: () => metrics.retries++,
    incrementClientRecreation: () => metrics.clientRecreations++,
    getMetrics: () => ({
      ...metrics,
      uptime: Date.now() - metrics.startTime,
      errorRate: metrics.queries > 0 ? (metrics.errors / metrics.queries) * 100 : 0,
    }),
    reset: () => {
      metrics.queries = 0
      metrics.errors = 0
      metrics.retries = 0
      metrics.clientRecreations = 0
      metrics.startTime = Date.now()
    }
  }
}

// Instancia global de métricas
export const prismaMetrics = createPrismaMetrics()

// Función para validar configuración de base de datos
export const validateDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  
  // Verificar que tenga los parámetros necesarios para serverless
  const url = new URL(databaseUrl)
  const params = url.searchParams
  
  const recommendations = []
  
  if (!params.has('statement_cache_size') || params.get('statement_cache_size') !== '0') {
    recommendations.push('Add statement_cache_size=0 to disable prepared statements')
  }
  
  if (!params.has('prepared_statements') || params.get('prepared_statements') !== 'false') {
    recommendations.push('Add prepared_statements=false to disable prepared statements')
  }
  
  if (!params.has('connection_limit') || parseInt(params.get('connection_limit') || '0') > 1) {
    recommendations.push('Add connection_limit=1 for serverless optimization')
  }
  
  if (recommendations.length > 0) {
    console.warn('🔧 DATABASE_URL optimization recommendations:', recommendations)
  }
  
  return {
    isValid: true,
    recommendations,
    currentUrl: databaseUrl.replace(/:[^:@]*@/, ':***@') // Ocultar password en logs
  }
}

// Función para health check de la base de datos
export const performHealthCheck = async (prismaClient: any) => {
  const startTime = Date.now()
  
  try {
    await prismaClient.$queryRaw`SELECT 1 as health_check`
    const duration = Date.now() - startTime
    
    return {
      status: 'healthy',
      duration,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    const duration = Date.now() - startTime
    logPrismaError(error, 'health_check')
    
    return {
      status: 'unhealthy',
      duration,
      error: analyzePrismaError(error),
      timestamp: new Date().toISOString()
    }
  }
}

// Función para cleanup de emergencia
export const emergencyCleanup = async (prismaClient: any) => {
  try {
    console.log('🚨 Performing emergency Prisma cleanup...')
    
    // Intentar limpiar prepared statements
    await prismaClient.$executeRaw`DEALLOCATE ALL`
    
    // Desconectar cliente
    await prismaClient.$disconnect()
    
    console.log('✅ Emergency cleanup completed')
    return true
  } catch (error) {
    console.error('❌ Emergency cleanup failed:', error)
    return false
  }
}
