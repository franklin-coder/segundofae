
"use client"

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#FAF5EF] flex items-center justify-center z-50">
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-8">
          <div className="w-20 h-20 border-4 border-[#0A8E81]/20 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-[#0A8E81] rounded-full animate-spin"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-[#0A8E81] mb-2">
            FaeLight Crafts
          </h2>
          <p className="text-gray-600">
            Loading beautiful handcrafted jewelry...
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
