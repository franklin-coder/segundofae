
'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AuthState {
  isAuthenticated: boolean
  user: null
  isAdmin: boolean
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState: AuthState = {
    isAuthenticated: false,
    user: null,
    isAdmin: false
  }

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
