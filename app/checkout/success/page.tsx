
import { Metadata } from 'next'
import CheckoutSuccess from '@/components/checkout/checkout-success'

export const metadata: Metadata = {
  title: 'Order Confirmed - FaeLight Crafts | Thank You!',
  description: 'Your order has been successfully placed. Thank you for choosing FaeLight Crafts for your handcrafted jewelry.',
}

export default function CheckoutSuccessPage() {
  return <CheckoutSuccess />
}
