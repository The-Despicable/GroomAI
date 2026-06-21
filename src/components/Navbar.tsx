'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import { ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [showMore, setShowMore] = useState(false)

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
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
          <Link href="/profile" className="text-gray-400 hover:text-white transition">Profile</Link>
          <div className="relative">
            <button onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition text-sm">
              More <ChevronDown size={14} />
            </button>
            {showMore && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMore(false)} />
                <div className="absolute top-full right-0 mt-2 w-40 bg-[#1a1a1a] border border-[#333] rounded-xl py-2 z-20">
                  <Link href="/about" onClick={() => setShowMore(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#222]">About</Link>
                  <Link href="/help" onClick={() => setShowMore(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#222]">Help</Link>
                  <Link href="/terms" onClick={() => setShowMore(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#222]">Terms</Link>
                  <Show when="signed-in">
                    <Link href="/admin" onClick={() => setShowMore(false)} className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#222]">Admin</Link>
                  </Show>
                </div>
              </>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="px-4 py-2 rounded-lg bg-[#C9A84C] text-black font-medium text-sm hover:opacity-90 transition">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: 'w-8 h-8',
                  userButtonTrigger: 'focus:shadow-none',
                }
              }}
            />
          </Show>
        </div>
      </div>
    </header>
  )
}
