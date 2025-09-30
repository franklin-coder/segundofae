
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { Product } from '@/lib/types'

interface CartItem {
  id: string
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id === action.product.id)
      const quantity = action.quantity || 1
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }
      } else {
        const newItems = [...state.items, { id: action.product.id, product: action.product, quantity }]
        return {
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        }
      }
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.productId)
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      ).filter(item => item.quantity > 0)
      
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      }
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
