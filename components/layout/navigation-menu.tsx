
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationMenuProps {
  mobile?: boolean
  onItemClick?: () => void
}

const categories = {
  earrings: {
    title: 'Earrings',
    subcategories: ['Crochet', 'Beaded', 'Resin']
  },
  necklaces: {
    title: 'Necklaces', 
    subcategories: ['Crochet', 'Beaded']
  },
  bracelets: {
    title: 'Bracelets',
    subcategories: ['Beaded', 'Crochet']
  }
}

export default function NavigationMenu({ mobile = false, onItemClick }: NavigationMenuProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleMouseEnter = (category: string) => {
    if (!mobile) {
      setActiveDropdown(category)
    }
  }

  const handleMouseLeave = () => {
    if (!mobile) {
      setActiveDropdown(null)
    }
  }

  const toggleDropdown = (category: string) => {
    if (mobile) {
      setActiveDropdown(activeDropdown === category ? null : category)
    }
  }

  if (mobile) {
    return (
      <nav className="flex flex-col space-y-4">
        <Link 
          href="/" 
          className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          onClick={onItemClick}
        >
          Home
        </Link>
        <Link 
          href="/products" 
          className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          onClick={onItemClick}
        >
          All Products
        </Link>
        
        {Object.entries(categories).map(([key, category]) => (
          <div key={key} className="space-y-2">
            <button
              onClick={() => toggleDropdown(key)}
              className="flex items-center justify-between w-full text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              {category.title}
              <ChevronDown 
                className={cn(
                  "h-4 w-4 transition-transform",
                  activeDropdown === key && "rotate-180"
                )}
              />
            </button>
            
            {activeDropdown === key && (
              <div className="pl-4 space-y-2">
                <Link
                  href={`/products/${key}`}
                  className="block text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={onItemClick}
                >
                  All {category.title}
                </Link>
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory}
                    href={`/products/${key}/${subcategory.toLowerCase()}`}
                    className="block text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={onItemClick}
                  >
                    {subcategory} {category.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <Link 
          href="/about" 
          className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          onClick={onItemClick}
        >
          About
        </Link>
        <Link 
          href="/contact" 
          className="text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors"
          onClick={onItemClick}
        >
          Contact
        </Link>
      </nav>
    )
  }

  return (
    <nav className="flex items-center space-x-8">
      <Link 
        href="/" 
        className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
      >
        Home
      </Link>
      
      <Link 
        href="/products" 
        className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
      >
        All Products
      </Link>
      
      {Object.entries(categories).map(([key, category]) => (
        <div
          key={key}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(key)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            href={`/products/${key}`}
            className="flex items-center space-x-1 text-gray-900 hover:text-gray-600 transition-colors font-medium"
          >
            <span>{category.title}</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
          
          {activeDropdown === key && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link
                href={`/products/${key}`}
                className="block px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors font-medium"
              >
                All {category.title}
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory}
                  href={`/products/${key}/${subcategory.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  {subcategory} {category.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      
      <Link 
        href="/about" 
        className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
      >
        About
      </Link>
      
      <Link 
        href="/contact" 
        className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
      >
        Contact
      </Link>
    </nav>
  )
}
