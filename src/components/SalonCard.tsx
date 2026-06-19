import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'

interface SalonCardProps {
  id: string
  name: string
  location: string
  rating: number
  priceFrom: number
  imageUrl?: string
}

export default function SalonCard({ id, name, location, rating, priceFrom, imageUrl }: SalonCardProps) {
  return (
    <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1a1a1a] hover:border-[#C9A84C]/30 transition-colors">
      <div className="h-40 bg-[#1a1a1a]">
        {imageUrl && <img src={imageUrl} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white">{name}</h3>
        <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
          <MapPin size={12} />{location}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1 text-[#C9A84C] text-sm">
            <Star size={12} fill="currentColor" />{rating}
          </div>
          <span className="text-gray-400 text-sm">from ₹{priceFrom}</span>
        </div>
        <Link href={`/salon/${id}`} className="mt-3 block w-full text-center bg-[#C9A84C] text-black text-sm font-medium py-2 rounded-xl hover:bg-[#b8963e] transition-colors">
          Book
        </Link>
      </div>
    </div>
  )
}