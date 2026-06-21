export default function Loading() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="w-3 h-3 bg-[#C9A84C] rounded-full animate-bounce" />
        <div className="w-3 h-3 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-3 h-3 bg-[#C9A84C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-gray-500 mt-4">Loading...</p>
    </div>
  )
}