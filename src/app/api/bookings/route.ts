import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')

    let query = getSupabase()
      .from('bookings')
      .select(`
        *,
        salons (
          id,
          name,
          address,
          image_url,
          rating
        )
      `)

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, salon_id, service, date, time } = body

    if (!user_id || !salon_id || !service || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, salon_id, service, date, time' },
        { status: 400 }
      )
    }

    const { data, error } = await getSupabase()
      .from('bookings')
      .insert({
        user_id,
        salon_id,
        service,
        date,
        time,
        status: 'upcoming',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}
