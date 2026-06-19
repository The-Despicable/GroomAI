import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'

interface Salon {
  id: string
  name: string
  location: string
  rating: number
  priceFrom: number
  imageUrl?: string
  services?: { name: string; price: number; duration: number }[]
}

export default function SalonCard({ salon }: { salon: Salon }) {
  return (
    <Link href={`/salon/${salon.id}`}>
      <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#C9A84C]/30 transition-colors">
        <div className="h-40 bg-[#1a1a1a] flex items-center justify-center text-gray-600">
          {salon.imageUrl ? (
            <img src={salon.imageUrl} alt={salon.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">💈</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white text-lg">{salon.name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <MapPin size={12} />{salon.location}
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1 text-[#C9A84C] text-sm">
              <Star size={12} fill="currentColor" />{salon.rating}
            </div>
            <span className="text-gray-400 text-sm">from ₹{salon.priceFrom}</span>
          </div>
          <div className="mt-3 w-full text-center bg-[#C9A84C] text-black text-sm font-medium py-2 rounded-xl hover:bg-[#b8963e] transition-colors">
            Book
          </div>
        </div>
      </div>
    </Link>
  )
}