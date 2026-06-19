import { NextResponse } from 'next/server';

let bookings: any[] = [];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get('user_id');
  const userBookings = user_id ? bookings.filter(b => b.user_id === user_id) : bookings;
  return NextResponse.json(userBookings);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newBooking = {
    id: String(Date.now()),
    ...body,
    status: 'upcoming',
    created_at: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return NextResponse.json(newBooking, { status: 201 });
}