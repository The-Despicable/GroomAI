import { NextResponse } from 'next/server'
import { createServerClient, createAdminClient } from '@/lib/supabase-server'

let mockPayments: any[] = []

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET

async function createRazorpayOrder(amount: number, currency = 'INR') {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return null
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amount * 100, currency, receipt: `rcpt_${Date.now()}` }),
  })
  if (!res.ok) return null
  return res.json()
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { appointmentId, amount, userId } = body
    if (!appointmentId || !amount) {
      return NextResponse.json({ error: 'Missing appointmentId or amount' }, { status: 400 })
    }

    const razorpayOrder = await createRazorpayOrder(amount)
    if (razorpayOrder) {
      const payment = {
        id: razorpayOrder.id, appointmentId, userId, amount,
        currency: 'INR', status: 'created',
        razorpay_order_id: razorpayOrder.id, razorpay_payment_id: null,
        created_at: new Date().toISOString(),
      }
      mockPayments.push(payment)

      const { data: ctx } = await createAdminClient(request)
      if (ctx) {
        await ctx.supabase.from('bookings').update({
          razorpay_order_id: razorpayOrder.id, price: amount,
        }).eq('id', appointmentId)
      }

      return NextResponse.json({
        ...payment, razorpay_key_id: RAZORPAY_KEY_ID, razorpay_order_id: razorpayOrder.id,
      }, { status: 201 })
    }

    const payment = {
      id: `pay_${Date.now()}`, appointmentId, userId, amount,
      currency: 'INR', status: 'completed',
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

  const { data: ctx } = await createServerClient(request)
  if (ctx) {
    let query = ctx.supabase.from('bookings').select('*').not('razorpay_order_id', 'is', null)
    if (userId) query = query.eq('user_id', userId)
    const { data } = await query.order('created_at', { ascending: false })
    if (data) return NextResponse.json(data)
  }

  const filtered = userId ? mockPayments.filter((p: any) => p.userId === userId) : mockPayments
  return NextResponse.json(filtered)
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = body
    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
    }

    const existing = mockPayments.find((p: any) => p.razorpay_order_id === razorpay_order_id)
    if (existing) { existing.status = 'completed'; existing.razorpay_payment_id = razorpay_payment_id }

    const { data: ctx } = await createAdminClient(request)
    if (ctx) {
      await ctx.supabase.from('bookings').update({
        razorpay_order_id, razorpay_payment_id, status: 'confirmed',
      }).eq('id', appointmentId)
    }

    return NextResponse.json({ status: 'completed', razorpay_payment_id })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
