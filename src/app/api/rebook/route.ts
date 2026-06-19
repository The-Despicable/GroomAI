import { NextResponse } from 'next/server'

let mockAppointments: any[] = [
  {
    id: 'a1', userId: 'u1', salonId: '1', salonName: 'The Groom Room',
    serviceName: 'Haircut', stylistName: 'Rajesh Kumar',
    date: '2026-06-10', time: '10:00 AM', price: 399, status: 'completed',
  },
  {
    id: 'a2', userId: 'u1', salonId: '1', salonName: 'The Groom Room',
    serviceName: 'Beard Trim', stylistName: 'Rajesh Kumar',
    date: '2026-06-01', time: '11:00 AM', price: 199, status: 'completed',
  },
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, appointmentId } = body

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    if (appointmentId) {
      const prev = mockAppointments.find(a => a.id === appointmentId)
      if (!prev) return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })

      const rebooked = {
        id: `a${Date.now()}`,
        userId: prev.userId,
        salonId: prev.salonId,
        salonName: prev.salonName,
        serviceName: prev.serviceName,
        stylistName: prev.stylistName,
        price: prev.price,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: prev.time,
        status: 'upcoming',
        rebooked_from: prev.id,
        created_at: new Date().toISOString(),
      }
      mockAppointments.push(rebooked)
      return NextResponse.json(rebooked, { status: 201 })
    }

    // Get last completed appointment for user
    const last = [...mockAppointments]
      .filter(a => a.userId === userId && a.status === 'completed')
      .sort((a, b) => new Date(b.created_at || b.date).getTime() - new Date(a.created_at || a.date).getTime())[0]

    if (!last) {
      return NextResponse.json({ error: 'No previous appointment found' }, { status: 404 })
    }

    const rebooked = {
      id: `a${Date.now()}`,
      userId: last.userId,
      salonId: last.salonId,
      salonName: last.salonName,
      serviceName: last.serviceName,
      stylistName: last.stylistName,
      price: last.price,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: last.time,
      status: 'upcoming',
      rebooked_from: last.id,
      created_at: new Date().toISOString(),
    }
    mockAppointments.push(rebooked)
    return NextResponse.json(rebooked, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const filtered = userId ? mockAppointments.filter(a => a.userId === userId) : mockAppointments
  return NextResponse.json(filtered)
}
