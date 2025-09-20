// app/api/health/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createHealthCheckData } from '@/lib/debug-utils'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const healthData = createHealthCheckData()
    
    // Test database connection
    let databaseStatus = 'unknown'
    let productCount = 0
    
    try {
      const count = await prisma.product.count()
      productCount = count
      databaseStatus = 'connected'
    } catch (dbError: any) {
      console.error('[HEALTH_CHECK] Database connection failed:', dbError)
      databaseStatus = 'failed'
    }

    // Get sample products for debugging
    let sampleProducts: any[] = []
    try {
      sampleProducts = await prisma.product.findMany({
        select: { id: true, name: true, category: true },
        take: 5
      })
    } catch (error) {
      console.error('[HEALTH_CHECK] Failed to fetch sample products:', error)
    }

    const response = {
      ...healthData,
      database: {
        ...healthData.database,
        status: databaseStatus,
        productCount,
        sampleProducts
      },
      request: {
        url: request.url,
        method: request.method,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString()
      }
    }

    console.log('[HEALTH_CHECK] Health check completed:', {
      databaseStatus,
      productCount,
      sampleProductsCount: sampleProducts.length
    })

    return NextResponse.json(response, { 
      status: databaseStatus === 'connected' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error: any) {
    console.error('[HEALTH_CHECK] Health check failed:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        code: error.code
      },
      environment: process.env.NODE_ENV
    }, { status: 500 })
  }
}
