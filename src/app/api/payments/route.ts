import { NextResponse } from 'next/server'

let mockPayments: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { appointmentId, amount, userId } = body

    if (!appointmentId || !amount) {
      return NextResponse.json({ error: 'Missing appointmentId or amount' }, { status: 400 })
    }

    // Mock Razorpay order creation
    const payment = {
      id: `pay_${Date.now()}`,
      appointmentId,
      userId,
      amount,
      currency: 'INR',
      status: 'completed',
      razorpay_order_id: `order_${Date.now()}`,
      razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      created_at: new Date().toISOString(),
    }

    mockPayments.push(payment)
    return NextResponse.json(payment, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const filtered = userId ? mockPayments.filter(p => p.userId === userId) : mockPayments
  return NextResponse.json(filtered)
}
