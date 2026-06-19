import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import realSalons from '@/data/real_salons.json'

const mockSalons: any[] = realSalons

function filterMockSalons(service?: string | null, query?: string | null) {
  let filtered = [...mockSalons]
  if (service) {
    filtered = filtered.filter(s =>
      s.services.some((svc: any) => svc.name.toLowerCase().includes(service.toLowerCase()))
    )
  }
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
    )
  }
  return filtered
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')
  const query = searchParams.get('query') || searchParams.get('location')

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(filterMockSalons(service, query))
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )

    let supabaseQuery = supabase.from('salons').select('*')

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
    console.error('Supabase error, falling back to mock:', error)
    return NextResponse.json(filterMockSalons(service, query))
  }
}
