
"use client"

import { useState, useRef } from 'react'
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
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Solo mostrar si es admin
  if (!isAdmin) {
    return null
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevenir múltiples clicks si ya está eliminando
    if (isDeleting) {
      return
    }
    
    setDeleteError(null)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    // Prevenir múltiples llamadas simultáneas
    if (isDeleting) {
      return
    }

    setIsDeleting(true)
    setDeleteError(null)
    
    // Cancelar cualquier petición anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Crear nuevo AbortController para esta operación
    abortControllerRef.current = new AbortController()
    
    try {
      const response = await fetch(`/api/products/delete?id=${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Verificar si la petición fue cancelada
      if (abortControllerRef.current.signal.aborted) {
        return
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        toast.success(`Product "${productName}" deleted successfully!`)
        setShowDeleteModal(false)
        
        // Llamar callback para actualizar la lista
        if (onProductDeleted) {
          onProductDeleted()
        } else {
          // Si no hay callback, recargar la página después de un breve delay
          setTimeout(() => {
            if (!abortControllerRef.current?.signal.aborted) {
              window.location.reload()
            }
          }, 500)
        }
      } else {
        const errorMessage = result.error || 'Failed to delete product'
        setDeleteError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error: any) {
      // No mostrar error si la petición fue cancelada intencionalmente
      if (error.name === 'AbortError') {
        return
      }
      
      console.error('Error deleting product:', error)
      const errorMessage = error.message || 'An error occurred while deleting the product'
      setDeleteError(errorMessage)
      toast.error(errorMessage)
    } finally {
      // Solo actualizar el estado si la petición no fue cancelada
      if (!abortControllerRef.current?.signal.aborted) {
        setIsDeleting(false)
      }
    }
  }

  const handleCloseModal = () => {
    // Cancelar petición en curso si existe
    if (abortControllerRef.current && isDeleting) {
      abortControllerRef.current.abort()
    }
    
    setShowDeleteModal(false)
    setDeleteError(null)
    setIsDeleting(false)
  }

  return (
    <>
      {/* Delete Button */}
      <div className="absolute top-2 right-2 z-10">
        <Button
          onClick={handleDeleteClick}
          size="sm"
          variant="destructive"
          disabled={isDeleting}
          className={`w-8 h-8 p-0 bg-red-600/90 hover:bg-red-700 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
            isDeleting ? 'cursor-not-allowed opacity-50' : ''
          }`}
          title={isDeleting ? "Deleting..." : "Delete Product"}
        >
          <Trash2 className={`h-4 w-4 ${isDeleting ? 'animate-pulse' : ''}`} />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        productName={productName}
        isLoading={isDeleting}
        error={deleteError}
      />
    </>
  )
}

export default AdminProductControls
