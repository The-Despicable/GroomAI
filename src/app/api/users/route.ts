import { NextResponse } from 'next/server'

let mockUsers: Record<string, any> = {}

export async function POST(request: Request) {
  const body = await request.json()
  const { firebaseUid, email, name } = body

  if (!firebaseUid) {
    return NextResponse.json({ error: 'firebaseUid required' }, { status: 400 })
  }

  const user = {
    id: `u_${firebaseUid}`,
    firebaseUid,
    email: email || '',
    name: name || 'User',
    role: 'customer',
    created_at: new Date().toISOString(),
  }

  mockUsers[firebaseUid] = user
  return NextResponse.json(user, { status: 201 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const firebaseUid = searchParams.get('firebaseUid')
  const user = mockUsers[firebaseUid || '']
  if (!user) return NextResponse.json(null)
  return NextResponse.json(user)
}
