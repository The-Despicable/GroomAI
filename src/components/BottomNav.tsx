'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Calendar, Bot, User } from 'lucide-react'

const links = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/explore', icon: Search, label: 'Explore' },
  { href: '/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/assistant', icon: Bot, label: 'AI' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-[#1a1a1a] flex md:hidden">
      {links.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href}
          className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] transition-colors ${
            pathname === href ? 'text-[#C9A84C]' : 'text-gray-500'
          }`}>
          <Icon size={20} />
          {label}
        </Link>
      ))}
    </nav>
  )
}