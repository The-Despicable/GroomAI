const BASE = process.env.NEXT_PUBLIC_API_URL

export async function getSalons(filters?: { service?: string; location?: string }) {
  const params = new URLSearchParams()
  if (filters?.service) params.set('service', filters.service)
  if (filters?.location) params.set('location', filters.location)
  const res = await fetch(`${BASE}/salons?${params}`)
  if (!res.ok) return []
  return res.json()
}

export async function getSalon(id: string) {
  const res = await fetch(`${BASE}/salons/${id}`)
  if (!res.ok) return null
  return res.json()
}

export async function createBooking(payload: object) {
  const res = await fetch(`${BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Booking failed')
  return res.json()
}

export async function getBookings(userId: string) {
  const res = await fetch(`${BASE}/bookings?user_id=${userId}`)
  if (!res.ok) return []
  return res.json()
}

export async function chatWithAI(message: string, history: { role: string; content: string }[]) {
  const res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  })
  if (!res.ok) throw new Error('AI request failed')
  return res.json()
}