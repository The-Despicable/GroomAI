'use client'

import { useAuth } from '@/hooks/useAuth'
import { User, Mail, LogOut, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading, signIn, signOut } = useAuth()

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
          <User size={36} className="text-gray-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-gray-500 mb-6">Sign in to view your profile.</p>
        <button
          onClick={signIn}
          className="bg-[#C9A84C] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
        >
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 bg-[#C9A84C]/20 rounded-full flex items-center justify-center">
              <User size={28} className="text-[#C9A84C]" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-white">{user.displayName || 'User'}</h2>
            <p className="text-gray-400 text-sm">{user.email}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-400">
            <Mail size={16} />
            <span className="text-sm">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <User size={16} />
            <span className="text-sm">{user.uid}</span>
          </div>
        </div>
      </div>

      <Link
        href="/bookings"
        className="flex items-center justify-between bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 mb-4 hover:border-[#C9A84C] transition"
      >
        <div className="flex items-center gap-3">
          <Calendar size={20} className="text-[#C9A84C]" />
          <span className="text-white">My Bookings</span>
        </div>
        <span className="text-gray-500">&rarr;</span>
      </Link>

      <button
        onClick={signOut}
        className="w-full flex items-center justify-center gap-2 bg-red-900/30 text-red-400 border border-red-800 rounded-xl py-4 font-medium hover:bg-red-900/50 transition"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  )
}