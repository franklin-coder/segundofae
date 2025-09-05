
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validar datos requeridos
    if (!productData.name || !productData.price || !productData.description || !productData.category) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, price, description, and category are required'
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
      // Si el archivo no existe o está corrupto, comenzamos con un array vacío
      products = []
    }

    // Validar que el ID sea único
    const existingProduct = products.find((p: any) => p.id === productData.id)
    if (existingProduct) {
      // Generar nuevo ID si ya existe
      productData.id = `${productData.category}-${Date.now().toString()}`
    }

    // Agregar el nuevo producto
    products.push(productData)

    // Guardar de vuelta al archivo
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2))

    console.log('New product added:', productData.name)

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      product: productData
    })

  } catch (error) {
    console.error('Error adding product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to add product. Please try again.'
    }, { status: 500 })
  }
}
