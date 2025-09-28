
"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Upload, Save, Loader, Link, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import toast from 'react-hot-toast'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductAdded: () => void
}

interface FormErrors {
  name?: string
  price?: string
  description?: string
  category?: string
  images?: string
  general?: string
}

const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    longDescription: '',
    category: 'necklaces',
    dimensions: '',
    featured: false,
    inStock: true
  })
  
  const [images, setImages] = useState<string[]>(['', ''])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const categories = [
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'and-more', label: 'And More' }
  ]

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [imagePreviews])

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length === 0) {
      toast.error('Please select only image files')
      return
    }

    if (imageFiles.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    // Create previews
    const newPreviews: string[] = []
    imageFiles.forEach(file => {
      const preview = URL.createObjectURL(file)
      newPreviews.push(preview)
    })

    // Clean up old previews
    imagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })

    setImageFiles(imageFiles)
    setImagePreviews(newPreviews)
    
    // Clear errors
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: undefined }))
    }
  }, [imagePreviews, errors.images])

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Revoke the URL for the removed preview
    if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index])
    }
    
    setImageFiles(newFiles)
    setImagePreviews(newPreviews)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar campos requeridos
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters'
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required'
    } else {
      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a valid positive number'
      } else if (price > 10000) {
        newErrors.price = 'Price cannot exceed $10,000'
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    // Validar imágenes (al menos una URL válida o archivo subido)
    const validImages = images.filter(img => img.trim() !== '')
    const hasImages = imageInputMode === 'upload' ? imageFiles.length > 0 : validImages.length > 0
    
    if (!hasImages) {
      newErrors.images = 'At least one product image is required'
    } else if (imageInputMode === 'url') {
      // Validar formato básico de URLs solo si estamos en modo URL
      const invalidUrls = validImages.filter(url => {
        try {
          new URL(url)
          return false
        } catch {
          return true
        }
      })
      if (invalidUrls.length > 0) {
        newErrors.images = 'All image URLs must be valid'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
    
    // Limpiar error de imágenes cuando el usuario modifique
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: undefined
      }))
    }
  }

  const addImageField = () => {
    if (images.length < 10) { // Límite máximo de imágenes
      setImages([...images, ''])
    }
  }

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      longDescription: '',
      category: 'necklaces',
      dimensions: '',
      featured: false,
      inStock: true
    })
    setImages(['', ''])
    
    // Clean up image previews
    imagePreviews.forEach(preview => {
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
    })
    
    setImageFiles([])
    setImagePreviews([])
    setImageInputMode('url')
    setIsDragOver(false)
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoading) {
      return // Prevenir múltiples envíos
    }

    // Validar formulario
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsLoading(true)
    setErrors({})

    const startTime = Date.now()
    console.log('[PRODUCT_MODAL] Starting product creation process')

    try {
      // Preparar datos del producto (sin ID manual - Prisma lo generará)
      let finalImages: string[] = []
      
     if (imageInputMode === 'upload' && imageFiles.length > 0) {
  console.log(`[PRODUCT_MODAL] Uploading ${imageFiles.length} files to server...`)
  
  // Crear FormData para enviar archivos
  const uploadFormData = new FormData()
  imageFiles.forEach(file => {
    uploadFormData.append('files', file)
  })
  
  // Subir archivos al servidor
  const uploadResponse = await fetch('/api/upload', {
    method: 'POST',
    body: uploadFormData,
  })
  
  if (!uploadResponse.ok) {
    const uploadError = await uploadResponse.text()
    console.error('[PRODUCT_MODAL] Upload failed:', uploadError)
    throw new Error(`Failed to upload images: ${uploadError}`)
  }
  
  const uploadResult = await uploadResponse.json()
  
  if (!uploadResult.success) {
    console.error('[PRODUCT_MODAL] Upload result error:', uploadResult.error)
    throw new Error(`Upload failed: ${uploadResult.error}`)
  }
  
  finalImages = uploadResult.urls
  console.log(`[PRODUCT_MODAL] Successfully uploaded ${finalImages.length} images`)
  toast.success(`${finalImages.length} images uploaded successfully!`)
} else {
  finalImages = images.filter(img => img.trim() !== '')
}
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        longDescription: formData.longDescription.trim() || formData.description.trim(),
        category: formData.category,
        images: finalImages,
        featured: formData.featured,
        inStock: formData.inStock,
        dimensions: formData.dimensions.trim(),
        // Campos eliminados: materials, care_instructions
        // No incluir created_at ni updated_at - Prisma los manejará automáticamente
      }

      console.log('[PRODUCT_MODAL] Product data prepared:', {
        name: productData.name,
        category: productData.category,
        price: productData.price,
        imagesCount: productData.images.length
      })

      // Enviar al API
      console.log('[PRODUCT_MODAL] Sending request to API...')
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      console.log('[PRODUCT_MODAL] API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[PRODUCT_MODAL] API error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`)
      }

      const result = await response.json()
      console.log('[PRODUCT_MODAL] API response:', result)

      if (result.success) {
        console.log(`[PRODUCT_MODAL] Product created successfully in ${Date.now() - startTime}ms:`, result.product.id)
        toast.success('Product added successfully!')
        onProductAdded()
        onClose()
        resetForm()
      } else {
        const errorMessage = result.error || 'Failed to add product'
        console.error('[PRODUCT_MODAL] API returned error:', errorMessage)
        
        // Mostrar detalles adicionales si están disponibles
        if (result.details && Array.isArray(result.details)) {
          setErrors({ general: `${errorMessage}: ${result.details.join(', ')}` })
        } else {
          setErrors({ general: errorMessage })
        }
        
        toast.error(errorMessage)
      }
    } catch (error: any) {
      console.error(`[PRODUCT_MODAL] Error adding product (${Date.now() - startTime}ms):`, error)
      
      let errorMessage = 'An error occurred while adding the product'
      
      // Manejo específico de diferentes tipos de errores
      if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error occurred. Please check your internet connection and try again.'
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      console.error('[PRODUCT_MODAL] Final error message:', errorMessage)
      setErrors({ general: errorMessage })
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      console.log(`[PRODUCT_MODAL] Process completed in ${Date.now() - startTime}ms`)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      // Limpiar errores al cerrar
      setErrors({})
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#0A8E81]" />
                <h2 className="text-xl font-bold text-gray-900">Add New Product</h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Error General */}
            {errors.general && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Form */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., LUNA Crystal Necklace"
                      className={errors.name ? 'border-red-500' : ''}
                      required
                    />
                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (CAD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10000"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="25.00"
                      className={errors.price ? 'border-red-500' : ''}
                      required
                    />
                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${
                      errors.category ? 'border-red-500' : ''
                    }`}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                </div>

                {/* Descriptions */}
                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief description for product cards"
                    rows={2}
                    className={errors.description ? 'border-red-500' : ''}
                    required
                  />
                  {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label htmlFor="longDescription">Detailed Description</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => handleInputChange('longDescription', e.target.value)}
                    placeholder="Detailed description for product page"
                    rows={3}
                  />
                </div>

                {/* Product Images */}
                <div>
                  <Label>Product Images *</Label>
                  
                  {/* Image Input Mode Toggle */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      variant={imageInputMode === 'url' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageInputMode('url')}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Link className="h-4 w-4" />
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={imageInputMode === 'upload' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setImageInputMode('upload')}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Files
                    </Button>
                  </div>

                  {imageInputMode === 'url' ? (
                    /* URL Input Mode */
                    <div className="space-y-2">
                      {images.map((image, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder="Enter image URL"
                            className={`flex-1 ${errors.images ? 'border-red-500' : ''}`}
                          />
                          {images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImageField(index)}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {images.length < 10 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addImageField}
                          className="w-full"
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Image URL
                        </Button>
                      )}
                    </div>
                  ) : (
                    /* File Upload Mode */
                    <div className="space-y-4">
                      {/* Drag & Drop Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                          border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
                          ${isDragOver 
                            ? 'border-[#0A8E81] bg-[#0A8E81]/5' 
                            : errors.images 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300 hover:border-gray-400'
                          }
                        `}
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        <input
                          id="file-input"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <div className="flex flex-col items-center gap-2">
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {isDragOver ? 'Drop images here' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PNG, JPG, GIF up to 10 images
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Image Previews */}
                      {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg border"
                              />
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={isLoading}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                                {imageFiles[index]?.name.substring(0, 10)}...
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {errors.images && <p className="text-sm text-red-600 mt-1">{errors.images}</p>}
                </div>

                {/* Product Details */}
                <div>
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange('dimensions', e.target.value)}
                    placeholder="e.g., Length: 45cm, adjustable"
                  />
                </div>

                {/* Options */}
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Featured product
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleInputChange('inStock', checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="inStock" className="text-sm font-medium cursor-pointer">
                      In stock
                    </Label>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-[#0A8E81] hover:bg-[#087267]"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        Adding Product...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Add Product
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default AddProductModal
