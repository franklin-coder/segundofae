
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
                src="https://i.postimg.cc/yNnYg9xz/Dise-o-sin-t-tulo.png"
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
              <p className="text-lg text-gray-600 leading-relaxed">
                Here you'll find handmade treasures inspired by the magic of fantasy worlds. From crochet creatures and jewelry to soaps and unique decorations, every piece is created with love, imagination, and a touch of wonder. My goal is to bring a little sparkle and joy into your everyday life.
              </p>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutPreview
