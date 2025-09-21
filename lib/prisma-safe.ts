// lib/prisma-safe.ts
// Solución específica para el error "prepared statement already exists"
import { PrismaClient } from '@prisma/client'

// Configuración específica para evitar prepared statements duplicados
const createPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // Configuración para logging y debugging
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  })
}

// Patrón singleton mejorado con limpieza automática
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaRequestCount: number
}

// Inicializar contador de requests
if (!globalForPrisma.prismaRequestCount) {
  globalForPrisma.prismaRequestCount = 0
}

// Función para obtener cliente Prisma con limpieza automática
export const getPrismaClient = async (): Promise<PrismaClient> => {
  // Incrementar contador de requests
  globalForPrisma.prismaRequestCount++
  
  // Si no hay cliente global o hemos hecho muchos requests, crear uno nuevo
  if (!globalForPrisma.prisma || globalForPrisma.prismaRequestCount > 50) {
    // Desconectar cliente anterior si existe
    if (globalForPrisma.prisma) {
      try {
        await globalForPrisma.prisma.$disconnect()
        console.log('🔄 Prisma client disconnected and cleaned up')
      } catch (error) {
        console.warn('⚠️ Error disconnecting Prisma client:', error)
      }
    }
    
    // Crear nuevo cliente
    globalForPrisma.prisma = createPrismaClient()
    globalForPrisma.prismaRequestCount = 1
    
    console.log('✨ New Prisma client created')
  }
  
  return globalForPrisma.prisma
}

// Función para limpiar prepared statements explícitamente
export const cleanupPrismaStatements = async (client: PrismaClient): Promise<void> => {
  try {
    // Ejecutar comando SQL para limpiar prepared statements
    await client.$executeRaw`DEALLOCATE ALL;`
    console.log('🧹 Prepared statements cleaned up')
  } catch (error) {
    // Ignorar errores de cleanup - no son críticos
    console.warn('⚠️ Cleanup warning (non-critical):', error)
  }
}

// Función wrapper para ejecutar queries con limpieza automática
export const executeWithCleanup = async <T>(
  queryFn: (client: PrismaClient) => Promise<T>
): Promise<T> => {
  const client = await getPrismaClient()
  
  try {
    // Limpiar prepared statements antes de la query
    await cleanupPrismaStatements(client)
    
    // Ejecutar la query
    const result = await queryFn(client)
    
    return result
  } catch (error) {
    // Si es el error específico de prepared statements, intentar recovery
    if (error && typeof error === 'object' && 'code' in error && (error as any).code === '42P05') {
      console.log('🔧 Detected prepared statement error, attempting recovery...')
      
      try {
        // Forzar limpieza y reconexión
        await client.$disconnect()
        const newClient = await getPrismaClient()
        await cleanupPrismaStatements(newClient)
        
        // Reintentar la query con el nuevo cliente
        const result = await queryFn(newClient)
        console.log('✅ Recovery successful')
        return result
      } catch (recoveryError) {
        console.error('❌ Recovery failed:', recoveryError)
        throw recoveryError
      }
    }
    
    throw error
  }
}

// Cliente por defecto para compatibilidad
export const prisma = globalForPrisma.prisma || createPrismaClient()

// Asegurar que tenemos un cliente en desarrollo
if (process.env.NODE_ENV !== 'production' && !globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}
