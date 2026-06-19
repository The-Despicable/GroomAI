import { NextResponse } from 'next/server'

const mockStylists: Record<string, any[]> = {
  '1': [
    { id: 's1', name: 'Rajesh Kumar', title: 'Master Barber', specialties: ['Haircut', 'Beard'], rating: 4.9 },
    { id: 's2', name: 'Priya Sharma', title: 'Senior Stylist', specialties: ['Spa', 'Nails'], rating: 4.8 },
  ],
  '2': [
    { id: 's3', name: 'Amit Singh', title: 'Spa Therapist', specialties: ['Massage', 'Facial'], rating: 4.7 },
  ],
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const salonId = searchParams.get('salonId')

  if (salonId && mockStylists[salonId]) {
    return NextResponse.json(mockStylists[salonId])
  }

  return NextResponse.json(Object.values(mockStylists).flat())
}
