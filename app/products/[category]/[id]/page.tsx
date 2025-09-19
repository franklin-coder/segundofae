
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
// import { Product as PrismaProduct } from '@prisma/client' // Commented out due to build issues

interface ProductPageProps {
  params: {
    category: string
    id: string
  }
}

// ✅ Función mejorada con búsqueda flexible y múltiples criterios + logging mejorado
async function getProduct(id: string, category?: string) {
  const startTime = Date.now()
  
  try {
    console.log(`[PRODUCT_SEARCH] Starting search for ID: "${id}", Category: "${category}"`)
    
    // Estrategia 1: Búsqueda directa por ID
    let product = await prisma.product.findUnique({
      where: { id }
    })

    if (product) {
      console.log(`[PRODUCT_SEARCH] Direct match found: ${product.id} (${Date.now() - startTime}ms)`)
      
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
        searchStrategy: 'direct'
      }
    }

    console.log(`[PRODUCT_SEARCH] No direct match, trying flexible search...`)

    // Estrategia 2: Si no se encuentra, buscar por ID con diferentes formatos
    const productsWithSimilarId = await prisma.product.findMany({
      where: {
        OR: [
          { id: { contains: id, mode: 'insensitive' } },
          { id: { startsWith: id, mode: 'insensitive' } },
          { id: { endsWith: id, mode: 'insensitive' } }
        ]
      },
      take: 10
    })

    console.log(`[PRODUCT_SEARCH] Similar ID search found ${productsWithSimilarId.length} products`)

    if (productsWithSimilarId.length > 0) {
      // Priorizar productos de la misma categoría si se proporciona
      if (category && category !== 'all') {
        product = productsWithSimilarId.find((p: any) => p.category === category) || productsWithSimilarId[0]
        console.log(`[PRODUCT_SEARCH] Category priority applied, selected: ${product.id}`)
      } else {
        product = productsWithSimilarId[0]
        console.log(`[PRODUCT_SEARCH] No category filter, selected first: ${product.id}`)
      }
    }

    // Estrategia 3: Si aún no se encuentra, buscar por nombre similar
    if (!product) {
      console.log(`[PRODUCT_SEARCH] Trying name-based search...`)
      
      // Decodificar el ID por si contiene caracteres especiales
      const decodedId = decodeURIComponent(id)
      const searchTerms = decodedId.split(/[-_\s]+/).filter(term => term.length > 2)
      
      console.log(`[PRODUCT_SEARCH] Search terms extracted: ${searchTerms.join(', ')}`)
      
      if (searchTerms.length > 0) {
        const nameSearchProducts = await prisma.product.findMany({
          where: {
            OR: searchTerms.map(term => ({
              name: { contains: term, mode: 'insensitive' as const }
            }))
          },
          take: 10
        })

        console.log(`[PRODUCT_SEARCH] Name search found ${nameSearchProducts.length} products`)

        if (nameSearchProducts.length > 0) {
          // Priorizar productos de la misma categoría
          if (category && category !== 'all') {
            product = nameSearchProducts.find((p: any) => p.category === category) || nameSearchProducts[0]
          } else {
            product = nameSearchProducts[0]
          }
          console.log(`[PRODUCT_SEARCH] Name search selected: ${product.id}`)
        }
      }
    }

    // Estrategia 4: Como último recurso, buscar por categoría y tomar el primero
    if (!product && category && category !== 'all') {
      console.log(`[PRODUCT_SEARCH] Last resort: searching by category "${category}"`)
      
      const categoryProducts = await prisma.product.findMany({
        where: { category },
        take: 1
      })
      
      if (categoryProducts.length > 0) {
        product = categoryProducts[0]
        console.log(`[PRODUCT_SEARCH] Category fallback selected: ${product.id}`)
      }
    }

    if (!product) {
      console.log(`[PRODUCT_SEARCH] No product found after all strategies (${Date.now() - startTime}ms)`)
      
      // Log de todos los productos disponibles para debugging
      const allProducts = await prisma.product.findMany({
        select: { id: true, name: true, category: true },
        take: 20
      })
      console.log(`[PRODUCT_SEARCH] Available products:`, allProducts.map((p: any) => `${p.id} (${p.category})`))
      
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

    console.log(`[PRODUCT_SEARCH] Success! Found: ${product.id}, Strategy: fallback (${Date.now() - startTime}ms)`)

    return {
      success: true,
      product,
      relatedProducts,
      searchStrategy: 'fallback'
    }
  } catch (error) {
    console.error(`[PRODUCT_SEARCH] Error fetching product (${Date.now() - startTime}ms):`, error)
    
    // Log adicional para debugging en producción
    console.error(`[PRODUCT_SEARCH] Search params:`, { id, category })
    console.error(`[PRODUCT_SEARCH] Database URL configured:`, !!process.env.DATABASE_URL)
    
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
