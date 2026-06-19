import { NextResponse } from 'next/server'

let mockReviews: any[] = [
  { id: 'r1', userId: 'u1', salonId: '1', rating: 5, comment: 'Best haircut in Banjara Hills!', userName: 'Arun', created_at: '2026-06-15T10:00:00Z' },
  { id: 'r2', userId: 'u2', salonId: '1', rating: 4, comment: 'Great service, friendly staff.', userName: 'Neha', created_at: '2026-06-14T14:30:00Z' },
  { id: 'r3', userId: 'u3', salonId: '2', rating: 5, comment: 'Amazing spa experience!', userName: 'Vikram', created_at: '2026-06-13T09:15:00Z' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const salonId = searchParams.get('salonId')
  const filtered = salonId ? mockReviews.filter(r => r.salonId === salonId) : mockReviews
  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { userId, salonId, rating, comment, userName } = body

  if (!userId || !salonId || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const review = {
    id: `r_${Date.now()}`,
    userId,
    salonId,
    rating,
    comment: comment || '',
    userName: userName || 'Anonymous',
    created_at: new Date().toISOString(),
  }

  mockReviews.push(review)
  return NextResponse.json(review, { status: 201 })
}
