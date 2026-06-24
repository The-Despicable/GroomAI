import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import realSalons from '@/data/real_salons.json'

const mockSalons: Record<string, any> = Object.fromEntries(
  (realSalons as any[]).map(s => [s.id, s])
)

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const { data: ctx } = await createAdminClient(_request)
  if (ctx) {
    const { data: salon, error } = await ctx.supabase.from('salons').select('*').eq('id', id).single()
    if (!error && salon) {
      const { data: services } = await ctx.supabase.from('services').select('*').eq('salon_id', id)
      return NextResponse.json(transformSupabaseSalon(salon, services || []))
    }
  }

  const salon = mockSalons[id]
  if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(salon)
}

function transformSupabaseSalon(salon: any, services: any[]): any {
  return {
    id: salon.id, name: salon.name, location: salon.location,
    rating: salon.rating,
    priceFrom: services.length > 0 ? Math.min(...services.map((sv: any) => sv.price / 100)) : 0,
    lat: salon.lat, lon: salon.lon,
    imageUrl: salon.images?.[0] || null,
    services: services.map((sv: any) => ({ name: sv.name, price: sv.price / 100, duration: sv.duration_minutes })),
    slug: salon.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    area: salon.area,
    description: salon.description,
    phone: salon.phone,
    openTime: salon.open_time,
    closeTime: salon.close_time,
  }
}
