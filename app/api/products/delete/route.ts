
// app/api/products/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    // Validación de entrada
    if (!productId || typeof productId !== 'string' || productId.trim() === '') {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required and must be a valid string'
      }, { status: 400 })
    }

    const trimmedProductId = productId.trim()

    // Usar transacción para operación atómica
    const result = await prisma.$transaction(async (tx: any) => {
      // Primero verificar que el producto existe
      const existingProduct = await tx.product.findUnique({
        where: { id: trimmedProductId },
        select: { id: true, name: true, category: true }
      })

      if (!existingProduct) {
        throw new Error('PRODUCT_NOT_FOUND')
      }

      // Eliminar el producto
      const deletedProduct = await tx.product.delete({
        where: { id: trimmedProductId }
      })

      return {
        deletedProduct,
        existingProduct
      }
    })

    console.log('Product deleted successfully:', {
      id: result.deletedProduct.id,
      name: result.deletedProduct.name,
      category: result.deletedProduct.category
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        id: result.deletedProduct.id,
        name: result.deletedProduct.name,
        category: result.deletedProduct.category
      }
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error deleting product:', error)

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

    if (error.code === 'P2003') {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete product: it is referenced by other records'
      }, { status: 409 })
    }

    if (error.code === 'P2014') {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete product: constraint violation'
      }, { status: 409 })
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
      error: 'Failed to delete product. Please try again.',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    }, { status: 500 })
  }
}
