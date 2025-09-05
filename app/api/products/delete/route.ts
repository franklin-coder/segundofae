
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'Product ID is required'
      }, { status: 400 })
    }

    // Ruta al archivo de productos
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    
    // Leer productos existentes
    let products = []
    try {
      const fileContent = fs.readFileSync(productsPath, 'utf8')
      products = JSON.parse(fileContent)
    } catch (error) {
      console.error('Error reading products file:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to read products file'
      }, { status: 500 })
    }

    // Buscar el producto
    const productIndex = products.findIndex((p: any) => p.id === productId)
    
    if (productIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    // Obtener información del producto antes de eliminarlo
    const deletedProduct = products[productIndex]

    // Eliminar el producto del array
    products.splice(productIndex, 1)

    // Guardar de vuelta al archivo
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))

    console.log('Product deleted:', deletedProduct.name, '(ID:', productId, ')')

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: {
        id: deletedProduct.id,
        name: deletedProduct.name
      }
    })

  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete product. Please try again.'
    }, { status: 500 })
  }
}
