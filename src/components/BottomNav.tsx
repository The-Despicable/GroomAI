'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Home, Search, Calendar, Bot, User, ChevronUp, X, LayoutDashboard, Info, HelpCircle, FileText } from 'lucide-react'

const mainLinks = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/assistant', icon: Bot, label: 'AI' },
  { href: '/profile', icon: User, label: 'Profile' },
]

const moreLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/about', icon: Info, label: 'About' },
  { href: '/help', icon: HelpCircle, label: 'Help' },
  { href: '/terms', icon: FileText, label: 'Terms' },
  { href: '/admin', icon: LayoutDashboard, label: 'Admin' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      {showMore && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-20 left-4 right-4 bg-[#1a1a1a] border border-[#333] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-2">
              {moreLinks.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setShowMore(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${
                    pathname === href ? 'text-[#C9A84C] bg-[#C9A84C]/10' : 'text-gray-300 hover:text-white hover:bg-[#222]'
                  }`}>
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#1a1a1a] flex md:hidden">
        {mainLinks.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] transition-colors ${
              pathname === href ? 'text-[#C9A84C]' : 'text-gray-500'
            }`}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
        <button onClick={() => setShowMore(!showMore)}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] text-gray-500 transition-colors">
          {showMore ? <X size={20} /> : <ChevronUp size={20} />}
          More
        </button>
      </nav>
    </>
  )
}
