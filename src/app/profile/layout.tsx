import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Profile | GroomAI',
  description: 'Manage your GroomAI profile, view appointment history, and adjust settings.',
}
export default function ProfileLayout({ children }: { children: React.ReactNode }) { return children }
