'use client'
import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { signInWithGoogle } from '@/lib/auth'
import { createBooking } from '@/lib/api'
import { Lock, CreditCard, Smartphone, Building2, User, X, Copy, Check, Loader } from 'lucide-react'

const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM']

const paymentMethods = [
  { id: 'card', label: 'Card', icon: CreditCard },
  { id: 'upi', label: 'UPI', icon: Smartphone },
  { id: 'netbanking', label: 'Net Banking', icon: Building2 },
]

const upiId = 'groomai@razorpay'

const netBankingBanks = [
  'SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank', 'PNB', 'Canara', 'Bank of Baroda',
]

function PaymentModal({ amount, onClose, onSuccess }: { amount: number; onClose: () => void; onSuccess: () => void }) {
  const [tab, setTab] = useState<'upi' | 'card' | 'netbanking'>('upi')
  const [upiInput, setUpiInput] = useState(upiId)
  const [copied, setCopied] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [selectedBank, setSelectedBank] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)

  function copyUpiId() {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleVerify() {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setVerified(true)
      setShowReceipt(true)
    }, 2000)
  }

  function formatCardNumber(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
    return digits
  }

  if (showReceipt) {
    const txnId = 'TXN' + Date.now().toString(36).toUpperCase()
    const refId = 'RZP' + Math.random().toString(36).slice(2, 10).toUpperCase()
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-[#0A0A0A] border border-[#1a1a1a] rounded-3xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
          <div className="bg-gradient-to-b from-green-600/20 to-transparent p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check size={32} className="text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Payment Successful</h2>
            <p className="text-[#C9A84C] font-bold text-2xl mt-2">₹{amount}</p>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Transaction ID</span><span className="text-white font-mono text-xs">{txnId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Reference</span><span className="text-white font-mono text-xs">{refId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment Method</span><span className="text-white capitalize">{tab === 'upi' ? 'UPI' : tab === 'card' ? 'Debit Card' : 'Net Banking'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-400 font-medium">Completed</span></div>
          </div>
          <div className="p-5 pt-0">
            <button onClick={() => { onSuccess(); onClose() }}
              className="w-full bg-gradient-to-r from-[#C9A84C] to-[#b8963e] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity">
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0A0A0A] border border-[#1a1a1a] rounded-3xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#C9A84C] rounded-full flex items-center justify-center">
              <span className="text-black text-[10px] font-bold">R</span>
            </div>
            <span className="text-sm font-semibold text-white">Razorpay</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#C9A84C] font-bold">₹{amount}</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-5 border-r border-[#1a1a1a] flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/qr-payment.jpeg" alt="UPI QR"
                className="w-48 h-48 object-cover rounded-2xl border border-[#222]" />
              <div className="absolute -top-1 -right-1 bg-[#C9A84C] text-[9px] text-black font-semibold px-1.5 py-0.5 rounded-full">
                UPI
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Scan with any UPI app</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-mono text-gray-300">{upiId}</span>
              <button onClick={copyUpiId}
                className="text-[#C9A84C] hover:text-[#d4b85a] transition-colors">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            {copied && <span className="text-[10px] text-green-400 mt-1">Copied!</span>}
          </div>

          <div className="p-5">
            <div className="flex border border-[#1a1a1a] rounded-xl overflow-hidden mb-5">
              {(['upi', 'card', 'netbanking'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                    tab === t ? 'bg-[#C9A84C] text-black' : 'text-gray-500 hover:text-white'
                  }`}>
                  {t === 'upi' ? 'UPI' : t === 'card' ? 'Card' : 'Net Banking'}
                </button>
              ))}
            </div>

            {tab === 'upi' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">Or enter UPI ID manually</p>
                <input type="text" value={upiInput} onChange={e => setUpiInput(e.target.value)}
                  className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50"
                  placeholder="example@upi" />
                <button onClick={handleVerify} disabled={verifying || !upiInput}
                  className="w-full bg-[#C9A84C] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
                  {verifying ? <><Loader size={16} className="animate-spin" /> Verifying...</> : <>Pay ₹{amount}</>}
                </button>
              </div>
            )}

            {tab === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Card Number</label>
                  <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50"
                    placeholder="1234 5678 9012 3456" maxLength={19} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Expiry</label>
                    <input type="text" value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50"
                      placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">CVV</label>
                    <input type="password" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50"
                      placeholder="•••" maxLength={3} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Cardholder Name</label>
                  <input type="text" value={cardName} onChange={e => setCardName(e.target.value)}
                    className="w-full bg-[#111] border border-[#222] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50"
                    placeholder="John Doe" />
                </div>
                <button onClick={handleVerify} disabled={verifying || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3}
                  className="w-full bg-[#C9A84C] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
                  {verifying ? <><Loader size={16} className="animate-spin" /> Processing...</> : <>Pay ₹{amount}</>}
                </button>
                <div className="flex items-center justify-center gap-1 text-[10px] text-gray-600">
                  <Lock size={10} /> Secured by Razorpay
                </div>
              </div>
            )}

            {tab === 'netbanking' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-400">Select your bank</p>
                <div className="grid grid-cols-2 gap-1.5 max-h-[200px] overflow-y-auto">
                  {netBankingBanks.map(b => (
                    <button key={b} onClick={() => setSelectedBank(b)}
                      className={`text-left px-3 py-2.5 rounded-lg text-sm border transition-colors ${
                        selectedBank === b ? 'border-[#C9A84C] bg-[#C9A84C]/10 text-white' : 'border-[#222] text-gray-400 hover:border-[#C9A84C]/50'
                      }`}>
                      {b}
                    </button>
                  ))}
                </div>
                <button onClick={handleVerify} disabled={verifying || !selectedBank}
                  className="w-full bg-[#C9A84C] text-black font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2">
                  {verifying ? <><Loader size={16} className="animate-spin" /> Processing...</> : <>Pay ₹{amount}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutContent() {
  const params = useSearchParams()
  const router = useRouter()
  const { isSignedIn, user } = useUser()
  const salonId = params.get('salonId') || ''
  const salonName = params.get('salonName') || 'Salon'
  const service = params.get('service') || ''
  const price = params.get('price') || '0'
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [phone, setPhone] = useState('')
  const [stylist, setStylist] = useState('')
  const [stylists, setStylists] = useState<any[]>([])
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [processing, setProcessing] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const servicePrice = Number(price)
  const tax = Math.round(servicePrice * 0.18)
  const total = servicePrice + tax

  useEffect(() => {
    if (salonId) {
      fetch(`/api/stylists?salonId=${salonId}`)
        .then(r => r.json())
        .then(data => setStylists(data))
        .catch(() => {})
    }
    const savedPhone = localStorage.getItem('groomai_phone') || ''
    if (savedPhone) setPhone(savedPhone)
  }, [salonId])

  async function handlePay() {
    if (!user) { await signInWithGoogle(); return }
    if (!date || !time) { alert('Select date and time'); return }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) { alert('Enter a valid 10-digit mobile number'); return }
    setShowPayment(true)
  }

  async function handlePaymentSuccess() {
    if (!user) return
    setShowPayment(false)
    setProcessing(true)
    try {
      const booking = await createBooking({
        salon_id: salonId,
        service,
        price: total,
        date,
        time,
        phone,
        status: 'upcoming',
        ...(stylist ? { stylist_id: stylist } : {}),
        user_id: user.id,
      })
      if (booking) {
        await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appointmentId: booking.id, amount: total, userId: user.id }),
        })
      }
      router.push('/bookings')
    } catch {
      alert('Booking failed. Please try again.')
    }
    setProcessing(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
      <div className="lg:col-span-3 space-y-5">
        <h1 className="text-xl font-bold text-white">Checkout</h1>

        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">Salon</p>
          <p className="text-white font-medium">{salonName}</p>
        </div>

        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white font-medium">{service}</p>
              <p className="text-xs text-gray-500 mt-0.5">30 min</p>
            </div>
            <p className="text-[#C9A84C] font-semibold">₹{servicePrice}</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Mobile Number</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit mobile number"
            maxLength={10}
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Time Slot</label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlots.map(t => (
              <button key={t} onClick={() => setTime(t)}
                className={`py-2 rounded-xl text-xs border transition-colors ${
                  time === t ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Preferred Stylist (optional)</label>
          <div className="grid grid-cols-2 gap-2">
            {stylists.length === 0 ? (
              <p className="text-gray-500 text-xs col-span-2 text-center py-4">No stylists available</p>
            ) : stylists.map((s: any) => (
              <button key={s.id} onClick={() => s.available !== false && setStylist(s.id)}
                disabled={s.available === false}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                  stylist === s.id
                    ? 'bg-[#C9A84C]/10 border-[#C9A84C]'
                    : s.available !== false
                      ? 'border-[#1a1a1a] hover:border-[#C9A84C]/50'
                      : 'border-[#1a1a1a] opacity-40 cursor-not-allowed'
                }`}>
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <User size={16} className="text-[#C9A84C]" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.rating} ★ · {(s.specializations || []).join(', ')}</p>
                  {s.available === false && <p className="text-xs text-red-400">Unavailable</p>}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
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
      </div>

      <div className="lg:col-span-2">
        <div className="bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-5 sticky top-24">
          <h2 className="text-white font-semibold mb-4">Booking Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Service</span>
              <span className="text-white">₹{servicePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tax (18%)</span>
              <span className="text-white">₹{tax}</span>
            </div>
            <div className="border-t border-[#1a1a1a] pt-3 flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-[#C9A84C] font-bold text-lg">₹{total}</span>
            </div>
          </div>
          <button onClick={handlePay} disabled={processing}
            className="w-full mt-5 bg-gradient-to-r from-[#C9A84C] to-[#b8963e] text-black font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            {processing ? 'Processing...' : <><Lock size={16} />{user ? `Pay ₹${total}` : 'Sign In to Pay'}</>}
          </button>
          <p className="text-center text-[10px] text-gray-600 mt-3">Secured by Razorpay</p>
        </div>
      </div>
      {showPayment && (
        <PaymentModal amount={total} onClose={() => setShowPayment(false)} onSuccess={handlePaymentSuccess} />
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <Suspense fallback={<div className="text-center py-8 text-gray-500">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}
