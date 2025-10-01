"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Heart, Leaf, Users, Award, MapPin, Palette, Scissors, Star, Sparkles, Coffee, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const AboutContent = () => {
  const values = [
    {
      icon: Sparkles,
      title: "Imagination as Craft",
      description: "Every creation is born from a story. Inspired by myth and fantasy, each piece carries a sense of artistry that invites you to step beyond the ordinary.."
    },
    {
      icon: Heart,
      title: "Authenticity in Craftsmanship",
      description: "Handmade with care, every item is unique. Patience, detail, and dedication are woven into each creation, offering something truly one of a kind."

    },
    {
      icon: Users,
      title: "A World of Fantasy, Within Reach",
      description: "Faelight Crafts exists to bring subtle enchantment into daily life — treasures that awaken wonder and carry the quiet elegance of a high-fantasy realm."

    },
    {
      icon: Leaf,
      title: "Respect for Materials, Vision for Growth",
      description: "Thoughtful choices guide the way we source and create. As Faelight grows, so will our commitment to sustainable practices, ensuring beauty is crafted with integrity."
    }
  ]

  const timeline = [
    {
      year: "A Creative Beginning",
      title: "The Spark",
      description: "It all began with a love for magical stories and the joy of crafting with my own hands. From crochet creatures to tiny handmade treasures, each piece carried a bit of my love fot those things."
    },
    {
      year: "Expanding Horizons",
      title: "The Craft Grows",
      description: "Soon, what began as a pastime turned into endless hours of creativity — making jewelry, clothes, and enchanted decorations. Each creation carried its own story, and little by little, Faelight Crafts took shape."
    },
    {
      year: "Building Community ",
      title: "Sharing the Magic",
      description: "Markets, fairs, and social media became the bridges to share this magic. Meeting people who connected with my work showed me that this dream had a place in the world."
    },
    {
      year: "A Thriving Dream",
      title: "Faelight Today",
      description: "Now, Faelight Crafts is more than just a shop. It is a home for handmade wonders inspired by fantasy — a place where faes, dragons, and dreamers can all find a treasure made with love."
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
          About the Crafter
          <span className="block text-[#0A8E81]"> </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Hi, I’m Julia—the maker behind Faelight Crafts. I’ve always loved creating, and what started as a little hobby has become my favorite way of sharing joy and imagination with others.
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
            <Coffee className="h-6 w-6 text-[#0A8E81]" />
            <span className="text-lg font-medium text-[#0A8E81]">Made with Love & Coffee</span>
          </div>
          
          {/* <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Handcrafted Magic, One Piece at a Time
          </h2> */}
          
          <p className="text-lg text-gray-600 leading-relaxed">
            From crochet creatures to sparkling resin pieces and playful bookmarks, I make each item by hand with love (and often a cup of coffee by my side). Your support truly means the world—it lets me keep doing what I love and sprinkle a bit of magic into everyday life.
          </p>
          
          <p className="text-lg text-gray-600 leading-relaxed">
            Thank you for being here!.
          </p>

          <div className="bg-gradient-to-r from-[#0A8E81]/10 to-purple-100 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Instagram className="h-5 w-5 text-[#0A8E81]" />
              <span className="font-semibold text-gray-900">Stay Connected!</span>
            </div>
            <p className="text-gray-600 mb-3">
              Let's stay connected! You can find me on Instagram @faelight.crafts for behind-the-scenes, new creations, and a little extra sparkle.
            </p>
            <Link href="https://instagram.com/faelight.crafts" target="_blank" rel="noopener noreferrer">
              <Button 
                variant="outline" 
                size="sm"
                className="text-[#0A8E81] border-[#0A8E81] hover:bg-[#0A8E81] hover:text-white"
              >
                Follow @faelight.crafts
              </Button>
            </Link>
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
              src="https://i.postimg.cc/SsjDmvmc/julia.png"
              alt="Julia creating handmade crafts with love"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          
          {/* Floating elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#0A8E81] rounded-full flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Coffee className="h-6 w-6 text-[#0A8E81]" />
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
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These fundamental principles guide every creation and shape the magical experience 
            we strive to bring to each and every piece.
          </p> */}
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
            From a simple spark of creativity to a thriving craft business, 
            here's how Faelight Crafts grew into the magical experience it is today.
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
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#0A8E81] to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm text-center p-2">
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

      {/* Magic & Community Section */}
      <motion.div 
        className="newFont bg-gradient-to-r from-[#0A8E81] to-purple-600 rounded-2xl p-8 lg:p-12 text-white"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Spreading Magic, One Creation at a Time
            </h2>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              Every piece I create is infused with love, imagination, and a touch of magic. 
              Whether it's a cuddly crochet creature, a sparkling resin bookmark, or any other 
              handmade treasure, each item is designed to bring joy and wonder to your world.
            </p>
            <p className="text-lg opacity-90 leading-relaxed">
              Your support means everything to me—it allows me to continue doing what I love 
              and sharing these magical moments with an amazing community of fellow dreamers and magic-lovers.
            </p>
          </div>
          <div className="text-center">
            <div className="inline-block bg-white/20 rounded-full p-8 mb-4">
              <Sparkles className="h-16 w-16" />
            </div>
            <div className="newFont text-2xl font-bold">Handmade with Love</div>
            <div className="opacity-90">& a Cup of Coffee</div>
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
          Ready to Add Some Magic to Your Life?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore our collection of handcrafted treasures, each piece made with love 
          and designed to bring joy, imagination, and a touch of magic to your everyday adventures.
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