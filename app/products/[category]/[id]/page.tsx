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

// ✅ Función actualizada para usar Prisma
async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return null
    }

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
      relatedProducts
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = params
  const productData = await getProduct(id)

  if (!productData?.product) {
    return {
      title: 'Product Not Found - FaeLight Crafts'
    }
  }

  const product = productData.product

  return {
    title: `${product.name} - FaeLight Crafts | Handmade Jewelry`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images || [],
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, id } = params
  const productData = await getProduct(id)

  if (!productData?.product) {
    notFound()
  }

  const { product, relatedProducts } = productData

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
              <BreadcrumbLink href={`/products/${category}`}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
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