'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { signInWithGoogle, signOut } from '@/lib/auth'
import { User, CalendarDays, Clock, RotateCcw, LogOut, Star, Heart, Settings, Gift } from 'lucide-react'
import Link from 'next/link'

type ProfileTab = 'history' | 'favorites' | 'settings'

interface Appointment {
  id: string; salonName: string; serviceName: string; stylistName: string
  date: string; time: string; price: number; status: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [tab, setTab] = useState<ProfileTab>('history')
  const [history, setHistory] = useState<Appointment[]>([])
  const [rebooking, setRebooking] = useState(false)

  useEffect(() => {
    if (user) {
      fetch(`/api/rebook?userId=${user.uid}`).then(r => r.json()).then(setHistory).catch(() => {})
    }
  }, [user])

  async function handleRebook(appointmentId: string) {
    setRebooking(true)
    try {
      const res = await fetch('/api/rebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.uid, appointmentId }),
      })
      if (res.ok) {
        const data = await res.json()
        setHistory(prev => [data, ...prev])
      }
    } catch { alert('Rebook failed') }
    setRebooking(false)
  }

  if (loading) {
    return <div className="px-4 py-6 max-w-2xl mx-auto"><div className="h-48 bg-[#111111] rounded-2xl animate-pulse border border-[#1a1a1a]" /></div>
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-2xl mx-auto text-center">
        <User size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 mb-4">Sign in to view your profile</p>
        <button onClick={signInWithGoogle} className="bg-[#C9A84C] text-black px-6 py-2.5 rounded-xl font-medium hover:bg-[#b8963e] transition-colors">Sign In with Google</button>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <div className="bg-gradient-to-b from-[#111111] to-[#0A0A0A] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 flex items-center justify-center ring-2 ring-[#C9A84C]/30">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <User size={28} className="text-[#C9A84C]" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">{user.displayName || 'User'}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
            <p className="text-xs text-gray-600 mt-0.5">Member since June 2026</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#1a1a1a]">
          {[
            { icon: CalendarDays, label: 'Total Visits', value: '12' },
            { icon: Gift, label: 'Loyalty Points', value: '4' },
            { icon: Star, label: 'Reviews', value: '3' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="text-center">
              <Icon size={18} className="mx-auto text-[#C9A84C] mb-1" />
              <p className="text-lg font-bold text-white">{value}</p>
              <p className="text-[10px] text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {([
          { key: 'history' as ProfileTab, label: 'History', icon: CalendarDays },
          { key: 'favorites' as ProfileTab, label: 'Favorites', icon: Heart },
          { key: 'settings' as ProfileTab, label: 'Settings', icon: Settings },
        ]).map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl text-sm border transition-colors justify-center ${
              tab === key ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[#1a1a1a] text-gray-400 hover:border-[#C9A84C]/50'
            }`}>
            <Icon size={16} />{label}
          </button>
        ))}
      </div>

      {tab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No appointment history yet.</p>
              <Link href="/explore" className="text-[#C9A84C] text-sm mt-2 inline-block hover:underline">Book your first appointment</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {history.map(a => (
                <div key={a.id} className="bg-[#111111] border border-[#1a1a1a] rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{a.salonName}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{a.serviceName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <Clock size={11} />{a.date} · {a.time}
                        {a.stylistName && <span>· {a.stylistName}</span>}
                      </div>
                    </div>
                    <span className="text-[#C9A84C] font-semibold">₹{a.price}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {a.status === 'completed' && (
                      <button onClick={() => handleRebook(a.id)} disabled={rebooking}
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-[#C9A84C]/10 text-[#C9A84C] py-1.5 rounded-lg hover:bg-[#C9A84C]/20 transition-colors disabled:opacity-50">
                        <RotateCcw size={12} />{rebooking ? 'Rebooking...' : 'Rebook'}
                      </button>
                    )}
                    <span className={`text-xs capitalize px-2 py-1.5 rounded-lg ${
                      a.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                      a.status === 'upcoming' ? 'bg-blue-400/10 text-blue-400' : 'bg-red-400/10 text-red-400'
                    }`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'favorites' && (
        <div className="text-center py-10">
          <Heart size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No favorite salons yet.</p>
          <Link href="/explore" className="text-[#C9A84C] text-sm mt-2 inline-block hover:underline">Explore salons</Link>
        </div>
      )}

      {tab === 'settings' && (
        <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
          {[
            { label: 'Name', value: user.displayName || 'Not set' },
            { label: 'Email', value: user.email || 'Not set' },
            { label: 'Phone', value: 'Not set' },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a] last:border-0">
              <div>
                <p className="text-sm text-gray-400">{s.label}</p>
                <p className="text-sm text-white font-medium">{s.value}</p>
              </div>
              <button className="text-xs text-[#C9A84C] hover:underline">Edit</button>
            </div>
          ))}
          <div className="px-5 py-3.5 border-t border-[#1a1a1a] flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Push Notifications</p>
              <p className="text-xs text-gray-500">Get booking reminders and offers</p>
            </div>
            <div className="w-10 h-5 bg-[#C9A84C] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
            </div>
          </div>
          <div className="px-5 py-3.5 border-t border-[#1a1a1a] flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium">Dark Mode</p>
              <p className="text-xs text-gray-500">Always on (default)</p>
            </div>
            <div className="w-10 h-5 bg-[#C9A84C] rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5" />
            </div>
          </div>
        </div>
      )}

      <button onClick={signOut}
        className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-3 rounded-xl hover:bg-red-500/20 transition-colors text-sm mt-6">
        <LogOut size={16} />Sign Out
      </button>
    </div>
  )
}
