
import { Metadata } from 'next'
import CheckoutForm from '@/components/checkout/checkout-form'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Checkout - FaeLight Crafts | Complete Your Purchase',
  description: 'Complete your handcrafted jewelry purchase with secure checkout. Fast and easy ordering at FaeLight Crafts.',
}

export default function CheckoutPage() {
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
              <BreadcrumbLink href="/cart">Cart</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Secure Checkout
          </h1>
          <p className="text-lg text-gray-600">
            Complete your order securely and safely
          </p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  )
}
