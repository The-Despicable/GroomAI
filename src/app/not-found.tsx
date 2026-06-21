import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <h1 className="text-6xl font-bold text-[#C9A84C] mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
      <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="bg-[#C9A84C] text-black px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        Go Home
      </Link>
    </div>
  )
}
