import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'

let mockUsers: any[] = [
  { id: 'u1', uid: 'u1', email: 'arun@email.com', name: 'Arun Kumar', phone: '+919876543210' },
  { id: 'u2', uid: 'u2', email: 'priya@email.com', name: 'Priya Sharma', phone: '+919876543211' },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')

  if (uid) {
    const { data: ctx } = await createServerClient(request)
    if (ctx) {
      const { data } = await ctx.supabase.from('users').select('*').eq('uid', uid).single()
      if (data) return NextResponse.json(data)
    }
    return NextResponse.json(mockUsers.find(u => u.uid === uid) || null)
  }

  const { data: ctx } = await createServerClient(request)
  if (ctx) {
    const { data } = await ctx.supabase.from('users').select('*')
    if (data) return NextResponse.json(data)
  }
  return NextResponse.json(mockUsers)
}

export async function POST(request: Request) {
  const body = await request.json()

  const { data: ctx } = await createAdminClient(request)
  if (ctx) {
    const { data, error } = await ctx.supabase.from('users').upsert(body).select().single()
    if (!error && data) return NextResponse.json(data, { status: 201 })
  }

  const existing = mockUsers.findIndex(u => u.uid === body.uid)
  if (existing >= 0) {
    mockUsers[existing] = { ...mockUsers[existing], ...body }
    return NextResponse.json(mockUsers[existing])
  }
  const user = { id: `u${Date.now()}`, ...body }
  mockUsers.push(user)
  return NextResponse.json(user, { status: 201 })
}
