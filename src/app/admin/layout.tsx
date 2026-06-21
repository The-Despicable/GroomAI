import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Admin Panel | GroomAI',
  description: 'GroomAI admin dashboard for managing salons, users, bookings, and platform settings.',
}
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children }
