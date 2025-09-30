
// Tipos básicos para el e-commerce

export interface Product {
  id: string | number
  sku?: string
  name: string
  description?: string
  longDescription?: string
  price: number
  image?: string
  images?: string[]
  category: string
  subcategory?: string
  in_stock?: boolean
  inStock?: boolean
  featured?: boolean
  materials?: string[]
  dimensions?: string
  care_instructions?: string
  created_at?: string | Date
  updated_at?: string | Date
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

export interface CartItem {
  id: string
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
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
