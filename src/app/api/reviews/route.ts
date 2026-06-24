import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

import realSalons from '@/data/real_salons.json'
const rSalons = realSalons as any[]
let mockReviews: any[] = [
  { id: 'r1', user_id: 'u1', salon_id: rSalons[0]?.id || '00000000-0000-4000-a000-000000000001', rating: 5, comment: 'Best haircut in Banjara Hills!', user_name: 'Arun', created_at: '2026-06-15T10:00:00Z' },
  { id: 'r2', user_id: 'u2', salon_id: rSalons[0]?.id || '00000000-0000-4000-a000-000000000001', rating: 4, comment: 'Great service, friendly staff.', user_name: 'Neha', created_at: '2026-06-14T14:30:00Z' },
  { id: 'r3', user_id: 'u3', salon_id: rSalons[1]?.id || '00000000-0000-4000-a000-000000000002', rating: 5, comment: 'Amazing spa experience!', user_name: 'Vikram', created_at: '2026-06-13T09:15:00Z' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const salonId = searchParams.get('salonId')

  const { data: ctx } = await createAdminClient(request)
  if (ctx) {
    let query = ctx.supabase.from('reviews').select('*')
    if (salonId) query = query.eq('salon_id', salonId)
    const { data } = await query.order('created_at', { ascending: false })
    if (data) return NextResponse.json(data)
  }

  const filtered = salonId ? mockReviews.filter(r => r.salon_id === salonId) : mockReviews
  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { user_id, salon_id, rating, comment, user_name } = body
  if (!user_id || !salon_id || !rating) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: ctx } = await createAdminClient(request)
  if (ctx) {
    const { data, error } = await ctx.supabase.from('reviews').insert({
      user_id, salon_id, rating, comment: comment || '', user_name: user_name || 'Anonymous',
    }).select().single()
    if (!error && data) return NextResponse.json(data, { status: 201 })
  }

  const review = { id: `r_${Date.now()}`, user_id, salon_id, rating, comment: comment || '', user_name: user_name || 'Anonymous', created_at: new Date().toISOString() }
  mockReviews.push(review)
  return NextResponse.json(review, { status: 201 })
}
