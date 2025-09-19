
// app/products/[category]/[id]/page.tsx
import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetails from '@/components/products/product-details'
import RelatedProducts from '@/components/products/related-products'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Product as PrismaProduct } from '@prisma/client'

interface ProductPageProps {
  params: {
    category: string
    id: string
  }
}

// ✅ Función mejorada con búsqueda flexible y múltiples criterios
async function getProduct(id: string, category?: string) {
  try {
    // Estrategia 1: Búsqueda directa por ID
    let product = await prisma.product.findUnique({
      where: { id }
    })

    // Estrategia 2: Si no se encuentra, buscar por ID con diferentes formatos
    if (!product) {
      // Buscar productos que contengan el ID como substring
      const productsWithSimilarId = await prisma.product.findMany({
        where: {
          OR: [
            { id: { contains: id } },
            { id: { startsWith: id } },
            { id: { endsWith: id } }
          ]
        },
        take: 5
      })

      if (productsWithSimilarId.length > 0) {
        // Priorizar productos de la misma categoría si se proporciona
        if (category) {
          product = productsWithSimilarId.find(p => p.category === category) || productsWithSimilarId[0]
        } else {
          product = productsWithSimilarId[0]
        }
      }
    }

    // Estrategia 3: Si aún no se encuentra, buscar por nombre similar
    if (!product) {
      // Decodificar el ID por si contiene caracteres especiales
      const decodedId = decodeURIComponent(id)
      const searchTerms = decodedId.split(/[-_\s]+/).filter(term => term.length > 2)
      
      if (searchTerms.length > 0) {
        const nameSearchProducts = await prisma.product.findMany({
          where: {
            OR: searchTerms.map(term => ({
              name: { contains: term, mode: 'insensitive' as const }
            }))
          },
          take: 5
        })

        if (nameSearchProducts.length > 0) {
          // Priorizar productos de la misma categoría
          if (category) {
            product = nameSearchProducts.find(p => p.category === category) || nameSearchProducts[0]
          } else {
            product = nameSearchProducts[0]
          }
        }
      }
    }

    // Estrategia 4: Como último recurso, buscar por categoría y tomar el primero
    if (!product && category && category !== 'all') {
      const categoryProducts = await prisma.product.findMany({
        where: { category },
        take: 1
      })
      
      if (categoryProducts.length > 0) {
        product = categoryProducts[0]
      }
    }

    if (!product) {
      return null
    }

    // Obtener productos relacionados
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id }
      },
      take: 4
    })

    return {
      success: true,
      product,
      relatedProducts,
      searchStrategy: product.id === id ? 'direct' : 'fallback'
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id, category } = params
  const productData = await getProduct(id, category)

  if (!productData?.product) {
    return {
      title: 'Product Not Found - FaeLight Crafts',
      description: 'The requested product could not be found.'
    }
  }

  const product = productData.product

  return {
    title: `${product.name} - FaeLight Crafts | Handmade Jewelry`,
    description: product.description || `Discover ${product.name} in our ${product.category} collection`,
    openGraph: {
      title: product.name,
      description: product.description || `Beautiful handmade ${product.category}`,
      images: product.images && product.images.length > 0 ? product.images : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Beautiful handmade ${product.category}`,
      images: product.images && product.images.length > 0 ? product.images : [],
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, id } = params
  const productData = await getProduct(id, category)

  if (!productData?.product) {
    notFound()
  }

  const { product, relatedProducts, searchStrategy } = productData

  // Log para debugging en desarrollo
  if (process.env.NODE_ENV === 'development' && searchStrategy === 'fallback') {
    console.log(`Product found using fallback strategy for ID: ${id}, found: ${product.id}`)
  }

  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products/${product.category}`}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mensaje informativo si se usó búsqueda de fallback */}
        {searchStrategy === 'fallback' && process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              Note: Product found using flexible search (original ID: {id})
            </p>
          </div>
        )}

        {/* Product Details */}
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="aspect-square bg-white rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        }>
          <ProductDetails product={product as any} />
        </Suspense>

        {/* Related Products */}
        {relatedProducts?.length > 0 && (
          <Suspense fallback={
            <div className="mt-20">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            </div>
          }>
            <RelatedProducts products={relatedProducts as any} />
          </Suspense>
        )}
      </div>
    </div>
  )
}
