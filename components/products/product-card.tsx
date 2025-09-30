
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(price)
  }

  const getSubcategoryDisplay = (subcategory: string | null) => {
    if (!subcategory) return null
    return subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
  }

  return (
    <Link href={`/products/${product.category}/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Featured
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category and Subcategory */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="capitalize">{product.category}</span>
            {product.subcategory && (
              <>
                <span>•</span>
                <span>{getSubcategoryDisplay(product.subcategory)}</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.materials && product.materials.length > 0 && (
              <div className="flex gap-1">
                {product.materials.slice(0, 2).map((material, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {material}
                  </Badge>
                ))}
                {product.materials.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.materials.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
