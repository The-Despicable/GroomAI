'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { chatWithAI, type ChatMessage } from '@/lib/api'
import ChatMessageComponent from '@/components/ChatMessage'

const starters = ['Find beard salons near me', 'Best haircut styles 2025', 'Trending salon services in Banjara Hills']

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    const res = await chatWithAI(input.trim(), messages)
    if (res) {
      setMessages((prev) => [...prev, { role: 'assistant', content: res.reply }])
    } else {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Sparkles size={24} className="text-[#C9A84C]" />
        GroomAI Assistant
      </h2>

      <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Ask me anything about grooming!</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s) }}
                    className="px-4 py-2 bg-[#1A1A1A] border border-gray-700 rounded-full text-sm text-gray-400 hover:border-[#C9A84C] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <ChatMessageComponent key={i} msg={msg} />
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#1A1A1A] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
            placeholder="Ask about salons, styles, or recommendations..."
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="p-3 bg-[#C9A84C] text-black rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}