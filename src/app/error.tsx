'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-red-400 text-2xl">!</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-gray-500 mb-6">An unexpected error occurred. Please try again.</p>
      <button
        onClick={reset}
        className="bg-[#C9A84C] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        Try Again
      </button>
    </div>
  )
}