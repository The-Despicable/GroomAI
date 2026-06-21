import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

const mockResults = [
  { placeId: 'p1', name: 'The Urban Barber Co.', vicinity: 'Road No 12, Banjara Hills', rating: 4.8, geometry: { location: { lat: 17.415, lng: 78.428 } }, types: ['beauty_salon', 'barber'] },
  { placeId: 'p2', name: 'Luxe Hair Studio', vicinity: 'Road No 36, Jubilee Hills', rating: 4.6, geometry: { location: { lat: 17.431, lng: 78.412 } }, types: ['beauty_salon'] },
  { placeId: 'p3', name: 'The Royal Trim', vicinity: 'Road No 10, Banjara Hills', rating: 4.9, geometry: { location: { lat: 17.425, lng: 78.420 } }, types: ['barber'] },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  const { data: ctx } = await createServerClient(request)
  if (ctx) {
    let q = ctx.supabase.from('salons').select('id, name, location, area, lat, lng, rating, images')
    if (query) {
      const ql = query.toLowerCase()
      q = q.or(`name.ilike.%${ql}%,location.ilike.%${ql}%,area.ilike.%${ql}%`)
    }
    const { data: salons } = await q.limit(20)
    if (salons && salons.length > 0) {
      const results = salons.map((s: any) => ({
        placeId: s.id, name: s.name,
        vicinity: `${s.location}${s.area ? ', ' + s.area : ''}`,
        rating: s.rating,
        geometry: { location: { lat: s.lat, lng: s.lng } },
        types: ['beauty_salon', 'barber'],
      }))
      return NextResponse.json({ results, status: 'OK' })
    }
  }

  let filtered = [...mockResults]
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.vicinity.toLowerCase().includes(q))
  }
  return NextResponse.json({ results: filtered, status: 'OK' })
}
