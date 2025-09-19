
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
  const startTime = Date.now()
  
  try {
    console.log(`[API_PRODUCT_CREATE] Starting product creation request`)
    
    const productData = await request.json()
    console.log(`[API_PRODUCT_CREATE] Received data:`, {
      name: productData.name,
      category: productData.category,
      price: productData.price,
      imagesCount: productData.images?.length || 0
    })

    // Validar datos de entrada
    const validation = validateProductData(productData)
    if (!validation.isValid) {
      console.log(`[API_PRODUCT_CREATE] Validation failed:`, validation.errors)
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 })
    }

    console.log(`[API_PRODUCT_CREATE] Validation passed, preparing data for database`)

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

    console.log(`[API_PRODUCT_CREATE] Prisma data prepared:`, {
      name: prismaData.name,
      category: prismaData.category,
      price: prismaData.price,
      imagesCount: prismaData.images.length,
      materialsCount: prismaData.materials.length
    })

    // Verificar conexión a la base de datos
    console.log(`[API_PRODUCT_CREATE] Database URL configured:`, !!process.env.DATABASE_URL)

    // Usar transacción para operación atómica
    const product = await prisma.$transaction(async (tx: any) => {
      console.log(`[API_PRODUCT_CREATE] Starting database transaction`)
      
      // Verificar si ya existe un producto con el mismo nombre (opcional)
      const existingProduct = await tx.product.findFirst({
        where: {
          name: prismaData.name,
          category: prismaData.category
        }
      })

      if (existingProduct) {
        console.log(`[API_PRODUCT_CREATE] Duplicate product found:`, existingProduct.id)
        throw new Error(`A product with the name "${prismaData.name}" already exists in the ${prismaData.category} category`)
      }

      console.log(`[API_PRODUCT_CREATE] No duplicates found, creating product`)

      // Crear el producto
      const newProduct = await tx.product.create({
        data: prismaData
      })

      console.log(`[API_PRODUCT_CREATE] Product created successfully:`, {
        id: newProduct.id,
        name: newProduct.name,
        category: newProduct.category
      })

      return newProduct
    })

    console.log(`[API_PRODUCT_CREATE] Transaction completed successfully (${Date.now() - startTime}ms)`)

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
    console.error(`[API_PRODUCT_CREATE] Error adding product (${Date.now() - startTime}ms):`, error)
    console.error(`[API_PRODUCT_CREATE] Error details:`, {
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : 'Hidden in production'
    })

    // Manejo específico de errores de Prisma
    if (error.code === 'P2002') {
      console.log(`[API_PRODUCT_CREATE] Prisma unique constraint violation`)
      return NextResponse.json({
        success: false,
        error: 'A product with this information already exists'
      }, { status: 409 })
    }

    // Error de conexión a la base de datos
    if (error.code === 'P1001' || error.code === 'P1002') {
      console.log(`[API_PRODUCT_CREATE] Database connection error`)
      return NextResponse.json({
        success: false,
        error: 'Database connection error. Please check your database configuration.'
      }, { status: 503 })
    }

    // Manejo de errores de validación personalizada
    if (error.message.includes('already exists')) {
      console.log(`[API_PRODUCT_CREATE] Custom validation error`)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 409 })
    }

    // Error genérico
    console.log(`[API_PRODUCT_CREATE] Generic error occurred`)
    return NextResponse.json({
      success: false,
      error: 'Failed to add product. Please try again.',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code
      } : undefined
    }, { status: 500 })
  }
}
