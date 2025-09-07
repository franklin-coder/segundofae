// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    // ✅ Construir el filtro dinámico para Prisma
    const where: Prisma.ProductWhereInput = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (featured === 'true') {
      where.featured = true
    }

    // ✅ Construir opciones de consulta
    const take = limit ? parseInt(limit, 10) : undefined

    // ✅ Usar Prisma para obtener productos
    const products = await prisma.product.findMany({
      where,
      take
    })

    return NextResponse.json({
      success: true,
      products,
      total: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      products: [],
      total: 0
    }, { status: 500 })
  }
}