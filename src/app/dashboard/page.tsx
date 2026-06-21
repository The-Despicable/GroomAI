'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signInWithGoogle } from '@/lib/auth'
import { Users, CalendarDays, TrendingUp, ArrowLeft, Clock, CheckCircle, XCircle, DollarSign, Search, Star } from 'lucide-react'
import Link from 'next/link'

type Tab = 'appointments' | 'crm' | 'analytics'

const mockRevenue = {
  today: 8450, thisWeek: 48500, thisMonth: 182000, totalCustomers: 156, rating: 4.8,
  topServices: [
    { name: 'Haircut', count: 45, revenue: 17955 },
    { name: 'Beard Trim', count: 32, revenue: 6368 },
    { name: 'Facial', count: 18, revenue: 10782 },
    { name: 'Spa Massage', count: 12, revenue: 11988 },
  ],
  dailyData: [45, 60, 72, 50, 85, 65, 78],
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
}

const mockAppointments = [
  { id: 'a1', customer: 'Arun Kumar', service: 'Haircut', stylist: 'Rajesh', time: '10:00 AM', status: 'upcoming', price: 399 },
  { id: 'a2', customer: 'Neha Sharma', service: 'Facial', stylist: 'Priya', time: '11:30 AM', status: 'upcoming', price: 599 },
  { id: 'a3', customer: 'Vikram Singh', service: 'Hair + Beard', stylist: 'Rajesh', time: '2:00 PM', status: 'upcoming', price: 499 },
  { id: 'a4', customer: 'Rahul Verma', service: 'Premium Haircut', stylist: 'Rajesh', time: '4:00 PM', status: 'completed', price: 550 },
  { id: 'a5', customer: 'Priya Patel', service: 'Manicure', stylist: 'Priya', time: '5:00 PM', status: 'completed', price: 399 },
]

const mockCustomers = [
  { name: 'Arun Kumar', phone: '+91-9876543210', visits: 12, lastVisit: '2026-06-15', spent: 8400 },
  { name: 'Neha Sharma', phone: '+91-9876543211', visits: 8, lastVisit: '2026-06-14', spent: 5200 },
  { name: 'Vikram Singh', phone: '+91-9876543212', visits: 5, lastVisit: '2026-06-13', spent: 3500 },
  { name: 'Priya Patel', phone: '+91-9876543213', visits: 3, lastVisit: '2026-06-10', spent: 1800 },
  { name: 'Rahul Verma', phone: '+91-9876543214', visits: 15, lastVisit: '2026-06-18', spent: 12000 },
]

const statusIcon: Record<string, any> = {
  upcoming: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('appointments')
  const [search, setSearch] = useState('')

  if (loading) {
    return <div className="px-4 py-6 max-w-4xl mx-auto"><div className="h-32 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" /></div>
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <TrendingUp size={40} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to access the salon dashboard</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">Sign In</button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors"><ArrowLeft size={20} /></Link>
          <h1 className="text-xl font-bold text-white">Salon Dashboard</h1>
        </div>
        <span className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1 rounded-full font-medium">The Groom Room</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Today\'s Appointments', value: '12', icon: CalendarDays, change: '+2' },
          { label: 'Revenue Today', value: `₹${mockRevenue.today.toLocaleString()}`, icon: TrendingUp, change: '+18%' },
          { label: 'Total Customers', value: String(mockRevenue.totalCustomers), icon: Users, change: '+8%' },
          { label: 'Rating', value: String(mockRevenue.rating), icon: Star, change: 'Stable' },
        ].map(({ label, value, icon: Icon, change }) => (
          <div key={label} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
              <Icon size={14} className="text-[#C9A84C]" />{label}
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-400' : 'text-gray-500'}`}>{change}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {([
          { key: 'appointments' as Tab, label: 'Appointments', icon: CalendarDays },
          { key: 'crm' as Tab, label: 'Customers', icon: Users },
          { key: 'analytics' as Tab, label: 'Analytics', icon: TrendingUp },
        ]).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 flex-shrink-0 px-4 py-2 rounded-xl text-sm border transition-colors ${
              tab === key ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
            }`}>
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {tab === 'appointments' && (
        <div className="space-y-3">
          {(['upcoming', 'completed'] as const).map(group => {
            const items = mockAppointments.filter(a => a.status === group)
            if (items.length === 0) return null
            return (
              <div key={group}>
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {group === 'upcoming' ? 'Today' : 'Past'}
                </h2>
                {items.map(a => {
                  const st = statusIcon[a.status] || statusIcon.upcoming
                  const Icon = st.icon
                  return (
                    <div key={a.id} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 mb-2 hover:border-[#C9A84C]/20 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-full min-h-[3rem] rounded-full mt-1 ${st.bg}`} />
                          <div>
                            <p className="font-medium text-white">{a.customer}</p>
                            <p className="text-sm text-gray-400 mt-0.5">{a.service} · {a.stylist}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[#C9A84C] font-semibold">₹{a.price}</span>
                          <p className={`flex items-center gap-1 text-xs mt-1 capitalize ${st.color}`}>
                            <Icon size={12} />{a.status}
                          </p>
                        </div>
                      </div>
                      {a.status === 'upcoming' && (
                        <div className="flex gap-2 mt-3 pl-5">
                          <button className="flex-1 text-xs bg-green-500/10 text-green-400 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                            <CheckCircle size={12} className="inline mr-1" />Confirm
                          </button>
                          <button className="flex-1 text-xs bg-red-500/10 text-red-400 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                            <XCircle size={12} className="inline mr-1" />Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'crm' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{mockCustomers.length} customers</p>
            <div className="relative w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full bg-[#111111] border border-[#1a1a1a] rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50" />
            </div>
          </div>
          <div className="space-y-2">
            {mockCustomers.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
              <div key={c.name} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4 hover:border-[#C9A84C]/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-sm font-bold text-[#C9A84C]">
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-white">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#C9A84C] font-semibold">₹{c.spent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{c.visits} visits</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span>Last visit: {c.lastVisit}</span>
                  <span className="text-[#C9A84C] cursor-pointer hover:underline">View History →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Today', value: `₹${mockRevenue.today.toLocaleString()}`, change: '+22%' },
              { label: 'This Week', value: `₹${mockRevenue.thisWeek.toLocaleString()}`, change: '+15%' },
              { label: 'This Month', value: `₹${mockRevenue.thisMonth.toLocaleString()}`, change: '+18%' },
            ].map(({ label, value, change }) => (
              <div key={label} className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-green-400 mt-1">↑ {change}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl p-5 mb-5">
            <h3 className="text-sm font-semibold text-white mb-4">Weekly Revenue</h3>
            <div className="h-36 flex items-end gap-2">
              {mockRevenue.dailyData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="w-full bg-gradient-to-t from-[#C9A84C] to-[#C9A84C]/40 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${v}%` }} />
                  <span className="text-[10px] text-gray-500">{mockRevenue.days[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Top Services</h3>
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-xl overflow-hidden">
            {mockRevenue.topServices.map((s, i) => (
              <div key={s.name} className={`flex items-center justify-between px-5 py-3 ${i < mockRevenue.topServices.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                  <div>
                    <span className="text-white text-sm font-medium">{s.name}</span>
                    <p className="text-xs text-gray-500">{s.count} bookings</p>
                  </div>
                </div>
                <span className="text-[#C9A84C] text-sm font-semibold">₹{s.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
