'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Scissors, Hand, Smile, Flower2, Star, Calendar } from 'lucide-react'
import { getSalons, type Salon } from '@/lib/api'
import SalonCard from '@/components/SalonCard'

const categories = [
  { label: 'Hair', icon: Scissors },
  { label: 'Nails', icon: Hand },
  { label: 'Beard', icon: Smile },
  { label: 'Spa', icon: Flower2 },
]

const steps = [
  { icon: Search, title: 'Search', desc: 'Tell GroomAI what you need.' },
  { icon: Star, title: 'Pick', desc: 'Choose your perfect style.' },
  { icon: Calendar, title: 'Book', desc: 'Instant, verified slots.' },
  { icon: Flower2, title: 'Relax', desc: 'Enjoy the grooming ritual.' },
]

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSalons().then((data) => {
      setSalons(data)
      setLoading(false)
    })
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/explore?q=${encodeURIComponent(query)}`)
  }

  return (
    <>
      <section className="relative min-h-[560px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C9A84C]/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C9A84C]/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0A]/60 to-[#0A0A0A]" />
        </div>
        <div className="z-10 max-w-3xl">
          <span className="inline-block text-xs text-[#C9A84C] uppercase tracking-[0.2em] mb-6 font-medium">
            AI-Powered Salon Booking
          </span>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight leading-[1.1]">
            Your Grooming,
            <br />
            <span className="text-[#C9A84C]">Perfected.</span>
          </h2>
          <p className="text-base text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Discover top-rated salons tailored to your style. AI-powered scheduling for the modern individual.
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto bg-[#111] border border-gray-800 rounded-2xl p-1.5 flex items-center gap-2 focus-within:border-[#C9A84C]/50 focus-within:ring-1 focus-within:ring-[#C9A84C]/20 transition-all shadow-lg">
            <div className="pl-4 text-gray-500">
              <Search size={20} />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-white py-3 text-sm placeholder:text-gray-600"
              placeholder="Search salons, styles, or locations..."
              type="text"
            />
            <button type="submit" className="p-2.5 bg-[#C9A84C] text-black rounded-xl hover:bg-[#b8963e] hover:scale-105 transition-all active:scale-95">
              <Sparkles size={18} />
            </button>
          </form>
          <p className="text-xs text-gray-600 mt-4">Popular: Haircut, Beard Trim, Spa, Facial</p>
        </div>
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Browse by Category</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => router.push(`/explore?service=${label.toLowerCase()}`)}
              className="group relative flex flex-col items-center py-8 px-4 bg-[#111] border border-gray-800/50 rounded-2xl hover:border-[#C9A84C]/30 hover:bg-[#1A1A1A] transition-all cursor-pointer active:scale-[0.98]"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#C9A84C]/5 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-[#C9A84C]/10 group-hover:scale-110 transition-all">
                <Icon size={32} className="text-[#C9A84C]" />
              </div>
              <span className="text-[#C9A84C] font-medium text-sm">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-end mb-8">
          <div>
            <span className="text-xs text-[#C9A84C] uppercase tracking-[0.15em] font-medium">Curated for you</span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">Trending Near You</h3>
          </div>
          <button onClick={() => router.push('/explore')} className="text-sm text-gray-400 hover:text-[#C9A84C] transition-colors">
            View All &rarr;
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-6 pb-4 snap-x">
          {loading ? (
            <div className="flex gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-w-[280px] md:min-w-[320px] bg-[#111] rounded-2xl h-72 animate-pulse border border-gray-800/50" />
              ))}
            </div>
          ) : salons.length === 0 ? (
            <div className="min-w-[280px] text-gray-500 py-12 text-center">
              <p>No salons found. Check back later.</p>
            </div>
          ) : (
            salons.slice(0, 3).map((s) => (
              <SalonCard key={s.id} id={s.id} name={s.name} location={s.location} rating={s.rating} priceFrom={s.priceFrom} imageUrl={s.image_url} />
            ))
          )}
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">How It Works</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="relative flex flex-col items-center text-center p-6 bg-[#111] border border-gray-800/50 rounded-2xl hover:border-gray-700/50 transition-colors">
              <span className="absolute top-3 left-3 text-3xl font-bold text-gray-800 select-none">0{i + 1}</span>
              <div className="w-14 h-14 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center mb-4">
                <Icon size={26} className="text-[#C9A84C]" />
              </div>
              <h5 className="text-white font-semibold mb-1.5">{title}</h5>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h4 className="text-white font-bold text-lg">Ready to look your best?</h4>
            <p className="text-gray-500 text-sm mt-1">Book your next grooming session in seconds.</p>
          </div>
          <button
            onClick={() => router.push('/explore')}
            className="bg-[#C9A84C] text-black px-8 py-3 rounded-xl font-semibold hover:bg-[#b8963e] transition-colors"
          >
            Explore Salons
          </button>
        </div>
      </section>
    </>
  )
}