
// app/api/products/add/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Product } from '@/lib/types'

export const dynamic = "force-dynamic"

// Función de validación mejorada
function validateProductData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validaciones requeridas
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Product name is required and must be at least 2 characters')
  }

  if (!data.price || typeof data.price !== 'number' || data.price <= 0 || data.price > 10000) {
    errors.push('Price must be a valid positive number not exceeding $10,000')
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters')
  }

  if (!data.category || typeof data.category !== 'string') {
    errors.push('Category is required')
  }

  // Validar categorías permitidas
  const allowedCategories = ['necklaces', 'earrings', 'bracelets', 'and-more']
  if (data.category && !allowedCategories.includes(data.category)) {
    errors.push('Invalid category. Must be one of: ' + allowedCategories.join(', '))
  }

  // Validar imágenes
  if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
    errors.push('At least one product image is required')
  } else {
    // Validar URLs de imágenes
    const invalidUrls = data.images.filter((url: any) => {
      if (typeof url !== 'string' || !url.trim()) return true
      try {
        new URL(url)
        return false
      } catch {
        return true
      }
    })
    if (invalidUrls.length > 0) {
      errors.push('All image URLs must be valid')
    }
  }

  // Validar tipos de datos opcionales
  if (data.featured !== undefined && typeof data.featured !== 'boolean') {
    errors.push('Featured must be a boolean value')
  }

  if (data.inStock !== undefined && typeof data.inStock !== 'boolean') {
    errors.push('InStock must be a boolean value')
  }

  if (data.materials && !Array.isArray(data.materials)) {
    errors.push('Materials must be an array')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validar datos de entrada
    const validation = validateProductData(productData)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 })
    }

    // Preparar datos para Prisma (sin ID manual - Prisma lo generará automáticamente)
    const prismaData = {
      name: productData.name.trim(),
      price: productData.price,
      description: productData.description.trim(),
      longDescription: productData.longDescription?.trim() || productData.description.trim(),
      category: productData.category,
      images: productData.images.filter((img: string) => img.trim() !== ''),
      featured: productData.featured || false,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      materials: productData.materials || [],
      dimensions: productData.dimensions?.trim() || null,
      care_instructions: productData.care_instructions?.trim() || null,
      // created_at y updated_at se manejan automáticamente por Prisma
    }

    // Usar transacción para operación atómica
    const product = await prisma.$transaction(async (tx) => {
      // Verificar si ya existe un producto con el mismo nombre (opcional)
      const existingProduct = await tx.product.findFirst({
        where: {
          name: prismaData.name,
          category: prismaData.category
        }
      })

      if (existingProduct) {
        throw new Error(`A product with the name "${prismaData.name}" already exists in the ${prismaData.category} category`)
      }

      // Crear el producto
      return await tx.product.create({
        data: prismaData
      })
    })

    console.log('New product added successfully:', {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price
    })

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        featured: product.featured,
        inStock: product.inStock
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error adding product:', error)

    // Manejo específico de errores de Prisma
    if (error.code === 'P2002') {
      return NextResponse.json({
        success: false,
        error: 'A product with this information already exists'
      }, { status: 409 })
    }

    // Manejo de errores de validación personalizada
    if (error.message.includes('already exists')) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 409 })
    }

    // Error genérico
    return NextResponse.json({
      success: false,
      error: 'Failed to add product. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
