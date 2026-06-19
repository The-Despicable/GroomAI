const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface Salon {
  id: string
  name: string
  location: string
  rating: number
  priceFrom: number
  image_url: string
  services: { name: string; price: number; duration: number }[]
}

export interface Booking {
  id: string
  salon_id: string
  salon_name: string
  service: string
  price: number
  status: 'upcoming' | 'completed' | 'cancelled'
  date: string
  time: string
  user_id: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getSalons(filters?: { service?: string; location?: string }): Promise<Salon[]> {
  const params = new URLSearchParams()
  if (filters?.service) params.set('service', filters.service)
  if (filters?.location) params.set('location', filters.location)
  const qs = params.toString()
  const res = await fetch(`${BASE}/api/salons${qs ? `?${qs}` : ''}`)
  if (!res.ok) return []
  return res.json()
}

export async function getSalon(id: string): Promise<Salon | null> {
  const res = await fetch(`${BASE}/api/salons/${id}`)
  if (!res.ok) return null
  return res.json()
}

export async function createBooking(payload: {
  salon_id: string
  service: string
  price: number
  date: string
  time: string
  user_id: string
}): Promise<Booking | null> {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) return null
  return res.json()
}

export async function getBookings(userId: string): Promise<Booking[]> {
  const res = await fetch(`${BASE}/api/bookings?user_id=${userId}`)
  if (!res.ok) return []
  return res.json()
}

export async function chatWithAI(
  message: string,
  history: ChatMessage[]
): Promise<{ reply: string } | null> {
  const res = await fetch(`${BASE}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) return null
  return res.json()
}