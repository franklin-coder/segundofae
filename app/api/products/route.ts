// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
// import { Prisma } from '@prisma/client' // Commented out due to build issues

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    console.log(`[API] Fetching products - category: ${category}, featured: ${featured}, limit: ${limit}`)

    // ✅ Construir el filtro dinámico para Prisma
    const where: any = {}

    if (category && category !== 'all') {
      // Handle category mapping for URL-friendly names
      const categoryMap: { [key: string]: string } = {
        'and-more': 'anklets', // Map URL-friendly name to database value
        'necklaces': 'necklaces',
        'earrings': 'earrings',
        'bracelets': 'bracelets'
      }
      
      const mappedCategory = categoryMap[category] || category
      where.category = mappedCategory
      console.log(`[API] Mapped category '${category}' to '${mappedCategory}'`)
    }

    if (featured === 'true') {
      where.featured = true
    }

    // ✅ Construir opciones de consulta
    const take = limit ? parseInt(limit, 10) : undefined

    console.log(`[API] Prisma query where:`, JSON.stringify(where, null, 2))

    // ✅ Usar Prisma para obtener productos
    const products = await prisma.product.findMany({
      where,
      take,
      orderBy: {
        created_at: 'desc'
      }
    })

    console.log(`[API] Found ${products.length} products`)

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      query: { category, featured, limit, mappedCategory: where.category }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      products: [],
      total: 0,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}