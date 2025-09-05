
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Clock, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["creations.faelight@gmail.com"],
      note: "We reply within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (250) 889-9919"],
      note: "Mon-Fri, 9AM-5PM PST"
    }
  ]

  const faqs = [
    {
      question: "How long does it take to create a custom piece?",
      answer: "Custom pieces typically take 2-3 weeks to complete, depending on complexity. We'll provide an estimated timeline when you place your order."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide. Shipping costs and times vary by location. Contact us for specific rates to your country."
    },
    {
      question: "What materials do you use in your jewelry?",
      answer: "We use high-quality, sustainable materials including cotton cord, natural beads, sterling silver findings, and ethically sourced stones."
    },
    {
      question: "Can I visit your studio in Victoria?",
      answer: "Absolutely! We love meeting customers in person. Please contact us to schedule an appointment, as we work by appointment only."
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response?.ok) {
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-20">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl lg:text-6xl font-bold mb-6" style={{ color: '#000000' }}>
          Get In Touch
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Have questions about our handcrafted jewelry? Want to discuss a custom piece? 
          We'd love to hear from you! Reach out and let's create something beautiful together.
        </p>
      </motion.div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contactInfo.map((info, index) => (
          <motion.div 
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="w-12 h-12 bg-[#0A8E81]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <info.icon className="h-6 w-6 text-[#0A8E81]" />
            </div>
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              {info.title}
            </h3>
            <div className="space-y-1 text-gray-600 mb-3">
              {info.details.map((detail, i) => (
                <p key={i} className="text-sm">{detail}</p>
              ))}
            </div>
            <p className="text-xs text-[#0A8E81] font-medium">
              {info.note}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Contact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="h-6 w-6 text-[#0A8E81]" />
              <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <Button 
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <select 
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="custom">Custom Order</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="mt-1 min-h-[120px]"
                    placeholder="Tell us about your inquiry, custom design ideas, or any questions you have..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0A8E81] hover:bg-[#087267] text-white py-3"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-[#0A8E81]/10 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for? We're here to help! 
              Send us a message and we'll get back to you as soon as possible.
            </p>
            <p className="text-sm text-[#0A8E81] font-medium">
              Average response time: Less than 24 hours
            </p>
          </div>
        </motion.div>
      </div>


    </div>
  )
}

export default ContactContent
