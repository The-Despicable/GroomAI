'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { signInWithGoogle } from '@/lib/auth'
import {
  LayoutDashboard, Store, Users, CalendarCheck, Star, Settings,
  Search, Bell, TrendingUp, ArrowUpRight, MoreVertical, LogOut
} from 'lucide-react'
import Link from 'next/link'

type AdminTab = 'dashboard' | 'salons' | 'users' | 'bookings' | 'reviews' | 'settings'

const navItems: { key: AdminTab; label: string; icon: any }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'salons', label: 'Salons', icon: Store },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'bookings', label: 'Bookings', icon: CalendarCheck },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const stats = [
  { label: 'Total Salons', value: '24', change: '+4%', icon: Store, color: 'text-[#C9A84C]' },
  { label: 'Active Users', value: '1,247', change: '+12%', icon: Users, color: 'text-green-400' },
  { label: 'Bookings Today', value: '38', change: 'Stable', icon: CalendarCheck, color: 'text-blue-400' },
  { label: 'Revenue', value: '₹48,250', change: '+8.2%', icon: TrendingUp, color: 'text-[#C9A84C]' },
]

const recentBookings = [
  { customer: 'Arjun Sharma', initials: 'AS', salon: 'The Royal Trim', service: 'Elite Grooming Pack', date: 'Oct 24, 2:30 PM', status: 'Confirmed' as const },
  { customer: 'Priya Kapoor', initials: 'PK', salon: 'Luxe Hair Spa', service: 'Keratin Therapy', date: 'Oct 24, 4:15 PM', status: 'Pending' as const },
  { customer: 'Rohan Verma', initials: 'RV', salon: 'Urban Gent', service: 'Beard Sculpting', date: 'Oct 24, 11:00 AM', status: 'Cancelled' as const },
  { customer: 'Sneha Mehta', initials: 'SM', salon: 'Bella Flora Salon', service: 'Manicure Deluxe', date: 'Oct 25, 9:30 AM', status: 'Confirmed' as const },
]

const statusStyle: Record<string, string> = {
  Confirmed: 'bg-green-500/10 border-green-500 text-green-400',
  Pending: 'bg-yellow-500/10 border-yellow-500 text-yellow-400',
  Cancelled: 'bg-red-500/10 border-red-500 text-red-400',
}

const activityFeed = [
  { title: 'New Salon Registration', desc: "'Gilded Mane' requested approval.", time: '2 mins ago', active: true },
  { title: 'Payout Completed', desc: '₹12,400 sent to Royal Trim.', time: '45 mins ago', active: false },
  { title: 'System Update', desc: 'Version 2.4.1 deployed successfully.', time: '2 hours ago', active: true },
]

const allSalons = [
  { name: 'The Urban Barber Co.', location: 'Banjara Hills', rating: 4.8, bookings: 156, status: 'Active' },
  { name: 'Luxe Hair Studio', location: 'Jubilee Hills', rating: 4.6, bookings: 98, status: 'Active' },
  { name: 'The Royal Trim', location: 'Banjara Hills', rating: 4.9, bookings: 203, status: 'Active' },
  { name: 'Bella Flora Salon', location: 'Jubilee Hills', rating: 4.7, bookings: 134, status: 'Inactive' },
  { name: 'Urban Gent', location: 'Hitech City', rating: 4.5, bookings: 87, status: 'Active' },
]

const allUsers = [
  { name: 'Rahul Sharma', email: 'rahul@email.com', visits: 12, spent: 8400, joined: '2024-01' },
  { name: 'Neha Kapoor', email: 'neha@email.com', visits: 8, spent: 5200, joined: '2024-03' },
  { name: 'Vikram Singh', email: 'vikram@email.com', visits: 5, spent: 3500, joined: '2024-06' },
  { name: 'Priya Patel', email: 'priya@email.com', visits: 3, spent: 1800, joined: '2024-09' },
  { name: 'Arjun Sharma', email: 'arjun@email.com', visits: 15, spent: 12000, joined: '2023-11' },
]

