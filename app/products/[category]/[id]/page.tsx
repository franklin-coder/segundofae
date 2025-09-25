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

// Función simplificada para obtener producto
async function getProduct(id: string, category?: string) {
  const startTime = Date.now()
  
  try {
    console.log(`[PRODUCT_SEARCH] Searching for product ID: "${id}", Category: "${category}"`)
    
    // Búsqueda directa por ID
    const product = await prisma.product.findUnique({
      where: { id: id.trim() }
    })

    if (!product) {
      console.log(`[PRODUCT_SEARCH] Product not found: "${id}" (${Date.now() - startTime}ms)`)
      return null
    }

    console.log(`[PRODUCT_SEARCH] Product found: ${product.id} (${Date.now() - startTime}ms)`)
    
    // Obtener productos relacionados
    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id }
      },
      take: 4,
      orderBy: {
        created_at: 'desc'
      }
    })

    return {
      success: true,
      product,
      relatedProducts,
      searchStrategy: 'direct'
    }
  } catch (error) {
    console.error(`[PRODUCT_SEARCH] Error fetching product (${Date.now() - startTime}ms):`, error)
    console.error(`[PRODUCT_SEARCH] Search params:`, { id, category })
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
      images: product.image_url ? [product.image_url] : [], // ✅ CORREGIDO
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Beautiful handmade ${product.category}`,
      images: product.image_url ? [product.image_url] : [], // ✅ CORREGIDO
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
  if (process.env.NODE_ENV === 'development') {
    console.log(`Product page rendered for ID: ${id}, found: ${product.id}`)
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