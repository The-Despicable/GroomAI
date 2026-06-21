import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

// shared reference to the same mock array as route.ts
// import if you extract to a shared module, or redeclare as fallback
let mockBookings: any[] = (globalThis as any).__mockBookings ??= []

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const updates: Record<string, string> = {}
  if (body.status) updates.status = body.status
  if (body.date)   updates.date   = body.date
  if (body.time)   updates.time   = body.time

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: ctx } = await createAdminClient(req)
  if (ctx) {
    const { data, error } = await ctx.supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error && data) return NextResponse.json(data)
  }

  // mock fallback — mirrors route.ts pattern
  const idx = mockBookings.findIndex(b => b.id === id)
  if (idx >= 0) {
    mockBookings[idx] = { ...mockBookings[idx], ...updates }
    return NextResponse.json(mockBookings[idx])
  }
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
