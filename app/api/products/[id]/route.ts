
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

interface RouteParams {
  params: {
    id: string
  }
}

// Función auxiliar para búsqueda flexible de productos
async function findProductFlexibly(id: string) {
  try {
    // Estrategia 1: Búsqueda directa por ID
    let product = await prisma.product.findUnique({
      where: { id }
    })

    if (product) {
      return { product, searchStrategy: 'direct' }
    }

    // Estrategia 2: Búsqueda por ID con diferentes formatos
    const productsWithSimilarId = await prisma.product.findMany({
      where: {
        OR: [
          { id: { contains: id } },
          { id: { startsWith: id } },
          { id: { endsWith: id } }
        ]
      },
      take: 5
    })

    if (productsWithSimilarId.length > 0) {
      return { 
        product: productsWithSimilarId[0], 
        searchStrategy: 'similar_id',
        alternatives: productsWithSimilarId.slice(1)
      }
    }

    // Estrategia 3: Búsqueda por nombre similar
    const decodedId = decodeURIComponent(id)
    const searchTerms = decodedId.split(/[-_\s]+/).filter(term => term.length > 2)
    
    if (searchTerms.length > 0) {
      const nameSearchProducts = await prisma.product.findMany({
        where: {
          OR: searchTerms.map(term => ({
            name: { contains: term, mode: 'insensitive' as const }
          }))
        },
        take: 5
      })

      if (nameSearchProducts.length > 0) {
        return { 
          product: nameSearchProducts[0], 
          searchStrategy: 'name_search',
          alternatives: nameSearchProducts.slice(1)
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error in flexible product search:', error)
    return null
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    // Validación de entrada
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required and must be a valid string'
      }, { status: 400 })
    }

    const trimmedId = id.trim()

    // Buscar producto usando estrategia flexible
    const searchResult = await findProductFlexibly(trimmedId)

    if (!searchResult?.product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found',
        searchedId: trimmedId
      }, { status: 404 })
    }

    const { product, searchStrategy, alternatives } = searchResult

    // Obtener productos relacionados (misma categoría, excluyendo el actual)
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id }
      },
      take: 4,
      orderBy: {
        created_at: 'desc'
      }
    })

    // Log para debugging en desarrollo
    if (process.env.NODE_ENV === 'development' && searchStrategy !== 'direct') {
      console.log(`Product API: Used ${searchStrategy} strategy for ID: ${trimmedId}, found: ${product.id}`)
    }

    return NextResponse.json({
      success: true,
      product,
      relatedProducts,
      meta: {
        searchStrategy,
        originalId: trimmedId,
        foundId: product.id,
        alternatives: alternatives?.map(p => ({ id: p.id, name: p.name })) || []
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error fetching product:', error)

    // Manejo específico de errores de Prisma
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // Error de conexión a la base de datos
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json({
        success: false,
        error: 'Database connection error. Please try again later.'
      }, { status: 503 })
    }

    // Error genérico
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product. Please try again.',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    }, { status: 500 })
  }
}

// Endpoint para actualizar producto (PUT)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const updateData = await request.json()

    // Validación de entrada
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required and must be a valid string'
      }, { status: 400 })
    }

    const trimmedId = id.trim()

    // Validaciones básicas de los datos de actualización
    if (updateData.price !== undefined && (typeof updateData.price !== 'number' || updateData.price <= 0)) {
      return NextResponse.json({
        success: false,
        error: 'Price must be a positive number'
      }, { status: 400 })
    }

    if (updateData.name !== undefined && (typeof updateData.name !== 'string' || updateData.name.trim().length < 2)) {
      return NextResponse.json({
        success: false,
        error: 'Name must be at least 2 characters long'
      }, { status: 400 })
    }

    // Usar transacción para operación atómica
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Verificar que el producto existe
      const existingProduct = await tx.product.findUnique({
        where: { id: trimmedId }
      })

      if (!existingProduct) {
        throw new Error('PRODUCT_NOT_FOUND')
      }

      // Actualizar el producto
      return await tx.product.update({
        where: { id: trimmedId },
        data: {
          ...updateData,
          updated_at: new Date()
        }
      })
    })

    console.log('Product updated successfully:', {
      id: updatedProduct.id,
      name: updatedProduct.name
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error updating product:', error)

    // Manejo específico de errores personalizados
    if (error.message === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // Manejo específico de errores de Prisma
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'A product with this information already exists'
      }, { status: 409 })
    }

    // Error genérico
    return NextResponse.json({
      success: false,
      error: 'Failed to update product. Please try again.',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    }, { status: 500 })
  }
}
