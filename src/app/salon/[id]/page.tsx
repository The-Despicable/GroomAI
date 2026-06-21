'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Star, MapPin, Clock } from 'lucide-react'
import { getSalon, type Salon } from '@/lib/api'

export default function SalonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [salon, setSalon] = useState<Salon | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getSalon(id).then((data) => {
      setSalon(data)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-[#1A1A1A] rounded-2xl h-64 animate-pulse mb-6" />
        <div className="bg-gray-800 h-8 w-2/3 rounded mb-4 animate-pulse" />
        <div className="bg-gray-800 h-4 w-1/2 rounded animate-pulse" />
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Salon not found.</p>
        <button onClick={() => router.push('/explore')} className="mt-4 text-[#C9A84C] underline">
          Browse salons
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${salon.image_url || '/placeholder.svg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{salon.name}</h1>
      <div className="flex items-center gap-4 text-gray-400 mb-8">
        <div className="flex items-center gap-1.5">
          <Star size={16} className="text-[#C9A84C]" fill="#C9A84C" />
          <span className="text-sm">{salon.rating}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm">{salon.location}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        <span className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium">Services</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </div>

      <div className="space-y-3">
        {salon.services.map((svc, i) => (
          <div key={i} className="bg-[#111] border border-gray-800/50 rounded-xl p-4 md:p-5 flex justify-between items-center hover:border-gray-700/50 transition-colors">
            <div>
              <h3 className="text-white font-medium">{svc.name}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                <Clock size={14} />
                <span>{svc.duration} min</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#C9A84C] font-bold text-lg">₹{svc.price}</span>
              <button
                onClick={() => router.push(`/checkout?salonId=${salon.id}&service=${encodeURIComponent(svc.name)}&price=${svc.price}`)}
                className="bg-[#C9A84C] text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#b8963e] transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}