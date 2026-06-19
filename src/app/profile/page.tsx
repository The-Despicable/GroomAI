'use client'
import { useEffect, useState } from 'react'
import { auth, signInWithGoogle, signOut } from '@/lib/firebase'
import { User } from 'firebase/auth'
import Link from 'next/link'
import { User as UserIcon, LogOut, CalendarDays } from 'lucide-react'

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => auth.onAuthStateChanged(setUser), [])

  if (!user) return (
    <div className="px-4 py-16 max-w-md mx-auto text-center">
      <UserIcon size={40} className="mx-auto text-gray-600 mb-4" />
      <p className="text-gray-400 mb-4">Sign in to view your profile</p>
      <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">Sign In with Google</button>
    </div>
  )

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        {user.photoURL ? <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full" /> : <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 flex items-center justify-center"><UserIcon size={28} className="text-[#C9A84C]" /></div>}
        <div>
          <p className="font-semibold text-white text-lg">{user.displayName}</p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Link href="/bookings" className="flex items-center gap-3 bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3.5 text-white hover:border-[#C9A84C]/30 transition-colors">
          <CalendarDays size={18} className="text-[#C9A84C]" /><span className="text-sm">My Bookings</span>
        </Link>
        <button onClick={signOut} className="flex items-center gap-3 bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3.5 text-red-400 hover:border-red-400/30 transition-colors">
          <LogOut size={18} /><span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  )
}