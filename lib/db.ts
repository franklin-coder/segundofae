// lib/db.ts
// Configuración de base de datos optimizada para Vercel/serverless
import { PrismaClient } from '@prisma/client'
import { executeQuery } from './prisma'

// Re-exportar el cliente principal y la función de ejecución
export { prisma, executeQuery, forceCleanupPrisma } from './prisma'

// Funciones helper específicas para operaciones comunes
export const withPrisma = async <T>(
  operation: (client: PrismaClient) => Promise<T>
): Promise<T> => {
  return executeQuery(operation)
}

// Función para verificar la conexión de la base de datos
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await executeQuery(async (client) => {
      await client.$queryRaw`SELECT 1`
    })
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

// Función para obtener estadísticas de la base de datos
export const getDatabaseStats = async () => {
  return executeQuery(async (client) => {
    const [productCount] = await Promise.all([
      client.product.count(),
    ])
    
    return {
      products: productCount,
      timestamp: new Date().toISOString(),
    }
  })
}

// Funciones específicas del dominio con manejo de errores mejorado
export const getProducts = async (options?: {
  featured?: boolean
  category?: string
  limit?: number
  offset?: number
}) => {
  return executeQuery(async (client) => {
    const where: any = {}
    
    if (options?.featured !== undefined) {
      where.featured = options.featured
    }
    
    if (options?.category) {
      where.category = options.category
    }
    
    return client.product.findMany({
      where,
      take: options?.limit,
      skip: options?.offset,
      orderBy: {
        createdAt: 'desc'
      }
    })
  })
}

export const getProductById = async (id: string) => {
  return executeQuery(async (client) => {
    return client.product.findUnique({
      where: { id }
    })
  })
}

export const getProductBySku = async (sku: string) => {
  return executeQuery(async (client) => {
    return client.product.findFirst({
      where: { sku }
    })
  })
}

export const getFeaturedProducts = async (limit = 8) => {
  return executeQuery(async (client) => {
    return client.product.findMany({
      where: { featured: true },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
  })
}

export const getProductsByCategory = async (category: string, limit?: number) => {
  return executeQuery(async (client) => {
    return client.product.findMany({
      where: { category },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
  })
}

export const searchProducts = async (query: string, limit = 20) => {
  return executeQuery(async (client) => {
    return client.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ]
      },
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
  })
}

// Función para crear productos (con validación)
export const createProduct = async (productData: {
  sku?: string
  name: string
  description: string
  longDescription?: string
  category: string
  price: number
  images: string[]
  featured?: boolean
}) => {
  return executeQuery(async (client) => {
    return client.product.create({
      data: {
        ...productData,
        featured: productData.featured || false
      }
    })
  })
}

// Función para actualizar productos
export const updateProduct = async (id: string, productData: Partial<{
  sku: string
  name: string
  description: string
  longDescription: string
  category: string
  price: number
  images: string[]
  featured: boolean
}>) => {
  return executeQuery(async (client) => {
    return client.product.update({
      where: { id },
      data: productData
    })
  })
}

// Función para eliminar productos
export const deleteProduct = async (id: string) => {
  return executeQuery(async (client) => {
    return client.product.delete({
      where: { id }
    })
  })
}
