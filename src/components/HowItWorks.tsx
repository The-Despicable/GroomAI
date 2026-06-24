'use client'
import { motion } from 'framer-motion'
import { Search, Star, Calendar, Flower2 } from 'lucide-react'
import { fadeUp } from '@/lib/animations'

const steps = [
  { num: '01', icon: Search, title: 'Search', desc: 'Tell GroomAI what you need.' },
  { num: '02', icon: Star, title: 'Pick', desc: 'Choose your perfect style.' },
  { num: '03', icon: Calendar, title: 'Book', desc: 'Instant, verified slots.' },
  { num: '04', icon: Flower2, title: 'Relax', desc: 'Enjoy the grooming ritual.' },
]

export default function HowItWorks() {
  return (
    <section className="py-16 max-w-5xl mx-auto px-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        <motion.span
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-xs text-gray-500 uppercase tracking-[0.15em] font-medium"
        >
          How It Works
        </motion.span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {steps.map(({ num, icon: Icon, title, desc }, i) => (
          <motion.div
            key={num}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-30px' }}
            custom={i}
            className="relative flex flex-col items-center text-center p-6 bg-[#111] border border-gray-800/50 rounded-2xl hover:border-gray-700/50 transition-colors"
          >
            <span className="absolute top-3 left-3 text-3xl font-bold text-gray-800 select-none">{num}</span>
            <div className="w-14 h-14 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center mb-4">
              <Icon size={26} className="text-[#C9A84C]" />
            </div>
            <h5 className="text-white font-semibold mb-1.5">{title}</h5>
            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
