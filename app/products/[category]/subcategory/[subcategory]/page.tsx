
import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductsGrid from '@/components/products/products-grid'
import SubcategoryFilter from '@/components/products/subcategory-filter'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

interface SubcategoryPageProps {
  params: {
    category: string
    subcategory: string
  }
}

const categoryInfo = {
  necklaces: {
    title: 'Necklaces',
    subcategories: ['crochet', 'beaded']
  },
  earrings: {
    title: 'Earrings',
    subcategories: ['crochet', 'beaded', 'resin']
  },
  bracelets: {
    title: 'Bracelets',
    subcategories: ['beaded', 'crochet']
  }
}

const subcategoryInfo = {
  crochet: {
    title: 'Crochet',
    description: 'Handcrafted with intricate crochet techniques, these pieces showcase the beauty of fiber art in jewelry form.'
  },
  beaded: {
    title: 'Beaded',
    description: 'Carefully selected beads woven together to create stunning, colorful pieces that catch the light beautifully.'
  },
  resin: {
    title: 'Resin',
    description: 'Modern resin designs that capture nature and color in unique, lightweight pieces perfect for everyday wear.'
  }
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = params
  const categoryData = categoryInfo[category as keyof typeof categoryInfo]
  const subcategoryData = subcategoryInfo[subcategory as keyof typeof subcategoryInfo]
  
  if (!categoryData || !subcategoryData || !categoryData.subcategories.includes(subcategory)) {
    return {
      title: 'Page Not Found - FaeLight Crafts'
    }
  }

  return {
    title: `${subcategoryData.title} ${categoryData.title} - FaeLight Crafts | Handmade Jewelry`,
    description: `${subcategoryData.description} Browse our collection of ${subcategory} ${category}.`,
  }
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { category, subcategory } = params
  const categoryData = categoryInfo[category as keyof typeof categoryInfo]
  const subcategoryData = subcategoryInfo[subcategory as keyof typeof subcategoryInfo]
  
  if (!categoryData || !subcategoryData || !categoryData.subcategories.includes(subcategory)) {
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
              <BreadcrumbLink href={`/products/${category}`}>{categoryData.title}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{subcategoryData.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            {subcategoryData.title} {categoryData.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subcategoryData.description}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <Suspense fallback={<div className="h-96 bg-white rounded-lg animate-pulse" />}>
              <SubcategoryFilter category={category} currentSubcategory={subcategory} />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg h-96 animate-pulse" />
                ))}
              </div>
            }>
              <ProductsGrid category={category} subcategory={subcategory} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
