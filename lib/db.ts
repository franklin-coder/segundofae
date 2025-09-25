import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error']
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Función optimizada para serverless con timeout personalizado
export const executeQuery = async <T>(
  operation: (client: PrismaClient) => Promise<T>,
  timeoutMs: number = 15000
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
  })

  try {
    const result = await Promise.race([
      operation(prisma),
      timeoutPromise
    ])
    return result
  } catch (error) {
    console.error('Database operation failed:', error)
    throw error
  }
}

// Función para limpiar conexiones si es necesario
export const forceCleanupPrisma = async () => {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error disconnecting Prisma:', error)
  }
}

export default prisma