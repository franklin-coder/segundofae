
import { RotateCcw, Clock, Package, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

const ReturnsContent = () => {
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
              <BreadcrumbPage>Returns & Exchanges</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#0A8E81]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <RotateCcw className="h-8 w-8 text-[#0A8E81]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
              Returns & Exchanges
            </h1>
            <p className="text-gray-600">
              Our hassle-free return policy for your peace of mind
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-8">
            {/* Return Policy Overview */}
            <div 
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Return Policy Overview
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">30-Day Return Window</strong>: You have 30 days from the date of delivery to return items for a full refund
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Easy Returns</strong>: We want you to love your jewelry! If you're not completely satisfied, returns are simple and hassle-free
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Condition Requirements</strong>: Items must be in original condition, unworn, and in original packaging
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Custom Orders</strong>: Custom and personalized items cannot be returned unless there's a defect or error on our part
                </p>
              </div>
            </div>

            {/* What Can Be Returned */}
            <div 
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  What Can Be Returned
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Ready-to-ship jewelry</strong> in original condition and packaging
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Gift items</strong> with original receipt or order number
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Items with manufacturing defects</strong> - we'll cover all return shipping costs
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Wrong items sent</strong> - we'll arrange immediate exchange and cover all costs
                </p>
              </div>
            </div>

            {/* Items That Cannot Be Returned */}
            <div 
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Items That Cannot Be Returned
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Custom or personalized items</strong> (unless defective or incorrectly made)
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Items worn or damaged</strong> by the customer
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Items without original packaging</strong> or tags
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Items returned after 30 days</strong> from delivery date
                </p>
              </div>
            </div>

            {/* How to Return Items */}
            <div 
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <Package className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  How to Return Items
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Contact Us First</strong>: Email us at faelightcrafts@gmail.com with your order number and reason for return
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Return Authorization</strong>: We'll provide a return authorization number and instructions
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Package Securely</strong>: Use original packaging when possible, and pack items carefully to prevent damage
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Ship Back</strong>: Use the prepaid return label we provide (for defective items) or ship at your expense
                </p>
              </div>
            </div>

            {/* Refunds & Processing */}
            <div 
              className="bg-white rounded-lg p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0A8E81]/10 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-[#0A8E81]" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Refunds & Processing
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Refund Timeline</strong>: Refunds are processed within 3-5 business days after we receive your return
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Original Payment Method</strong>: Refunds are issued to the original payment method used for purchase
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Return Shipping</strong>: Customer pays return shipping unless the item was defective or incorrectly sent
                </p>
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-gray-900">Inspection Period</strong>: We may take 1-2 business days to inspect returned items before processing refund
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-12 space-y-6">
            {/* Exchange Policy */}
            <div 
              className="bg-[#0A8E81]/5 rounded-lg p-6 border border-[#0A8E81]/10"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Exchange Policy
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Exchanges are available for different sizes or colors of the same item (when applicable)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Contact us first to check availability of exchange items</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Price differences for exchanges must be paid before shipping</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Exchange shipping fees apply unless the original item was defective</span>
                </li>
              </ul>
            </div>

            {/* Damaged or Defective Items */}
            <div 
              className="bg-[#0A8E81]/5 rounded-lg p-6 border border-[#0A8E81]/10"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Damaged or Defective Items
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Contact us immediately if you receive a damaged or defective item</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Take photos of the damage and include them in your email to us</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>We'll arrange immediate replacement or full refund at no cost to you</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>We may ask you to return the defective item for quality control purposes</span>
                </li>
              </ul>
            </div>

            {/* Gift Returns */}
            <div 
              className="bg-[#0A8E81]/5 rounded-lg p-6 border border-[#0A8E81]/10"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gift Returns
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Gift recipients can return items with the original gift receipt or order information</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>Gift returns will be refunded as store credit unless the original purchaser requests a refund</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-[#0A8E81] rounded-full mt-2 flex-shrink-0" />
                  <span>We can also arrange exchanges for gifts to better suit the recipient's preferences</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact CTA */}
          <div 
            className="mt-12 text-center bg-white rounded-lg p-8 shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about our return policy or need clarification on anything, 
              please don't hesitate to reach out. We're here to help!
            </p>
            <a 
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-[#0A8E81] text-white rounded-full hover:bg-[#087267] transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnsContent
