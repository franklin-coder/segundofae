
"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Upload, Save, Loader } from 'lucide-react'
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

const AddProductModal = ({ isOpen, onClose, onProductAdded }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    longDescription: '',
    category: 'necklaces',
    materials: '',
    dimensions: '',
    care_instructions: '',
    featured: false,
    inStock: true
  })
  
  const [images, setImages] = useState<string[]>(['', ''])
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    { value: 'necklaces', label: 'Necklaces' },
    { value: 'earrings', label: 'Earrings' },
    { value: 'bracelets', label: 'Bracelets' },
    { value: 'and-more', label: 'And More' }
  ]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images]
    newImages[index] = value
    setImages(newImages)
  }

  const addImageField = () => {
    setImages([...images, ''])
  }

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index)
      setImages(newImages)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.price || !formData.description) {
        toast.error('Please fill in all required fields')
        setIsLoading(false)
        return
      }

      // Preparar datos del producto
      const productData = {
        id: `${formData.category}-${Date.now().toString().slice(-6)}`,
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        longDescription: formData.longDescription || formData.description,
        category: formData.category,
        images: images.filter(img => img.trim() !== ''),
        featured: formData.featured,
        inStock: formData.inStock,
        materials: formData.materials.split(',').map(m => m.trim()).filter(m => m !== ''),
        dimensions: formData.dimensions,
        care_instructions: formData.care_instructions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Enviar al API
      const response = await fetch('/api/products/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Product added successfully!')
        onProductAdded()
        onClose()
        
        // Reset form
        setFormData({
          name: '',
          price: '',
          description: '',
          longDescription: '',
          category: 'necklaces',
          materials: '',
          dimensions: '',
          care_instructions: '',
          featured: false,
          inStock: true
        })
        setImages(['', ''])
      } else {
        toast.error(result.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('An error occurred while adding the product')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

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
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Price (CAD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="25.00"
                      required
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
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
                    required
                  />
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
                  <Label>Product Images</Label>
                  <div className="space-y-2">
                    {images.map((image, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          placeholder="Enter image URL"
                          className="flex-1"
                        />
                        {images.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeImageField(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addImageField}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Image URL
                    </Button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="materials">Materials</Label>
                    <Input
                      id="materials"
                      value={formData.materials}
                      onChange={(e) => handleInputChange('materials', e.target.value)}
                      placeholder="e.g., Cotton cord, Sterling silver, Natural beads"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate with commas</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) => handleInputChange('dimensions', e.target.value)}
                      placeholder="e.g., Length: 45cm, adjustable"
                    />
                  </div>
                </div>

                {/* Care Instructions */}
                <div>
                  <Label htmlFor="care_instructions">Care Instructions</Label>
                  <Textarea
                    id="care_instructions"
                    value={formData.care_instructions}
                    onChange={(e) => handleInputChange('care_instructions', e.target.value)}
                    placeholder="How to care for this product"
                    rows={2}
                  />
                </div>

                {/* Options */}
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked as boolean)}
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
