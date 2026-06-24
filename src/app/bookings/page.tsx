'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { signInWithGoogle } from '@/lib/auth'
import { getBookings } from '@/lib/api'
import { CalendarDays, Search, RotateCcw, XCircle, Star } from 'lucide-react'
import Link from 'next/link'

type StatusFilter = 'all' | 'upcoming' | 'completed' | 'cancelled'

const statusBadge: Record<string, string> = {
  upcoming: 'bg-green-500/10 text-green-400 border-green-500/30',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

const timeSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM']

export default function BookingsPage() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [rescheduleId, setRescheduleId] = useState<string | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getBookings(user.id).then(data => {
      setBookings(data)
      setLoading(false)
    })
  }, [user])

  async function handleCancel(id: string) {
    if (!confirm('Cancel this booking?')) return
    setActionLoading(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))
      } else {
        alert('Could not cancel booking. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    }
    setActionLoading(null)
  }

  async function handleReschedule(id: string) {
    if (!newDate || !newTime) { alert('Pick a date and time slot first.'); return }
    setActionLoading(id)
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, time: newTime }),
      })
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, date: newDate, time: newTime } : b))
        setRescheduleId(null)
        setNewDate('')
        setNewTime('')
      } else {
        alert('Could not reschedule. Please try again.')
      }
    } catch {
      alert('Network error. Please try again.')
    }
    setActionLoading(null)
  }

  const filtered = bookings.filter(b => {
    const salonName = b.salons?.name || b.salon_name || b.salonName || ''
    const matchesSearch = search === '' ||
      salonName.toLowerCase().includes(search.toLowerCase()) ||
      (b.service || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!isLoaded || loading) {
    return <div className="px-4 py-6 max-w-2xl mx-auto"><div className="h-32 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" /></div>
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <CalendarDays size={40} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to view your bookings</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">Sign In</button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-white">My Bookings</h1>
        <span className="text-xs text-gray-500 bg-[#111111] border border-[#1a1a1a] px-3 py-1 rounded-full">
          {bookings.length} total
        </span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search bookings..."
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50" />
        </div>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {(['all', 'upcoming', 'completed', 'cancelled'] as StatusFilter[]).map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors capitalize ${
              statusFilter === f ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
            }`}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays size={36} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm mb-3">
            {search || statusFilter !== 'all' ? 'No matching bookings found.' : 'No bookings yet.'}
          </p>
          {!search && statusFilter === 'all' && (
            <Link href="/explore" className="text-[#C9A84C] text-sm hover:underline">Find a salon</Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((b: any) => {
            const salonName = b.salons?.name || b.salon_name || b.salonName || 'Salon'
            const isRescheduling = rescheduleId === b.id
            const isActing = actionLoading === b.id
            return (
              <div key={b.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#C9A84C]/20 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{salonName}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${statusBadge[b.status] || statusBadge.upcoming}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-0.5">{b.service}</p>
                    <p className="text-xs text-gray-500 mt-1">{b.date} · {b.time}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[#C9A84C] font-semibold">₹{b.price}</span>
                  </div>
                </div>

                {isRescheduling && (
                  <div className="mt-3 pt-3 border-t border-[#1a1a1a] space-y-2">
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#0A0A0A] border border-[#1a1a1a] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-[#C9A84C]/50" />
                    <div className="grid grid-cols-4 gap-1.5">
                      {timeSlots.map(t => (
                        <button key={t} onClick={() => setNewTime(t)}
                          className={`py-1.5 rounded-lg text-[10px] border transition-colors ${
                            newTime === t ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
                          }`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleReschedule(b.id)} disabled={isActing || !newDate || !newTime}
                        className="flex-1 text-xs bg-[#C9A84C] text-black py-1.5 rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity">
                        {isActing ? 'Saving...' : 'Confirm'}
                      </button>
                      <button onClick={() => { setRescheduleId(null); setNewDate(''); setNewTime('') }}
                        className="flex-1 text-xs border border-[#1a1a1a] text-gray-400 py-1.5 rounded-lg hover:border-[#C9A84C]/50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t border-[#1a1a1a]">
                  {b.status === 'upcoming' && !isRescheduling && (
                    <>
                      <button onClick={() => setRescheduleId(b.id)}
                        className="flex-1 flex items-center justify-center gap-1 text-xs bg-[#C9A84C]/10 text-[#C9A84C] py-1.5 rounded-lg hover:bg-[#C9A84C]/20 transition-colors">
                        <RotateCcw size={12} />Reschedule
                      </button>
                      <button onClick={() => handleCancel(b.id)} disabled={isActing}
                        className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-500/10 text-red-400 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-40">
                        <XCircle size={12} />{isActing ? 'Cancelling...' : 'Cancel'}
                      </button>
                    </>
                  )}
                  {b.status === 'completed' && (
                    <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-[#C9A84C]/10 text-[#C9A84C] py-1.5 rounded-lg hover:bg-[#C9A84C]/20 transition-colors">
                      <RotateCcw size={12} />Rebook
                    </button>
                  )}
                  {b.status === 'completed' && (
                    <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-blue-500/10 text-blue-400 py-1.5 rounded-lg hover:bg-blue-500/20 transition-colors">
                      <Star size={12} />Review
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
