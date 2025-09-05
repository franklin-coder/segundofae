
"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Leaf, Users, Award, MapPin, Palette, Scissors, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AboutContent = () => {
  const values = [
    {
      icon: Heart,
      title: "Handcrafted with Love",
      description: "Every piece is made by hand with passion, care, and attention to detail. No mass production, just personal artistry."
    },
    {
      icon: Leaf,
      title: "Sustainable Materials",
      description: "We carefully source eco-friendly and ethically produced materials, supporting both the environment and artisan communities."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Based in Victoria, we're proud to be part of the local creative community and support other local artisans."
    },
    {
      icon: Award,
      title: "Quality Guaranteed",
      description: "Each piece is carefully inspected to ensure it meets our high standards of quality and craftsmanship."
    }
  ]

  const timeline = [
    {
      year: "2019",
      title: "The Beginning",
      description: "Julia discovered her passion for macramé while traveling through South America, learning traditional techniques from local artisans."
    },
    {
      year: "2020",
      title: "First Creations",
      description: "Started creating jewelry pieces for friends and family, quickly gaining recognition for unique designs and quality craftsmanship."
    },
    {
      year: "2022",
      title: "FaeLight Crafts Born",
      description: "Officially launched FaeLight Crafts in Victoria, BC, with a mission to bring handcrafted beauty to everyday wear."
    },
    {
      year: "2024",
      title: "Growing Community",
      description: "Expanded our collection and built a wonderful community of customers who appreciate handmade artistry."
    }
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ color: '#000000' }}>
          Meet Julia, the Heart Behind
          <span className="block text-[#0A8E81]">FaeLight Crafts</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          From the beautiful coastal city of Victoria, Canada, comes a story of passion, 
          creativity, and the timeless art of handcrafted jewelry making.
        </p>
      </motion.div>

      {/* Main Story Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-[#0A8E81]" />
            <span className="text-lg font-medium text-[#0A8E81]">Victoria, British Columbia</span>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            A Spanish Heart in Canadian Beauty
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Hola! I'm Julia, originally from Spain but now proudly calling Victoria, Canada my home. 
            My journey into jewelry making began during my travels through South America, where I fell 
            in love with the ancient art of macramé. The intricate knots, the meditative process, and 
            the beautiful results captivated my heart.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Each piece I create tells a story - sometimes of the ocean waves I see daily in Victoria, 
            sometimes of the Mediterranean warmth of my homeland, and always of the love and intention 
            I pour into every knot and detail.
          </p>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-[#0A8E81]">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#0A8E81]">5+</div>
                <div className="text-sm text-gray-600">Years Crafting</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Julia at work creating handmade jewelry"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#0A8E81] rounded-full flex items-center justify-center">
            <Palette className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Scissors className="h-6 w-6 text-[#0A8E81]" />
          </div>
        </motion.div>
      </div>

      {/* Values Section */}
      <motion.div 
        className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
            Our Core Values
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything we do is guided by these fundamental principles that shape 
            every piece we create and every relationship we build.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div 
              key={index}
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-[#0A8E81]/10 rounded-xl flex items-center justify-center">
                <value.icon className="h-6 w-6 text-[#0A8E81]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Section */}
      <div>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
            Our Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From a passion discovered while traveling to a thriving business 
            in beautiful Victoria, here's how FaeLight Crafts came to be.
          </p>
        </motion.div>

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <motion.div 
              key={index}
              className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-lg p-6 shadow-sm"
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-[#0A8E81] rounded-full flex items-center justify-center text-white font-bold text-lg">
                {item.year}
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Victoria Section */}
      <motion.div 
        className="bg-gradient-to-r from-[#0A8E81] to-[#087267] rounded-2xl p-8 lg:p-12 text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Why Victoria?
            </h2>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              Victoria's stunning natural beauty, vibrant arts community, and laid-back coastal 
              lifestyle provide the perfect inspiration for our creations. The city's commitment 
              to sustainability aligns perfectly with our values of ethical craftsmanship.
            </p>
            <p className="text-lg opacity-90 leading-relaxed">
              From the Inner Harbour to the Pacific coastline, every corner of this beautiful 
              city influences our designs and reminds us why we love calling this place home.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block bg-white/20 rounded-full p-8 mb-4">
              <MapPin className="h-16 w-16" />
            </div>
            <div className="text-2xl font-bold">Victoria, BC</div>
            <div className="opacity-90">Canada's Garden City</div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center bg-white rounded-2xl p-8 lg:p-12 shadow-lg"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center justify-center mb-6">
          <div className="flex -space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="h-8 w-8 text-yellow-400 fill-current"
              />
            ))}
          </div>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
          Ready to Find Your Perfect Piece?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Browse our collection of handcrafted jewelry, each piece made with love 
          and designed to celebrate your unique style and story.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button 
              size="lg"
              className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full text-lg"
            >
              Shop Our Collection
            </Button>
          </Link>
          <Link href="/contact">
            <Button 
              variant="outline"
              size="lg" 
              className="px-8 py-3 rounded-full text-lg"
            >
              Get in Touch
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default AboutContent
