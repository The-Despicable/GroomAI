import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GroomAI',
  description: 'AI-powered salon booking platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0A] text-white pb-32 lg:pb-0`}>
        <Navbar />
        <main className="min-h-screen pt-20 lg:pt-16">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}