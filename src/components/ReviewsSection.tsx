'use client'
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export default function ReviewsSection({ salonId }: { salonId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/reviews?salonId=${salonId}`)
      .then(r => r.json())
      .then(data => {
        setReviews(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [salonId])

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0'

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">Reviews</h2>
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="bg-[#111111] rounded-xl p-4 border border-[#1a1a1a] animate-pulse h-20" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Reviews</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <Star size={14} className="text-[#C9A84C]" fill="#C9A84C" />
            <span className="text-[#C9A84C] font-semibold">{avgRating}</span>
            <span className="text-gray-500">({reviews.length})</span>
          </div>
        )}
      </div>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="bg-[#111111] rounded-xl p-4 border border-[#1a1a1a]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white text-sm font-medium">{r.user_name}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={12} className={i < r.rating ? 'text-[#C9A84C]' : 'text-gray-600'} fill={i < r.rating ? '#C9A84C' : 'none'} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-gray-400 text-sm">{r.comment}</p>}
              <p className="text-gray-600 text-[10px] mt-1.5">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
