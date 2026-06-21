'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { getSalons, type Salon } from '@/lib/api'
import SalonCard from '@/components/SalonCard'

const services = ['All', 'Hair', 'Beard', 'Nails', 'Spa']

function ExploreContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeService, setActiveService] = useState(searchParams.get('service') || 'All')
  const [salons, setSalons] = useState<Salon[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSalons = useCallback(async () => {
    setLoading(true)
    const filters: { service?: string; location?: string } = {}
    if (activeService !== 'All') filters.service = activeService
    if (query.trim()) filters.location = query.trim()
    const data = await getSalons(filters)
    setSalons(data)
    setLoading(false)
  }, [activeService, query])

  useEffect(() => {
    const timer = setTimeout(fetchSalons, 400)
    return () => clearTimeout(timer)
  }, [fetchSalons])

  return (
    <>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Explore Salons</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </div>

      <div className="relative max-w-xl mx-auto mb-6 mt-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#111] border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 transition-all"
          placeholder="Search salons or location..."
        />
      </div>

      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {services.map((s) => (
          <button
            key={s}
            onClick={() => setActiveService(s)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              activeService === s
                ? 'bg-[#C9A84C] text-black shadow-lg shadow-[#C9A84C]/20'
                : 'bg-[#111] text-gray-400 border border-gray-800 hover:border-gray-600'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#111] rounded-2xl h-72 animate-pulse border border-gray-800/50" />
          ))}
        </div>
      ) : salons.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-500 text-lg">No salons found matching your criteria.</p>
          <button
            onClick={() => { setQuery(''); setActiveService('All') }}
            className="mt-4 text-[#C9A84C] hover:underline transition"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {salons.map((s) => (
            <SalonCard key={s.id} id={s.id} name={s.name} location={s.location} rating={s.rating} priceFrom={s.priceFrom} imageUrl={s.image_url} />
          ))}
        </div>
      )}
    </>
  )
}

export default function ExplorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading...</div>}>
        <ExploreContent />
      </Suspense>
    </div>
  )
}