
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '@/lib/types'

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    
    // Read products from JSON file
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    let products: Product[] = JSON.parse(fileContents) || []

    // Filter by category if specified
    if (category && category !== 'all') {
      products = products.filter(product => product?.category === category)
    }

    // Filter by featured if specified
    if (featured === 'true') {
      products = products.filter(product => product?.featured === true)
    }

    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        products = products.slice(0, limitNum)
      }
    }

    return NextResponse.json({
      success: true,
      products: products || [],
      total: products?.length || 0
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
