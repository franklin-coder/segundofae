
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Gift } from 'lucide-react'

const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response?.ok) {
        setStatus('success')
        setMessage('Thank you for subscribing! Check your email for a welcome message.')
        setEmail('')
      } else {
        throw new Error('Subscription failed')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again later.')
    }
  }

  return (
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#0A8E81' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://img.freepik.com/premium-vector/abstract-light-background-small-circles-pixels-various-sizes-white-gray-colors_444390-11089.jpg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Mail className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Join Our Crafting Community
          </h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Get exclusive access to new collections, artisan insights, and special offers. 
            Plus, enjoy 10% off your first order when you subscribe!
          </p>

          {/* Subscription Form */}
          <motion.div 
            className="max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/50 h-12 text-lg"
                  disabled={status === 'loading'}
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="bg-white text-[#0A8E81] hover:bg-gray-100 px-8 py-3 text-lg font-medium transition-all duration-300 hover:scale-105 h-12"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                {status !== 'loading' && <Gift className="ml-2 h-5 w-5" />}
              </Button>
            </form>

            {/* Status Messages */}
            {message && (
              <motion.div 
                className={`mt-4 p-3 rounded-lg text-sm ${
                  status === 'success' 
                    ? 'bg-green-500/20 text-green-100' 
                    : 'bg-red-500/20 text-red-100'
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {message}
              </motion.div>
            )}
          </motion.div>

          {/* Benefits */}
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span>10% off first order</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Exclusive previews</span>
            </div>
            <div className="flex items-center gap-2">
              <span>✨</span>
              <span>Artisan insights</span>
            </div>
          </motion.div>

          <p className="text-xs opacity-70 mt-6">
            We respect your privacy and never spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsletterSection
