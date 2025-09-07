// app/api/products/add/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/types'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const productData: Product = await request.json()

    // Validar datos requeridos
    if (!productData.name || !productData.price || !productData.description || !productData.category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, price, description, and category are required'
      }, { status: 400 })
    }

    // ✅ Usar Prisma para crear el producto
    const product = await prisma.product.create({
      data: {
        ...productData,
        // Prisma genera automáticamente el ID si no se pasa
        // Si necesitas un ID personalizado, puedes pasarlo aquí
      }
    })

    console.log('New product added:', product.name)

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product
    })
  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add product. Please try again.'
    }, { status: 500 })
  }
}