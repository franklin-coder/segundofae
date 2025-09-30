
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SubcategoryPage from '@/components/subcategories/subcategory-page'

interface SubcategoriesPageProps {
  params: {
    category: string
  }
}

const SubcategoriesPage = ({ params }: SubcategoriesPageProps) => {
  return <SubcategoryPage category={params.category} />
}

export default SubcategoriesPage
