import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  const { data: ctx } = await createServerClient(request)
  if (ctx) {
    let query = ctx.supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    const { data } = await query
    if (data) return NextResponse.json(data)
  }

  return NextResponse.json([])
}

export async function POST(request: Request) {
  const body = await request.json()
  const { user_id, booking_id } = body

  const { data: ctx } = await createServerClient(request)
  if (ctx && booking_id) {
    const { data: original } = await ctx.supabase
      .from('bookings').select('*').eq('id', booking_id).single()
    if (original) {
      const { data, error } = await ctx.supabase.from('bookings').insert({
        user_id: user_id || original.user_id,
        salon_id: original.salon_id,
        service: original.service,
        price: original.price,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        status: 'upcoming',
      }).select().single()
      if (!error && data) return NextResponse.json(data, { status: 201 })
    }
  }

  const newBooking = { id: String(Date.now()), ...body, status: 'upcoming', created_at: new Date().toISOString() }
  return NextResponse.json(newBooking, { status: 201 })
}
