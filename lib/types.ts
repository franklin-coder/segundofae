// Tipos básicos para el e-commerce

export interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  image?: string
  images?: string[]
  category: string
  subcategory?: string
  in_stock?: boolean
  featured?: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
  href: string
  color?: string
}

export interface Subcategory {
  id: string
  name: string
  description: string
  apiValue: string
  category: string
}

// Tipos para filtros
export interface ProductFilters {
  categories?: string[]
  price_min?: number
  price_max?: number
  in_stock?: boolean
  featured?: boolean
  subcategory?: string
}

// Tipos para respuestas de API
export interface ProductsResponse {
  products: Product[]
  total: number
  page?: number
  limit?: number
  query?: any
}
