'use client'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signInWithGoogle } from '@/lib/firebase'
import { Users, CalendarDays, TrendingUp, ArrowLeft, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import Link from 'next/link'

type Tab = 'crm' | 'appointments' | 'revenue'

const mockCustomers = [
  { id: 'c1', name: 'Arun Kumar', email: 'arun@email.com', phone: '+91-9876543210', totalVisits: 12, lastVisit: '2026-06-15', totalSpent: 8400 },
  { id: 'c2', name: 'Neha Sharma', email: 'neha@email.com', phone: '+91-9876543211', totalVisits: 8, lastVisit: '2026-06-14', totalSpent: 5200 },
  { id: 'c3', name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91-9876543212', totalVisits: 5, lastVisit: '2026-06-13', totalSpent: 3500 },
  { id: 'c4', name: 'Priya Patel', email: 'priya@email.com', phone: '+91-9876543213', totalVisits: 3, lastVisit: '2026-06-10', totalSpent: 1800 },
  { id: 'c5', name: 'Rahul Verma', email: 'rahul@email.com', phone: '+91-9876543214', totalVisits: 15, lastVisit: '2026-06-18', totalSpent: 12000 },
]

const mockAppointments = [
  { id: 'a1', customer: 'Arun Kumar', service: 'Haircut', stylist: 'Rajesh', date: '2026-06-19', time: '10:00 AM', status: 'upcoming', price: 399 },
  { id: 'a2', customer: 'Neha Sharma', service: 'Facial', stylist: 'Priya', date: '2026-06-19', time: '11:30 AM', status: 'upcoming', price: 599 },
  { id: 'a3', customer: 'Vikram Singh', service: 'Hair + Beard', stylist: 'Rajesh', date: '2026-06-19', time: '2:00 PM', status: 'upcoming', price: 499 },
  { id: 'a4', customer: 'Rahul Verma', service: 'Premium Haircut', stylist: 'Rajesh', date: '2026-06-18', time: '4:00 PM', status: 'completed', price: 550 },
  { id: 'a5', customer: 'Priya Patel', service: 'Manicure', stylist: 'Priya', date: '2026-06-18', time: '5:00 PM', status: 'completed', price: 399 },
]

const mockRevenue = {
  today: 1497,
  thisWeek: 8450,
  thisMonth: 32000,
  lastMonth: 28500,
  topServices: [
    { name: 'Haircut', count: 45, revenue: 17955 },
    { name: 'Beard Trim', count: 32, revenue: 6368 },
    { name: 'Facial', count: 18, revenue: 10782 },
    { name: 'Spa Massage', count: 12, revenue: 11988 },
  ],
  dailyData: [3200, 2800, 4100, 3600, 2900, 4500, 3800],
}

const statusIcon: Record<string, any> = {
  upcoming: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  completed: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  cancelled: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<Tab>('appointments')

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-4xl mx-auto">
        <div className="h-32 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <TrendingUp size={40} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to access the salon dashboard</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">
          Sign In
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-white">Salon Dashboard</h1>
        </div>
        <span className="text-xs bg-[#C9A84C]/10 text-[#C9A84C] px-3 py-1 rounded-full font-medium">
          The Groom Room
        </span>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {([
          { key: 'appointments' as Tab, label: 'Appointments', icon: CalendarDays },
          { key: 'crm' as Tab, label: 'CRM', icon: Users },
          { key: 'revenue' as Tab, label: 'Revenue', icon: TrendingUp },
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
        <div className="flex flex-col gap-3">
          {mockAppointments.filter(a => a.status === 'upcoming').length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Today</h2>
              {mockAppointments.filter(a => a.status === 'upcoming').map(a => {
                const st = statusIcon[a.status] || statusIcon.upcoming
                const Icon = st.icon
                return (
                  <div key={a.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 mb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-white">{a.customer}</p>
                        <p className="text-sm text-gray-400 mt-0.5">{a.service} · {a.stylist}</p>
                        <p className="text-xs text-gray-500 mt-1">{a.date} · {a.time}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#C9A84C] font-semibold">₹{a.price}</span>
                        <span className={`flex items-center gap-1 text-xs capitalize ${st.color}`}>
                          <Icon size={12} />{a.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 text-xs bg-green-500/10 text-green-400 py-1.5 rounded-lg hover:bg-green-500/20 transition-colors">
                        Confirm
                      </button>
                      <button className="flex-1 text-xs bg-red-500/10 text-red-400 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <h2 className="text-sm font-semibold text-gray-400 mb-1 uppercase tracking-wide">Past</h2>
          {mockAppointments.filter(a => a.status === 'completed').map(a => (
            <div key={a.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 opacity-70">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-white">{a.customer}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{a.service} · {a.stylist}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.date} · {a.time}</p>
                </div>
                <span className="text-[#C9A84C] font-semibold">₹{a.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'crm' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-400">{mockCustomers.length} customers</p>
            <input placeholder="Search customers..."
              className="bg-[#111111] border border-[#1a1a1a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50 w-48" />
          </div>
          <div className="flex flex-col gap-2">
            {mockCustomers.map(c => (
              <div key={c.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#C9A84C]/20 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.email} · {c.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#C9A84C] font-semibold">₹{c.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{c.totalVisits} visits</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-gray-500">
                  <span>Last: {c.lastVisit}</span>
                  <span className="text-[#C9A84C]">View History →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'revenue' && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Today', value: `₹${mockRevenue.today.toLocaleString()}`, change: '+12%', icon: DollarSign },
              { label: 'This Week', value: `₹${mockRevenue.thisWeek.toLocaleString()}`, change: '+8%', icon: TrendingUp },
              { label: 'This Month', value: `₹${mockRevenue.thisMonth.toLocaleString()}`, change: '+15%', icon: TrendingUp },
            ].map(({ label, value, change, icon: Icon }) => (
              <div key={label} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                  <Icon size={14} className="text-[#C9A84C]" />
                  {label}
                </div>
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-green-400 mt-1">{change}</p>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Top Services</h2>
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl overflow-hidden mb-6">
            {mockRevenue.topServices.map((s, i) => (
              <div key={s.name} className={`flex items-center justify-between px-4 py-3 ${i < mockRevenue.topServices.length - 1 ? 'border-b border-[#1a1a1a]' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 text-sm w-5">{i + 1}</span>
                  <span className="text-white text-sm font-medium">{s.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-[#C9A84C] text-sm font-semibold">₹{s.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{s.count} bookings</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Weekly Trend</h2>
          <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
            <div className="flex items-end gap-2 h-32">
              {mockRevenue.dailyData.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-[#C9A84C] rounded-t-md transition-all hover:opacity-80"
                    style={{ height: `${(v / 4500) * 100}%` }}
                  />
                  <span className="text-[10px] text-gray-500">{(['Mon','Tue','Wed','Thu','Fri','Sat','Sun'])[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
