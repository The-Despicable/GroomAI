import Link from 'next/link'
import { Star } from 'lucide-react'

interface SalonCardProps {
  id: string
  name: string
  location: string
  rating: number
  priceFrom: number
  imageUrl: string
}

export default function SalonCard({ id, name, location, rating, priceFrom, imageUrl }: SalonCardProps) {
  return (
    <div className="min-w-[280px] md:min-w-[320px] bg-[#1A1A1A] rounded-2xl overflow-hidden snap-start hover:shadow-lg transition-shadow border border-gray-800">
      <div
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className="text-white font-semibold text-lg">{name}</h4>
          <div className="flex items-center gap-0.5">
            <Star size={14} className="text-[#C9A84C]" fill="#C9A84C" />
            <span className="text-gray-400 text-sm">{rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-3">{location}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#C9A84C] text-xl font-bold">
            ₹{priceFrom} <span className="text-xs text-gray-500 font-normal">onwards</span>
          </span>
          <Link
            href={`/salon/${id}`}
            className="bg-[#C9A84C] text-black px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition"
          >
            Book
          </Link>
        </div>
      </div>
    </div>
  )
}