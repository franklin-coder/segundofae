
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SubcategoryFilterProps {
  category: string
  currentSubcategory?: string
}

const subcategoriesByCategory = {
  earrings: ['Crochet', 'Beaded', 'Resin'],
  necklaces: ['Crochet', 'Beaded'],
  bracelets: ['Beaded', 'Crochet']
}

export default function SubcategoryFilter({ category, currentSubcategory }: SubcategoryFilterProps) {
  const pathname = usePathname()
  const subcategories = subcategoriesByCategory[category as keyof typeof subcategoriesByCategory] || []

  if (subcategories.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter by Style</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href={`/products/${category}`}>
          <Button
            variant={!currentSubcategory ? "default" : "ghost"}
            className={cn(
              "w-full justify-start",
              !currentSubcategory && "bg-gray-900 text-white hover:bg-gray-800"
            )}
          >
            All {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        </Link>
        
        {subcategories.map((subcategory) => {
          const isActive = currentSubcategory === subcategory.toLowerCase()
          return (
            <Link key={subcategory} href={`/products/${category}/${subcategory.toLowerCase()}`}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-gray-900 text-white hover:bg-gray-800"
                )}
              >
                {subcategory} {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            </Link>
          )
        })}
      </CardContent>
    </Card>
  )
}
