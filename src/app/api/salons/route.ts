import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import realSalons from '@/data/real_salons.json'

const mockSalons: any[] = realSalons

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const service = searchParams.get('service')
  const query = searchParams.get('query') || searchParams.get('location')
  const category = searchParams.get('category')

  const { data: ctx } = await createAdminClient(request)
  if (ctx) {
    let salonQuery = ctx.supabase.from('salons').select('*')
    if (query) {
      const q = query.toLowerCase()
      salonQuery = salonQuery.or(`name.ilike.%${q}%,location.ilike.%${q}%`)
    }
    const { data: salons, error } = await salonQuery
    if (!error && salons) {
      const { data: allServices } = await ctx.supabase.from('services').select('*')
      if (service && allServices) {
        const filteredIds = allServices
          .filter((sv: any) => sv.name.toLowerCase().includes(service.toLowerCase()))
          .map((sv: any) => sv.salon_id)
        return NextResponse.json(transformSupabaseSalons(
          salons.filter((s: any) => filteredIds.includes(s.id)),
          allServices || []
        ))
      }
      return NextResponse.json(transformSupabaseSalons(salons || [], allServices || []))
    }
  }

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
  if (category) {
    filtered = filtered.filter(s => s.category?.toLowerCase() === category.toLowerCase())
  }
  return NextResponse.json(filtered)
}

function transformSupabaseSalons(salons: any[], services: any[]): any[] {
  const servicesBySalon: Record<string, any[]> = {}
  for (const svc of services) {
    if (!servicesBySalon[svc.salon_id]) servicesBySalon[svc.salon_id] = []
    servicesBySalon[svc.salon_id].push(svc)
  }
  return salons.map(s => {
    const salonServices = servicesBySalon[s.id] || []
    return {
      id: s.id, name: s.name, location: s.location, rating: s.rating,
      priceFrom: salonServices.length > 0 ? Math.min(...salonServices.map((sv: any) => sv.price / 100)) : 0,
      lat: s.lat, lon: s.lon,
      imageUrl: s.images?.[0] || null,
      services: salonServices.map((sv: any) => ({ name: sv.name, price: sv.price / 100, duration: sv.duration_minutes })),
      slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      area: s.area,
    }
  })
}
