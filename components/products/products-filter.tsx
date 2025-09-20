
"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { X, Filter } from 'lucide-react'

interface ProductsFilterProps {
  currentCategory?: string
}

const ProductsFilter = ({ currentCategory }: ProductsFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [inStockOnly, setInStockOnly] = useState(false)
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const categories = [
    { id: 'necklaces', name: 'Necklaces', count: 2 },
    { id: 'earrings', name: 'Earrings', count: 2 },
    { id: 'bracelets', name: 'Bracelets', count: 2 },
    { id: 'anklets', name: 'Anklets', count: 2 }
  ]



  useEffect(() => {
    if (currentCategory) {
      setSelectedCategories([currentCategory])
    }
  }, [currentCategory])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, categoryId])
    } else {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId))
    }
  }



  const clearAllFilters = () => {
    setSelectedCategories(currentCategory ? [currentCategory] : [])
    setPriceRange([0, 100])
    setInStockOnly(false)
    setFeaturedOnly(false)
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (selectedCategories.length > 0 && !currentCategory) {
      params.append('categories', selectedCategories.join(','))
    }
    

    
    if (priceRange[0] > 0 || priceRange[1] < 100) {
      params.append('price_min', priceRange[0].toString())
      params.append('price_max', priceRange[1].toString())
    }
    
    if (inStockOnly) {
      params.append('in_stock', 'true')
    }
    
    if (featuredOnly) {
      params.append('featured', 'true')
    }

    const queryString = params.toString()
    const basePath = currentCategory ? `/products/${currentCategory}` : '/products'
    router.push(queryString ? `${basePath}?${queryString}` : basePath)
  }

  const activeFiltersCount = selectedMaterials.length + 
    (inStockOnly ? 1 : 0) + 
    (featuredOnly ? 1 : 0) + 
    (priceRange[0] > 0 || priceRange[1] < 100 ? 1 : 0)

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-[#0A8E81]" />
          <h3 className="font-semibold text-lg">Filters</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Categories */}
      {!currentCategory && (
        <div>
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {category.name}
                  <span className="text-gray-500 ml-1">({category.count})</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>



      {/* Other Filters */}
      <div>
        <h4 className="font-medium mb-3">Other</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <label
              htmlFor="in-stock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              In Stock Only
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featuredOnly}
              onCheckedChange={(checked) => setFeaturedOnly(checked as boolean)}
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Featured Items
            </label>
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button 
        onClick={applyFilters}
        className="w-full bg-[#0A8E81] hover:bg-[#087267]"
      >
        Apply Filters
      </Button>
    </div>
  )
}

export default ProductsFilter
