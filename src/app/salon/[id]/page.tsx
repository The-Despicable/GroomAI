import { getSalon } from '@/lib/api'
import Link from 'next/link'
import { MapPin, Star, Clock } from 'lucide-react'

export default async function SalonDetail({ params }: { params: { id: string } }) {
  const salon = await getSalon(params.id)

  if (!salon) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-gray-500 text-lg">Salon not found</p>
        <Link href="/explore" className="mt-4 inline-block text-[#C9A84C] underline">Browse salons</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="h-56 bg-[#1a1a1a] rounded-2xl mb-6 flex items-center justify-center text-6xl">
        {salon.imageUrl ? (
          <img src={salon.imageUrl} alt={salon.name} className="w-full h-full object-cover rounded-2xl" />
        ) : (
          <span>💈</span>
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
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-3">Services</h2>
        <div className="flex flex-col gap-2">
          {(salon.services || []).map((svc: any) => (
            <div key={svc.name} className="flex items-center justify-between bg-[#111111] rounded-xl px-4 py-3 border border-[#1a1a1a]">
              <div>
                <span className="text-white text-sm font-medium">{svc.name}</span>
                {svc.duration && (
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                    <Clock size={12} />{svc.duration} min
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#C9A84C] font-semibold">₹{svc.price}</span>
                <Link
                  href={`/checkout?salonId=${salon.id}&service=${encodeURIComponent(svc.name)}&price=${svc.price}`}
                  className="bg-[#C9A84C] text-black text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#b8963e] transition-colors"
                >
                  Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}