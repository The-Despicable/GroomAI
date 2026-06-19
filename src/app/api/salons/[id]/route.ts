import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const mockSalons: Record<string, any> = {
  '1': { id: '1', name: 'The Groom Room', location: '123 Main St, Banjara Hills, Hyderabad', rating: 4.8, priceFrom: 399, lat: 17.415, lon: 78.428, imageUrl: '', services: [{ name: 'Haircut', price: 399, duration: 30 }, { name: 'Beard Trim', price: 199, duration: 15 }, { name: 'Hair + Beard Combo', price: 499, duration: 45 }] },
  '2': { id: '2', name: 'Spa & Blade', location: '456 Oak Ave, Jubilee Hills, Hyderabad', rating: 4.5, priceFrom: 599, lat: 17.431, lon: 78.412, imageUrl: '', services: [{ name: 'Full Body Massage', price: 999, duration: 60 }, { name: 'Facial', price: 599, duration: 30 }, { name: 'Manicure', price: 399, duration: 25 }] },
  '3': { id: '3', name: 'The Gentry Hub', location: 'Koramangala, Bangalore', rating: 4.9, priceFrom: 550, lat: 12.935, lon: 77.624, imageUrl: '', services: [{ name: 'Premium Haircut', price: 550, duration: 45 }, { name: 'Beard Sculpt', price: 299, duration: 20 }, { name: 'Hair Color', price: 1499, duration: 90 }] },
  '4': { id: '4', name: 'Luxe Rituals', location: 'Indiranagar, Bangalore', rating: 4.8, priceFrom: 800, lat: 12.978, lon: 77.640, imageUrl: '', services: [{ name: 'Spa Pedicure', price: 899, duration: 45 }, { name: 'Head Massage', price: 499, duration: 30 }, { name: 'Grooming Package', price: 1499, duration: 90 }] },
  '5': { id: '5', name: 'Urban Oasis', location: 'HSR Layout, Bangalore', rating: 4.7, priceFrom: 1200, lat: 12.911, lon: 77.638, imageUrl: '', services: [{ name: 'Detox Facial', price: 1299, duration: 50 }, { name: 'Hair Styling', price: 699, duration: 40 }, { name: 'Wedding Package', price: 4999, duration: 180 }] },
}

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
