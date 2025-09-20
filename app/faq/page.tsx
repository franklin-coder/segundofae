

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
      question: "Are all your creations handmade?",
      answer: "Yes. Every item in Faelight Crafts is carefully handmade — from crochet earrings and creatures to jewelry, soaps, and decorations. Each piece is unique, which means no two are ever exactly alike."
    },
    {
      question: "Do you take custom orders?",
      answer: "At the moment, custom orders are open. If you have a special request, feel free to reach out through the contact page or Instagram — I'll let you know if it's possible."
    },
    {
      question: "What materials do you use?",
      answer: "I use a mix of quality yarns, threads, glass, acrilyc beads and hypoalergenic metals, . Whenever possible, I choose sustainable or responsibly sourced materials, though availability may vary."
    },
    {
      question: "How do I care for my item?",
      answer: "Each creation is delicate and best treated with care. For crochet pieces: hand-wash gently and lay flat to dry. For jewelry: keep away from water and store in a dry place. Every order comes with simple care instructions."
    },
    {
      question: "Where do you ship?",
      answer: "Worldwide!. Shipping options and prices will be available at checkout."
    },
    {
      question: "How long will my order take to arrive?",
      answer: "Since each item is handmade, processing may take 3–5 business days before shipping. Delivery times vary by location and shipping method chosen."
    },
    {
      question: "Do you sell at markets or only online?",
      answer: "Both! Faelight Crafts can be found at local markets and fairs, as well as here in the online store. Follow me on Instagram for upcoming events."
    },
    {
      question: "What if the item I love is sold out?",
      answer: "Many creations are one of a kind, so once sold, they may not return. However, similar designs or new variations are always in the works — check back often or reach out to see what's coming next."
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

