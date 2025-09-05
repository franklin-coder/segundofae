
"use client"

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'
import DeleteConfirmModal from './delete-confirm-modal'
import toast from 'react-hot-toast'

interface AdminProductControlsProps {
  productId: string
  productName: string
  onProductDeleted?: () => void
}

const AdminProductControls = ({ 
  productId, 
  productName, 
  onProductDeleted 
}: AdminProductControlsProps) => {
  const { isAdmin } = useAuth()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Solo mostrar si es admin
  if (!isAdmin) {
    return null
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/products/delete?id=${productId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Product "${productName}" deleted successfully!`)
        setShowDeleteModal(false)
        
        // Llamar callback para actualizar la lista
        if (onProductDeleted) {
          onProductDeleted()
        } else {
          // Si no hay callback, recargar la página
          setTimeout(() => window.location.reload(), 500)
        }
      } else {
        toast.error(result.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('An error occurred while deleting the product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Delete Button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          onClick={handleDeleteClick}
          size="sm"
          variant="destructive"
          className="w-8 h-8 p-0 bg-red-600/90 hover:bg-red-700 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          title="Delete Product"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        productName={productName}
        isLoading={isDeleting}
      />
    </>
  )
}

export default AdminProductControls
