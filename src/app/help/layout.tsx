import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Help Center | GroomAI',
  description: 'Find answers to common questions about booking, payments, and account management on GroomAI.',
}
export default function HelpLayout({ children }: { children: React.ReactNode }) { return children }
