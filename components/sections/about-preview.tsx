
"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Heart, Leaf, Users, Award } from 'lucide-react'
import Link from 'next/link'

const AboutPreview = () => {

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://i.etsystatic.com/58229756/r/il/f03e2c/6844052318/il_794xN.6844052318_d3ni.jpg"
                alt="FaeLight Crafts artisan at work"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

          </motion.div>

          {/* Content Side */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div id="about">
              <span className="text-[#0A8E81] font-medium text-lg">About FaeLight Crafts</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 mt-2" style={{ color: '#000000' }}>
                Artisan Jewelry from the Heart
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Welcome to FaeLight Crafts, where every piece tells a story of passion, 
                creativity, and craftsmanship. Based in beautiful Victoria, Canada, 
                I'm Julia, and I create handmade macramé jewelry that celebrates 
                the beauty of natural materials and traditional techniques.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                My journey began with a simple love for creating beautiful things with my hands. 
                Today, each piece represents hours of careful work, using time-honored 
                techniques and focusing on quality craftsmanship.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At FaeLight Crafts, we believe jewelry should be more than just an accessory - 
                it should be a reflection of your unique style and personality. Each piece 
                is thoughtfully designed and carefully crafted to bring beauty and meaning 
                to your everyday life.
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
