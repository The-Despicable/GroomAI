'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createBooking } from '@/lib/api'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user, signIn } = useAuth()
  const salonId = searchParams.get('salonId') || ''
  const service = searchParams.get('service') || ''
  const price = Number(searchParams.get('price')) || 0
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [processing, setProcessing] = useState(false)

  const handlePayment = async () => {
    if (!user) {
      await signIn()
      return
    }
    if (!date || !time) return

    setProcessing(true)

    try {
      const booking = await createBooking({
        salon_id: salonId,
        service,
        price,
        date,
        time,
        user_id: user.uid,
      })

      if (booking) {
        router.push('/bookings')
      } else {
        alert('Booking failed. Please try again.')
      }
    } catch {
      alert('Payment processing error.')
    }
    setProcessing(false)
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-white mb-6">Checkout</h2>
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Salon ID</span>
            <span className="text-white">{salonId}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Service</span>
            <span className="text-white">{service}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Price</span>
            <span className="text-[#C9A84C] font-bold">₹{price}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Select Date & Time</h3>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={processing || !date || !time}
        className="w-full bg-[#C9A84C] text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
      >
        {processing ? 'Processing...' : user ? `Pay ₹${price}` : 'Sign In to Book'}
      </button>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}