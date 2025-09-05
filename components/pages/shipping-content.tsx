
"use client"

import { motion } from 'framer-motion'
import { Truck, Clock, Globe, Package, Shield, CreditCard } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const ShippingContent = () => {
  return (
    <div className="pt-20 min-h-screen" style={{ backgroundColor: '#FAF5EF' }}>
      <div className="container py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shipping Information</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-16 h-16 bg-[#0A8E81]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-8 w-8 text-[#0A8E81]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
              Shipping Information
            </h1>
            <p className="text-gray-600">
              Last updated: January 2024
            </p>
          </motion.div>

          {/* Main Sections */}
          <div className="space-y-8">
            {/* Shipping Methods & Times */}
            <motion.div 
              className="bg-white rounded-lg p-8 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Methods & Times
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Free Standard Shipping</strong> (Orders $50+): 5-7 business days within Canada, 7-10 business days to US
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Standard Shipping</strong>: $9.99 within Canada, $14.99 to US - 5-7 business days within Canada, 7-10 business days to US
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Express Shipping</strong>: $19.99 within Canada, $24.99 to US - 2-3 business days within Canada, 4-6 business days to US
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">International Shipping</strong>: Varies by location - Contact us for rates and estimated delivery times
                </p>
              </div>
            </motion.div>

            {/* Processing Time */}
            <motion.div 
              className="bg-white rounded-lg p-8 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Processing Time
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">In-Stock Items</strong>: Orders are typically processed and shipped within 1-2 business days
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Custom Orders</strong>: Please allow 2-3 weeks for custom pieces to be handcrafted before shipping
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Holiday Seasons</strong>: Processing times may be extended during peak seasons. We'll notify you of any delays
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Order Confirmation</strong>: You'll receive an email confirmation with tracking information once your order ships
                </p>
              </div>
            </motion.div>

            {/* Shipping Locations */}
            <motion.div 
              className="bg-white rounded-lg p-8 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Locations
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Canada</strong>: We ship to all provinces and territories across Canada
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">United States</strong>: We ship to all 50 states
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">International</strong>: We ship worldwide! Contact us for specific rates to your country
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Local Pickup</strong>: Available in Victoria, BC by appointment - contact us to arrange
                </p>
              </div>
            </motion.div>

            {/* Packaging & Protection */}
            <motion.div 
              className="bg-white rounded-lg p-8 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Packaging & Protection
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  All jewelry is carefully packaged in protective materials to ensure safe delivery
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Items are shipped in branded FaeLight Crafts packaging, perfect for gifting
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Fragile items receive extra padding and 'Handle with Care' labels
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We use eco-friendly packaging materials whenever possible
                </p>
              </div>
            </motion.div>

            {/* Shipping Costs */}
            <motion.div 
              className="bg-white rounded-lg p-8 shadow-sm"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Shipping Costs
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Free shipping</strong> on orders over $50 CAD within Canada and US
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Shipping costs are calculated at checkout based on your location and chosen shipping method
                </p>
                <p className="text-gray-600 leading-relaxed">
                  International shipping rates vary by destination and package size
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Any applicable duties, taxes, or customs fees are the responsibility of the recipient
                </p>
              </div>
            </motion.div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 space-y-6">
            <motion.div 
              className="bg-[#0A8E81]/5 rounded-lg p-6 border border-[#0A8E81]/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Important Notes
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Orders are processed Monday through Friday, excluding holidays</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Shipping times are estimates and may vary due to weather or other factors beyond our control</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>We are not responsible for delays caused by postal services or customs</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Please ensure your shipping address is accurate - we cannot be responsible for packages sent to incorrect addresses</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-[#0A8E81]/5 rounded-lg p-6 border border-[#0A8E81]/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tracking Your Order
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>You'll receive a tracking number via email once your order ships</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Track your package directly through Canada Post or your local postal service</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Contact us if you haven't received tracking information within 3 business days</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>For international orders, tracking may be limited once the package leaves Canada</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact CTA */}
          <motion.div 
            className="mt-12 text-center bg-white rounded-lg p-8 shadow-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about our shipping policies or need clarification on anything, 
              please don't hesitate to reach out. We're here to help!
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-[#0A8E81] text-white rounded-full hover:bg-[#087267] transition-colors font-medium"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ShippingContent
