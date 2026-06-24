'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { fadeUp } from '@/lib/animations'

interface SalonCardProps {
  id: string
  name: string
  location: string
  rating: number
  priceFrom: number
  imageUrl?: string
  index?: number
}

export default function SalonCard({ id, name, location, rating, priceFrom, imageUrl, index = 0 }: SalonCardProps) {
  const imgSrc = imageUrl || '/placeholder.svg'
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      custom={index}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link href={`/salon/${id}`} className="block bg-[#111] rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-[#C9A84C]/5 transition-shadow border border-gray-800/50 hover:border-gray-700 group">
        <div
          className="relative h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url(${imgSrc})` }}
        />
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-white font-semibold text-base group-hover:text-[#C9A84C] transition-colors">{name}</h4>
            <div className="flex items-center gap-0.5">
              <Star size={13} className="text-[#C9A84C]" fill="#C9A84C" />
              <span className="text-gray-400 text-xs">{rating}</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs mb-3 truncate">{location}</p>
          <div className="flex justify-between items-center">
            <span className="text-[#C9A84C] font-bold">
              ₹{priceFrom} <span className="text-xs text-gray-500 font-normal">onwards</span>
            </span>
            <span className="bg-[#C9A84C] text-black px-4 py-1.5 rounded-lg font-medium text-xs hover:bg-[#b8963e] transition-colors">
              Book
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}