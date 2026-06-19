import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await getSupabase()
      .from('salons')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching salon:', error)
    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Salon not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error.message || 'Failed to fetch salon' },
      { status: 500 }
    )
  }
}
