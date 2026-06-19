'use client'

import Link from 'next/link'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, signIn, signOut } = useAuth()

  return (
    <header className="fixed top-0 left-0 w-full h-[80px] z-50 flex items-center px-4 bg-[#111]">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
        <Link href="/" className="text-[#C9A84C] text-2xl font-bold tracking-tight">
          GroomAI
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-white font-medium">Home</Link>
          <Link href="/explore" className="text-gray-400 hover:text-white transition">Explore</Link>
          <Link href="/bookings" className="text-gray-400 hover:text-white transition">Bookings</Link>
          <Link href="/assistant" className="text-gray-400 hover:text-white transition">AI</Link>
        </nav>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">{user.displayName || user.email}</span>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-lg bg-[#C9A84C] text-black font-medium text-sm hover:opacity-90 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={signIn}
            className="px-4 py-2 rounded-lg bg-[#C9A84C] text-black font-medium text-sm hover:opacity-90 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  )
}