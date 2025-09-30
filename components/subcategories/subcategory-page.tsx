
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SubcategoryShowcase from './subcategory-showcase'

interface SubcategoryPageProps {
  category: string
}

const SubcategoryPage = ({ category }: SubcategoryPageProps) => {
  const router = useRouter()
  const [isValidCategory, setIsValidCategory] = useState(true)

  // Categorías válidas que tienen subcategorías
  const validCategories = ['necklaces', 'bracelets', 'earrings']

  useEffect(() => {
    // Verificar si la categoría es válida
    if (!validCategories.includes(category)) {
      setIsValidCategory(false)
      // Redirigir a la página de productos directamente si no tiene subcategorías
      if (category === 'and-more') {
        router.push('/products/and-more')
      } else {
        router.push('/')
      }
    }
  }, [category, router])

  if (!isValidCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
          <p className="text-gray-600">Please wait while we redirect you.</p>
        </div>
      </div>
    )
  }

  return <SubcategoryShowcase category={category} />
}

export default SubcategoryPage
