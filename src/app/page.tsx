'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { getSalons } from '@/lib/api'
import SalonCard from '@/components/SalonCard'
import SearchAutocomplete from '@/components/SearchAutocomplete'
import CategoryPills from '@/components/CategoryPills'
import HowItWorks from '@/components/HowItWorks'
import dynamic from 'next/dynamic'

const SalonMap = dynamic(() => import('@/components/SalonMap'), { ssr: false })

export default function HomePage() {
  const router = useRouter()
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSalons().then((data) => {
      setSalons(data)
      setLoading(false)
    })
  }, [])

  const handleSearch = (q: string) => {
    router.push(`/explore?q=${encodeURIComponent(q)}`)
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
          <SearchAutocomplete onSearch={handleSearch} />
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Haircut', 'Beard Trim', 'Spa', 'Facial', 'Banjara Hills'].map(tag => (
              <button key={tag} onClick={() => handleSearch(tag)}
                className="px-3 py-1.5 text-xs border border-gray-800 rounded-full text-gray-500 hover:text-[#C9A84C] hover:border-[#C9A84C]/30 transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Browse by Category</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
        <CategoryPills />
      </section>

      {!loading && salons.length > 0 && (
        <section className="px-6 py-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
            <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Map View</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
          </div>
          <div className="h-64 rounded-2xl overflow-hidden border border-gray-800/50">
            <SalonMap salons={salons} />
          </div>
        </section>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
          {loading ? (
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#111] rounded-2xl h-72 animate-pulse border border-gray-800/50" />
              ))}
            </div>
          ) : salons.length === 0 ? (
            <div className="col-span-3 text-gray-500 py-12 text-center">
              <p>No salons found. Check back later.</p>
            </div>
          ) : (
            salons.slice(0, 3).map((s: any, i: number) => (
              <SalonCard key={s.id} id={s.id} name={s.name} location={s.location} rating={s.rating} priceFrom={s.priceFrom} imageUrl={s.imageUrl} index={i} />
            ))
          )}
        </div>
      </section>

      <HowItWorks />

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