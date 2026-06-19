import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'GroomAI',
  description: 'AI-powered salon booking platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="pb-32 lg:pb-0">
        <Navbar />
        <main className="mt-[80px]">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}