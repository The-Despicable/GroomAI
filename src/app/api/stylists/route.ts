import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import realSalons from '@/data/real_salons.json'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const salonId = searchParams.get('salonId')

  const { data: ctx } = await createServerClient(request)
  if (ctx) {
    let query = ctx.supabase.from('stylists').select('*')
    if (salonId) query = query.eq('salon_id', salonId)
    const { data } = await query
    if (data && data.length > 0) return NextResponse.json(data)
  }

  // Build mock stylists from real salon data
  const allStylists: any[] = []
  for (const salon of realSalons as any[]) {
    if (!salonId || salon.id === salonId) {
      const names = ['Ravi', 'Arun', 'Priya', 'Vikram', 'Anita', 'Raj', 'Sneha', 'Kiran']
      const specializations = ['Classic Cuts', 'Beard Sculpting', 'Fade Cuts', 'Hot Towel Shave', 'Styling', 'Color', 'Spa', 'Facial']
      for (let i = 0; i < 3; i++) {
        allStylists.push({
          id: `${salon.id}-stylist-${i}`,
          salon_id: salon.id,
          name: names[(parseInt(salon.id) * 3 + i) % names.length] + ' ' + [' Kumar', ' Reddy', ' Sharma', ' Singh'][i],
          rating: (4.5 + Math.random() * 0.5).toFixed(1),
          specializations: [specializations[(parseInt(salon.id) + i) % specializations.length], specializations[(parseInt(salon.id) + i + 1) % specializations.length]],
          available: i !== 2,
        })
      }
    }
  }

  if (salonId) return NextResponse.json(allStylists.filter(s => s.salon_id === salonId))
  return NextResponse.json(allStylists)
}
