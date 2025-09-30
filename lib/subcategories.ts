
// Definición de subcategorías por categoría
export const subcategoriesMap = {
  necklaces: [
    {
      id: 'crochet',
      name: 'Crochet',
      description: 'Handcrafted crochet necklaces with intricate patterns',
      apiValue: 'necklaces-crochet'
    },
    {
      id: 'beaded',
      name: 'Beaded',
      description: 'Elegant beaded necklaces with premium materials',
      apiValue: 'necklaces-beaded'
    }
  ],
  bracelets: [
    {
      id: 'beaded',
      name: 'Beaded',
      description: 'Beautiful beaded bracelets for every occasion',
      apiValue: 'bracelets-beaded'
    },
    {
      id: 'crochet',
      name: 'Crochet',
      description: 'Soft and comfortable crochet bracelets',
      apiValue: 'bracelets-crochet'
    }
  ],
  earrings: [
    {
      id: 'crochet',
      name: 'Crochet',
      description: 'Lightweight crochet earrings with unique designs',
      apiValue: 'earrings-crochet'
    },
    {
      id: 'beaded',
      name: 'Beaded',
      description: 'Stunning beaded earrings that catch the light',
      apiValue: 'earrings-beaded'
    },
    {
      id: 'resin',
      name: 'Resin',
      description: 'Modern resin earrings with artistic flair',
      apiValue: 'earrings-resin'
    }
  ]
} as const

// Información de categorías principales
export const categoryInfo = {
  necklaces: {
    name: 'Necklaces',
    description: 'Explore our collection of handcrafted necklaces',
    hasSubcategories: true
  },
  bracelets: {
    name: 'Bracelets',
    description: 'Discover beautiful bracelets for every style',
    hasSubcategories: true
  },
  earrings: {
    name: 'Earrings',
    description: 'Find the perfect earrings to complete your look',
    hasSubcategories: true
  },
  'and-more': {
    name: 'And More',
    description: 'Discover our unique collection of special pieces and accessories',
    hasSubcategories: false
  }
} as const

// Tipos para TypeScript
export type CategoryKey = keyof typeof categoryInfo
export type SubcategoryKey = keyof typeof subcategoriesMap

// Función para obtener subcategorías de una categoría
export function getSubcategories(category: string) {
  return subcategoriesMap[category as SubcategoryKey] || []
}

// Función para obtener información de una categoría
export function getCategoryInfo(category: string) {
  return categoryInfo[category as CategoryKey]
}

// Función para verificar si una categoría tiene subcategorías
export function hasSubcategories(category: string): boolean {
  const info = getCategoryInfo(category)
  return info?.hasSubcategories || false
}

// Función para obtener el valor de API para una combinación categoría-subcategoría
export function getApiValue(category: string, subcategory?: string): string {
  if (category === 'and-more') {
    return 'and-more'
  }
  
  if (subcategory) {
    const subcategories = getSubcategories(category)
    const subcategoryData = subcategories.find(sub => sub.id === subcategory)
    return subcategoryData?.apiValue || category
  }
  
  return category
}

// Función para obtener el nombre completo de una subcategoría
export function getSubcategoryName(category: string, subcategory: string): string {
  const subcategories = getSubcategories(category)
  const subcategoryData = subcategories.find(sub => sub.id === subcategory)
  const categoryData = getCategoryInfo(category)
  
  if (subcategoryData && categoryData) {
    return `${subcategoryData.name} ${categoryData.name}`
  }
  
  return subcategory
}

// Función para obtener subcategorías de una categoría (nombres únicamente)
// Esta función es requerida por el componente add-product-modal.tsx
export function getSubcategoriesForCategory(category: string): string[] {
  const subcategories = getSubcategories(category)
  return subcategories.map(sub => sub.name)
}
