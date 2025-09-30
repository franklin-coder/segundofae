
import Link from 'next/link'
import { Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-berkshire-swash">FaeLight Crafts</h3>
            <p className="text-gray-300">
              Handcrafted jewelry and accessories made with love in Victoria, Canada.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Products</h4>
            <div className="space-y-2">
              <Link href="/products/earrings" className="block text-gray-300 hover:text-white transition-colors">
                Earrings
              </Link>
              <Link href="/products/necklaces" className="block text-gray-300 hover:text-white transition-colors">
                Necklaces
              </Link>
              <Link href="/products/bracelets" className="block text-gray-300 hover:text-white transition-colors">
                Bracelets
              </Link>
              <Link href="/products" className="block text-gray-300 hover:text-white transition-colors">
                All Products
              </Link>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="block text-gray-300 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <div className="space-y-2">
              <Link href="/shipping" className="block text-gray-300 hover:text-white transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="block text-gray-300 hover:text-white transition-colors">
                Returns
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 FaeLight Crafts. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
