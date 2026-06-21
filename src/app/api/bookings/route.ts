import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'

let mockBookings: any[] = (globalThis as any).__mockBookings ??= []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  const { data: ctx } = await createServerClient(request)
  if (ctx) {
    let query = ctx.supabase.from('bookings').select('*, salons (id, name, address, image_url, rating)')
    if (userId) query = query.eq('user_id', userId)
    const { data, error } = await query.order('created_at', { ascending: false })
    if (!error && data) return NextResponse.json(data)
  }

  const filtered = userId ? mockBookings.filter(b => b.user_id === userId) : mockBookings
  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  const body = await request.json()

  const { data: ctx } = await createAdminClient(request)
  if (ctx) {
    const { user_id, salon_id, service, date, time } = body
    if (!user_id || !salon_id || !service || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const { data, error } = await ctx.supabase
      .from('bookings')
      .insert({ user_id, salon_id, service, date, time, status: 'upcoming' })
      .select().single()
    if (!error && data) return NextResponse.json(data, { status: 201 })
  }

  const newBooking = { id: String(Date.now()), ...body, status: 'upcoming', created_at: new Date().toISOString() }
  mockBookings.push(newBooking)
  return NextResponse.json(newBooking, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, ...updates } = body

  const { data: ctx } = await createAdminClient(request)
  if (ctx && id) {
    const { data, error } = await ctx.supabase.from('bookings').update(updates).eq('id', id).select().single()
    if (!error && data) return NextResponse.json(data)
  }

  const idx = mockBookings.findIndex(b => b.id === id)
  if (idx >= 0) { mockBookings[idx] = { ...mockBookings[idx], ...updates }; return NextResponse.json(mockBookings[idx]) }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
