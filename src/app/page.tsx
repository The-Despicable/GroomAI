'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Scissors, Wind, Sparkles, Hand } from 'lucide-react'
import dynamic from 'next/dynamic'
import SalonCard from '@/components/SalonCard'
import { getSalons } from '@/lib/api'

const SalonMap = dynamic(() => import('@/components/SalonMap'), { ssr: false })

const categories = [
  { label: 'Hair', icon: Scissors },
  { label: 'Beard', icon: Wind },
  { label: 'Spa', icon: Sparkles },
  { label: 'Nails', icon: Hand },
]

export default function HomePage() {
  const router = useRouter()
  const [salons, setSalons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const data = await getSalons({ location: search || undefined })
        setSalons(data)
      } catch (err) {
        console.error('Failed to fetch salons:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSalons()
  }, [search])

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Your Grooming,</h1>
        <h1 className="text-3xl font-bold text-[#C9A84C] mb-6">Perfected.</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && router.push(`/explore?q=${search}`)}
            placeholder="Search salons, styles..."
            className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50"
          />
          <button onClick={() => router.push(`/explore?q=${search}`)} className="bg-[#C9A84C] text-black px-4 rounded-xl hover:bg-[#b8963e] transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        {categories.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => router.push(`/explore?service=${label.toLowerCase()}`)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-[#111111] border border-[#1a1a1a] rounded-xl px-5 py-3 text-xs text-gray-400 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors"
          >
            <Icon size={18} />{label}
          </button>
        ))}
      </div>

      {!loading && salons.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">Map View</h2>
          <SalonMap salons={salons} />
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Trending Near You</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" />)}
          </div>
        ) : salons.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No salons found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {salons.slice(0, 3).map((s: any) => <SalonCard key={s.id} salon={s} />)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Search size={20} className="text-[#C9A84C]" />
          </div>
          <p className="text-white text-sm font-medium">Search</p>
          <p className="text-gray-500 text-xs mt-1">Tell GroomAI what you need.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles size={20} className="text-[#C9A84C]" />
          </div>
          <p className="text-white text-sm font-medium">Pick</p>
          <p className="text-gray-500 text-xs mt-1">Choose your perfect style.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Hand size={20} className="text-[#C9A84C]" />
          </div>
          <p className="text-white text-sm font-medium">Book</p>
          <p className="text-gray-500 text-xs mt-1">Instant, verified slots.</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-12 bg-[#C9A84C]/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Wind size={20} className="text-[#C9A84C]" />
          </div>
          <p className="text-white text-sm font-medium">Relax</p>
          <p className="text-gray-500 text-xs mt-1">Enjoy the grooming ritual.</p>
        </div>
      </div>
    </div>
  )
}
