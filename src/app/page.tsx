'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Sparkles, Mic, Scissors, Hand, Smile, Flower2, Star, Calendar } from 'lucide-react'
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
      <section className="relative min-h-[530px] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-gradient-to-b from-[#1A1A1A]/30 to-[#0A0A0A]">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }} />
        </div>
        <div className="z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-[#C9A84C] mb-4 tracking-tight">
            Your Grooming, Perfected.
          </h2>
          <p className="text-lg text-gray-400 mb-6 max-w-xl mx-auto">
            AI-powered scheduling for the modern gentleman. Discover top-rated salons tailored to your style.
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto bg-[#1A1A1A] border border-gray-700 rounded-full p-2 flex items-center gap-2 focus-within:ring-2 ring-[#C9A84C] transition">
            <div className="pl-3 text-gray-500">
              <Search size={20} />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus:outline-none text-white py-2"
              placeholder="Haircut under ₹600"
              type="text"
            />
            <div className="flex items-center gap-2 pr-2">
              <button type="button" className="p-2 hover:bg-gray-800 rounded-full transition">
                <Mic size={18} className="text-gray-400" />
              </button>
              <button type="submit" className="p-2 bg-[#C9A84C] text-black rounded-full hover:scale-105 transition">
                <Sparkles size={18} />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="px-4 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => router.push(`/explore?service=${label.toLowerCase()}`)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1A1A1A] border border-gray-800 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 group-active:scale-95 transition">
                <Icon size={36} className="text-[#C9A84C]" />
              </div>
              <span className="text-[#C9A84C] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="py-12 bg-[#111] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-end mb-6">
          <div>
            <span className="text-xs text-[#C9A84C] uppercase tracking-widest">Selected for you</span>
            <h3 className="text-2xl font-bold text-white">Trending Near You</h3>
          </div>
          <button onClick={() => router.push('/explore')} className="text-[#C9A84C] text-sm border-b border-[#C9A84C] hover:opacity-70">View All</button>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-4 snap-x">
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : salons.length === 0 ? (
            <div className="text-gray-500">No salons found. Check back later.</div>
          ) : (
            salons.slice(0, 3).map((s) => (
              <SalonCard key={s.id} id={s.id} name={s.name} location={s.location} rating={s.rating} priceFrom={s.priceFrom} imageUrl={s.image_url} />
            ))
          )}
        </div>
      </section>

      <section className="py-12 max-w-7xl mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-white mb-8">Your Ritual, Simplified</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mb-3">
                <Icon size={28} className="text-[#C9A84C]" />
              </div>
              <h5 className="text-white font-medium mb-1">{title}</h5>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}