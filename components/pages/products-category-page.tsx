
"use client"

import ProductsPage from '@/components/products/products-page'

interface ProductsCategoryPageProps {
  params: {
    category: string
    subcategory?: string
  }
}

const ProductsCategoryPage = ({ params }: ProductsCategoryPageProps) => {
  return (
    <ProductsPage 
      category={params.category} 
      subcategory={params.subcategory}
    />
  )
}

export default ProductsCategoryPage
