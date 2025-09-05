
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Product } from '@/lib/types'

export const dynamic = "force-dynamic"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 })
    }

    // Read products from JSON file
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const products: Product[] = JSON.parse(fileContents) || []

    // Find product by ID
    const product = products.find(p => p?.id === id)

    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // Get related products (same category, excluding current product)
    const relatedProducts = products
      .filter(p => p?.category === product.category && p?.id !== product.id)
      .slice(0, 4) || []

    return NextResponse.json({
      success: true,
      product,
      relatedProducts
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch product'
    }, { status: 500 })
  }
}
