'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { signInWithGoogle } from '@/lib/firebase'
import { createBooking } from '@/lib/api'
import { Lock, CreditCard, Smartphone, Building2 } from 'lucide-react'

const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

const paymentMethods = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
]

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const salonId = params.get('salonId') || ''
  const service = params.get('service') || ''
  const price = params.get('price') || '0'
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)

  async function handlePay() {
    if (!user) { await signInWithGoogle(); return }
    if (!date || !time) { alert('Select date and time'); return }
    setProcessing(true)
    try {
      const booking = await createBooking({
        salon_id: salonId,
        service,
        price: Number(price),
        date,
        time,
        user_id: user.uid,
      })

      if (booking) {
        await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            appointmentId: booking.id,
            amount: Number(price),
            userId: user.uid,
          }),
        })
      }

      router.push('/bookings')
    } catch {
      alert('Payment failed. Please try again.')
    }
    setProcessing(false)
  }

  return (
    <>
      <h1 className="text-xl font-bold text-white mb-6">Checkout</h1>

      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 mb-6">
        <p className="text-sm text-gray-400">Service</p>
        <p className="text-white font-medium mt-0.5">{service}</p>
        <p className="text-[#C9A84C] font-semibold mt-1">₹{price}</p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-1.5 block">Time</label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setTime(t)}
                className={`py-2 rounded-xl text-sm border transition-colors ${
                  time === t ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">Payment Method</label>
        <div className="grid grid-cols-3 gap-2">
          {paymentMethods.map(m => (
            <button key={m.id} onClick={() => setPaymentMethod(m.id)}
              className={`flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm border transition-colors ${
                paymentMethod === m.id ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
              }`}>
              <m.icon size={16} />{m.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handlePay} disabled={processing}
        className="w-full bg-[#C9A84C] text-black font-semibold py-3.5 rounded-xl hover:bg-[#b8963e] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {processing ? (
          'Processing...'
        ) : (
          <><Lock size={16} />{user ? `Pay ₹${price}` : 'Sign In to Pay'}</>
        )}
      </button>

      <p className="text-center text-xs text-gray-600 mt-3">
        Secured by Razorpay. Your payment info is encrypted.
      </p>
    </>
  )
}

export default function CheckoutPage() {
  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
