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
      <div
        className="h-64 rounded-2xl bg-cover bg-center mb-6"
        style={{ backgroundImage: `url(${salon.image_url})` }}
      />
      <h1 className="text-3xl font-bold text-white mb-2">{salon.name}</h1>
      <div className="flex items-center gap-4 text-gray-400 mb-6">
        <div className="flex items-center gap-1">
          <Star size={16} className="text-[#C9A84C]" fill="#C9A84C" />
          <span>{salon.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin size={16} />
          <span>{salon.location}</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Services</h2>
      <div className="space-y-3">
        {salon.services.map((svc, i) => (
          <div key={i} className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-white font-medium">{svc.name}</h3>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                <Clock size={14} />
                <span>{svc.duration} min</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#C9A84C] font-bold text-lg">₹{svc.price}</span>
              <button
                onClick={() => router.push(`/checkout?salonId=${salon.id}&service=${encodeURIComponent(svc.name)}&price=${svc.price}`)}
                className="bg-[#C9A84C] text-black px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition"
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