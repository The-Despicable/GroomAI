import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import { AuthProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GroomAI',
  description: 'AI-powered salon booking platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0A] text-white`}>
        <ClerkProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-20 lg:pt-16 pb-16">{children}</main>
            <BottomNav />
          </AuthProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
