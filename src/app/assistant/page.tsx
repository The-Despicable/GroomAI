'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Bot } from 'lucide-react'
import { chatWithAI } from '@/lib/api'

interface Message { role: 'user' | 'assistant'; content: string }

const starters = ['Find beard salons near me', 'Best haircut styles 2025', 'Book a spa near Banjara Hills']

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'Hi! I can help you find salons, styles, and bookings in Hyderabad. What are you looking for?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function send(text?: string) {
    const msg = text || input
    if (!msg.trim()) return
    const updated: Message[] = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setInput('')
    setLoading(true)
    try {
      const data = await chatWithAI(msg, messages)
      setMessages([...updated, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([...updated, { role: 'assistant', content: 'Sorry, AI is unavailable right now.' }])
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-2xl mx-auto px-4 py-4">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 mt-1"><Bot size={14} className="text-[#C9A84C]" /></div>}
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#C9A84C] text-black' : 'bg-[#111111] text-white border border-[#1a1a1a]'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-7 h-7 h-7 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0 mt-1"><Bot size={14} className="text-[#C9A84C]" /></div>
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-2xl px-4 py-2.5"><span className="animate-pulse text-gray-400 text-sm">Thinking...</span></div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex flex-col gap-2 mt-4">
            {starters.map(s => <button key={s} onClick={() => send(s)} className="text-left text-sm text-gray-400 border border-[#1a1a1a] rounded-xl px-4 py-2.5 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors">{s}</button>)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2 pt-2 border-t border-[#1a1a1a]">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about salons or styles..."
          className="flex-1 bg-[#111111] border border-[#1a1a1a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C9A84C]/50" />
        <button onClick={() => send()} className="bg-[#C9A84C] text-black px-4 rounded-xl hover:bg-[#b8963e] transition-colors disabled:opacity-50" disabled={loading}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}