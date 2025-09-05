
"use client"

import { createContext, useContext, useEffect, useState } from 'react'

interface AuthContextType {
  isAdmin: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  adminUser: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Credenciales de administrador (en producción esto debería estar en variables de entorno)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'faelight2024'
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminUser, setAdminUser] = useState<string | null>(null)

  // Verificar si hay una sesión guardada
  useEffect(() => {
    const savedAuth = localStorage.getItem('faelight_admin')
    if (savedAuth) {
      const authData = JSON.parse(savedAuth)
      if (authData.isAdmin && authData.adminUser) {
        setIsAdmin(true)
        setAdminUser(authData.adminUser)
      }
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true)
      setAdminUser(username)
      
      // Guardar en localStorage
      localStorage.setItem('faelight_admin', JSON.stringify({
        isAdmin: true,
        adminUser: username,
        loginTime: new Date().toISOString()
      }))
      
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    setAdminUser(null)
    localStorage.removeItem('faelight_admin')
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, adminUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