export default function AdminPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [tab, setTab] = useState<AdminTab>('dashboard')

  if (!isLoaded) {
    return <div className="px-4 py-6 max-w-7xl mx-auto"><div className="h-64 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" /></div>
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <LayoutDashboard size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to access the admin panel</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">
          Sign In
        </button>
      </div>
    )
  }

  const allowedAdmins = ['admin@groomai.com', 'yaser.hussain69@gmail.com']
  const isAdmin = allowedAdmins.includes(user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || '')

  if (!isAdmin) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <LayoutDashboard size={48} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-white font-bold text-xl mb-2">Access Denied</h2>
        <p className="text-gray-400 mb-4">You do not have admin privileges.</p>
        <Link href="/" className="text-[#C9A84C] text-sm hover:underline">Go Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <aside className="w-64 bg-[#111111] border-r border-[#1a1a1a] flex flex-col fixed h-screen z-40">
        <div className="px-6 py-6 border-b border-[#1a1a1a]">
          <h1 className="text-xl font-bold text-[#C9A84C]">GroomAI</h1>
          <p className="text-xs text-gray-500 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                tab === key
                  ? 'bg-[#C9A84C]/10 text-[#C9A84C] border-l-2 border-[#C9A84C]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}>
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-[#1a1a1a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
              <Users size={14} className="text-[#C9A84C]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">LOGGED IN AS</p>
              <p className="text-sm font-medium text-white">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        <header className="h-16 bg-[#111111] border-b border-[#1a1a1a] flex items-center justify-between px-6">
          <div className="relative w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input placeholder="Search salons, users, or transactions..."
              className="w-full bg-[#0A0A0A] border border-[#1a1a1a] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-500 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C9A84C] rounded-full" />
            </button>
            <div className="text-sm text-[#C9A84C] font-medium">GroomAI</div>
          </div>
        </header>

        <main className="p-6">
          {tab === 'dashboard' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-8">
                {stats.map(({ label, value, change, icon: Icon, color }) => (
                  <div key={label} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 hover:border-[#C9A84C]/30 transition-all hover:-translate-y-0.5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-[#1a1a1a] rounded-lg">
                        <Icon size={18} className={color} />
                      </div>
                      <span className={`text-xs flex items-center gap-1 ${change.startsWith('+') ? 'text-green-400' : 'text-gray-500'}`}>
                        <TrendingUp size={12} />{change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="text-2xl font-bold text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">Recent Bookings</h3>
                    <button className="text-xs text-[#C9A84C] hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#0A0A0A] border-b border-[#1a1a1a]">
                          {['Customer', 'Salon', 'Service', 'Date', 'Status', ''].map(h => (
                            <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1a1a1a]">
                        {recentBookings.map((b, i) => (
                          <tr key={i} className="hover:bg-[#1a1a1a] transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs font-bold text-[#C9A84C]">{b.initials}</div>
                                <div>
                                  <p className="text-sm font-medium text-white">{b.customer}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3 text-sm text-gray-400">{b.salon}</td>
                            <td className="px-5 py-3 text-sm text-gray-400">{b.service}</td>
                            <td className="px-5 py-3 text-sm text-gray-400">{b.date}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[b.status]}`}>{b.status}</span>
                            </td>
                            <td className="px-5 py-3 text-right">
                              <button className="text-gray-500 hover:text-white"><MoreVertical size={16} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Performance Trend</h3>
                    <div className="h-28 flex items-end gap-2">
                      {[45, 60, 72, 50, 85, 65, 78].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-gradient-to-t from-[#C9A84C] to-[#C9A84C]/40 rounded-t"
                            style={{ height: `${h}%` }} />
                          <span className="text-[10px] text-gray-500">{['M','T','W','T','F','S','S'][i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Live Feed</h3>
                    <div className="space-y-4">
                      {activityFeed.map((a, i) => (
                        <div key={i} className="flex gap-3">
                          <div className={`w-0.5 rounded-full ${a.active ? 'bg-[#C9A84C]' : 'bg-[#333]'}`} />
                          <div>
                            <p className="text-sm text-white font-medium">{a.title}</p>
                            <p className="text-xs text-gray-500">{a.desc}</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">{a.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'salons' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Salons</h2>
                <button className="bg-[#C9A84C] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b8963e] transition-colors">Add Salon</button>
              </div>
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#0A0A0A] border-b border-[#1a1a1a]">
                      {['Name', 'Location', 'Rating', 'Bookings', 'Status', ''].map(h => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {allSalons.map((s, i) => (
                      <tr key={i} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-white">{s.name}</td>
                        <td className="px-5 py-3 text-sm text-gray-400">{s.location}</td>
                        <td className="px-5 py-3 text-sm text-[#C9A84C]">{s.rating} ★</td>
                        <td className="px-5 py-3 text-sm text-gray-400">{s.bookings}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            s.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'
                          }`}>{s.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right"><MoreVertical size={16} className="text-gray-500" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Users</h2>
                <div className="relative w-64">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input placeholder="Search users..."
                    className="w-full bg-[#111111] border border-[#1a1a1a] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50" />
                </div>
              </div>
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#0A0A0A] border-b border-[#1a1a1a]">
                      {['Name', 'Email', 'Visits', 'Total Spent', 'Joined', ''].map(h => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {allUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-[#1a1a1a] transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-white">{u.name}</td>
                        <td className="px-5 py-3 text-sm text-gray-400">{u.email}</td>
                        <td className="px-5 py-3 text-sm text-gray-400">{u.visits}</td>
                        <td className="px-5 py-3 text-sm text-[#C9A84C]">₹{u.spent.toLocaleString()}</td>
                        <td className="px-5 py-3 text-sm text-gray-400">{u.joined}</td>
                        <td className="px-5 py-3 text-right"><MoreVertical size={16} className="text-gray-500" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'bookings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">All Bookings</h2>
              <div className="flex gap-2 mb-4">
                {['All', 'Confirmed', 'Pending', 'Cancelled'].map(f => (
                  <button key={f} className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    f === 'All' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
                  }`}>{f}</button>
                ))}
              </div>
              <p className="text-sm text-gray-500">38 bookings today. Use the tabs above to filter.</p>
            </div>
          )}

          {tab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
              <p className="text-sm text-gray-500">All customer reviews across salons.</p>
            </div>
          )}

          {tab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">Admin Settings</h2>
              <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-6 space-y-4">
                {[
                  { label: 'Platform Name', value: 'GroomAI' },
                  { label: 'Support Email', value: 'admin@groomai.app' },
                  { label: 'Commission Rate', value: '15%' },
                  { label: 'Currency', value: 'INR (₹)' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-[#1a1a1a] last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm text-white font-medium">{s.label}</p>
                      <p className="text-sm text-gray-500">{s.value}</p>
                    </div>
                    <button className="text-xs text-[#C9A84C] hover:underline">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
