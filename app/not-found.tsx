
"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, Search, ArrowLeft, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-[150px] lg:text-[200px] font-bold text-[#0A8E81]/10 leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-[#0A8E81]/10 rounded-full flex items-center justify-center">
                  <Compass className="h-12 w-12 text-[#0A8E81]" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
            Page Not Found
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off like a piece of 
            thread from our macramé workspace. Let's get you back to the beautiful jewelry!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/">
              <Button 
                size="lg"
                className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full text-lg font-medium"
              >
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/products">
              <Button 
                variant="outline"
                size="lg"
                className="px-8 py-3 rounded-full text-lg font-medium"
              >
                <Search className="mr-2 h-5 w-5" />
                Browse Products
              </Button>
            </Link>
            
            <Button 
              variant="ghost"
              size="lg"
              onClick={() => window.history.back()}
              className="px-8 py-3 rounded-full text-lg font-medium"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Looking for something specific?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Link href="/products/necklaces" className="text-[#0A8E81] hover:underline">
                Necklaces
              </Link>
              <Link href="/products/earrings" className="text-[#0A8E81] hover:underline">
                Earrings
              </Link>
              <Link href="/products/bracelets" className="text-[#0A8E81] hover:underline">
                Bracelets
              </Link>
              <Link href="/products/anklets" className="text-[#0A8E81] hover:underline">
                Anklets
              </Link>
              <Link href="/about" className="text-[#0A8E81] hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="text-[#0A8E81] hover:underline">
                Contact
              </Link>
              <Link href="/shipping" className="text-[#0A8E81] hover:underline">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-[#0A8E81] hover:underline">
                Returns
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
