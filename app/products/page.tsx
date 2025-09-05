
import { Suspense } from 'react'
import { Metadata } from 'next'
import ProductsGrid from '@/components/products/products-grid'
// import ProductsFilter from '@/components/products/products-filter' // COMMENTED OUT - Filter removed
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'All Products - FaeLight Crafts | Handmade Jewelry Collection',
  description: 'Browse our complete collection of handcrafted macramé jewelry. From necklaces to anklets, find the perfect piece to express your unique style.',
}

export default function ProductsPage() {
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
              <BreadcrumbPage>All Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Our Complete Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our full range of handcrafted macramé jewelry, each piece 
            created with love and attention to detail in Victoria, Canada.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - COMMENTED OUT */}
          {/* 
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
              <ProductsFilter />
            </Suspense>
          </aside>
          */}

          {/* Products Grid - Now takes full width */}
          <main className="flex-1">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            }>
              <ProductsGrid />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
