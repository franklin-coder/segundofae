'use client'

interface SubcategoryFilterProps {
  category: string
  currentSubcategory?: string
}

export default function SubcategoryFilter({ category, currentSubcategory }: SubcategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="font-semibold mb-4">Filter by Subcategory</h3>
      <div className="space-y-2">
        <p>Category: {category}</p>
        {currentSubcategory && <p>Current: {currentSubcategory}</p>}
        <p className="text-sm text-gray-500">SubcategoryFilter component - placeholder</p>
      </div>
    </div>
  )
}
