
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Plus, LogIn, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import LoginModal from './login-modal'
import AddProductModal from './add-product-modal'
import toast from 'react-hot-toast'

const AdminControls = () => {
  const { isAdmin, logout, adminUser } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    setIsMenuOpen(false)
  }

  const handleProductAdded = () => {
    // Recargar la página para mostrar el nuevo producto
    window.location.reload()
  }

  if (!isAdmin) {
    return (
      <>
        {/* Login Button - Fixed position */}
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => setShowLoginModal(true)}
            size="sm"
            className="bg-[#0A8E81] hover:bg-[#087267] text-white shadow-lg"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </div>

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    )
  }

  return (
    <>
      {/* Admin Controls - Fixed position */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="flex flex-col gap-2">
          {/* Admin Menu Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              size="lg"
              className="bg-[#0A8E81] hover:bg-[#087267] text-white shadow-lg rounded-full w-12 h-12 p-0"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Settings className="h-5 w-5" />
              </motion.div>
            </Button>

            {/* Menu Items */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border min-w-[200px]"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-[#0A8E81]" />
                      <span className="text-sm font-medium text-gray-900">
                        Welcome, {adminUser}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowAddProductModal(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4 text-[#0A8E81]" />
                      Add Product
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={() => setShowAddProductModal(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Backdrop for menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  )
}

export default AdminControls
