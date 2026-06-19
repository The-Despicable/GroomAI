'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import SalonCard from '@/components/SalonCard'
import { getSalons } from '@/lib/api'

const services = ['All', 'Hair', 'Beard', 'Spa', 'Nails']

export default function Explore() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [service, setService] = useState(searchParams.get('service') || 'All')
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const data = await getSalons({ service: service === 'All' ? undefined : service.toLowerCase(), location: query || undefined })
    setSalons(data)
    setLoading(false)
  }, [query, service])

  useEffect(() => {
    const t = setTimeout(fetch, 400)
    return () => clearTimeout(t)
  }, [fetch])

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search salons..."
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50" />
        </div>
      </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {services.map(s => (
          <button key={s} onClick={() => setService(s)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${service === s ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'}`}>
            {s}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-[#111111] rounded-2xl animate-pulse" />)}
        </div>
      ) : salons.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-16">No salons found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {salons.map((s: any) => <SalonCard key={s.id} {...s} />)}
        </div>
      )}
    </div>
  )
}