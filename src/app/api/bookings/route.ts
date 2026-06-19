import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

let mockBookings: any[] = []

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('user_id')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const filtered = userId ? mockBookings.filter(b => b.user_id === userId) : mockBookings
    return NextResponse.json(filtered)
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    let query = supabase.from('bookings').select(`
      *,
      salons (id, name, address, image_url, rating)
    `)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    const filtered = userId ? mockBookings.filter(b => b.user_id === userId) : mockBookings
    return NextResponse.json(filtered)
  }
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const newBooking = {
      id: String(Date.now()),
      ...body,
      status: 'upcoming',
      created_at: new Date().toISOString(),
    }
    mockBookings.push(newBooking)
    return NextResponse.json(newBooking, { status: 201 })
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { user_id, salon_id, service, date, time } = body

    if (!user_id || !salon_id || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, salon_id, service, date, time' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({ user_id, salon_id, service, date, time, status: 'upcoming' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    const newBooking = {
      id: String(Date.now()),
      ...body,
      status: 'upcoming',
      created_at: new Date().toISOString(),
    }
    mockBookings.push(newBooking)
    return NextResponse.json(newBooking, { status: 201 })
  }
}
