
import { Metadata } from 'next'
import CheckoutCancel from '@/components/checkout/checkout-cancel'

export const metadata: Metadata = {
  title: 'Checkout Cancelled - FaeLight Crafts',
  description: 'Your checkout was cancelled. Your cart items are still saved.',
}

export default function CheckoutCancelPage() {
  return <CheckoutCancel />
}
