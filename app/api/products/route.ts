// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { executeWithCleanup, getPrismaClient } from '@/lib/prisma-safe'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let requestId = Math.random().toString(36).substring(7)
  
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    console.log(`[API:${requestId}] 🚀 Starting request - category: ${category}, featured: ${featured}, limit: ${limit}`)

    // ✅ Validate database connection first with safe client
    try {
      const safeClient = await getPrismaClient()
      await safeClient.$connect()
      console.log(`[API:${requestId}] ✅ Database connection successful with safe client`)
    } catch (dbError) {
      console.error(`[API:${requestId}] ❌ Database connection failed:`, dbError)
      throw new Error(`Database connection failed: ${dbError instanceof Error ? dbError.message : 'Unknown DB error'}`)
    }

    // ✅ Construir el filtro dinámico para Prisma
    const where: any = {}

    if (category && category !== 'all') {
      // Handle category mapping for URL-friendly names
      const categoryMap: { [key: string]: string } = {
        'and-more': 'anklets', // Map URL-friendly name to database value
        'necklaces': 'necklaces',
        'earrings': 'earrings',
        'bracelets': 'bracelets',
        'anklets': 'anklets' // Direct mapping for anklets
      }
      
      const mappedCategory = categoryMap[category] || category
      where.category = mappedCategory
      console.log(`[API:${requestId}] 🔄 Mapped category '${category}' to '${mappedCategory}'`)
      
      // Validate that the mapped category is valid
      const validCategories = ['necklaces', 'earrings', 'bracelets', 'anklets']
      if (!validCategories.includes(mappedCategory)) {
        console.warn(`[API:${requestId}] ⚠️ Invalid category '${mappedCategory}', proceeding anyway`)
      }
    }

    if (featured === 'true') {
      where.featured = true
      console.log(`[API:${requestId}] ⭐ Filtering for featured products`)
    }

    // ✅ Construir opciones de consulta
    const take = limit ? parseInt(limit, 10) : undefined
    if (take && (take < 1 || take > 100)) {
      console.warn(`[API:${requestId}] ⚠️ Invalid limit ${take}, using default`)
    }

    console.log(`[API:${requestId}] 🔍 Prisma query where:`, JSON.stringify(where, null, 2))

    // ✅ Usar Prisma seguro para obtener productos con timeout y limpieza automática
    const queryStartTime = Date.now()
    const products = await Promise.race([
      executeWithCleanup(async (client) => {
        return await client.product.findMany({
          where,
          take: take && take > 0 && take <= 100 ? take : undefined,
          orderBy: {
            created_at: 'desc'
          }
        })
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout after 10 seconds')), 10000)
      )
    ]) as any[]

    const queryTime = Date.now() - queryStartTime
    console.log(`[API:${requestId}] ✅ Query completed in ${queryTime}ms - Found ${products.length} products`)

    // ✅ Validate products data
    if (!Array.isArray(products)) {
      throw new Error('Invalid products data returned from database')
    }

    // ✅ Log product details for debugging
    if (products.length > 0) {
      console.log(`[API:${requestId}] 📦 Products found:`)
      products.forEach((product, index) => {
        console.log(`[API:${requestId}]   ${index + 1}. ${product.name} (${product.category})`)
      })
    } else {
      console.log(`[API:${requestId}] 📭 No products found for query`)
    }

    const totalTime = Date.now() - startTime
    console.log(`[API:${requestId}] 🏁 Request completed in ${totalTime}ms`)

    return NextResponse.json({
      success: true,
      products,
      total: products.length,
      query: { 
        category, 
        featured, 
        limit, 
        mappedCategory: where.category,
        requestId,
        queryTime: `${queryTime}ms`,
        totalTime: `${totalTime}ms`
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const totalTime = Date.now() - startTime
    console.error(`[API:${requestId}] ❌ Error after ${totalTime}ms:`, error)
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error(`[API:${requestId}] Error name:`, error.name)
      console.error(`[API:${requestId}] Error message:`, error.message)
      console.error(`[API:${requestId}] Error stack:`, error.stack)
    }

    // Check if it's a Prisma error
    if (error && typeof error === 'object' && 'code' in error) {
      console.error(`[API:${requestId}] Prisma error code:`, (error as any).code)
      console.error(`[API:${requestId}] Prisma error meta:`, (error as any).meta)
      
      // Detectar específicamente el error de prepared statements
      if ((error as any).code === '42P05') {
        console.error(`[API:${requestId}] 🚨 DETECTED: Prepared statement already exists error`)
        console.error(`[API:${requestId}] 🔧 This should have been handled by executeWithCleanup`)
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      products: [],
      total: 0,
      details: error instanceof Error ? error.message : 'Unknown error',
      requestId,
      timestamp: new Date().toISOString(),
      totalTime: `${totalTime}ms`
    }, { status: 500 })
  }
}