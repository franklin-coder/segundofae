
export interface Product {
  id: string
  sku?: string
  name: string
  description: string
  longDescription?: string
  category: string
  subcategory?: string
  price: number
  images: string[]
  featured: boolean
  inStock: boolean
  materials: string[]
  dimensions?: string
  care_instructions?: string
  created_at: Date
  updated_at: Date
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
