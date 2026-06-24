import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import PageTransition from '@/components/PageTransition'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GroomAI — AI-Powered Salon Booking',
  description: 'Discover top-rated salons. AI-powered scheduling for the modern individual.',
  metadataBase: new URL('https://frontend-one-amber-82.vercel.app'),
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'GroomAI — AI-Powered Salon Booking',
    description: 'Discover top-rated salons. AI-powered scheduling for the modern individual.',
    url: 'https://frontend-one-amber-82.vercel.app',
    siteName: 'GroomAI',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'GroomAI' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GroomAI — AI-Powered Salon Booking',
    description: 'Discover top-rated salons. AI-powered scheduling for the modern individual.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A0A0A] text-white`}>
        <ClerkProvider>
          <Navbar />
          <main className="min-h-screen pt-20 lg:pt-16"><PageTransition>{children}</PageTransition></main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  )
}
