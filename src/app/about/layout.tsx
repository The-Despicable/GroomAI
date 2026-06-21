import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'About | GroomAI',
  description: 'Hyderabad\'s premier AI-powered salon booking platform. Learn about our mission and team.',
}
export default function AboutLayout({ children }: { children: React.ReactNode }) { return children }
