
// Product Types
export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  description: string
  longDescription?: string
  category: 'necklaces' | 'earrings' | 'bracelets' | 'anklets'
  images: string[]
  featured: boolean
  inStock: boolean
  materials?: string[]
  dimensions?: string
  care_instructions?: string
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
}

// Cart Types
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

// Order Types
export interface Order {
  id: string
  customer_email: string
  customer_name: string
  customer_address: string
  items: CartItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
}

// Contact Form Types
export interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
