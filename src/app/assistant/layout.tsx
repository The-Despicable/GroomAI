import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'AI Assistant | GroomAI',
  description: 'Chat with GroomAI\'s AI assistant to find salons, book appointments, and get grooming advice.',
}
export default function AssistantLayout({ children }: { children: React.ReactNode }) { return children }
