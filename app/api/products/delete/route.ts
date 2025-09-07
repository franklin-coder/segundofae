// app/api/products/delete/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 })
    }

    // ✅ Usar Prisma para eliminar el producto
    const deletedProduct = await prisma.product.delete({
      where: { id: productId }
    })

    console.log('Product deleted:', deletedProduct.name, '(ID:', deletedProduct.id, ')')

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        id: deletedProduct.id,
        name: deletedProduct.name
      }
    })
  } catch (error: any) {
    console.error('Error deleting product:', error)

    // ✅ Manejo de errores específicos de Prisma
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete product. Please try again.'
    }, { status: 500 })
  }
}