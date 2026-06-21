import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const updates: Record<string, string> = {}
  if (body.status) updates.status = body.status
  if (body.date) updates.date = body.date
  if (body.time) updates.time = body.time

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data: ctx } = await createAdminClient(req)
  if (!ctx) {
    return NextResponse.json({ error: 'Database not available' }, { status: 503 })
  }

  const { data, error } = await ctx.supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
