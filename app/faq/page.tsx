

"use client"

import { motion } from 'framer-motion'
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { HelpCircle, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const FAQPage = () => {
  const faqs = [
    {
      question: "How are your jewelry pieces made?",
      answer: "Each piece is handcrafted using traditional macramé techniques. I use high-quality cotton cords and natural materials to create unique, durable jewelry that reflects the beauty of handmade artistry."
    },
    {
      question: "How long does shipping take?",
      answer: "Orders typically ship within 3-5 business days. Shipping within Canada takes 5-7 business days, while international shipping may take 10-14 business days."
    },
    {
      question: "Can I customize a piece?",
      answer: "Absolutely! I love creating custom pieces. Please contact me with your ideas, preferred colors, and any specific requirements. Custom orders typically take 2-3 weeks to complete."
    },
    {
      question: "What materials do you use?",
      answer: "I primarily use high-quality cotton cords, natural fibers, wooden beads, and sterling silver findings. All materials are carefully selected for their durability and aesthetic appeal."
    },
    {
      question: "How do I care for my macramé jewelry?",
      answer: "To keep your jewelry looking beautiful, avoid getting it wet and store it in a dry place. For cleaning, gently brush with a soft brush or cloth. Avoid harsh chemicals and direct sunlight for extended periods."
    },
    {
      question: "Do you offer returns or exchanges?",
      answer: "Yes, I accept returns within 14 days of delivery if the item is in original condition. Custom pieces are not returnable unless there's a defect. Please contact me to initiate a return."
    },
    {
      question: "Are your pieces suitable for sensitive skin?",
      answer: "Yes, I use hypoallergenic materials including sterling silver findings and natural cotton cords. However, if you have specific allergies, please let me know before ordering."
    },
    {
      question: "How do I determine the right size?",
      answer: "Most of my necklaces and bracelets are adjustable. For specific sizing questions or if you need a custom size, please don't hesitate to contact me with your measurements."
    },
    {
      question: "Do you participate in local markets?",
      answer: "Yes! I regularly participate in local artisan markets in Victoria. Follow our social media or check back here for upcoming market dates and locations."
    },
    {
      question: "Can I wholesale your products?",
      answer: "I do work with select retailers. If you're interested in carrying FaeLight Crafts jewelry in your store, please contact me to discuss wholesale opportunities and requirements."
    }
  ]

  return (
    <div className="pt-16 lg:pt-20">
      <section className="py-20" style={{ backgroundColor: '#FAF5EF' }}>
        <div className="container max-w-4xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <HelpCircle className="h-8 w-8 text-[#0A8E81] mr-3" />
              <span className="text-lg font-medium text-[#0A8E81]">Support</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#000000' }}>
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Have questions about FaeLight Crafts jewelry? Find answers to common 
              questions below, or feel free to contact me directly.
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white rounded-lg border border-gray-200 px-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#0A8E81] transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            className="text-center mt-16 p-8 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <MessageCircle className="h-12 w-12 text-[#0A8E81] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#000000' }}>
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              I'm here to help! Don't hesitate to reach out if you need more information 
              or have specific questions about my jewelry.
            </p>
            <Link href="/contact">
              <Button 
                size="lg"
                className="bg-[#0A8E81] hover:bg-[#087267] text-white px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Contact Me
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage

