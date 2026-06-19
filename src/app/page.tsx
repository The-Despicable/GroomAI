'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Scissors, Wind, Sparkles, Hand } from 'lucide-react'
import SalonCard from '@/components/SalonCard'
import { getSalons } from '@/lib/api'

const categories = [
  { label: 'Hair', icon: Scissors },
  { label: 'Beard', icon: Wind },
  { label: 'Spa', icon: Sparkles },
  { label: 'Nails', icon: Hand },
]

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [salons, setSalons] = useState<any[]>([])

  useEffect(() => { getSalons().then(setSalons) }, [])

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Your Grooming,</h1>
        <h1 className="text-3xl font-bold text-[#C9A84C] mb-6">Perfected.</h1>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && router.push(`/explore?q=${query}`)}
            placeholder="Search salons, styles..."
            className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50"
          />
          <button onClick={() => router.push(`/explore?q=${query}`)} className="bg-[#C9A84C] text-black px-4 rounded-xl hover:bg-[#b8963e] transition-colors">
            <Search size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-1">
        {categories.map(({ label, icon: Icon }) => (
          <button key={label} onClick={() => router.push(`/explore?service=${label.toLowerCase()}`)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 bg-[#111111] border border-[#1a1a1a] rounded-xl px-5 py-3 text-xs text-gray-400 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors">
            <Icon size={18} />{label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Trending Near You</h2>
        {salons.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No salons found. Add your API URL to .env.local</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {salons.slice(0, 3).map((s: any) => <SalonCard key={s.id} {...s} />)}
          </div>
        )}
      </div>
    </div>
  )
}