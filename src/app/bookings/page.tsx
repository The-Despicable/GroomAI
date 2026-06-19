'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { getBookings, type Booking } from '@/lib/api'
import BookingCard from '@/components/BookingCard'

export default function BookingsPage() {
  const { user, loading: authLoading, signIn } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    getBookings(user.uid).then((data) => {
      setBookings(data)
      setLoading(false)
    })
  }, [user])

  if (authLoading) {
    return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Loading...</div>
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">My Bookings</h2>
        <p className="text-gray-500 mb-6">Sign in to view your bookings.</p>
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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6">My Bookings</h2>
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1A1A1A] rounded-2xl h-24 animate-pulse border border-gray-800" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No bookings yet.</p>
          <a href="/explore" className="mt-4 inline-block text-[#C9A84C] underline">
            Explore salons
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  )
}