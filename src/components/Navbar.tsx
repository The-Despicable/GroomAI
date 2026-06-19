'use client'
import Link from 'next/link'
import { signInWithGoogle, signOut } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const { user, loading } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A] border-b border-[#1a1a1a] px-4 h-14 flex items-center justify-between">
      <Link href="/" className="text-[#C9A84C] font-bold text-lg tracking-tight">GroomAI</Link>
      <div className="hidden md:flex gap-6 text-sm text-gray-400">
        <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
        <Link href="/bookings" className="hover:text-white transition-colors">Bookings</Link>
        <Link href="/assistant" className="hover:text-white transition-colors">AI</Link>
        <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
      </div>
      {loading ? null : user ? (
        <button onClick={signOut} className="text-sm text-gray-400 hover:text-white transition-colors">Sign Out</button>
      ) : (
        <button onClick={signInWithGoogle} className="text-sm bg-[#C9A84C] text-black px-3 py-1.5 rounded-lg font-medium hover:bg-[#b8963e] transition-colors">Sign In</button>
      )}
    </nav>
  )
}