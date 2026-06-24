'use client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Scissors, Smile, Flower2, Sparkles } from 'lucide-react'
import { slideRight } from '@/lib/animations'

const categories = [
  { label: 'Hair', icon: Scissors },
  { label: 'Beard', icon: Smile },
  { label: 'Spa', icon: Flower2 },
  { label: 'Facial', icon: Sparkles },
]

export default function CategoryPills() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {categories.map(({ label, icon: Icon }, i) => (
        <motion.button
          key={label}
          variants={slideRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={i}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/explore?service=${label.toLowerCase()}`)}
          className="group relative flex flex-col items-center py-8 px-4 bg-[#111] border border-gray-800/50 rounded-2xl hover:border-[#C9A84C]/30 hover:bg-[#1A1A1A] transition-colors cursor-pointer"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#C9A84C]/5 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-[#C9A84C]/10 group-hover:scale-110 transition-all">
            <Icon size={32} className="text-[#C9A84C]" />
          </div>
          <span className="text-[#C9A84C] font-medium text-sm">{label}</span>
        </motion.button>
      ))}
    </div>
  )
}
