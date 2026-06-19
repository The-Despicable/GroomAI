'use client'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signInWithGoogle } from '@/lib/firebase'
import { getBookings } from '@/lib/api'
import { CalendarDays } from 'lucide-react'

const statusColor: Record<string, string> = {
  upcoming: 'text-green-400',
  completed: 'text-gray-500',
  cancelled: 'text-red-400',
}

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getBookings(user.uid).then(data => {
      setBookings(data)
      setLoading(false)
    })
  }, [user])

  if (authLoading || loading) {
    return <div className="px-4 py-6 max-w-2xl mx-auto"><div className="h-32 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" /></div>
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <CalendarDays size={40} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to view your bookings</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">Sign In</button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-16">No bookings yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b: any) => (
            <div key={b.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{b.salon_name || b.salonName || 'Salon'}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{b.service}</p>
                  <p className="text-sm text-gray-500 mt-1">{b.date} · {b.time}</p>
                </div>
                <span className={`text-xs font-medium capitalize ${statusColor[b.status] || 'text-gray-400'}`}>{b.status}</span>
              </div>
              <div className="mt-2 text-right">
                <span className="text-[#C9A84C] font-semibold">₹{b.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}