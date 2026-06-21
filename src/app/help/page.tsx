'use client'
import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'Booking',
    questions: [
      { q: 'How do I book an appointment?', a: 'Search for a salon, select your service, choose a date and time, and confirm your booking. It takes less than 30 seconds.' },
      { q: 'Can I cancel a booking?', a: 'Yes. Go to My Bookings, find the appointment, and click Cancel. Cancellations made 2+ hours before the appointment are free.' },
      { q: 'How do I reschedule?', a: 'Cancel your existing booking and create a new one with the desired date and time.' },
      { q: 'Can I book for someone else?', a: 'Yes. Just enter their details during checkout. The booking confirmation will be sent to your email.' },
    ],
  },
  {
    category: 'Payment',
    questions: [
      { q: 'What payment methods are accepted?', a: 'We accept Credit/Debit Cards, UPI (GPay, PhonePe, Paytm), and Net Banking through our secure Razorpay integration.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All payments are processed through Razorpay, a PCI-DSS compliant payment gateway. We never store your card details.' },
      { q: 'What is the cancellation/refund policy?', a: 'Free cancellation up to 2 hours before the appointment. Late cancellations may incur a 50% charge.' },
    ],
  },
  {
    category: 'Account',
    questions: [
      { q: 'How do I sign up?', a: 'Click Sign In and use your Google account. No separate registration needed.' },
      { q: 'How do I reset my password?', a: 'Since we use Google Sign-In, your Google account password handles authentication. Manage it through your Google account settings.' },
      { q: 'How do I delete my account?', a: 'Contact us at support@groomai.app with your registered email. We will process the request within 48 hours.' },
    ],
  },
  {
    category: 'Salons',
    questions: [
      { q: 'How are salons curated?', a: 'We personally verify each salon for quality, hygiene, and service standards before listing them on the platform.' },
      { q: 'How do I leave a review?', a: 'After your visit, go to My Bookings, find the completed appointment, and click Write Review.' },
      { q: 'Can I suggest a salon?', a: 'Absolutely! Email us at hello@groomai.app with the salon name and location.' },
    ],
  },
]

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [openCategory, setOpenCategory] = useState<string | null>('Booking')
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({})

  const filtered = faqs.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      q.q.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.questions.length > 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          <span className="text-[#C9A84C]">Help</span> Center
        </h1>
        <p className="text-gray-400">Find answers to common questions about booking, payments, and more.</p>
      </div>

      <div className="relative max-w-xl mx-auto mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search help articles..."
          className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <HelpCircle size={40} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500">No results found for &quot;{search}&quot;</p>
          <button onClick={() => setSearch('')} className="text-[#C9A84C] text-sm mt-2 hover:underline">Clear search</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(cat => (
            <div key={cat.category} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              <button onClick={() => setOpenCategory(openCategory === cat.category ? null : cat.category)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#1a1a1a] transition-colors">
                <h2 className="text-white font-semibold">{cat.category}</h2>
                {openCategory === cat.category ? <ChevronUp size={18} className="text-[#C9A84C]" /> : <ChevronDown size={18} className="text-gray-500" />}
              </button>
              {openCategory === cat.category && (
                <div className="border-t border-[#1a1a1a]">
                  {cat.questions.map((item, i) => (
                    <div key={i} className="border-b border-[#1a1a1a] last:border-0">
                      <button onClick={() => setOpenQuestions(prev => ({ ...prev, [`${cat.category}-${i}`]: !prev[`${cat.category}-${i}`] }))}
                        className="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-[#1a1a1a]/50 transition-colors">
                        <span className="text-sm text-gray-300">{item.q}</span>
                        {openQuestions[`${cat.category}-${i}`] ? <ChevronUp size={14} className="text-[#C9A84C]" /> : <ChevronDown size={14} className="text-gray-500" />}
                      </button>
                      {openQuestions[`${cat.category}-${i}`] && (
                        <div className="px-6 pb-4">
                          <p className="text-sm text-gray-500 border-l-2 border-[#C9A84C] pl-4">{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <p className="text-gray-500 text-sm mb-4">Still need help?</p>
        <Link href="/about"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-black px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#b8963e] transition-colors">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
