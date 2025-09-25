// lib/prisma.ts
// Solución definitiva para errores "prepared statement already exists" en Vercel
import { PrismaClient } from '@prisma/client'

// Configuración optimizada para entornos serverless
const createPrismaClient = () => {
  // Configurar DATABASE_URL con parámetros específicos para evitar prepared statements
  let databaseUrl = process.env.DATABASE_URL || ''
  
  // Agregar parámetros para evitar prepared statements y optimizar para serverless
  if (databaseUrl && !databaseUrl.includes('statement_cache_size')) {
    const separator = databaseUrl.includes('?') ? '&' : '?'
    databaseUrl += `${separator}statement_cache_size=0&prepared_statements=false&connection_limit=1&pool_timeout=0`
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Singleton pattern mejorado con cleanup automático
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaInstanceId: string | undefined
  lastCleanup: number
}

// Función para generar ID único de instancia
const generateInstanceId = () => `prisma_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

// Función para limpiar instancia anterior
const cleanupPreviousInstance = async (client: PrismaClient) => {
  try {
    // Intentar limpiar prepared statements antes de desconectar
    await client.$executeRaw`SELECT 1` // Query simple para verificar conexión
    await client.$disconnect()
  } catch (error) {
    // Ignorar errores de cleanup - la instancia puede ya estar desconectada
    console.warn('Prisma cleanup warning (non-critical):', error)
  }
}

// Función principal para obtener cliente Prisma
const getPrismaClient = (): PrismaClient => {
  const now = Date.now()
  const CLEANUP_INTERVAL = 5 * 60 * 1000 // 5 minutos

  // Si no hay cliente o ha pasado tiempo suficiente, crear uno nuevo
  if (!globalForPrisma.prisma || 
      !globalForPrisma.lastCleanup || 
      (now - globalForPrisma.lastCleanup) > CLEANUP_INTERVAL) {
    
    // Limpiar instancia anterior si existe
    if (globalForPrisma.prisma) {
      const oldClient = globalForPrisma.prisma
      // Cleanup asíncrono para no bloquear
      setImmediate(() => cleanupPreviousInstance(oldClient))
    }

    // Crear nueva instancia
    globalForPrisma.prisma = createPrismaClient()
    globalForPrisma.prismaInstanceId = generateInstanceId()
    globalForPrisma.lastCleanup = now

    console.log(`✨ New Prisma client created: ${globalForPrisma.prismaInstanceId}`)
  }

  return globalForPrisma.prisma
}

// Wrapper para queries con manejo de errores específicos
export const executeQuery = async <T>(
  queryFn: (client: PrismaClient) => Promise<T>,
  retries = 2
): Promise<T> => {
  let lastError: any

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const client = getPrismaClient()
      const result = await queryFn(client)
      return result
    } catch (error: any) {
      lastError = error
      
      // Si es el error específico de prepared statements, forzar nueva instancia
      if (error?.code === '42P05' || 
          error?.message?.includes('prepared statement') ||
          error?.message?.includes('already exists')) {
        
        console.log(`🔧 Detected prepared statement error (attempt ${attempt + 1}/${retries + 1}), creating new client...`)
        
        // Forzar creación de nueva instancia
        if (globalForPrisma.prisma) {
          const oldClient = globalForPrisma.prisma
          globalForPrisma.prisma = undefined
          setImmediate(() => cleanupPreviousInstance(oldClient))
        }
        
        // Si no es el último intento, continuar el loop
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 100 * (attempt + 1))) // Backoff
          continue
        }
      }
      
      // Para otros errores, no reintentar
      if (attempt === 0 && error?.code !== '42P05') {
        throw error
      }
    }
  }

  throw lastError
}

// Cliente principal exportado
export const prisma = getPrismaClient()

// Mantener referencia global en desarrollo
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Función de cleanup manual para casos especiales
export const forceCleanupPrisma = async (): Promise<void> => {
  if (globalForPrisma.prisma) {
    const client = globalForPrisma.prisma
    globalForPrisma.prisma = undefined
    globalForPrisma.prismaInstanceId = undefined
    await cleanupPreviousInstance(client)
    console.log('🧹 Prisma client manually cleaned up')
  }
}

// Cleanup automático al cerrar el proceso
if (typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    if (globalForPrisma.prisma) {
      globalForPrisma.prisma.$disconnect().catch(() => {})
    }
  })
}