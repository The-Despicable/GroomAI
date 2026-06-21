'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, Sparkles, MessageSquare, Trash2, X, Star, MapPin, ArrowRight, CheckCircle, ExternalLink } from 'lucide-react'
import { chatWithAI } from '@/lib/api'
import Link from 'next/link'

interface SalonItem { id: string; name: string; location: string; rating: number; priceFrom: number; imageUrl?: string | null }
interface BookingData { service: string; date: string; time: string; salonName: string | null }
interface RebookData { salon: string; service: string; stylist: string; price: number }
interface SalonInfo { id: string; name: string; location: string; rating: number; priceFrom: number; services: string[]; imageUrl?: string | null }

interface Message {
  role: 'user' | 'assistant'
  content: string
  intent?: string
  data?: { salons?: SalonItem[]; booking?: BookingData; rebook?: RebookData; salon?: SalonInfo }
}

const starters = [
  { label: 'Find a barber', prompt: 'Find me a good barber near Banjara Hills' },
  { label: 'Book a haircut', prompt: 'I want to book a haircut' },
  { label: 'Best salons near me', prompt: 'What are the best salons in Jubilee Hills?' },
  { label: 'Grooming tips', prompt: 'How often should I trim my beard?' },
]

function SalonModal({ salon, onClose }: { salon: SalonInfo | SalonItem; onClose: () => void }) {
  const isDetailed = 'services' in salon && salon.services
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {salon.imageUrl && (
          <div className="h-36 bg-gradient-to-br from-[#C9A84C]/20 to-transparent flex items-center justify-center">
            <img src={salon.imageUrl} alt={salon.name} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white">{salon.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={12} className="text-gray-500" />
                <span className="text-xs text-gray-400">{salon.location}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-[#C9A84C]" />
              <span className="text-sm text-white font-medium">{salon.rating}</span>
            </div>
            <span className="text-sm text-[#C9A84C] font-semibold">Starts at ₹{salon.priceFrom}</span>
          </div>

          {isDetailed && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Services</p>
              <div className="space-y-1.5">
                {((salon as SalonInfo).services || []).slice(0, 5).map((svc, i) => (
                  <div key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />
                    {svc}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link href={`/salon/${salon.id}`}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#b8963e] text-black font-medium py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
            <ExternalLink size={14} />View Salon & Book
          </Link>
        </div>
      </div>
    </div>
  )
}

function ConfirmBooking({ data, intent }: { data: BookingData | RebookData; intent: string }) {
  return (
    <div className="bg-[#0a0a0a] border border-[#C9A84C]/20 rounded-xl p-4 mt-3 space-y-3">
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-[#C9A84C]" />
        <span className="text-sm font-medium text-white">
          {intent === 'rebook' ? 'Rebook Appointment' : 'New Booking'}
        </span>
      </div>
      {'salon' in data ? (
        <>
          <div className="text-sm text-gray-300"><span className="text-gray-500">Salon:</span> {data.salon}</div>
          <div className="text-sm text-gray-300"><span className="text-gray-500">Service:</span> {data.service}</div>
          <div className="text-sm text-gray-300"><span className="text-gray-500">Stylist:</span> {(data as RebookData).stylist}</div>
          <div className="text-sm text-gray-300"><span className="text-gray-500">Price:</span> ₹{(data as RebookData).price}</div>
        </>
      ) : (
        <>
          <div className="text-sm text-gray-300"><span className="text-gray-500">Service:</span> {data.service}</div>
          <div className="text-sm text-gray-300"><span className="text-gray-500">When:</span> {data.date} {data.time !== 'your usual time' ? `at ${data.time}` : ''}</div>
          {data.salonName && <div className="text-sm text-gray-300"><span className="text-gray-500">Where:</span> {data.salonName}</div>}
        </>
      )}
      <div className="flex gap-2 pt-1">
        <button className="flex-1 bg-[#C9A84C] text-black text-sm font-medium py-2.5 rounded-xl hover:bg-[#b8963e] transition-colors">
          Confirm ✓
        </button>
        <button className="px-4 bg-[#1a1a1a] text-gray-400 text-sm py-2.5 rounded-xl hover:text-white transition-colors">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I can help you find salons, styles, and bookings in Hyderabad. What are you looking for?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [modalSalon, setModalSalon] = useState<SalonItem | SalonInfo | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send(text?: string) {
    const msg = text || input
    if (!msg.trim()) return
    const userMsg: Message = { role: 'user', content: msg }
    const updated: Message[] = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const res = await chatWithAI(msg, messages)
      setMessages([...updated, { role: 'assistant', content: res.reply, intent: res.intent, data: res.data }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Sorry, AI is unavailable right now.' }])
    }
    setLoading(false)
  }

  function MessageBubble({ msg }: { msg: Message }) {
    if (msg.role === 'user') {
      return (
        <div className="flex justify-end">
          <div className="bg-[#C9A84C] text-black rounded-2xl rounded-tr-md px-4 py-3 text-sm leading-relaxed max-w-[75%]">
            {msg.content}
          </div>
        </div>
      )
    }

    const isFind = msg.intent === 'find' && msg.data?.salons?.length
    const isBook = (msg.intent === 'book' || msg.intent === 'rebook') && msg.data
    const isInfo = msg.intent === 'info' && msg.data?.salon

    return (
      <div className="flex gap-3 justify-start">
        <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-[#C9A84C]/20">
          <Bot size={16} className="text-[#C9A84C]" />
        </div>
        <div className="max-w-[75%]">
          <div className="bg-[#111111] text-white border border-[#1a1a1a] rounded-2xl rounded-tl-md px-4 py-3 text-sm leading-relaxed">
            {msg.content}

            {isFind && (
              <div className="flex flex-wrap gap-2 mt-3">
                {msg.data!.salons!.map(s => (
                  <button key={s.id} onClick={() => setModalSalon(s)}
                    className="border border-[#1a1a1a] hover:border-[#C9A84C]/50 bg-[#0a0a0a] rounded-xl px-3 py-2 text-left transition-all hover:bg-[#0d0d0d] flex-1 min-w-[140px]">
                    <div className="text-sm font-medium text-white">{s.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-[#C9A84C]">₹{s.priceFrom}</span>
                      <span className="text-[10px] text-gray-500">⭐ {s.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isInfo && <SalonInfoCard salon={msg.data!.salon!} />}
          </div>

          {isBook && (
            <ConfirmBooking data={msg.data!.booking || msg.data!.rebook!} intent={msg.intent!} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] max-w-5xl mx-auto relative">
      {showSidebar && (
        <div className="w-60 bg-[#111111] border-r border-[#1a1a1a] flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-[#1a1a1a]">
            <button onClick={() => {
              setMessages([{ role: 'assistant', content: 'Hi! I can help you find salons, styles, and bookings in Hyderabad. What are you looking for?' }])
            }}
              className="w-full flex items-center justify-center gap-2 bg-[#C9A84C] text-black py-2.5 rounded-xl text-sm font-medium hover:bg-[#b8963e] transition-colors">
              <MessageSquare size={14} />New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider px-2">Quick Examples</p>
            {starters.map(s => (
              <button key={s.label} onClick={() => send(s.prompt)}
                className="w-full text-left p-3 rounded-xl hover:bg-[#1a1a1a] transition-colors">
                <p className="text-sm text-white truncate">{s.label}</p>
              </button>
            ))}
          </div>
          <div className="p-3 border-t border-[#1a1a1a]">
            <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-red-400 transition-colors w-full justify-center py-2">
              <Trash2 size={14} />Clear All Chats
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a1a]">
          <button onClick={() => setShowSidebar(!showSidebar)} className="lg:hidden text-gray-500 hover:text-white">
            <MessageSquare size={18} />
          </button>
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <h1 className="text-sm font-semibold text-white">GroomAI Assistant</h1>
          <span className="text-[10px] text-green-400 font-medium">Online</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col gap-4 max-w-3xl mx-auto">
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} />
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-[#C9A84C]" />
                </div>
                <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="mt-6">
                <p className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                  <Sparkles size={12} className="text-[#C9A84C]" />Suggested
                </p>
                <div className="flex flex-wrap gap-2">
                  {starters.map(s => (
                    <button key={s.label} onClick={() => send(s.prompt)}
                      className="text-sm text-gray-400 border border-[#1a1a1a] rounded-xl px-4 py-2.5 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors bg-[#111111]">
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="px-4 py-3 border-t border-[#1a1a1a]">
          <div className="flex gap-2 max-w-3xl mx-auto">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about salons or styles..."
              className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors" />
            <button onClick={() => send()}
              className="bg-gradient-to-r from-[#C9A84C] to-[#b8963e] text-black px-5 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
              disabled={loading}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {modalSalon && <SalonModal salon={modalSalon} onClose={() => setModalSalon(null)} />}
    </div>
  )
}

function SalonInfoCard({ salon }: { salon: SalonInfo }) {
  return (
    <div className="border-t border-[#1a1a1a] mt-3 pt-3 space-y-2">
      <div className="flex items-center gap-2">
        <MapPin size={12} className="text-gray-500" />
        <span className="text-xs text-gray-400">{salon.location}</span>
        <span className="text-xs text-gray-500">·</span>
        <Star size={12} className="text-[#C9A84C]" />
        <span className="text-xs text-white">{salon.rating}</span>
        <span className="text-xs text-[#C9A84C]">₹{salon.priceFrom}+</span>
      </div>
      <div className="space-y-1">
        {(salon.services || []).slice(0, 5).map((svc, i) => (
          <div key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#C9A84C]" />{svc}
          </div>
        ))}
      </div>
      <Link href={`/salon/${salon.id}`}
        className="flex items-center justify-center gap-1 text-xs text-[#C9A84C] hover:text-white border border-[#C9A84C]/30 rounded-xl py-2 mt-2 transition-colors">
        View full details <ArrowRight size={12} />
      </Link>
    </div>
  )
}
