
import { Metadata } from 'next'
import CartDetails from '@/components/cart/cart-details'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Shopping Cart - FaeLight Crafts | Review Your Items',
  description: 'Review your handcrafted jewelry selections and proceed to checkout. Secure shopping with FaeLight Crafts.',
}

export default function CartPage() {
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
              <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ color: '#000000' }}>
            Your Shopping Cart
          </h1>
          <p className="text-lg text-gray-600">
            Review your beautiful handcrafted selections
          </p>
        </div>

        <CartDetails />
      </div>
    </div>
  )
}
