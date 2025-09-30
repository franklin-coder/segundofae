'use client'

interface ProductsGridProps {
  category?: string
  subcategory?: string
}

export default function ProductsGrid({ category, subcategory }: ProductsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div className="text-center p-8">
        <p>Products for category: {category}</p>
        {subcategory && <p>Subcategory: {subcategory}</p>}
        <p className="text-sm text-gray-500 mt-2">ProductsGrid component - placeholder</p>
      </div>
    </div>
  )
}
