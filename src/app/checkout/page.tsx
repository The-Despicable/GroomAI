'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { auth, signInWithGoogle } from '@/lib/firebase'
import { createBooking } from '@/lib/api'

const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

export default function Checkout() {
  const params = useSearchParams()
  const router = useRouter()
  const salonId = params.get('salonId') || ''
  const service = params.get('service') || ''
  const price = params.get('price') || '0'
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePay() {
    const user = auth.currentUser
    if (!user) { await signInWithGoogle(); return }
    if (!date || !time) { alert('Select date and time'); return }
    setLoading(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
    script.onload = () => {
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Number(price) * 100,
        currency: 'INR',
        name: 'GroomAI',
        description: service,
        handler: async () => {
          await createBooking({ salonId, service, date, time, userId: user.uid, price: Number(price) })
          router.push('/bookings')
        },
        prefill: { name: user.displayName, email: user.email },
        theme: { color: '#C9A84C' },
      })
      rzp.open()
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold text-white mb-6">Checkout</h1>
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 mb-6">
        <p className="text-sm text-gray-400">Service</p>
        <p className="text-white font-medium mt-0.5">{service}</p>
        <p className="text-[#C9A84C] font-semibold mt-1">₹{price}</p>
      </div>
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Time</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setTime(t)}
                className={`py-2 rounded-xl text-sm border transition-colors ${time === t ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button onClick={handlePay} disabled={loading}
        className="w-full bg-[#C9A84C] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b8963e] transition-colors disabled:opacity-50">
        {loading ? 'Processing...' : `Pay ₹${price}`}
      </button>
    </div>
  )
}