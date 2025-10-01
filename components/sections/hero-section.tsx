
"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Single Background Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(/hero_image_optimized.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/0.5" />
      </div>

      {/* Content 
      <div className="relative z-10 text-center px-4 max-w-4xl" style={{ color: '#FAF5EF' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-[#0A8E81] mr-3" />
            <span className="text-lg font-medium text-[#0A8E81]">FaeLight Crafts</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Handcrafted with 
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 opacity-90 font-light">
            Unique artisan jewelry created in Victoria, Canada
          </p>
          
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of handmade macramé jewelry, where each piece tells a story of craftsmanship and creativity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <Button 
                size="lg" 
                className="bg-[#0A8E81] hover:bg-[#087267] px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
                style={{ color: '#FAF5EF' }}
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            
            <Link href="#about">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/50 hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
                style={{ color: '#000000', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
              >
                Our Story
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>*/}
    </section>
  )
}

export default HeroSection
