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
    const service = searchParams.get('service')
    const query = searchParams.get('query')

    let supabaseQuery = getSupabase().from('salons').select('*')

    if (service) {
      supabaseQuery = supabaseQuery.contains('services', [service])
    }

    if (query) {
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,address.ilike.%${query}%`)
    }

    const { data, error } = await supabaseQuery
    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error fetching salons:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch salons' },
      { status: 500 }
    )
  }
}
