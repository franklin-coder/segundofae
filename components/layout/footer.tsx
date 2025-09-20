
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#0A8E81] mt-20" style={{ color: '#FAF5EF' }}>
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/logo/faelight-logo.jpg"
                  alt="FaeLight Crafts"
                  fill
                  className="object-contain rounded-full"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="font-bold text-xl">FaeLight Crafts</h3>
                <p className="text-sm opacity-80">Artisan Jewelry</p>
              </div>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Handcrafted jewelry and accessories created with love in Victoria, Canada. 
              Each piece tells a unique story of artisanal excellence and creative passion.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/products/necklaces" className="text-sm opacity-90 hover:opacity-100 transition-opacity">Necklaces</Link></li>
              <li><Link href="/products/earrings" className="text-sm opacity-90 hover:opacity-100 transition-opacity">Earrings</Link></li>
              <li><Link href="/products/bracelets" className="text-sm opacity-90 hover:opacity-100 transition-opacity">Bracelets</Link></li>
              <li><Link href="/products/and-more" className="text-sm opacity-90 hover:opacity-100 transition-opacity">And More</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Customer Care</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm opacity-90 hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link href="/contact" className="text-sm opacity-90 hover:opacity-100 transition-opacity">Contact</Link></li>
              <li><Link href="/shipping" className="text-sm opacity-90 hover:opacity-100 transition-opacity">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-sm opacity-90 hover:opacity-100 transition-opacity">Returns</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 opacity-80" />
                <span className="text-sm opacity-90">Victoria, BC, Canada</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="text-sm opacity-90">faelightcrafts@gmail.com</span>
              </div>
            </div>
            
            <div className="flex space-x-4 pt-2">
              <a href="https://www.instagram.com/p/DL04qoeS6A_/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <p className="text-sm opacity-80">
              © {new Date().getFullYear()} FaeLight Crafts. All rights reserved.
            </p>
            <p className="text-sm opacity-80">
              Made with ❤️ by Julia in Victoria, Canada
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
