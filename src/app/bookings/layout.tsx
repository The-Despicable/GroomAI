import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'My Bookings | GroomAI',
  description: 'View and manage your salon appointments on GroomAI.',
}
export default function BookingsLayout({ children }: { children: React.ReactNode }) { return children }
