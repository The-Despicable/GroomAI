import type { ChatMessage as ChatMessageType } from '../lib/api'
import { Bot, User } from 'lucide-react'

export default function ChatMessage({ msg }: { msg: ChatMessageType }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-[#C9A84C]' : 'bg-gray-700'}`}>
        {isUser ? <User size={16} className="text-black" /> : <Bot size={16} className="text-white" />}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser ? 'bg-[#C9A84C] text-black' : 'bg-[#1A1A1A] text-white border border-gray-800'}`}
      >
        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
      </div>
    </div>
  )
}