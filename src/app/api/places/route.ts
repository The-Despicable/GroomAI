import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!query && !(lat && lon)) {
    return NextResponse.json({ error: 'Provide query or lat+lon' }, { status: 400 })
  }

  // Mock Google Places response
  const mockResults = [
    {
      placeId: 'p1',
      name: 'The Groom Room',
      vicinity: '123 Main St, Banjara Hills',
      rating: 4.8,
      userRatingsTotal: 127,
      geometry: { location: { lat: 17.415, lng: 78.428 } },
      types: ['beauty_salon', 'barber'],
      priceLevel: 2,
      openingHours: { openNow: true },
    },
    {
      placeId: 'p2',
      name: 'Spa & Blade',
      vicinity: '456 Oak Ave, Jubilee Hills',
      rating: 4.5,
      userRatingsTotal: 89,
      geometry: { location: { lat: 17.431, lng: 78.412 } },
      types: ['spa', 'beauty_salon'],
      priceLevel: 3,
      openingHours: { openNow: true },
    },
    {
      placeId: 'p3',
      name: 'Gentleman\'s Quarter',
      vicinity: 'Road No 12, Banjara Hills',
      rating: 4.9,
      userRatingsTotal: 203,
      geometry: { location: { lat: 17.425, lng: 78.420 } },
      types: ['barber'],
      priceLevel: 2,
      openingHours: { openNow: true },
    },
  ]

  let filtered = [...mockResults]
  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(r => r.name.toLowerCase().includes(q) || r.vicinity.toLowerCase().includes(q))
  }

  return NextResponse.json({ results: filtered, status: 'OK' })
}
