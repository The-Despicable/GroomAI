'use client'
import { useState } from 'react'
import Link from 'next/link'

type LegalTab = 'terms' | 'privacy'

const termsSections = [
  { title: 'Acceptance of Terms', content: 'By accessing or using GroomAI, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.' },
  { title: 'Account Responsibilities', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information during registration.' },
  { title: 'Booking & Cancellation', content: 'Bookings are confirmed upon payment. Free cancellation is available up to 2 hours before the appointment. Late cancellations may incur a charge of up to 50% of the service value.' },
  { title: 'Payments', content: 'All payments are processed through Razorpay, a secure PCI-DSS compliant payment gateway. Prices are listed in INR and include applicable taxes unless stated otherwise.' },
  { title: 'Salon Listings', content: 'We verify salons before listing but are not responsible for the quality of services provided. Disputes should be raised with the salon directly or through our support team.' },
  { title: 'Limitation of Liability', content: 'GroomAI is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability is limited to the amount you paid for the booking.' },
]

const privacySections = [
  { title: 'Information We Collect', content: 'We collect personal information you provide (name, email, phone), booking history, and usage data. We also collect payment information through our secure payment processor Razorpay.' },
  { title: 'How We Use Your Data', content: 'We use your data to process bookings, send confirmations, improve our services, personalize recommendations, and communicate with you about your account.' },
  { title: 'Data Sharing', content: 'We share necessary information with salons to fulfill your booking. We do not sell your personal data to third parties. Payment data is processed directly by Razorpay.' },
  { title: 'Data Security', content: 'We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your data.' },
  { title: 'Cookies', content: 'We use essential cookies for platform functionality and analytics cookies to improve your experience. You can manage cookie preferences in your browser settings.' },
  { title: 'Contact Us', content: 'For privacy-related inquiries, contact us at privacy@groomai.app. We will respond within 48 hours.' },
]

export default function TermsPage() {
  const [tab, setTab] = useState<LegalTab>('terms')

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">
          <span className="text-[#C9A84C]">Terms of Service</span>
        </h1>
        <p className="text-sm text-gray-500">Last updated: June 15, 2026</p>
      </div>

      <div className="flex gap-2 mb-8">
        {([
          { key: 'terms' as LegalTab, label: 'Terms of Service' },
          { key: 'privacy' as LegalTab, label: 'Privacy Policy' },
        ]).map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
              tab === key ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(tab === 'terms' ? termsSections : privacySections).map((section, i) => (
          <div key={i} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
              <span className="w-1 h-4 bg-[#C9A84C] rounded-full" />
              {section.title}
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed ml-3">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-sm text-gray-500 mb-4">
          Questions about these terms? Email us at <span className="text-[#C9A84C]">privacy@groomai.app</span>
        </p>
        <Link href="/"
          className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors underline underline-offset-2">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
