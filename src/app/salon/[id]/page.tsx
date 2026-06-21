'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MapPin, Star, Clock, Phone, Clock3, Scissors } from 'lucide-react'
import ReviewsSection from '@/components/ReviewsSection'

export default function SalonDetail() {
  const params = useParams()
  const id = params?.id as string
  const [salon, setSalon] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    fetch(`/api/salons/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { setSalon(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="h-56 bg-[#1a1a1a] rounded-2xl mb-6 animate-pulse" />
        <div className="h-8 bg-[#1a1a1a] rounded-lg w-2/3 mb-4 animate-pulse" />
        <div className="h-4 bg-[#1a1a1a] rounded-lg w-1/3 mb-6 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[#1a1a1a] rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!salon) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Salon not found</p>
        <Link href="/explore" className="mt-4 inline-block text-[#C9A84C] underline">Browse salons</Link>
      </div>
    )
  }

  const formatTime = (t: string) => {
    if (!t) return ''
    const [h, m] = t.split(':')
    const hour = parseInt(h)
    return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="h-56 bg-[#1a1a1a] rounded-2xl mb-6 flex items-center justify-center overflow-hidden">
        {salon.imageUrl ? (
          <img src={salon.imageUrl} alt={salon.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-6xl">💈</span>
        )}
      </div>

      <h1 className="text-2xl font-bold text-white">{salon.name}</h1>

      <div className="flex items-center gap-4 mt-2 text-sm">
        <span className="flex items-center gap-1 text-gray-400">
          <MapPin size={14} />{salon.location}
        </span>
        <span className="flex items-center gap-1 text-[#C9A84C]">
          <Star size={14} fill="currentColor" />{salon.rating}
        </span>
      </div>

      {salon.about && (
        <p className="text-gray-400 text-sm mt-4 leading-relaxed">{salon.about}</p>
      )}

      {salon.description && (
        <p className="text-gray-500 text-sm mt-2 italic">&ldquo;{salon.description}&rdquo;</p>
      )}

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-500">
        {salon.phone && (
          <span className="flex items-center gap-1">
            <Phone size={12} /> {salon.phone}
          </span>
        )}
        {salon.openTime && salon.closeTime && (
          <span className="flex items-center gap-1">
            <Clock3 size={12} /> {formatTime(salon.openTime)} — {formatTime(salon.closeTime)}
          </span>
        )}
      </div>

      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Scissors size={16} className="text-[#C9A84C]" />
          <h2 className="text-lg font-semibold text-white">Services</h2>
          <span className="text-xs text-gray-500 bg-[#111] border border-[#1a1a1a] px-2 py-0.5 rounded-full">
            {salon.services?.length || 0}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {Array.from(new Map((salon.services || []).map((svc: any) => [`${svc.name}-${svc.price}`, svc])).values()).map((svc: any) => (
            <div key={`${svc.name}-${svc.price}`} className="bg-[#111111] rounded-xl px-4 py-3.5 border border-[#1a1a1a] hover:border-[#C9A84C]/20 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{svc.name}</span>
                    {svc.duration && (
                      <span className="flex items-center gap-0.5 text-gray-500 text-[10px]">
                        <Clock size={10} />{svc.duration} min
                      </span>
                    )}
                  </div>
                  {svc.description && (
                    <p className="text-gray-500 text-xs mt-1 leading-relaxed">{svc.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-[#C9A84C] font-semibold text-sm">₹{svc.price}</span>
                  <Link
                    href={`/checkout?salonId=${salon.id}&salonName=${encodeURIComponent(salon.name)}&service=${encodeURIComponent(svc.name)}&price=${svc.price}`}
                    className="bg-[#C9A84C] text-black text-xs font-medium px-3.5 py-1.5 rounded-lg hover:bg-[#b8963e] transition-colors whitespace-nowrap"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReviewsSection salonId={id} />
    </div>
  )
}
