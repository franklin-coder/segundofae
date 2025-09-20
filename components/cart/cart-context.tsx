
"use client"

import { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  category: string
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isLoaded: boolean
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }
      
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { items: newItems, total }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { items: newItems, total }
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0)
      
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      return { items: newItems, total }
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0 }
    
    case 'LOAD_CART':
      return action.payload
    
    default:
      return state
  }
}

// Funciones para localStorage
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 }
  }
  
  try {
    const savedCart = localStorage.getItem('faelight-cart')
    if (savedCart) {
      const parsed = JSON.parse(savedCart)
      // Validar estructura
      if (parsed && Array.isArray(parsed.items) && typeof parsed.total === 'number') {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  
  return { items: [], total: 0 }
}

const saveCartToStorage = (state: CartState) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('faelight-cart', JSON.stringify(state))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    const savedCart = loadCartFromStorage()
    if (savedCart.items.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart })
    }
    setIsLoaded(true)
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(state)
    }
  }, [state, isLoaded])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total: state.total,
      itemCount,
      isLoaded
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
