'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signInWithGoogle, signOut } from '@/lib/firebase'
import { User, CalendarDays, Clock, RotateCcw, LogOut, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

interface Appointment {
  id: string
  salonName: string
  serviceName: string
  stylistName: string
  date: string
  time: string
  price: number
  status: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [history, setHistory] = useState<Appointment[]>([])
  const [rebooking, setRebooking] = useState(false)

  useEffect(() => {
    if (user) {
      fetch(`/api/rebook?userId=${user.uid}`)
        .then(r => r.json())
        .then(data => setHistory(data))
        .catch(() => {})
    }
  }, [user])

  async function handleRebook(appointmentId: string) {
    setRebooking(true)
    try {
      const res = await fetch('/api/rebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid, appointmentId }),
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(prev => [data, ...prev])
        alert(`Rebooked! ${data.serviceName} at ${data.salonName} on ${data.date}`)
      }
    } catch {
      alert('Rebook failed')
    }
    setRebooking(false)
  }

  if (loading) {
    return <div className="px-4 py-6 max-w-2xl mx-auto"><div className="h-48 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" /></div>
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <User size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to view your profile</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">
          Sign In with Google
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <User size={28} className="text-[#C9A84C]" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{user.displayName || 'User'}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Link href="/bookings"
          className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#C9A84C]/30 transition-colors">
          <CalendarDays size={20} className="text-[#C9A84C] mb-2" />
          <p className="text-white font-medium text-sm">My Bookings</p>
          <p className="text-gray-500 text-xs mt-0.5">View all appointments</p>
        </Link>
        <Link href="/dashboard"
          className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#C9A84C]/30 transition-colors">
          <TrendingUp size={20} className="text-[#C9A84C] mb-2" />
          <p className="text-white font-medium text-sm">Salon Dashboard</p>
          <p className="text-gray-500 text-xs mt-0.5">Manage your salon</p>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Appointment History</h2>
          <RotateCcw size={16} className="text-gray-500" />
        </div>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No appointment history yet.</p>
            <Link href="/explore" className="text-[#C9A84C] text-sm mt-2 inline-block hover:underline">
              Book your first appointment
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map(a => (
              <div key={a.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{a.salonName}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{a.serviceName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Clock size={11} />
                      {a.date} · {a.time}
                      {a.stylistName && <span>· {a.stylistName}</span>}
                    </div>
                  </div>
                  <span className="text-[#C9A84C] font-semibold">₹{a.price}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {a.status === 'completed' && (
                    <button onClick={() => handleRebook(a.id)} disabled={rebooking}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-[#C9A84C]/10 text-[#C9A84C] py-1.5 rounded-lg hover:bg-[#C9A84C]/20 transition-colors disabled:opacity-50">
                      <RotateCcw size={12} />{rebooking ? 'Rebooking...' : 'Rebook'}
                    </button>
                  )}
                  <span className={`text-xs capitalize px-2 py-1 rounded-lg ${
                    a.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                    a.status === 'upcoming' ? 'bg-blue-400/10 text-blue-400' : 'bg-red-400/10 text-red-400'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={signOut}
        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-3 rounded-xl hover:bg-red-500/20 transition-colors text-sm">
        <LogOut size={16} />Sign Out
      </button>
    </div>
  )
}
