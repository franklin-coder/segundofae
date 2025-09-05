
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '@/lib/types'

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Read products from JSON file
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const allProducts: Product[] = JSON.parse(fileContents) || []

    // Filter featured products
    const featuredProducts = allProducts.filter(product => product?.featured === true) || []

    return NextResponse.json({
      success: true,
      products: featuredProducts,
      total: featuredProducts?.length || 0
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch featured products',
      products: [],
      total: 0
    }, { status: 500 })
  }
}
