import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import realSalons from '@/data/real_salons.json'

const mockSalons: Record<string, any> = Object.fromEntries(
  (realSalons as any[]).map(s => [s.id, s])
)

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const salon = mockSalons[id]
    if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(salon)
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    const { data, error } = await supabase
      .from('salons')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    const salon = mockSalons[id]
    if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(salon)
  }
}
