import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Salon Dashboard | GroomAI',
  description: 'Manage your salon appointments, customers, and revenue on GroomAI.',
}
export default function DashboardLayout({ children }: { children: React.ReactNode }) { return children }
