'use client'
import { MapPin, Mail, Phone, Sparkles, Search, Calendar, Star } from 'lucide-react'
import Link from 'next/link'

const features = [
  { icon: Sparkles, title: 'AI-Powered Matching', desc: 'Our 24/7 AI assistant helps you find the perfect salon, style, and stylist in seconds.' },
  { icon: Search, title: 'Curated Selection', desc: 'Handpicked premium salons in Banjara Hills and Jubilee Hills, verified for quality.' },
  { icon: Calendar, title: 'Easy Booking', desc: 'Book your appointment in under 30 seconds. No calls, no waiting.' },
  { icon: Star, title: 'Verified Reviews', desc: 'Real customer feedback from verified bookings to help you choose.' },
]

const team = [
  { name: 'Rajesh Kumar', role: 'Master Barber', initials: 'RK', specialty: 'Classic & modern cuts' },
  { name: 'Priya Sharma', role: 'Senior Stylist', initials: 'PS', specialty: 'Hair styling & coloring' },
  { name: 'Vikram Singh', role: 'Beard Specialist', initials: 'VS', specialty: 'Beard sculpting & grooming' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-bold text-white mb-3">
          About <span className="text-[#C9A84C]">GroomAI</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Hyderabad&apos;s premier AI-powered salon booking platform. We connect you with the best barbers
          and stylists in Banjara Hills and Jubilee Hills.
        </p>
      </div>

      <div className="bg-gradient-to-r from-[#C9A84C]/5 to-transparent border border-[#1a1a1a] rounded-2xl p-8 mb-12">
        <h2 className="text-xl font-semibold text-white mb-3">Our Mission</h2>
        <p className="text-gray-400 leading-relaxed">
          GroomAI makes premium grooming accessible. We believe every person deserves a great haircut,
          a perfect shave, or a relaxing spa experience — without the hassle of calling around or
          waiting in line. Our AI-powered platform learns your preferences and recommends the best
          salons, services, and stylists for your needs.
        </p>
      </div>

      <h2 className="text-xl font-semibold text-white mb-6">Why GroomAI?</h2>
      <div className="grid grid-cols-2 gap-4 mb-12">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#C9A84C]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-3">
              <Icon size={20} className="text-[#C9A84C]" />
            </div>
            <h3 className="text-white font-semibold mb-1">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-white mb-6">Meet Our Top Stylists</h2>
      <div className="grid grid-cols-3 gap-4 mb-12">
        {team.map(m => (
          <div key={m.name} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-6 text-center hover:border-[#C9A84C]/30 transition-all">
            <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-3">
              <span className="text-[#C9A84C] font-bold text-lg">{m.initials}</span>
            </div>
            <h3 className="text-white font-semibold">{m.name}</h3>
            <p className="text-xs text-[#C9A84C] mt-0.5">{m.role}</p>
            <p className="text-xs text-gray-500 mt-1">{m.specialty}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Contact Us</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#C9A84C] mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Address</p>
              <p className="text-xs text-gray-400">Road No. 12, Banjara Hills<br />Hyderabad - 500034</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-[#C9A84C] mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Email</p>
              <p className="text-xs text-gray-400">hello@groomai.app<br />support@groomai.app</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-[#C9A84C] mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium">Phone</p>
              <p className="text-xs text-gray-400">+91 1800 123 4567<br />Mon-Sat, 9AM-8PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/explore"
          className="inline-flex items-center gap-2 bg-[#C9A84C] text-black px-6 py-3 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">
          Explore Salons
        </Link>
      </div>
    </div>
  )
}
