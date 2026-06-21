import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Checkout | GroomAI',
  description: 'Complete your salon booking on GroomAI.',
}
export default function CheckoutLayout({ children }: { children: React.ReactNode }) { return children }
