import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-[#1a1a1a] bg-[#0A0A0A] px-6 py-8 mt-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[#C9A84C] text-lg font-bold tracking-tight">GroomAI</span>
          <p className="text-xs text-gray-600 mt-1">AI-powered salon booking for the modern individual.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          <Link href="/explore" className="hover:text-white transition">Explore</Link>
          <Link href="/bookings" className="hover:text-white transition">Bookings</Link>
          <Link href="/assistant" className="hover:text-white transition">AI Assistant</Link>
          <Link href="/about" className="hover:text-white transition">About</Link>
          <Link href="/help" className="hover:text-white transition">Help</Link>
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
        </nav>
        <p className="text-xs text-gray-700">&copy; {new Date().getFullYear()} GroomAI. All rights reserved.</p>
      </div>
    </footer>
  )
}
