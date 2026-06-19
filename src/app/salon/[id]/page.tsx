import { getSalon } from '@/lib/api'
import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'

export default async function SalonDetail({ params }: { params: { id: string } }) {
  const salon = await getSalon(params.id)
  if (!salon) return <div className="px-4 py-6 text-gray-500 text-center">Salon not found</div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="h-56 bg-[#111111] rounded-2xl mb-6">
        {salon.imageUrl && <img src={salon.imageUrl} alt={salon.name} className="w-full h-full object-cover rounded-2xl" />}
      </div>
      <h1 className="text-2xl font-bold text-white">{salon.name}</h1>
      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
        <span className="flex items-center gap-1"><MapPin size={14} />{salon.location}</span>
        <span className="flex items-center gap-1 text-[#C9A84C]"><Star size={14} fill="currentColor" />{salon.rating}</span>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-3">Services</h2>
        <div className="flex flex-col gap-2">
          {(salon.services || []).map((svc: any) => (
            <div key={svc.name} className="flex items-center justify-between bg-[#111111] rounded-xl px-4 py-3 border border-[#1a1a1a]">
              <span className="text-white text-sm">{svc.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-[#C9A84C] text-sm">₹{svc.price}</span>
                <Link href={`/checkout?salonId=${salon.id}&service=${svc.name}&price=${svc.price}`}
                  className="bg-[#C9A84C] text-black text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#b8963e] transition-colors">
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