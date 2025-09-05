
"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Search, User, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Necklaces', href: '/products/necklaces' },
    { name: 'Earrings', href: '/products/earrings' },
    { name: 'Bracelets', href: '/products/bracelets' },
    { name: 'And More', href: '/products/and-more' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-sm shadow-lg' 
        : 'bg-black'
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-12 h-12 lg:w-16 lg:h-16">
              <Image
                src="/images/logo/faelight-logo.jpg"
                alt="FaeLight Crafts Logo"
                fill
                className="object-contain rounded-full"
                sizes="64px"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold" style={{ color: '#FAF5EF' }}>
                FaeLight Crafts
              </h1>
              <p className="text-xs" style={{ color: '#FAF5EF', opacity: 0.8 }}>Artisan Jewelry</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-medium transition-colors hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Commented out icons as requested
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:flex hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
              <Heart className="h-5 w-5" />
            </Button>
            */}
            
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span 
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs font-bold text-white flex items-center justify-center"
                    style={{ backgroundColor: '#0A8E81' }}
                  >
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-black border-gray-800">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-lg font-medium transition-colors py-2 hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <hr className="my-4 border-gray-700" />
                  {/* Commented out mobile icons as requested
                  <div className="flex space-x-4">
                    <Button variant="ghost" size="icon" className="hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
                      <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
                      <User className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-[#0A8E81]" style={{ color: '#FAF5EF' }}>
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  */}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
