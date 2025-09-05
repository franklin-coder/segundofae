
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductsGrid from '@/components/products/products-grid'
// import ProductsFilter from '@/components/products/products-filter' // COMMENTED OUT - Filter removed
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface CategoryPageProps {
  params: {
    category: string
  }
}

const categoryInfo = {
  necklaces: {
    title: 'Necklaces',
    description: 'Statement pieces and delicate chains that complement any style. From bohemian macramé designs to elegant everyday wear.',
  },
  earrings: {
    title: 'Earrings',
    description: 'Elegant drops and modern hoops crafted with intricate macramé techniques. Perfect for adding a touch of artisanal beauty to your look.',
  },
  bracelets: {
    title: 'Bracelets',
    description: 'Layering essentials and statement cuffs made with love. Mix and match our friendship bracelets or wear a single statement piece.',
  },
  'and-more': {
    title: 'And More',
    description: 'Discover our unique collection of anklets, keychains, and other handcrafted accessories. Perfect finishing touches for your bohemian style.',
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = params
  const categoryData = categoryInfo[category as keyof typeof categoryInfo]
  
  if (!categoryData) {
    return {
      title: 'Category Not Found - FaeLight Crafts'
    }
  }

  return {
    title: `${categoryData.title} - FaeLight Crafts | Handmade Jewelry`,
    description: categoryData.description,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  const categoryData = categoryInfo[category as keyof typeof categoryInfo]
  
  if (!categoryData) {
    notFound()
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
              <BreadcrumbPage>{categoryData.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            {categoryData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {categoryData.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - COMMENTED OUT */}
          {/* 
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
              <ProductsFilter currentCategory={category} />
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
              <ProductsGrid category={category} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
